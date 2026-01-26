import { Component, OnInit, ChangeDetectorRef, NgZone } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { SupplierService } from '../../../../api/supplier.service';
import { Supplier } from '../../../../core/models/supplier.model';

@Component({
  selector: 'app-suppliers',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './suppliers.component.html',
  styleUrls: ['./suppliers.component.css']
})
export class SuppliersComponent implements OnInit {
  suppliers: Supplier[] = [];
  loading = true;
  error: string | null = null;

  constructor(
    private supplierService: SupplierService,
    private cdr: ChangeDetectorRef,
    private ngZone: NgZone
  ) {}

  ngOnInit(): void {
    this.loadSuppliers();
  }

  loadSuppliers(): void {
    this.loading = true;
    this.error = null;

    this.supplierService.getAllSuppliers().subscribe({
      next: (suppliers) => {
        console.log('✅ Suppliers loaded:', suppliers);
        this.ngZone.run(() => {
          this.suppliers = suppliers;
          this.loading = false;
          this.cdr.detectChanges();
        });
      },
      error: (err: any) => {
        console.error('Error loading suppliers:', err);
        this.ngZone.run(() => {
          this.error = 'Failed to load suppliers. Please try again.';
          this.loading = false;
          this.cdr.detectChanges();
        });
      }
    });
  }

  deactivateSupplier(supplier: Supplier): void {
    if (confirm(`Are you sure you want to deactivate supplier ${supplier.name}?`)) {
      this.supplierService.deactivateSupplier(supplier.id).subscribe({
        next: () => {
          this.loadSuppliers();
          console.log('Supplier deactivated successfully');
        },
        error: (err: any) => {
          console.error('Error deactivating supplier:', err);
          this.error = 'Failed to deactivate supplier. Please try again.';
        }
      });
    }
  }

  deleteSupplier(supplier: Supplier): void {
    if (confirm(`Are you sure you want to permanently delete supplier ${supplier.name}?`)) {
      this.supplierService.deleteSupplier(supplier.id).subscribe({
        next: () => {
          this.loadSuppliers();
          console.log('Supplier deleted successfully');
        },
        error: (err: any) => {
          console.error('Error deleting supplier:', err);
          this.error = 'Failed to delete supplier. Please try again.';
        }
      });
    }
  }
}
