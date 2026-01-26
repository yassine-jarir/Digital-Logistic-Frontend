import { Component, OnInit, ChangeDetectorRef, NgZone } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { ShipmentService } from '../../../../api/shipment.service';
import { Shipment } from '../../../../core/models/shipment.model';

@Component({
  selector: 'app-client-shipments',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './shipments.component.html',
  styleUrls: ['./shipments.component.css']
})
export class ClientShipmentsComponent implements OnInit {
  shipments: Shipment[] = [];
  loading = true;
  error: string | null = null;

  constructor(
    private shipmentService: ShipmentService,
    private cdr: ChangeDetectorRef,
    private ngZone: NgZone
  ) {}

  ngOnInit(): void {
    this.loadShipments();
  }

  loadShipments(): void {
    this.loading = true;
    this.error = null;

    this.shipmentService.getClientShipments().subscribe({
      next: (shipments) => {
        console.log('✅ Client shipments loaded:', shipments);
        this.ngZone.run(() => {
          this.shipments = shipments;
          this.loading = false;
          this.cdr.detectChanges();
        });
      },
      error: (err: any) => {
        console.error('❌ Error loading shipments:', err);
        this.ngZone.run(() => {
          this.error = 'Failed to load shipments. Please try again.';
          this.loading = false;
          this.cdr.detectChanges();
        });
      }
    });
  }

  getStatusBadgeClass(status: string): string {
    const statusClasses: { [key: string]: string } = {
      'PLANNED': 'badge-secondary',
      'SHIPPED': 'badge-primary',
      'DELIVERED': 'badge-success',
      'CANCELLED': 'badge-danger'
    };
    return statusClasses[status] || 'badge-secondary';
  }
}
