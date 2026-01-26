import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { SalesOrderService } from '../../../../api/sales-order.service';
import { PurchaseOrderService } from '../../../../api/purchase-order.service';
import { ProductService } from '../../../../api/product.service';
import { WarehouseService } from '../../../../api/warehouse.service';
import { UserService } from '../../../../api/user.service';
import { AuthService } from '../../../../core/services/auth.service';
import { SalesOrder } from '../../../../core/models/sales-order.model';
import { PurchaseOrder } from '../../../../core/models/purchase-order.model';
import { Product } from '../../../../core/models/product.model';
import { Warehouse } from '../../../../core/models/warehouse.model';
import { User } from '../../../../core/models/user.model';

@Component({
  selector: 'app-admin-dashboard',
  standalone: true,
  imports: [CommonModule, RouterLink],
  template: `
    <div class="dashboard-container">
      <div class="dashboard-header">
        <h1>Admin Dashboard</h1>
        <p>Welcome, {{ username }}!</p>
      </div>

      <div class="stats-grid">
        <div class="stat-card">
          <div class="stat-icon">📦</div>
          <div class="stat-info">
            <h3>Total Products</h3>
            <p class="stat-value">{{ products.length }}</p>
          </div>
        </div>

        <div class="stat-card">
          <div class="stat-icon">🏭</div>
          <div class="stat-info">
            <h3>Warehouses</h3>
            <p class="stat-value">{{ warehouses.length }}</p>
          </div>
        </div>

        <div class="stat-card">
          <div class="stat-icon">👥</div>
          <div class="stat-info">
            <h3>Users</h3>
            <p class="stat-value">{{ users.length }}</p>
          </div>
        </div>

        <div class="stat-card">
          <div class="stat-icon">📋</div>
          <div class="stat-info">
            <h3>Sales Orders</h3>
            <p class="stat-value">{{ salesOrders.length }}</p>
          </div>
        </div>

        <div class="stat-card">
          <div class="stat-icon">📝</div>
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
      </div>

      <div class="quick-actions">
        <h2>Quick Actions</h2>
        <div class="actions-grid">
          <button class="action-btn" routerLink="/admin/users/create">
            <span class="action-icon">👤</span>
            <span>Add User</span>
          </button>
          <button class="action-btn" routerLink="/admin/products/create">
            <span class="action-icon">➕</span>
            <span>Add Product</span>
          </button>
          <button class="action-btn" routerLink="/admin/warehouses/create">
            <span class="action-icon">🏭</span>
            <span>Add Warehouse</span>
          </button>
          <button class="action-btn" routerLink="/admin/users">
            <span class="action-icon">👥</span>
            <span>Manage Users</span>
          </button>
          <button class="action-btn" routerLink="/admin/products">
            <span class="action-icon">📦</span>
            <span>Manage Products</span>
          </button>
          <button class="action-btn" routerLink="/admin/purchase-orders">
            <span class="action-icon">📋</span>
            <span>Purchase Orders</span>
          </button>
          <button class="action-btn" routerLink="/admin/warehouses">
            <span class="action-icon">🏢</span>
            <span>Warehouses</span>
          </button>
          <button class="action-btn" routerLink="/admin/suppliers/create">
            <span class="action-icon">🚚</span>
            <span>Add Supplier</span>
          </button>
          <button class="action-btn" routerLink="/admin/suppliers">
            <span class="action-icon">🚛</span>
            <span>Manage Suppliers</span>
          </button>
          <button class="action-btn" routerLink="/admin/sales-orders">
            <span class="action-icon">🛒</span>
            <span>Sales Orders</span>
          </button>
        </div>
      </div>

      <div class="recent-section">
        <div class="section-card">
          <h2>Recent Sales Orders</h2>
          <div class="table-container">
            <table *ngIf="salesOrders.length > 0; else noSalesOrders">
              <thead>
                <tr>
                  <th>Order #</th>
                  <th>Customer</th>
                  <th>Date</th>
                  <th>Status</th>
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
                </tr>
              </tbody>
            </table>
            <ng-template #noSalesOrders>
              <p class="no-data">No sales orders found.</p>
            </ng-template>
          </div>
        </div>

        <div class="section-card">
          <h2>Recent Purchase Orders</h2>
          <div class="table-container">
            <table *ngIf="purchaseOrders.length > 0; else noPurchaseOrders">
              <thead>
                <tr>
                  <th>Order #</th>
                  <th>Supplier</th>
                  <th>Date</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                <tr *ngFor="let order of purchaseOrders.slice(0, 5)">
                  <td>{{ order.orderNumber }}</td>
                  <td>{{ order.supplierName }}</td>
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
    </div>
  `,
  styleUrl: './admin-dashboard.component.css'
})
export class AdminDashboardPageComponent implements OnInit {
  username = '';
  salesOrders: SalesOrder[] = [];
  purchaseOrders: PurchaseOrder[] = [];
  products: Product[] = [];
  warehouses: Warehouse[] = [];
  users: User[] = [];
  totalProducts = 0;
  totalWarehouses = 0;
  totalUsers = 0;

  constructor(
    private salesOrderService: SalesOrderService,
    private purchaseOrderService: PurchaseOrderService,
    private productService: ProductService,
    private warehouseService: WarehouseService,
    private userService: UserService,
    private authService: AuthService
  ) {
    this.username = this.authService.currentUser?.username || 'Admin';
  }

  ngOnInit(): void {
    this.loadAllData();
  }

  loadAllData(): void {
    this.loadSalesOrders();
    this.loadPurchaseOrders();
    this.loadProducts();
    this.loadWarehouses();
    this.loadUsers();
  }

  loadSalesOrders(): void {
    this.salesOrderService.getAdminSalesOrders().subscribe({
      next: (orders: SalesOrder[]) => {
        this.salesOrders = orders;
      },
      error: (error: any) => {
        console.error('Error loading sales orders:', error);
      }
    });
  }

  loadPurchaseOrders(): void {
    this.purchaseOrderService.getAdminPurchaseOrders().subscribe({
      next: (orders: PurchaseOrder[]) => {
        this.purchaseOrders = orders;
      },
      error: (error: any) => {
        console.error('Error loading purchase orders:', error);
      }
    });
  }

  loadProducts(): void {
    this.productService.list().subscribe({
      next: (products: Product[]) => {
        this.products = products;
        this.totalProducts = products.length;
      },
      error: (error: any) => {
        console.error('Error loading products:', error);
      }
    });
  }

  loadWarehouses(): void {
    this.warehouseService.getAdminWarehouses().subscribe({
      next: (warehouses: Warehouse[]) => {
        this.warehouses = warehouses;
        this.totalWarehouses = warehouses.length;
      },
      error: (error: any) => {
        console.error('Error loading warehouses:', error);
      }
    });
  }

  loadUsers(): void {
    this.userService.getUsers().subscribe({
      next: (users: User[]) => {
        this.users = users;
        this.totalUsers = users.length;
      },
      error: (error: any) => {
        console.error('Error loading users:', error);
      }
    });
  }

  getPOByStatus(status: string): PurchaseOrder[] {
    return this.purchaseOrders.filter(order => order.status === status);
  }
}
