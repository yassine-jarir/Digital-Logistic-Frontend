import { Component, OnInit, ChangeDetectorRef, NgZone } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { WarehouseService } from '../../../../api/warehouse.service';
import { Warehouse } from '../../../../core/models/warehouse.model';

@Component({
  selector: 'app-warehouses',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './warehouses.component.html',
  styleUrls: ['./warehouses.component.css']
})
export class WarehousesComponent implements OnInit {
  warehouses: Warehouse[] = [];
  loading = true;
  error: string | null = null;

  constructor(
    private warehouseService: WarehouseService,
    private cdr: ChangeDetectorRef,
    private ngZone: NgZone
  ) {}

  ngOnInit(): void {
    this.loadWarehouses();
  }

  loadWarehouses(): void {
    this.loading = true;
    this.error = null;
    console.log('🔄 Loading warehouses...');

    this.warehouseService.getAdminWarehouses().subscribe({
      next: (warehouses) => {
        console.log('✅ Warehouses loaded:', warehouses);
        this.ngZone.run(() => {
          this.warehouses = warehouses;
          this.loading = false;
          this.cdr.detectChanges();
          console.log('✅ UI updated - warehouses:', this.warehouses.length, 'loading:', this.loading);
        });
      },
      error: (err: any) => {
        console.error('❌ Error loading warehouses:', err);
        this.ngZone.run(() => {
          this.error = 'Failed to load warehouses. Please try again.';
          this.loading = false;
          this.cdr.detectChanges();
        });
      },
      complete: () => {
        console.log('🏁 Warehouse loading complete');
      }
    });
  }

  deleteWarehouse(warehouse: Warehouse): void {
    if (confirm(`Are you sure you want to delete warehouse ${warehouse.name}?`)) {
      this.warehouseService.deleteAdminWarehouse(String(warehouse.id!)).subscribe({
        next: () => {
          this.loadWarehouses();
          console.log('Warehouse deleted successfully');
        },
        error: (err: any) => {
          console.error('Error deleting warehouse:', err);
          this.error = 'Failed to delete warehouse. Please try again.';
        }
      });
    }
  }
}
