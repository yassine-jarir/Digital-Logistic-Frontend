import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { SupplierService } from '../../../../api/supplier.service';
import { CreateSupplierRequest } from '../../../../core/models/supplier.model';

@Component({
  selector: 'app-supplier-create',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './supplier-create.component.html',
  styleUrls: ['./supplier-create.component.css']
})
export class SupplierCreateComponent {
  supplier: CreateSupplierRequest = {
    name: '',
    contactEmail: '',
    contactPhone: '',
    address: '',
    active: true
  };

  loading = false;
  error: string | null = null;

  constructor(
    private supplierService: SupplierService,
    private router: Router
  ) {}

  onSubmit(): void {
    if (!this.supplier.name || !this.supplier.contactEmail || !this.supplier.contactPhone || !this.supplier.address) {
      this.error = 'All fields are required';
      return;
    }

    this.loading = true;
    this.error = null;

    this.supplierService.createSupplier(this.supplier).subscribe({
      next: () => {
        this.loading = false;
        this.router.navigate(['/admin/suppliers']);
      },
      error: (err: any) => {
        console.error('Error creating supplier:', err);
        this.error = err.error?.message || 'Failed to create supplier. Please try again.';
        this.loading = false;
      }
    });
  }

  cancel(): void {
    this.router.navigate(['/admin/suppliers']);
  }
}
