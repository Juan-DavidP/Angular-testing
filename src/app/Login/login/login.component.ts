import { Component, inject } from '@angular/core';
import { FormControl, NonNullableFormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { AuthService } from '../../services/auth.service';

interface loginForm {
  email: FormControl<string>;
  password: FormControl<string>;
}

@Component({
  selector: 'app-login',
  imports: [ReactiveFormsModule],
  template: `
  <form [formGroup]="loginForm" (ngSubmit)="login()">
    <input type="text" name="email" formControlName="email" placeholder="Email" required>
    <input type="password" name="password" formControlName="password" placeholder="Password" required>
    <button type="submit" [disabled]="loginForm.invalid" >Login</button>
    @if(errorMessage){
      <div> {{errorMessage}} </div>
    }
  </form>
  `
})
export class LoginComponent {
  errorMessage: string | null = null;
  authService = inject(AuthService);
  fb = inject(NonNullableFormBuilder);

  loginForm = this.fb.group<loginForm>({
    email: this.fb.control('', Validators.required),
    password: this.fb.control('', Validators.required)
  });

  login() {
    if (this.loginForm.invalid) {
      return
    }
    const { email, password } = this.loginForm.getRawValue();
    this.authService.login(email, password).subscribe({
      next: () => {
        window.location.href = '/dashboard';
      },
      error: (_error) => {
        this.errorMessage = 'Invalid email or password';
      }
    })
  }
}
