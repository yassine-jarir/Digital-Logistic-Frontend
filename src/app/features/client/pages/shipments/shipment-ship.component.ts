import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { ShipmentService } from '../../../../api/shipment.service';
import { Shipment } from '../../../../core/models/shipment.model';

@Component({
  selector: 'app-client-shipment-ship',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterLink],
  templateUrl: './shipment-ship.component.html',
  styleUrls: ['./shipment-ship.component.css']
})
export class ClientShipmentShipComponent implements OnInit {
  shipForm: FormGroup;
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
    this.shipForm = this.fb.group({
      shipmentId: ['', Validators.required],
      trackingNumber: ['', [Validators.required, Validators.minLength(5)]],
      carrier: ['', Validators.required]
    });
  }

  ngOnInit(): void {
    this.loadShipments();
  }

  loadShipments(): void {
    this.loadingShipments = true;
    this.shipmentService.getClientShipments({ status: 'PLANNED' }).subscribe({
      next: (shipments) => {
        this.shipments = shipments;
        this.loadingShipments = false;
      },
      error: (err: any) => {
        console.error('Error loading shipments:', err);
        this.error = 'Failed to load planned shipments';
        this.loadingShipments = false;
      }
    });
  }

  onShipmentSelect(): void {
    const shipmentId = this.shipForm.value.shipmentId;
    this.selectedShipment = this.shipments.find(s => s.id === Number(shipmentId)) || null;
  }

  onSubmit(): void {
    if (this.shipForm.valid) {
      this.loading = true;
      this.error = null;
      this.successMessage = null;

      const { shipmentId, trackingNumber, carrier } = this.shipForm.value;

      this.shipmentService.shipShipment(shipmentId, { trackingNumber, carrier }).subscribe({
        next: (shipment: Shipment) => {
          console.log('✅ Shipment marked as shipped:', shipment);
          this.successMessage = `Shipment ${shipment.shipmentNumber} marked as shipped successfully!`;
          this.loading = false;
          
          // Redirect after 2 seconds
          setTimeout(() => {
            this.router.navigate(['/client/shipments']);
          }, 2000);
        },
        error: (err: any) => {
          console.error('❌ Error shipping shipment:', err);
          this.error = err.error?.message || 'Failed to mark shipment as shipped';
          this.loading = false;
        }
      });
    }
  }

  getShipmentDisplay(shipment: Shipment): string {
    return `${shipment.shipmentNumber} - Order #${shipment.salesOrderNumber || shipment.salesOrderId}`;
  }
}
