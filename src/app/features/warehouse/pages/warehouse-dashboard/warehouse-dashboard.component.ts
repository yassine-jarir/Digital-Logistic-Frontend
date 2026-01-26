import { Component, OnInit, ChangeDetectorRef, NgZone } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { SalesOrderService } from '../../../../api/sales-order.service';
import { PurchaseOrderService } from '../../../../api/purchase-order.service';
import { AuthService } from '../../../../core/services/auth.service';
import { SalesOrder } from '../../../../core/models/sales-order.model';
import { PurchaseOrder } from '../../../../core/models/purchase-order.model';

@Component({
  selector: 'app-warehouse-dashboard',
  standalone: true,
  imports: [CommonModule, RouterLink],
  template: `
    <div class="dashboard-container">
      <div class="dashboard-header">
        <h1>Warehouse Manager Dashboard</h1>
        <p>Welcome, {{ username }}!</p>
      </div>

      <div class="stats-grid">
        <div class="stat-card">
          <div class="stat-icon">📦</div>
          <div class="stat-info">
            <h3>Sales Orders</h3>
            <p class="stat-value">{{ salesOrders.length }}</p>
          </div>
        </div>

        <div class="stat-card">
          <div class="stat-icon">📋</div>
          <div class="stat-info">
            <h3>Purchase Orders</h3>
            <p class="stat-value">{{ purchaseOrders.length }}</p>
          </div>
        </div>

        <div class="stat-card">
          <div class="stat-icon">⏳</div>
          <div class="stat-info">
            <h3>Pending Approval</h3>
            <p class="stat-value">{{ getPOByStatus('CREATED').length }}</p>
          </div>
        </div>

        <div class="stat-card">
          <div class="stat-icon">✓</div>
          <div class="stat-info">
            <h3>Received</h3>
            <p class="stat-value">{{ getPOByStatus('RECEIVED').length }}</p>
          </div>
        </div>
      </div>

      <div class="quick-actions">
        <h2>Quick Actions</h2>
        <div class="actions-grid">
          <button class="action-btn" routerLink="/warehouse/purchase-orders/create">
            <span class="action-icon">➕</span>
            <span>Create Purchase Order</span>
          </button>
          <button class="action-btn" routerLink="/warehouse/purchase-orders">
            <span class="action-icon">📋</span>
            <span>View Purchase Orders</span>
          </button>
          <button class="action-btn" routerLink="/warehouse/sales-orders">
            <span class="action-icon">📦</span>
            <span>View Sales Orders</span>
          </button>
        </div>
      </div>

      <div class="recent-orders">
        <h2>Recent Sales Orders</h2>
        <div class="table-container">
          <table *ngIf="salesOrders.length > 0; else noSalesOrders">
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
          <ng-template #noSalesOrders>
            <p class="no-data">No sales orders found.</p>
          </ng-template>
        </div>
      </div>

      <div class="recent-orders">
        <h2>Recent Purchase Orders</h2>
        <div class="table-container">
          <table *ngIf="purchaseOrders.length > 0; else noPurchaseOrders">
            <thead>
              <tr>
                <th>Order #</th>
                <th>Supplier</th>
                <th>Warehouse</th>
                <th>Date</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              <tr *ngFor="let order of purchaseOrders.slice(0, 5)">
                <td>{{ order.orderNumber }}</td>
                <td>{{ order.supplierName }}</td>
                <td>{{ order.warehouseName || 'N/A' }}</td>
                <td>{{ order.orderDate | date: 'short' }}</td>
                <td>
                  <span class="status-badge" [class]="'status-' + order.status.toLowerCase()">
                    {{ order.status }}
                  </span>
                </td>
              </tr>
            </tbody>
          </table>
          <ng-template #noPurchaseOrders>
            <p class="no-data">No purchase orders found.</p>
          </ng-template>
        </div>
      </div>
    </div>
  `,
  styleUrl: './warehouse-dashboard.component.css'
})
export class WarehouseDashboardPageComponent implements OnInit {
  username = '';
  salesOrders: SalesOrder[] = [];
  purchaseOrders: PurchaseOrder[] = [];

  constructor(
    private salesOrderService: SalesOrderService,
    private purchaseOrderService: PurchaseOrderService,
    private authService: AuthService,
    private cdr: ChangeDetectorRef,
    private ngZone: NgZone
  ) {
    this.username = this.authService.currentUser?.username || 'User';
  }

  ngOnInit(): void {
    this.loadSalesOrders();
    this.loadPurchaseOrders();
  }

  loadSalesOrders(): void {
    this.salesOrderService.getWarehouseSalesOrders().subscribe({
      next: (orders: SalesOrder[]) => {
        console.log('✅ Warehouse sales orders loaded:', orders);
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

  loadPurchaseOrders(): void {
    this.purchaseOrderService.getAdminPurchaseOrders().subscribe({
      next: (orders: PurchaseOrder[]) => {
        console.log('✅ Warehouse purchase orders loaded:', orders);
        this.ngZone.run(() => {
          this.purchaseOrders = orders;
          this.cdr.detectChanges();
        });
      },
      error: (error: any) => {
        console.error('Error loading purchase orders:', error);
      }
    });
  }

  getPOByStatus(status: string): PurchaseOrder[] {
    return this.purchaseOrders.filter(order => order.status === status);
  }
}
