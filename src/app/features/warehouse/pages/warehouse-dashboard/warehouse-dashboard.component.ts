import { Component, OnInit, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { SalesOrderService } from '../../../../api/sales-order.service';
import { PurchaseOrderService } from '../../../../api/purchase-order.service';
import { WarehousePurchaseOrderService } from '../../services/warehouse-purchase-order.service';
import { InventoryService } from '../../../../api/inventory.service';
import { WarehouseService } from '../../../../api/warehouse.service';
import { ShipmentService } from '../../../../api/shipment.service';
import { AuthService } from '../../../../core/services/auth.service';
import { SalesOrder } from '../../../../core/models/sales-order.model';
import { PurchaseOrder } from '../../../../core/models/purchase-order.model';
import { Inventory } from '../../../../core/models/inventory.model';
import { Warehouse } from '../../../../core/models/warehouse.model';
import { Shipment } from '../../../../core/models/shipment.model';
import { forkJoin } from 'rxjs';

interface DashboardStats {
  totalSalesOrders: number;
  totalPurchaseOrders: number;
  pendingApproval: number;
  approvedPO: number;
  receivedPO: number;
  totalWarehouses: number;
  lowStockItems: number;
  totalShipments: number;
  plannedShipments: number;
  shippedShipments: number;
  deliveredShipments: number;
  recentSalesOrders: SalesOrder[];
  recentPurchaseOrders: PurchaseOrder[];
  recentShipments: Shipment[];
  salesByStatus: { status: string; count: number; color: string }[];
  purchaseByStatus: { status: string; count: number; color: string }[];
}

@Component({
  selector: 'app-warehouse-dashboard',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './warehouse-dashboard.component.html',
  styleUrl: './warehouse-dashboard.component.css'
})
export class WarehouseDashboardPageComponent implements OnInit {
  loading = signal<boolean>(true);
  error = signal<string | null>(null);
  receiving = signal<number | null>(null);
  successMessage = signal<string | null>(null);
  
  salesOrders = signal<SalesOrder[]>([]);
  purchaseOrders = signal<PurchaseOrder[]>([]);
  inventory = signal<Inventory[]>([]);
  warehouses = signal<Warehouse[]>([]);
  shipments = signal<Shipment[]>([]);
  
  username = signal<string>('');
  
  stats = computed<DashboardStats>(() => {
    const sales = this.salesOrders();
    const purchases = this.purchaseOrders();
    const inv = this.inventory();
    const ships = this.shipments();
    
    return {
      totalSalesOrders: sales.length,
      totalPurchaseOrders: purchases.length,
      pendingApproval: purchases.filter(p => p.status === 'DRAFT' || p.status === 'CREATED').length,
      approvedPO: purchases.filter(p => p.status === 'APPROVED').length,
      receivedPO: purchases.filter(p => p.status === 'RECEIVED').length,
      totalWarehouses: this.warehouses().length,
      lowStockItems: inv.filter(i => i.qtyOnHand < (i.reorderPoint || 10)).length,
      totalShipments: ships.length,
      plannedShipments: ships.filter(s => s.status === 'PLANNED').length,
      shippedShipments: ships.filter(s => s.status === 'SHIPPED').length,
      deliveredShipments: ships.filter(s => s.status === 'DELIVERED').length,
      recentSalesOrders: sales.slice(0, 5),
      recentPurchaseOrders: purchases.slice(0, 5),
      recentShipments: ships.slice(0, 5),
      salesByStatus: this.calculateStatusBreakdown(sales),
      purchaseByStatus: this.calculatePurchaseStatusBreakdown(purchases)
    };
  });

  constructor(
    private salesOrderService: SalesOrderService,
    private purchaseOrderService: PurchaseOrderService,
    private warehousePurchaseOrderService: WarehousePurchaseOrderService,
    private inventoryService: InventoryService,
    private warehouseService: WarehouseService,
    private shipmentService: ShipmentService,
    private authService: AuthService
  ) {
    this.username.set(this.authService.currentUser?.username || 'Warehouse Manager');
  }

  ngOnInit(): void {
    this.loadDashboardData();
  }

  loadDashboardData(): void {
    this.loading.set(true); 
    this.error.set(null);

    forkJoin({
      salesOrders: this.salesOrderService.getWarehouseSalesOrders(),
      purchaseOrders: this.purchaseOrderService.getAdminPurchaseOrders(),
      inventory: this.inventoryService.getAllInventory(),
      warehouses: this.warehouseService.getAdminWarehouses()
    }).subscribe({
      next: (data) => {
        console.log('✅ Dashboard data loaded:', data);
        this.salesOrders.set(data.salesOrders);
        this.purchaseOrders.set(data.purchaseOrders);
        this.inventory.set(data.inventory);
        this.warehouses.set(data.warehouses);
        
        this.loadShipments();
        
        this.loading.set(false);
      },
      error: (error) => {
        console.error('❌ Error loading dashboard data:', error);
        this.error.set('Failed to load dashboard data. Please try again.');
        this.loading.set(false);
      }
    });
  }

  private loadShipments(): void {
    this.shipmentService.getClientShipments().subscribe({
      next: (shipments) => {
        console.log('✅ Shipments loaded:', shipments);
        this.shipments.set(shipments);
      },
      error: (error) => {
        console.warn('⚠️ Shipments not available:', error);
        this.shipments.set([]);
      }
    });
  }

  private calculateStatusBreakdown(orders: SalesOrder[]): { status: string; count: number; color: string }[] {
    const statusColors: Record<string, string> = {
      CREATED: '#fbbf24',
      RESERVED: '#3b82f6',
      SHIPPED: '#06b6d4',
      DELIVERED: '#10b981',
      CANCELED: '#ef4444'
    };

    const breakdown = orders.reduce((acc, order) => {
      const status = order.status;
      acc[status] = (acc[status] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    return Object.entries(breakdown).map(([status, count]) => ({
      status,
      count,
      color: statusColors[status] || '#6b7280'
    }));
  }

  private calculatePurchaseStatusBreakdown(orders: PurchaseOrder[]): { status: string; count: number; color: string }[] {
    const statusColors: Record<string, string> = {
      DRAFT: '#9ca3af',
      CREATED: '#fbbf24',
      APPROVED: '#3b82f6',
      RECEIVED: '#10b981',
      CANCELLED: '#ef4444'
    };

    const breakdown = orders.reduce((acc, order) => {
      const status = order.status;
      acc[status] = (acc[status] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    return Object.entries(breakdown).map(([status, count]) => ({
      status,
      count,
      color: statusColors[status] || '#6b7280'
    }));
  }

  getStatusClass(status: string): string {
    return `status-${status.toLowerCase()}`;
  }

  getPOByStatus(status: string): PurchaseOrder[] {
    return this.purchaseOrders().filter(order => order.status === status);
  }

  getSalesByStatus(status: string): SalesOrder[] {
    return this.salesOrders().filter(order => order.status === status);
  }

  refreshData(): void {
    this.loadDashboardData();
  }

  receivePurchaseOrder(order: PurchaseOrder, event: Event): void {
    event.preventDefault();
    event.stopPropagation();
    
    if (!order.id) return;
    
    if (order.status !== 'APPROVED') {
      this.error.set('Purchase order must be approved before receiving');
      setTimeout(() => this.error.set(null), 5000);
      return;
    }

    if (confirm(`Are you sure you want to receive Purchase Order #${order.orderNumber}?\n\nThis will automatically receive ALL line items with their full quantities and update inventory.`)) {
      this.receiving.set(order.id);
      this.error.set(null);
      this.successMessage.set(null);

      this.warehousePurchaseOrderService.receive(order.id).subscribe({
        next: (updatedPO) => {
          this.successMessage.set(`✅ Purchase Order #${order.orderNumber} has been successfully received!`);
          this.receiving.set(null);
          
          // Reload dashboard data to reflect the updated status
          this.refreshData();
          
          // Clear success message after 5 seconds
          setTimeout(() => this.successMessage.set(null), 5000);
        },
        error: (err) => {
          console.error('Failed to receive purchase order:', err);
          this.receiving.set(null);
          
          // Display error message from backend if available
          const errorMessage = err.error?.message || err.message || 'Failed to receive purchase order. Please try again.';
          this.error.set(errorMessage);
          
          // Clear error message after 5 seconds
          setTimeout(() => this.error.set(null), 5000);
        }
      });
    }
  }

  isReceiving(orderId: number | undefined): boolean {
    return orderId !== undefined && this.receiving() === orderId;
  }
}
