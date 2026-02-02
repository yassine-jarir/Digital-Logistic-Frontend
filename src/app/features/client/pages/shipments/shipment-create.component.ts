import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { ShipmentService } from '../../../../api/shipment.service';
import { SalesOrderService } from '../../../../api/sales-order.service';
import { Shipment } from '../../../../core/models/shipment.model';
import { SalesOrder } from '../../../../core/models/sales-order.model';

@Component({
  selector: 'app-client-shipment-create',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterLink],
  templateUrl: './shipment-create.component.html',
  styleUrls: ['./shipment-create.component.css']
})
export class ClientShipmentCreateComponent implements OnInit {
  createForm: FormGroup;
  salesOrders: SalesOrder[] = [];
  loading = false;
  loadingOrders = true;
  error: string | null = null;
  successMessage: string | null = null;

  constructor(
    private fb: FormBuilder,
    private shipmentService: ShipmentService,
    private salesOrderService: SalesOrderService,
    private router: Router
  ) {
    this.createForm = this.fb.group({
      salesOrderId: ['', Validators.required]
    });
  }

  ngOnInit(): void {
    this.loadSalesOrders();
  }

  loadSalesOrders(): void {
    this.loadingOrders = true;
    this.salesOrderService.getClientSalesOrders().subscribe({
      next: (orders) => {
        // Filter only reserved orders that can be shipped
        this.salesOrders = orders.filter(order => 
          order.status === 'RESERVED' || order.status === 'CREATED'
        );
        this.loadingOrders = false;
      },
      error: (err: any) => {
        console.error('Error loading sales orders:', err);
        this.error = 'Failed to load sales orders';
        this.loadingOrders = false;
      }
    });
  }

  onSubmit(): void {
    if (this.createForm.valid) {
      this.loading = true;
      this.error = null;
      this.successMessage = null;

      const salesOrderId = this.createForm.value.salesOrderId;

      this.shipmentService.createShipment(salesOrderId).subscribe({
        next: (shipment: Shipment) => {
          console.log('✅ Shipment created:', shipment);
          this.successMessage = `Shipment ${shipment.shipmentNumber} created successfully!`;
          this.loading = false;
          
          // Redirect after 2 seconds
          setTimeout(() => {
            this.router.navigate(['/client/shipments']);
          }, 2000);
        },
        error: (err: any) => {
          console.error('❌ Error creating shipment:', err);
          this.error = err.error?.message || 'Failed to create shipment. Please ensure the order is reserved.';
          this.loading = false;
        }
      });
    }
  }

  getOrderDisplay(order: SalesOrder): string {
    return `${order.orderNumber} - ${order.status} - Total: $${order.totalAmount}`;
  }
}
