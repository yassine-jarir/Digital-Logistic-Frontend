import { Component, OnInit, ChangeDetectorRef, NgZone } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { ProductService } from '../../../../api/product.service';
import { Product } from '../../../../core/models/product.model';

@Component({
  selector: 'app-products',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './products.component.html',
  styleUrls: ['./products.component.css']
})
export class ProductsComponent implements OnInit {
  products: Product[] = [];
  loading = true;
  error: string | null = null;

  constructor(
    private productService: ProductService,
    private cdr: ChangeDetectorRef,
    private ngZone: NgZone
  ) {}

  ngOnInit(): void {
    this.loadProducts();
  }

  loadProducts(): void {
    this.loading = true;
    this.error = null;

    this.productService.list().subscribe({
      next: (products) => {
        console.log('Products received:', products);
        this.ngZone.run(() => {
          this.products = products;
          this.loading = false;
          this.cdr.detectChanges();
        });
      },
      error: (err: any) => {
        console.error('Error loading products:', err);
        
        this.ngZone.run(() => {
          // Better error messages
          if (err.status === 401) {
            this.error = '🔒 Unauthorized - Please login first';
          } else if (err.status === 403) {
            this.error = '⛔ Access Denied - You don\'t have permission';
          } else if (err.status === 0) {
            this.error = '🔌 Cannot connect to backend - Is the server running on port 9090?';
          } else {
            this.error = `Failed to load products: ${err.message || 'Unknown error'}`;
          }
          
          this.loading = false;
          this.cdr.detectChanges();
        });
      }
    });
  }

  viewProduct(product: Product): void {
    console.log('View product:', product);
    // Navigate to detail view when implemented
    // this.router.navigate(['/admin/products', product.id]);
  }

  editProduct(product: Product): void {
    console.log('Edit product:', product);
    // Navigate to edit form when implemented
    // this.router.navigate(['/admin/products', product.id, 'edit']);
  }

  deleteProduct(product: Product): void {
    if (confirm(`Are you sure you want to deactivate ${product.name}?`)) {
      // Use deactivate instead of delete (soft delete by SKU)
      this.productService.deactivate(product.sku).subscribe({
        next: () => {
          // Reload products to reflect the deactivation
          this.loadProducts();
          console.log('Product deactivated successfully');
        },
        error: (err: any) => {
          console.error('Error deactivating product:', err);
          this.error = 'Failed to deactivate product. Please try again.';
        }
      });
    }
  }
}
