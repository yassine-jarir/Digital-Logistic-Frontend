import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterLink, RouterOutlet } from '@angular/router';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-layout',
  standalone: true,
  imports: [CommonModule, RouterOutlet, RouterLink],
  template: `
    <div style="display: flex; height: 100vh;">
      <nav style="width: 250px; background: #2c3e50; color: white; padding: 1rem;">
        <h3 style="margin-bottom: 2rem; padding-bottom: 1rem; border-bottom: 1px solid #34495e;">
          Menu Navigation
        </h3>
        <ul style="list-style: none; padding: 0;">
          <li *ngIf="authService.hasRole('CLIENT')" style="margin-bottom: 0.5rem;">
            <a 
              routerLink="/client" 
              routerLinkActive="active"
              style="display: block; padding: 0.75rem; color: white; text-decoration: none; border-radius: 4px; transition: background 0.3s;"
            >
              📊 Dashboard Client
            </a>
          </li>
          <li *ngIf="authService.hasRole('WAREHOUSE_MANAGER')" style="margin-bottom: 0.5rem;">
            <a 
              routerLink="/warehouse" 
              routerLinkActive="active"
              style="display: block; padding: 0.75rem; color: white; text-decoration: none; border-radius: 4px; transition: background 0.3s;"
            >
              📦 Dashboard Entrepôt
            </a>
          </li>
          <li *ngIf="authService.hasRole('ADMIN')" style="margin-bottom: 0.5rem;">
            <a 
              routerLink="/admin" 
              routerLinkActive="active"
              style="display: block; padding: 0.75rem; color: white; text-decoration: none; border-radius: 4px; transition: background 0.3s;"
            >
              ⚙️ Dashboard Admin
            </a>
          </li>
          <li style="margin-top: 2rem; padding-top: 1rem; border-top: 1px solid #34495e;">
            <button 
              (click)="onLogout()"
              style="width: 100%; padding: 0.75rem; background: #e74c3c; color: white; border: none; border-radius: 4px; cursor: pointer; font-weight: 600; transition: background 0.3s;"
            >
              🚪 Déconnexion
            </button>
          </li>
        </ul>
      </nav>
      <main style="flex: 1; padding: 2rem; background: #ecf0f1; overflow-y: auto;">
        <router-outlet></router-outlet>
      </main>
    </div>
  `,
  styles: [`
    a.active {
      background: #34495e !important;
      font-weight: 600;
    }
    
    a:hover {
      background: #34495e !important;
    }
    
    button:hover {
      background: #c0392b !important;
    }
  `]
})
export class AppLayout {
  constructor(
    public authService: AuthService,
    private router: Router
  ) {}

  onLogout(): void {
    this.authService.logout();
    this.router.navigate(['/login']);
  }
}
