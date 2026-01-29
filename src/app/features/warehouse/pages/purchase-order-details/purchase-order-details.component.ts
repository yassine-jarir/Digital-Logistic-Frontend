import { Component, OnInit, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { PurchaseOrder } from '../../../../core/models/purchase-order.model';
import { WarehousePurchaseOrderService } from '../../services/warehouse-purchase-order.service';

@Component({
  selector: 'app-purchase-order-details',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './purchase-order-details.component.html',
  styleUrls: ['./purchase-order-details.component.css']
})
export class PurchaseOrderDetailsComponent implements OnInit {
  private readonly route = inject(ActivatedRoute);
  private readonly router = inject(Router);
  private readonly purchaseOrderService = inject(WarehousePurchaseOrderService);

  purchaseOrder = signal<PurchaseOrder | null>(null);
  loading = signal<boolean>(false);
  receiving = signal<boolean>(false);
  error = signal<string | null>(null);
  notFound = signal<boolean>(false);
  successMessage = signal<string | null>(null);

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.loadPurchaseOrder(+id);
    } else {
      this.error.set('Invalid purchase order ID');
    }
  }

  loadPurchaseOrder(id: number): void {
    this.loading.set(true);
    this.error.set(null);
    this.notFound.set(false);

    this.purchaseOrderService.getById(id).subscribe({
      next: (po) => {
        // Calculate missing values if not provided by backend
        const enrichedPo = this.enrichPurchaseOrder(po);
        this.purchaseOrder.set(enrichedPo);
        this.loading.set(false);
      },
      error: (err) => {
        console.error('Failed to load purchase order:', err);
        this.loading.set(false);
        if (err.status === 404) {
          this.notFound.set(true);
          this.error.set('Purchase order not found');
        } else {
          this.error.set('Failed to load purchase order. Please try again.');
        }
      }
    });
  }

  /**
   * Enrich purchase order with calculated values if missing from backend
   */
  private enrichPurchaseOrder(po: PurchaseOrder): PurchaseOrder {
    // Calculate line item prices if missing
    const enrichedLines = po.lines.map(line => {
      const enrichedLine = { ...line };
      
      // If unitPrice is missing, set it to 0 or calculate from totalPrice if available
      if (enrichedLine.unitPrice === undefined || enrichedLine.unitPrice === null) {
        if (enrichedLine.totalPrice && enrichedLine.orderedQuantity > 0) {
          enrichedLine.unitPrice = enrichedLine.totalPrice / enrichedLine.orderedQuantity;
        } else {
          enrichedLine.unitPrice = 0;
        }
      }
      
      // Calculate totalPrice if missing
      if (enrichedLine.totalPrice === undefined || enrichedLine.totalPrice === null) {
        enrichedLine.totalPrice = (enrichedLine.unitPrice || 0) * enrichedLine.orderedQuantity;
      }
      
      return enrichedLine;
    });

    // Calculate total amount from line items if missing
    let totalAmount = po.totalAmount;
    if (totalAmount === undefined || totalAmount === null) {
      totalAmount = enrichedLines.reduce((sum, line) => sum + (line.totalPrice || 0), 0);
    }

    // Set expected delivery date to 7 days from order date if missing
    let expectedDeliveryDate = po.expectedDeliveryDate;
    if (!expectedDeliveryDate && po.orderDate) {
      const orderDate = new Date(po.orderDate);
      orderDate.setDate(orderDate.getDate() + 7);
      expectedDeliveryDate = orderDate.toISOString().split('T')[0];
    }

    return {
      ...po,
      lines: enrichedLines,
      totalAmount,
      expectedDeliveryDate
    };
  }

  receivePurchaseOrder(): void {
    const po = this.purchaseOrder();
    if (!po || !po.id) return;

    if (po.status !== 'APPROVED') {
      this.error.set('Purchase order must be approved before receiving');
      setTimeout(() => this.error.set(null), 5000);
      return;
    }

    this.receiving.set(true);
    this.error.set(null);

    this.purchaseOrderService.receive(po.id).subscribe({
      next: (updatedPo) => {
        // Enrich the updated purchase order as well
        const enrichedPo = this.enrichPurchaseOrder(updatedPo);
        this.purchaseOrder.set(enrichedPo);
        this.receiving.set(false);
        this.successMessage.set('Purchase order received successfully!');
        setTimeout(() => this.successMessage.set(null), 3000);
      },
      error: (err) => {
        console.error('Failed to receive purchase order:', err);
        this.receiving.set(false);
        const message = err.error?.message || 'Failed to receive purchase order. Please try again.';
        this.error.set(message);
      }
    });
  }

  canReceive(): boolean {
    const po = this.purchaseOrder();
    return po?.status === 'APPROVED';
  }

  goBack(): void {
    this.router.navigate(['/warehouse']);
  }

  formatDate(dateString: string | undefined): string {
    if (!dateString) return 'N/A';
    return new Date(dateString).toLocaleDateString();
  }

  formatAmount(amount: number | undefined): string {
    if (amount === undefined || amount === null) return 'N/A';
    return `$${amount.toFixed(2)}`;
  }

  getStatusClass(status: string): string {
    const statusMap: { [key: string]: string } = {
      'DRAFT': 'bg-gray-100 text-gray-800',
      'CREATED': 'bg-blue-100 text-blue-800',
      'APPROVED': 'bg-yellow-100 text-yellow-800',
      'RECEIVED': 'bg-green-100 text-green-800',
      'CANCELED': 'bg-red-100 text-red-800'
    };
    return statusMap[status] || 'bg-gray-100 text-gray-800';
  }
}
