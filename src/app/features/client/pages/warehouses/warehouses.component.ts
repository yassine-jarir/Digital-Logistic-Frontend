import { Component, OnInit, ChangeDetectorRef, NgZone } from '@angular/core';
import { CommonModule } from '@angular/common';
import { WarehouseService } from '../../../../api/warehouse.service';
import { Warehouse } from '../../../../core/models/warehouse.model';

@Component({
  selector: 'app-client-warehouses',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './warehouses.component.html',
  styleUrls: ['./warehouses.component.css']
})
export class ClientWarehousesComponent implements OnInit {
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

    this.warehouseService.getClientWarehouses().subscribe({
      next: (warehouses) => {
        console.log('✅ Client warehouses loaded:', warehouses);
        this.ngZone.run(() => {
          this.warehouses = warehouses;
          this.loading = false;
          this.cdr.detectChanges();
        });
      },
      error: (err: any) => {
        console.error('❌ Error loading warehouses:', err);
        this.ngZone.run(() => {
          this.error = 'Failed to load warehouses. Please try again.';
          this.loading = false;
          this.cdr.detectChanges();
        });
      }
    });
  }
}
