import { Component, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ShipmentService } from '../../../../api/shipment.service';
import { SalesOrderService } from '../../../../api/sales-order.service';
import { Shipment, ShipShipmentRequest } from '../../../../core/models/shipment.model';
import { SalesOrder } from '../../../../core/models/sales-order.model';

interface ShipmentWithOrder extends Shipment {
  salesOrderNumber?: string;
  customerName?: string;
}

@Component({
  selector: 'app-shipments-management',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './shipments-management.component.html',
  styleUrl: './shipments-management.component.css'
})
export class ShipmentsManagementComponent implements OnInit {
  // State signals
  loading = signal<boolean>(true);
  error = signal<string | null>(null);
  successMessage = signal<string | null>(null);
  
  // Data signals
  shipments = signal<ShipmentWithOrder[]>([]);
  salesOrders = signal<SalesOrder[]>([]);
  reservedSalesOrders = signal<SalesOrder[]>([]);
  
  // Filter state
  filterStatus = signal<string>('ALL');
  
  // Modal states
  showCreateModal = signal<boolean>(false);
  showShipModal = signal<boolean>(false);
  
  // Form data
  selectedSalesOrderId = signal<number | null>(null);
  selectedShipmentId = signal<number | null>(null);
  trackingNumber = signal<string>('');
  carrier = signal<string>('');
  
  // Processing states
  creating = signal<boolean>(false);
  shipping = signal<boolean>(false);
  delivering = signal<number | null>(null);

  constructor(
    private shipmentService: ShipmentService,
    private salesOrderService: SalesOrderService
  ) {}

  ngOnInit(): void {
    this.loadData();
  }

  onActionSelect(action: string): void {
    switch (action) {
      case 'CREATE':
        this.openCreateModal();
        break;
      case 'SHIP':
        this.filterStatus.set('PLANNED');
        break;
      case 'DELIVER':
        this.filterStatus.set('SHIPPED');
        break;
      default:
        // no-op
        break;
    }
  }

  loadData(): void {
    this.loading.set(true);
    this.error.set(null);

    // Load shipments and sales orders
    this.shipmentService.getClientShipments().subscribe({
      next: (shipments) => {
        console.log('✅ Shipments loaded:', shipments);
        this.shipments.set(shipments as ShipmentWithOrder[]);
        this.loadSalesOrders();
      },
      error: (error) => {
        console.error('❌ Error loading shipments:', error);
        this.error.set('Failed to load shipments. Please try again.');
        this.loading.set(false);
      }
    });
  }

  loadSalesOrders(): void {
    this.salesOrderService.getWarehouseSalesOrders().subscribe({
      next: (orders) => {
        console.log('✅ Sales orders loaded:', orders);
        this.salesOrders.set(orders);
        // Filter reserved orders that don't have shipments yet
        const reservedOrders = orders.filter(order => 
          order.status === 'RESERVED' && 
          !this.shipments().some(s => s.salesOrderId === order.id)
        );
        this.reservedSalesOrders.set(reservedOrders);
        this.loading.set(false);
      },
      error: (error) => {
        console.error('❌ Error loading sales orders:', error);
        this.error.set('Failed to load sales orders.');
        this.loading.set(false);
      }
    });
  }

  getFilteredShipments(): ShipmentWithOrder[] {
    const status = this.filterStatus();
    if (status === 'ALL') {
      return this.shipments();
    }
    return this.shipments().filter(s => s.status === status);
  }

  // Create shipment
  openCreateModal(): void {
    this.showCreateModal.set(true);
    this.selectedSalesOrderId.set(null);
  }

  closeCreateModal(): void {
    this.showCreateModal.set(false);
    this.selectedSalesOrderId.set(null);
  }

  createShipment(): void {
    const orderId = this.selectedSalesOrderId();
    if (!orderId) {
      this.error.set('Please select a sales order');
      return;
    }

    this.creating.set(true);
    this.error.set(null);

    this.shipmentService.createShipment(orderId).subscribe({
      next: (shipment) => {
        console.log('✅ Shipment created:', shipment);
        this.successMessage.set(`Shipment ${shipment.shipmentNumber} created successfully!`);
        this.closeCreateModal();
        this.loadData();
        this.creating.set(false);
        
        // Clear success message after 3 seconds
        setTimeout(() => this.successMessage.set(null), 3000);
      },
      error: (error) => {
        console.error('❌ Error creating shipment:', error);
        this.error.set(error.error?.message || 'Failed to create shipment. Make sure the order is reserved.');
        this.creating.set(false);
      }
    });
  }

  // Ship shipment
  openShipModal(shipmentId: number): void {
    this.selectedShipmentId.set(shipmentId);
    this.showShipModal.set(true);
    this.trackingNumber.set('');
    this.carrier.set('');
  }

  closeShipModal(): void {
    this.showShipModal.set(false);
    this.selectedShipmentId.set(null);
    this.trackingNumber.set('');
    this.carrier.set('');
  }

  shipShipment(): void {
    const shipmentId = this.selectedShipmentId();
    const tracking = this.trackingNumber();
    const carrierName = this.carrier();

    if (!shipmentId || !tracking || !carrierName) {
      this.error.set('Please fill in all fields');
      return;
    }

    this.shipping.set(true);
    this.error.set(null);

    const request: ShipShipmentRequest = {
      trackingNumber: tracking,
      carrier: carrierName
    };

    this.shipmentService.shipShipment(shipmentId, request).subscribe({
      next: (shipment) => {
        console.log('✅ Shipment shipped:', shipment);
        this.successMessage.set(`Shipment ${shipment.shipmentNumber} marked as shipped!`);
        this.closeShipModal();
        this.loadData();
        this.shipping.set(false);
        
        setTimeout(() => this.successMessage.set(null), 3000);
      },
      error: (error) => {
        console.error('❌ Error shipping shipment:', error);
        this.error.set(error.error?.message || 'Failed to ship shipment.');
        this.shipping.set(false);
      }
    });
  }

  // Deliver shipment
  markAsDelivered(shipmentId: number): void {
    if (!confirm('Mark this shipment as delivered?')) {
      return;
    }

    this.delivering.set(shipmentId);
    this.error.set(null);

    this.shipmentService.deliverShipment(shipmentId).subscribe({
      next: (shipment) => {
        console.log('✅ Shipment delivered:', shipment);
        this.successMessage.set(`Shipment ${shipment.shipmentNumber} marked as delivered!`);
        this.loadData();
        this.delivering.set(null);
        
        setTimeout(() => this.successMessage.set(null), 3000);
      },
      error: (error) => {
        console.error('❌ Error delivering shipment:', error);
        this.error.set(error.error?.message || 'Failed to mark shipment as delivered.');
        this.delivering.set(null);
      }
    });
  }

  // Utility methods
  getStatusBadgeClass(status: string): string {
    switch (status) {
      case 'PLANNED': return 'badge-planned';
      case 'SHIPPED': return 'badge-shipped';
      case 'DELIVERED': return 'badge-delivered';
      default: return 'badge-default';
    }
  }

  formatDate(date: string | null | undefined): string {
    if (!date) return 'N/A';
    return new Date(date).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  }

  canShip(shipment: Shipment): boolean {
    return shipment.status === 'PLANNED';
  }

  canDeliver(shipment: Shipment): boolean {
    return shipment.status === 'SHIPPED';
  }

  dismissError(): void {
    this.error.set(null);
  }

  dismissSuccess(): void {
    this.successMessage.set(null);
  }
}
