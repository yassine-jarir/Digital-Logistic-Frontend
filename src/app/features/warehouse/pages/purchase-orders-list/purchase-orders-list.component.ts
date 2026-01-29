import { Component, OnInit, inject, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { PurchaseOrderService } from '../../../../api/purchase-order.service';
import { WarehousePurchaseOrderService } from '../../services/warehouse-purchase-order.service';
import { PurchaseOrder, PurchaseOrderStatus } from '../../../../core/models/purchase-order.model';

@Component({
  selector: 'app-purchase-orders-list',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './purchase-orders-list.component.html',
  styleUrls: ['./purchase-orders-list.component.css']
})
export class PurchaseOrdersListComponent implements OnInit {
  private readonly router = inject(Router);
  private readonly purchaseOrderService = inject(PurchaseOrderService);
  private readonly warehousePurchaseOrderService = inject(WarehousePurchaseOrderService);

  purchaseOrders = signal<PurchaseOrder[]>([]);
  filteredOrders = signal<PurchaseOrder[]>([]);
  loading = signal<boolean>(false);
  receiving = signal<number | null>(null);
  error = signal<string | null>(null);
  successMessage = signal<string | null>(null);
  selectedStatus = signal<string>('ALL');
  
  // Computed total value
  totalValue = computed(() => {
    return this.filteredOrders().reduce((sum, order) => sum + (order.totalAmount || 0), 0);
  });
  
  statusFilters = ['ALL', 'DRAFT', 'CREATED', 'APPROVED', 'RECEIVED', 'CANCELLED'];

  ngOnInit(): void {
    this.loadPurchaseOrders();
  }

  loadPurchaseOrders(): void {
    this.loading.set(true);
    this.error.set(null);

    // Note: Using admin endpoint as warehouse manager likely has access
    // Backend doesn't have GET all endpoint for warehouse-manager
    this.purchaseOrderService.getAdminPurchaseOrders().subscribe({
      next: (orders) => {
        this.purchaseOrders.set(orders);
        this.applyFilter();
        this.loading.set(false);
      },
      error: (err) => {
        console.error('Failed to load purchase orders:', err);
        this.error.set('Failed to load purchase orders. Please try again.');
        this.loading.set(false);
      }
    });
  }

  applyFilter(): void {
    const status = this.selectedStatus();
    const orders = this.purchaseOrders();
    
    if (status === 'ALL') {
      this.filteredOrders.set(orders);
    } else {
      this.filteredOrders.set(orders.filter(order => order.status === status));
    }
  }

  filterByStatus(status: string): void {
    this.selectedStatus.set(status);
    this.applyFilter();
  }

  viewDetails(orderId: number | undefined): void {
    if (orderId) {
      this.router.navigate(['/warehouse/purchase-orders', orderId]);
    }
  }

  createNewOrder(): void {
    this.router.navigate(['/warehouse/purchase-orders/new']);
  }

  getStatusClass(status: string): string {
    const statusMap: { [key: string]: string } = {
      'DRAFT': 'status-draft',
      'CREATED': 'status-created',
      'APPROVED': 'status-approved',
      'RECEIVED': 'status-received',
      'CANCELLED': 'status-cancelled'
    };
    return statusMap[status] || 'status-draft';
  }

  formatDate(dateString: string | undefined): string {
    if (!dateString) return 'N/A';
    return new Date(dateString).toLocaleDateString();
  }

  formatAmount(amount: number | undefined): string {
    if (amount === undefined || amount === null) return 'N/A';
    return `$${amount.toFixed(2)}`;
  }

  receivePurchaseOrder(order: PurchaseOrder, event: Event): void {
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
          this.successMessage.set(`Purchase Order #${order.orderNumber} has been successfully received!`);
          this.receiving.set(null);
          
          // Reload the purchase orders to reflect the updated status
          this.loadPurchaseOrders();
          
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
