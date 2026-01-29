import { Component, OnInit, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { SalesOrder } from '../../../../core/models/sales-order.model';
import { WarehouseSalesOrderService } from '../../services/warehouse-sales-order.service';

@Component({
  selector: 'app-sales-orders-list',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './sales-orders-list.component.html',
  styleUrls: ['./sales-orders-list.component.css']
})
export class SalesOrdersListComponent implements OnInit {
  private readonly salesOrderService = inject(WarehouseSalesOrderService);
  private readonly router = inject(Router);

  salesOrders = signal<SalesOrder[]>([]);
  loading = signal<boolean>(false);
  error = signal<string | null>(null);

  ngOnInit(): void {
    this.loadSalesOrders();
  }

  loadSalesOrders(): void {
    this.loading.set(true);
    this.error.set(null);

    this.salesOrderService.getAll().subscribe({
      next: (orders) => {
        this.salesOrders.set(orders);
        this.loading.set(false);
      },
      error: (err) => {
        console.error('Failed to load sales orders:', err);
        this.error.set('Failed to load sales orders. Please try again.');
        this.loading.set(false);
      }
    });
  }

  retry(): void {
    this.loadSalesOrders();
  }

  formatDate(dateString: string | undefined): string {
    if (!dateString) return 'N/A';
    return new Date(dateString).toLocaleDateString();
  }

  formatAmount(amount: number | undefined): string {
    if (amount === undefined || amount === null) return 'N/A';
    return `$${amount.toFixed(2)}`;
  }
}
