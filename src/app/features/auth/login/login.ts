import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../../core/services/auth.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="login-container">
      <div class="login-card">
        <h1>Digital Logistics</h1>
        <h2>Connexion</h2>
        
        <form (ngSubmit)="onLogin()">
          <div class="form-group">
            <label for="email">Email</label>
            <input 
              type="email" 
              id="email" 
              [(ngModel)]="email" 
              name="email"
              placeholder="Entrez votre email"
              required
            />
          </div>

          <button type="submit" class="btn-login">Se connecter</button>
        </form>

        <div class="help-text" *ngIf="errorMessage">
          <p class="error">{{ errorMessage }}</p>
        </div>

        <div class="help-text">
          <p><strong>Comptes de test :</strong></p>
          <p>• client@test.com → CLIENT</p>
          <p>• warehouse@test.com → WAREHOUSE_MANAGER</p>
          <p>• admin@test.com → ADMIN</p>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .login-container {
      display: flex;
      justify-content: center;
      align-items: center;
      min-height: 100vh;
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
      padding: 2rem;
    }

    .login-card {
      background: white;
      padding: 2rem;
      border-radius: 8px;
      box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
      width: 100%;
      max-width: 400px;
    }

    h1 {
      color: #667eea;
      text-align: center;
      margin-bottom: 0.5rem;
    }

    h2 {
      color: #333;
      text-align: center;
      margin-bottom: 2rem;
      font-size: 1.5rem;
    }

    .form-group {
      margin-bottom: 1.5rem;
    }

    label {
      display: block;
      margin-bottom: 0.5rem;
      color: #555;
      font-weight: 500;
    }

    input {
      width: 100%;
      padding: 0.75rem;
      border: 1px solid #ddd;
      border-radius: 4px;
      font-size: 1rem;
      box-sizing: border-box;
    }

    input:focus {
      outline: none;
      border-color: #667eea;
    }

    .btn-login {
      width: 100%;
      padding: 0.75rem;
      background: #667eea;
      color: white;
      border: none;
      border-radius: 4px;
      font-size: 1rem;
      font-weight: 600;
      cursor: pointer;
      transition: background 0.3s;
    }

    .btn-login:hover {
      background: #5568d3;
    }

    .help-text {
      margin-top: 1.5rem;
      padding: 1rem;
      background: #f8f9fa;
      border-radius: 4px;
      font-size: 0.9rem;
    }

    .help-text p {
      margin: 0.25rem 0;
      color: #666;
    }

    .help-text strong {
      color: #333;
    }

    .error {
      color: #dc3545;
      font-weight: 500;
    }
  `]
})
export class Login {
  email = '';
  errorMessage = '';

  constructor(
    private authService: AuthService,
    private router: Router
  ) {}

  onLogin(): void {
    this.authService.login({ username: this.email, password: '' }).subscribe({
      next: (response) => {
        const roles = response.roles;
        
        // Rediriger selon le rôle
        if (roles.includes('CLIENT')) {
          this.router.navigate(['/client']);
        } else if (roles.includes('WAREHOUSE_MANAGER')) {
          this.router.navigate(['/warehouse']);
        } else if (roles.includes('ADMIN')) {
          this.router.navigate(['/admin']);
        }
      },
      error: () => {
        this.errorMessage = 'Email incorrect. Utilisez un compte de test.';
      }
    });
  }
}
