import { Component, OnInit, ChangeDetectorRef, NgZone } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { SalesOrderService } from '../../../../api/sales-order.service';
import { SalesOrder } from '../../../../core/models/sales-order.model';

@Component({
  selector: 'app-client-sales-orders',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './sales-orders.component.html',
  styleUrls: ['./sales-orders.component.css']
})
export class ClientSalesOrdersComponent implements OnInit {
  salesOrders: SalesOrder[] = [];
  loading = true;
  error: string | null = null;

  constructor(
    private salesOrderService: SalesOrderService,
    private cdr: ChangeDetectorRef,
    private ngZone: NgZone
  ) {}

  ngOnInit(): void {
    this.loadSalesOrders();
  }

  loadSalesOrders(): void {
    this.loading = true;
    this.error = null;

    this.salesOrderService.getClientSalesOrders().subscribe({
      next: (orders) => {
        console.log('✅ Client sales orders loaded:', orders);
        this.ngZone.run(() => {
          this.salesOrders = orders;
          this.loading = false;
          this.cdr.detectChanges();
        });
      },
      error: (err: any) => {
        console.error('❌ Error loading sales orders:', err);
        this.ngZone.run(() => {
          this.error = 'Failed to load sales orders. Please try again.';
          this.loading = false;
          this.cdr.detectChanges();
        });
      }
    });
  }

  getStatusBadgeClass(status: string): string {
    const statusClasses: { [key: string]: string } = {
      'CREATED': 'badge-secondary',
      'RESERVED': 'badge-info',
      'SHIPPED': 'badge-primary',
      'DELIVERED': 'badge-success',
      'CANCELED': 'badge-danger'
    };
    return statusClasses[status] || 'badge-secondary';
  }
}
