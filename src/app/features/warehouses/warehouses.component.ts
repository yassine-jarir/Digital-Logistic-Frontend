import { Component, OnInit, ChangeDetectorRef, NgZone } from '@angular/core';
import { CommonModule } from '@angular/common';
import { WarehouseService } from '../../api/warehouse.service';

@Component({
  selector: 'app-warehouses',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './warehouses.component.html',
  styleUrls: ['./warehouses.component.css']
})
export class WarehousesComponent implements OnInit {
  warehouses: any[] = [];
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
    
    this.warehouseService.getAdminWarehouses().subscribe({
      next: (data) => {
        console.log('✅ Warehouses loaded:', data);
        this.ngZone.run(() => {
          this.warehouses = data;
          this.loading = false;
          this.cdr.detectChanges();
        });
      },
      error: (err) => {
        console.error('❌ Error loading warehouses:', err);
        this.ngZone.run(() => {
          this.error = 'Failed to load warehouses';
          this.loading = false;
          this.cdr.detectChanges();
        });
      }
    });
  }
}
