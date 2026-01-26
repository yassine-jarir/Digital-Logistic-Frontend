import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { ProductService } from '../../../../api/product.service';
import { CreateProductRequest } from '../../../../core/models/product.model';

@Component({
  selector: 'app-product-create',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './product-create.component.html',
  styleUrl: './product-create.component.css'
})
export class ProductCreateComponent {
  product: CreateProductRequest = {
    sku: '',
    name: '',
    description: '',
    category: '',
    costPrice: 0,
    sellingPrice: 0,
    active: true
  };
  
  loading = false;
  error: string | null = null;

  constructor(
    private productService: ProductService,
    private router: Router
  ) {}

  onSubmit(): void {
    if (!this.product.sku || !this.product.name) {
      this.error = 'SKU and Name are required';
      return;
    }

    this.loading = true;
    this.error = null;

    this.productService.create(this.product).subscribe({
      next: () => {
        this.loading = false;
        this.router.navigate(['/admin/products']);
      },
      error: (err) => {
        console.error('Error creating product:', err);
        this.error = 'Failed to create product. Please try again.';
        this.loading = false;
      }
    });
  }

  cancel(): void {
    this.router.navigate(['/admin/products']);
  }
}
