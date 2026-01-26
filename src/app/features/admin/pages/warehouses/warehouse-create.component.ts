import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { WarehouseService } from '../../../../api/warehouse.service';

@Component({
  selector: 'app-warehouse-create',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './warehouse-create.component.html',
  styleUrls: ['./warehouse-create.component.css']
})
export class WarehouseCreateComponent {
  warehouse = {
    name: '',
    location: '',
    managerId: undefined as number | undefined,
    active: true
  };

  loading = false;
  error: string | null = null;

  constructor(
    private warehouseService: WarehouseService,
    private router: Router
  ) {}

  onSubmit(): void {
    if (!this.warehouse.name || !this.warehouse.location) {
      this.error = 'Name and Location are required';
      return;
    }

    this.loading = true;
    this.error = null;

    this.warehouseService.createAdminWarehouse(this.warehouse).subscribe({
      next: () => {
        this.loading = false;
        this.router.navigate(['/admin/warehouses']);
      },
      error: (err: any) => {
        console.error('Error creating warehouse:', err);
        this.error = err.error?.message || 'Failed to create warehouse. Please try again.';
        this.loading = false;
      }
    });
  }

  cancel(): void {
    this.router.navigate(['/admin/warehouses']);
  }
}
