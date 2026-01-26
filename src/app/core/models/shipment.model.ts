export type ShipmentStatus = 'PLANNED' | 'SHIPPED' | 'DELIVERED';

export interface Shipment {
  id?: number;
  shipmentNumber: string;
  salesOrderId: number;
  salesOrderNumber?: string;
  trackingNumber?: string;
  carrier?: string;
  status: ShipmentStatus;
  scheduledDate?: string;
  shippedDate?: string;
  deliveredDate?: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface CreateShipmentRequest {
  carrier?: string;
  scheduledDate?: string;
}

export interface ShipShipmentRequest {
  trackingNumber: string;
  carrier: string;
}
