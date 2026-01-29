import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { PurchaseOrderService } from '../../../../api/purchase-order.service';
import { PurchaseOrder } from '../../../../core/models/purchase-order.model';

@Component({
  selector: 'app-purchase-order-detail',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './purchase-order-detail.component.html',
  styleUrls: ['./purchase-order-detail.component.css']
})
export class PurchaseOrderDetailComponent implements OnInit {
  purchaseOrder: PurchaseOrder | null = null;
  loading = true;
  error: string | null = null;
  orderId: string = '';

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private purchaseOrderService: PurchaseOrderService
  ) {}

  ngOnInit(): void {
    this.orderId = this.route.snapshot.paramMap.get('id') || '';
    if (this.orderId) {
      this.loadPurchaseOrder();
    } else {
      this.error = 'Invalid purchase order ID';
      this.loading = false;
    }
  }

  loadPurchaseOrder(): void {
    this.loading = true;
    this.error = null;

    this.purchaseOrderService.getAdminOrderDetail(this.orderId).subscribe({
      next: (order) => {
        console.log('✅ Purchase order loaded:', order);
        this.purchaseOrder = order;
        this.loading = false;
      },
      error: (err: any) => {
        console.error('Error loading purchase order:', err);
        this.error = err.error?.message || 'Failed to load purchase order. Please try again.';
        this.loading = false;
      }
    });
  }

  approvePurchaseOrder(): void {
    if (!this.purchaseOrder || !this.purchaseOrder.id) return;

    if (confirm(`Are you sure you want to approve purchase order #${this.purchaseOrder.orderNumber}?`)) {
      this.purchaseOrderService.approvePurchaseOrder(this.purchaseOrder.id).subscribe({
        next: (updatedOrder) => {
          console.log('✅ Purchase order approved successfully');
          this.purchaseOrder = updatedOrder;
          alert('Purchase order approved successfully!');
        },
        error: (err: any) => {
          console.error('Error approving purchase order:', err);
          this.error = err.error?.message || 'Failed to approve purchase order. Please try again.';
        }
      });
    }
  }

  canApprove(): boolean {
    return this.purchaseOrder?.status === 'DRAFT';
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

  goBack(): void {
    this.router.navigate(['/admin/purchase-orders']);
  }
}
