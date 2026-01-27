import { Component, OnInit, NgZone } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { SalesOrderService } from '../../../../api/sales-order.service';
import { ProductService } from '../../../../api/product.service';
import { WarehouseService } from '../../../../api/warehouse.service';
import {
  CreateSalesOrderLineRequest,
  CreateSalesOrderRequest
} from '../../../../core/models/sales-order.model';
import { Product } from '../../../../core/models/product.model';
import { Warehouse } from '../../../../core/models/warehouse.model';
import { finalize } from 'rxjs';

@Component({
  selector: 'app-client-sales-order-create',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './sales-order-create.component.html',
  styleUrls: ['./sales-order-create.component.css']
})
export class ClientSalesOrderCreateComponent implements OnInit {
  order: CreateSalesOrderRequest = {
    // Store UI-friendly date (YYYY-MM-DD) and transform to ISO on submit
    orderDate: new Date().toISOString().slice(0, 10),
    items: [this.newItem()],
    currency: 'USD',
    notes: ''
  };

  products: Product[] = [];
  productsLoading = false;
  productsError: string | null = null;

  warehouses: Warehouse[] = [];
  warehousesLoading = false;
  warehousesError: string | null = null;
  warehouseId: number | null = null;
  clientId: number | null = null;

  loading = false;
  error: string | null = null;

  constructor(
    private salesOrderService: SalesOrderService,
    private productService: ProductService,
    private warehouseService: WarehouseService,
    private router: Router,
    private ngZone: NgZone
  ) {}

  ngOnInit(): void {
    this.loadProducts();
    this.loadWarehouses();
  }

  loadWarehouses(): void {
    this.warehousesLoading = true;
    this.warehousesError = null;
    this.warehouseService.getClientWarehouses().pipe(finalize(() => this.ngZone.run(() => (this.warehousesLoading = false)))).subscribe({
      next: (warehouses) => this.ngZone.run(() => {
        this.warehouses = Array.isArray(warehouses) ? warehouses : [];
        if (!this.warehouseId && this.warehouses.length === 1 && this.warehouses[0]?.id) {
          this.warehouseId = Number(this.warehouses[0].id);
        }
      }),
      error: (err) => this.ngZone.run(() => {
        this.warehousesError = err?.message || 'Failed to load warehouses';
      })
    });
  }

  loadProducts(): void {
    console.log('[CreateOrder] loadProducts()');
    this.productsLoading = true;
    this.productsError = null;

    this.productService
      .list()
      .pipe(finalize(() => this.ngZone.run(() => (this.productsLoading = false))))
      .subscribe({
      next: (products) => {
        console.log('✅ Products loaded:', products);
        this.ngZone.run(() => {
          const list = Array.isArray(products) ? products : [];
          this.products = list
            .filter((p) => p?.active)
            .sort((a, b) => (a?.name || '').localeCompare(b?.name || ''));
          console.log('✅ Filtered/sorted products:', this.products.length, 'active products');
          // productsLoading handled by finalize
        });
      },
      error: (err: any) => {
        console.error('❌ Products API error:', err);
        console.error('❌ Status:', err.status, 'Message:', err.message);
        
        this.ngZone.run(() => {
          if (err.status === 403) {
            this.productsError = '⛔ Access denied: CLIENT role cannot access products. Backend needs to allow CLIENT role for /api/products/all';
          } else if (err.status === 401) {
            this.productsError = '🔒 Unauthorized: Please log in again';
          } else if (err.status === 0) {
            this.productsError = '🔌 Cannot connect to backend - Is the server running?';
          } else {
            this.productsError = err?.error?.message || `Failed to load products (${err.status})`;
          }
          // productsLoading handled by finalize
        });
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
    if (!this.warehouseId) return 'Select a warehouse.';
    if (!this.clientId) return 'Client ID is required (backend validation).';
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

    // Transform UI model into backend expected payload
    const body: any = {
      warehouseId: this.warehouseId,
      clientId: this.clientId,
      lines: this.order.items.map((it) => {
        const selected = this.products.find((p) => p.id === it.productId);
        return {
          productId: it.productId,
          quantity: it.quantity,
          // backend calculates price from product; still send if needed
          unitPrice: it.unitPrice,
          // include sku for completeness (ignored by backend if not mapped)
          productSku: selected?.sku
        };
      })
    };

    this.salesOrderService.createClientOrder(body).subscribe({
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
