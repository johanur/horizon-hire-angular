import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { Subject, takeUntil, tap } from 'rxjs';

import { HotToastService } from '@ngneat/hot-toast';

import { AuthService } from '../../../services/auth.service';

@Component({
  selector: 'app-sign-in',
  templateUrl: './sign-in.component.html',
  styleUrls: ['./sign-in.component.scss']
})

export class SignInComponent implements OnDestroy {

  private destroy$ = new Subject<void>();

  submitting = false;

  loginForm = new FormGroup({
    email: new FormControl(null, [Validators.required, Validators.email]),
    password: new FormControl(null, Validators.required)
  });

  constructor(
    private router: Router,
    private toast: HotToastService,
    private authService: AuthService
  ) {
  }

  submit() {
    if (this.loginForm.invalid) {
      return;
    }

    this.submitting = true;

    const { email, password } = this.loginForm.value;
    this.authService.login(email, password).pipe(
      this.toast.observe({
        success: 'Logged in successfully',
        loading: 'Logging in...',
        error: ({ message }) => `${message}`
      }),
      tap({
        next: () => {
          // Navigate to profile
        },
        error: () => {
          this.submitting = false;
        }
      }),
      takeUntil(this.destroy$)
    ).subscribe();
  }

  navigateToRegister() {
    this.router.navigate(['/auth/sign-up']);
  }

  ngOnDestroy() {
    this.destroy$.next();
  }

}
