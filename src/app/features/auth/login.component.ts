import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../core/services/auth.service';

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

          <div class="form-group">
            <label for="password">Mot de passe</label>
            <input 
              type="password" 
              id="password" 
              [(ngModel)]="password" 
              name="password"
              placeholder="Entrez votre mot de passe"
              required
            />
          </div>

          <div class="form-group remember">
            <label>
              <input type="checkbox" [(ngModel)]="remember" name="remember" /> Se souvenir de moi
            </label>
          </div>

          <button type="submit" class="btn-login">Se connecter</button>
        </form>

        <div class="help-text" *ngIf="errorMessage">
          <p class="error">{{ errorMessage }}</p>
        </div>

        <div class="help-text">
          <p><strong>Comptes de test :</strong></p>
          <p>• client@test.com (CLIENT)</p>
          <p>• warehouse@test.com (WAREHOUSE_MANAGER)</p>
          <p>• admin@test.com (ADMIN)</p>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .login-container {
      display: flex;
      justify-content: center;
      align-items: center;
      min-height: calc(100vh - 80px);
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
export class LoginComponent {
  email = '';
  password = '';
  remember = false;
  errorMessage = '';

  constructor(
    private authService: AuthService,
    private router: Router
  ) {}

  onLogin(): void {
    this.errorMessage = '';
    this.authService.login({ username: this.email, password: this.password }).subscribe({
      next: (response) => {
        const effectiveRoles = (response.roles && response.roles.length > 0) ? response.roles : this.authService.roles;

        let targetUrl = '/login';
        if (effectiveRoles.includes('ADMIN')) {
          targetUrl = '/admin';
        } else if (effectiveRoles.includes('WAREHOUSE_MANAGER')) {
          targetUrl = '/warehouse';
        } else if (effectiveRoles.includes('CLIENT')) {
          targetUrl = '/client';
        }

        // If roles are still empty, keep the user on login and show a clear message.
        if (targetUrl === '/login') {
          this.errorMessage = "Connexion réussie, mais aucun rôle (CLIENT/WAREHOUSE_MANAGER/ADMIN) n'a été trouvé pour ce compte.";
          return;
        }

        // Navigate after auth state is set in AuthService (tap runs before this next handler)
        void this.router.navigateByUrl(targetUrl);
      },
      error: (err) => {
        console.error('❌ Login error:', err);
        this.errorMessage = 'Connexion échouée. Vérifiez vos identifiants.';
      }
    });
  }
}
