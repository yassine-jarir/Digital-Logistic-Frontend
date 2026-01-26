import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';
import { AuthService } from '../../core/services/auth.service';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [CommonModule, RouterModule],
  template: `
    <header>
      <div class="header-content">
        <div class="logo">
          <h1>Digital Logistics</h1>
        </div>

        <nav *ngIf="authService.isAuthenticated">
          <a 
            *ngIf="authService.hasRole('CLIENT')" 
            routerLink="/client" 
            routerLinkActive="active"
            class="nav-link"
          >
            Dashboard Client
          </a>

          <a 
            *ngIf="authService.hasRole('WAREHOUSE_MANAGER')" 
            routerLink="/warehouse" 
            routerLinkActive="active"
            class="nav-link"
          >
            Dashboard Entrepôt
          </a>

          <a 
            *ngIf="authService.hasRole('ADMIN')" 
            routerLink="/admin" 
            routerLinkActive="active"
            class="nav-link"
          >
            Dashboard Admin
          </a>

          <button class="btn-logout" (click)="onLogout()">
            Déconnexion
          </button>
        </nav>
      </div>
    </header>
  `,
  styles: [`
    header {
      background: #667eea;
      color: white;
      padding: 1rem 2rem;
      box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
    }

    .header-content {
      display: flex;
      justify-content: space-between;
      align-items: center;
      max-width: 1200px;
      margin: 0 auto;
    }

    .logo h1 {
      margin: 0;
      font-size: 1.5rem;
    }

    nav {
      display: flex;
      gap: 1rem;
      align-items: center;
    }

    .nav-link {
      color: white;
      text-decoration: none;
      padding: 0.5rem 1rem;
      border-radius: 4px;
      transition: background 0.3s;
    }

    .nav-link:hover {
      background: rgba(255, 255, 255, 0.1);
    }

    .nav-link.active {
      background: rgba(255, 255, 255, 0.2);
      font-weight: 600;
    }

    .btn-logout {
      background: rgba(255, 255, 255, 0.2);
      color: white;
      border: 1px solid white;
      padding: 0.5rem 1rem;
      border-radius: 4px;
      cursor: pointer;
      font-weight: 500;
      transition: all 0.3s;
    }

    .btn-logout:hover {
      background: white;
      color: #667eea;
    }
  `]
})
export class HeaderComponent {
  constructor(
    public authService: AuthService,
    private router: Router
  ) {}

  onLogout(): void {
    this.authService.logout();
    this.router.navigate(['/login']);
  }
}
