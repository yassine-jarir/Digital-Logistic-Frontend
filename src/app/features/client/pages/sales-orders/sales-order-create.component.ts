import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { SalesOrderService } from '../../../../api/sales-order.service';
import { ProductService } from '../../../../api/product.service';
import {
  CreateSalesOrderLineRequest,
  CreateSalesOrderRequest
} from '../../../../core/models/sales-order.model';
import { Product } from '../../../../core/models/product.model';

@Component({
  selector: 'app-client-sales-order-create',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './sales-order-create.component.html',
  styleUrls: ['./sales-order-create.component.css']
})
export class ClientSalesOrderCreateComponent implements OnInit {
  order: CreateSalesOrderRequest = {
    orderDate: new Date().toISOString().slice(0, 10),
    items: [this.newItem()]
  };

  products: Product[] = [];
  productsLoading = false;
  productsError: string | null = null;

  loading = false;
  error: string | null = null;

  constructor(
    private salesOrderService: SalesOrderService,
    private productService: ProductService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.loadProducts();
  }

  loadProducts(): void {
    this.productsLoading = true;
    this.productsError = null;

    this.productService.list().subscribe({
      next: (products) => {
        this.products = (products || [])
          .filter((p) => p.active)
          .sort((a, b) => a.name.localeCompare(b.name));
        this.productsLoading = false;
      },
      error: (err: any) => {
        console.error('Error loading products:', err);
        this.productsError = err?.error?.message || 'Failed to load products. Please try again.';
        this.productsLoading = false;
      }
    });
  }

  newItem(): CreateSalesOrderLineRequest {
    return {
      productId: 0,
      quantity: 1,
      unitPrice: 0
    };
  }

  onProductSelected(item: CreateSalesOrderLineRequest): void {
    const selected = this.products.find((p) => p.id === item.productId);
    if (!selected) return;
    item.unitPrice = selected.sellingPrice ?? item.unitPrice;
  }

  formatProductOption(product: Product): string {
    const sku = product.sku ? `[${product.sku}] ` : '';
    const price = Number.isFinite(product.sellingPrice) ? ` — $${product.sellingPrice}` : '';
    return `${sku}${product.name}${price}`;
  }

  addItem(): void {
    this.order.items.push(this.newItem());
  }

  removeItem(index: number): void {
    if (this.order.items.length <= 1) return;
    this.order.items.splice(index, 1);
  }

  trackByIndex(index: number): number {
    return index;
  }

  private validate(): string | null {
    if (!this.order.orderDate) return 'Order date is required.';
    if (!this.order.items?.length) return 'Add at least one item.';

    for (const [i, item] of this.order.items.entries()) {
      if (!item.productId || item.productId <= 0) return `Item #${i + 1}: select a product.`;
      if (!item.quantity || item.quantity <= 0) return `Item #${i + 1}: quantity must be > 0.`;
      if (item.unitPrice == null || item.unitPrice < 0) return `Item #${i + 1}: unitPrice must be >= 0.`;
    }

    return null;
  }

  onSubmit(): void {
    const validationError = this.validate();
    if (validationError) {
      this.error = validationError;
      return;
    }

    this.loading = true;
    this.error = null;

    this.salesOrderService.createClientOrder(this.order).subscribe({
      next: () => {
        this.loading = false;
        this.router.navigate(['/client/orders']);
      },
      error: (err: any) => {
        console.error('Error creating sales order:', err);
        this.error = err?.error?.message || 'Failed to create order. Please try again.';
        this.loading = false;
      }
    });
  }

  cancel(): void {
    this.router.navigate(['/client/orders']);
  }
}
