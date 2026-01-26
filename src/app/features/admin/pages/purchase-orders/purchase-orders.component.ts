import { Component, OnInit, ChangeDetectorRef, NgZone } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { PurchaseOrderService } from '../../../../api/purchase-order.service';
import { PurchaseOrder } from '../../../../core/models/purchase-order.model';

@Component({
  selector: 'app-purchase-orders',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './purchase-orders.component.html',
  styleUrls: ['./purchase-orders.component.css']
})
export class PurchaseOrdersComponent implements OnInit {
  purchaseOrders: PurchaseOrder[] = [];
  loading = true;
  error: string | null = null;

  constructor(
    private purchaseOrderService: PurchaseOrderService,
    private cdr: ChangeDetectorRef,
    private ngZone: NgZone
  ) {}

  ngOnInit(): void {
    this.loadPurchaseOrders();
  }

  loadPurchaseOrders(): void {
    this.loading = true;
    this.error = null;

    this.purchaseOrderService.getAdminPurchaseOrders().subscribe({
      next: (orders) => {
        console.log('✅ Purchase orders loaded:', orders);
        this.ngZone.run(() => {
          this.purchaseOrders = orders;
          this.loading = false;
          this.cdr.detectChanges();
        });
      },
      error: (err: any) => {
        console.error('Error loading purchase orders:', err);
        this.ngZone.run(() => {
          this.error = 'Failed to load purchase orders. Please try again.';
          this.loading = false;
          this.cdr.detectChanges();
        });
      }
    });
  }

  approvePurchaseOrder(order: PurchaseOrder): void {
    if (confirm(`Approve purchase order #${order.orderNumber}?`)) {
      this.purchaseOrderService.approvePurchaseOrder(order.id!).subscribe({
        next: () => {
          this.loadPurchaseOrders();
          console.log('Purchase order approved successfully');
        },
        error: (err: any) => {
          console.error('Error approving purchase order:', err);
          this.error = 'Failed to approve purchase order. Please try again.';
        }
      });
    }
  }

  getStatusBadgeClass(status: string): string {
    const statusClasses: { [key: string]: string } = {
      'DRAFT': 'badge-secondary',
      'APPROVED': 'badge-success',
      'RECEIVED': 'badge-info',
      'CANCELLED': 'badge-danger'
    };
    return statusClasses[status] || 'badge-secondary';
  }
}
