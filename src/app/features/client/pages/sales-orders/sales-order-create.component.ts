import { Component, OnInit, NgZone } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs';
import { SalesOrderService } from '../../../../api/sales-order.service';
import { WarehouseService } from '../../../../api/warehouse.service';
import { AuthService } from '../../../../core/services/auth.service';
import { TokenService } from '../../../../core/auth/token.service';
import {
  CreateSalesOrderLineRequest,
  CreateSalesOrderRequest
} from '../../../../core/models/sales-order.model';
import { Product } from '../../../../core/models/product.model';
import { Warehouse } from '../../../../core/models/warehouse.model';
import { finalize } from 'rxjs';
import * as ProductsActions from '../products/store/products.actions';
import * as ProductsSelectors from '../products/store/products.selectors';

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

  products$: Observable<Product[]>;
  productsLoading$: Observable<boolean>;
  productsError$: Observable<string | null>;
  products: Product[] = []; // Cached for form submission

  warehouses: Warehouse[] = [];
  warehousesLoading = false;
  warehousesError: string | null = null;
  warehouseId: number | null = null;
  clientId: number | null = null;

  loading = false;
  error: string | null = null;
  
  constructor(
    private salesOrderService: SalesOrderService,
    private warehouseService: WarehouseService,
    private authService: AuthService,
    private tokenService: TokenService,
    private router: Router,
    private ngZone: NgZone,
    private store: Store
  ) {
    this.products$ = this.store.select(ProductsSelectors.selectActiveProducts);
    this.productsLoading$ = this.store.select(ProductsSelectors.selectProductsLoading);
    this.productsError$ = this.store.select(ProductsSelectors.selectProductsError);
  }

  ngOnInit(): void {
    // Extract clientId from JWT token
    this.extractClientIdFromToken();
    this.loadProducts();
    this.loadWarehouses();
    
    // Subscribe to products for form submission usage
    this.products$.subscribe(products => {
      this.products = products;
    });
  }

  private extractClientIdFromToken(): void {
    const token = this.tokenService.getAccessToken();
    if (token) {
      try {
        const decoded = this.tokenService.decode(token);
        
        // Try to get numeric client ID from token
        // If the subject is a UUID (Keycloak style), the backend will handle it via owner_sub
        const clientIdFromToken = decoded?.['clientId'] || decoded?.['client_id'];
        
        if (typeof clientIdFromToken === 'number') {
          this.clientId = clientIdFromToken;
        } else if (typeof clientIdFromToken === 'string') {
          const numericId = parseInt(clientIdFromToken, 10);
          if (!isNaN(numericId)) {
            this.clientId = numericId;
          }
        }
        
        // If sub is numeric, try to use it
        if (!this.clientId && typeof decoded?.['sub'] === 'string') {
          const numericId = parseInt(decoded['sub'], 10);
          if (!isNaN(numericId)) {
            this.clientId = numericId;
          }
        }
        
        console.log('Client ID extracted from token:', this.clientId);
        console.log('Token subject (sub):', decoded?.['sub']);
      } catch (error) {
        console.error('Failed to decode token:', error);
        this.error = 'Unable to identify client. Please log in again.';
      }
    } else {
      this.error = 'No authentication token found. Please log in.';
    }
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
    this.store.dispatch(ProductsActions.loadProducts({ query: { active: true } }));
  }

  newItem(): CreateSalesOrderLineRequest {
    return {
      productId: 0,
      quantity: 1,
      unitPrice: 0
    };
  }

  onProductSelected(item: CreateSalesOrderLineRequest): void {
    this.store.select(ProductsSelectors.selectProductById(item.productId)).subscribe(selected => {
      if (!selected) return;
      item.unitPrice = selected.sellingPrice ?? item.unitPrice;
    }).unsubscribe();
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
    // Note: clientId is optional - backend will extract it from JWT token via owner_sub
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
      // Only include clientId if it's a valid number
      // Backend will extract it from JWT token (owner_sub) if not provided
      ...(this.clientId && { clientId: this.clientId }),
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
