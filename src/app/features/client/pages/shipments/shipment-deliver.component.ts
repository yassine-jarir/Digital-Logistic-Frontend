import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { ShipmentService } from '../../../../api/shipment.service';
import { Shipment } from '../../../../core/models/shipment.model';

@Component({
  selector: 'app-client-shipment-deliver',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterLink],
  templateUrl: './shipment-deliver.component.html',
  styleUrls: ['./shipment-deliver.component.css']
})
export class ClientShipmentDeliverComponent implements OnInit {
  deliverForm: FormGroup;
  shipments: Shipment[] = [];
  selectedShipment: Shipment | null = null;
  loading = false;
  loadingShipments = true;
  error: string | null = null;
  successMessage: string | null = null;

  constructor(
    private fb: FormBuilder,
    private shipmentService: ShipmentService,
    private router: Router
  ) {
    this.deliverForm = this.fb.group({
      shipmentId: ['', Validators.required]
    });
  }

  ngOnInit(): void {
    this.loadShipments();
  }

  loadShipments(): void {
    this.loadingShipments = true;
    this.shipmentService.getClientShipments({ status: 'SHIPPED' }).subscribe({
      next: (shipments) => {
        this.shipments = shipments;
        this.loadingShipments = false;
      },
      error: (err: any) => {
        console.error('Error loading shipments:', err);
        this.error = 'Failed to load shipped shipments';
        this.loadingShipments = false;
      }
    });
  }

  onShipmentSelect(): void {
    const shipmentId = this.deliverForm.value.shipmentId;
    this.selectedShipment = this.shipments.find(s => s.id === Number(shipmentId)) || null;
  }

  onSubmit(): void {
    if (this.deliverForm.valid) {
      this.loading = true;
      this.error = null;
      this.successMessage = null;

      const shipmentId = this.deliverForm.value.shipmentId;

      this.shipmentService.deliverShipment(shipmentId).subscribe({
        next: (shipment: Shipment) => {
          console.log('✅ Shipment marked as delivered:', shipment);
          this.successMessage = `Shipment ${shipment.shipmentNumber} marked as delivered successfully!`;
          this.loading = false;
          
          // Redirect after 2 seconds
          setTimeout(() => {
            this.router.navigate(['/client/shipments']);
          }, 2000);
        },
        error: (err: any) => {
          console.error('❌ Error delivering shipment:', err);
          this.error = err.error?.message || 'Failed to mark shipment as delivered';
          this.loading = false;
        }
      });
    }
  }

  getShipmentDisplay(shipment: Shipment): string {
    return `${shipment.shipmentNumber} - Order #${shipment.salesOrderNumber || shipment.salesOrderId} - ${shipment.carrier}`;
  }
}
