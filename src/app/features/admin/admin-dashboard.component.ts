import { Component } from '@angular/core';

@Component({
  selector: 'app-admin-dashboard',
  standalone: true,
  template: `
    <div>
      <h1>Admin Dashboard</h1>
      <p>Bienvenue sur votre tableau de bord administrateur</p>
    </div>
  `,
  styles: [`
    div {
      padding: 2rem;
    }
    h1 {
      color: #333;
      margin-bottom: 1rem;
    }
  `]
})
export class AdminDashboardComponent {}
