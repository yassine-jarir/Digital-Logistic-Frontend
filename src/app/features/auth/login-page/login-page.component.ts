import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
// Simplified placeholder; not used in routing

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './login-page.component.html',
  styleUrl: './login-page.component.css'
})
export class LoginPageComponent {
  loginForm: FormGroup;
  loading = false;
  errorMessage = '';
  // Form builder only for demo
  private fb = new FormBuilder();

  constructor() {
    this.loginForm = this.fb.group({
      username: ['', Validators.required],
      password: ['', Validators.required]
    });
  }

  onLogin(): void {
    if (this.loginForm.invalid) {
      return;
    }

    // Placeholder: actual logic handled by LoginComponent used in routing
    this.loading = true;
    setTimeout(() => {
      this.loading = false;
      this.errorMessage = 'This login page is not in use.';
    }, 300);
  }
}
