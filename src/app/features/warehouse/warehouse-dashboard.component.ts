import { Component } from '@angular/core';

@Component({
  selector: 'app-warehouse-dashboard',
  standalone: true,
  template: `
    <div>
      <h1>Warehouse Manager Dashboard</h1>
      <p>Bienvenue sur votre tableau de bord gestionnaire d'entrepôt</p>
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
export class WarehouseDashboardComponent {}
