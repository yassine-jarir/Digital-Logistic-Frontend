import { Component, OnInit, ChangeDetectorRef, NgZone } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { SalesOrderService } from '../../../../api/sales-order.service';
import { WarehouseService } from '../../../../api/warehouse.service';
import { AuthService } from '../../../../core/services/auth.service';
import { SalesOrder } from '../../../../core/models/sales-order.model';
import { Warehouse } from '../../../../core/models/warehouse.model';

@Component({
  selector: 'app-client-dashboard',
  standalone: true,
  imports: [CommonModule, RouterLink],
  template: `
    <div class="dashboard-container">
      <div class="dashboard-header">
        <h1>Client Dashboard</h1>
        <p>Welcome, {{ username }}!</p>
      </div>

      <div class="stats-grid">
        <div class="stat-card">
          <div class="stat-icon">📦</div>
          <div class="stat-info">
            <h3>Total Orders</h3>
            <p class="stat-value">{{ salesOrders.length }}</p>
          </div>
        </div>

        <div class="stat-card">
          <div class="stat-icon">✓</div>
          <div class="stat-info">
            <h3>Delivered</h3>
            <p class="stat-value">{{ getOrdersByStatus('DELIVERED').length }}</p>
          </div>
        </div>

        <div class="stat-card">
          <div class="stat-icon">🚚</div>
          <div class="stat-info">
            <h3>In Transit</h3>
            <p class="stat-value">{{ getOrdersByStatus('SHIPPED').length }}</p>
          </div>
        </div>

        <div class="stat-card">
          <div class="stat-icon">⏳</div>
          <div class="stat-info">
            <h3>Pending</h3>
            <p class="stat-value">{{ getOrdersByStatus('CREATED').length }}</p>
          </div>
        </div>
      </div>

      <div class="quick-actions">
        <h2>Quick Actions</h2>
        <div class="actions-grid">
          <button class="action-btn" routerLink="/client/orders/create">
            <span class="action-icon">➕</span>
            <span>Create New Order</span>
          </button>
          <button class="action-btn" routerLink="/client/orders">
            <span class="action-icon">📋</span>
            <span>View All Orders</span>
          </button>
          <button class="action-btn" routerLink="/client/warehouses">
            <span class="action-icon">🏭</span>
            <span>View Warehouses</span>
          </button>
          <button class="action-btn" routerLink="/client/shipments">
            <span class="action-icon">📍</span>
            <span>Track Shipments</span>
          </button>
        </div>
      </div>

      <div class="recent-orders">
        <h2>Recent Orders</h2>
        <div class="table-container">
          <table *ngIf="salesOrders.length > 0; else noOrders">
            <thead>
              <tr>
                <th>Order #</th>
                <th>Customer</th>
                <th>Date</th>
                <th>Status</th>
                <th>Items</th>
              </tr>
            </thead>
            <tbody>
              <tr *ngFor="let order of salesOrders.slice(0, 5)">
                <td>{{ order.orderNumber }}</td>
                <td>{{ order.customerName }}</td>
                <td>{{ order.orderDate | date: 'short' }}</td>
                <td>
                  <span class="status-badge" [class]="'status-' + order.status.toLowerCase()">
                    {{ order.status }}
                  </span>
                </td>
                <td>{{ order.lines.length }} items</td>
              </tr>
            </tbody>
          </table>
          <ng-template #noOrders>
            <p class="no-data">No orders found. Create your first order!</p>
          </ng-template>
        </div>
      </div>

      <div class="available-warehouses" *ngIf="warehouses.length > 0">
        <h2>Available Warehouses</h2>
        <div class="warehouse-grid">
          <div class="warehouse-card" *ngFor="let warehouse of warehouses">
            <h4>{{ warehouse.name }}</h4>
            <p><strong>Code:</strong> {{ warehouse.code }}</p>
            <p><strong>City:</strong> {{ warehouse.city || 'N/A' }}</p>
            <p><strong>Status:</strong> <span [class.text-success]="warehouse.active" [class.text-muted]="!warehouse.active">{{ warehouse.active ? 'Active' : 'Inactive' }}</span></p>
          </div>
        </div>
      </div>
    </div>
  `,
  styleUrl: './client-dashboard.component.css'
})
export class ClientDashboardPageComponent implements OnInit {
  username = '';
  salesOrders: SalesOrder[] = [];
  warehouses: Warehouse[] = [];

  constructor(
    private salesOrderService: SalesOrderService,
    private warehouseService: WarehouseService,
    private authService: AuthService,
    private cdr: ChangeDetectorRef,
    private ngZone: NgZone
  ) {
    this.username = this.authService.currentUser?.username || 'User';
  }

  ngOnInit(): void {
    this.loadSalesOrders();
    this.loadWarehouses();
  }

  loadSalesOrders(): void {
    this.salesOrderService.getClientSalesOrders().subscribe({
      next: (orders: SalesOrder[]) => {
        console.log('✅ Client sales orders loaded:', orders);
        this.ngZone.run(() => {
          this.salesOrders = orders;
          this.cdr.detectChanges();
        });
      },
      error: (error: any) => {
        console.error('Error loading sales orders:', error);
      }
    });
  }

  loadWarehouses(): void {
    this.warehouseService.getClientWarehouses().subscribe({
      next: (warehouses: Warehouse[]) => {
        console.log('✅ Client warehouses loaded:', warehouses);
        this.ngZone.run(() => {
          this.warehouses = warehouses;
          this.cdr.detectChanges();
        });
      },
      error: (error: any) => {
        console.error('Error loading warehouses:', error);
      }
    });
  }

  getOrdersByStatus(status: string): SalesOrder[] {
    return this.salesOrders.filter(order => order.status === status);
  }
}
