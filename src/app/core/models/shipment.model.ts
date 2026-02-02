export type ShipmentStatus = 'PLANNED' | 'SHIPPED' | 'DELIVERED' | 'CANCELLED';

export interface ShipmentLine {
  id: number;
  productId: number;
  productName: string;
  productSku: string;
  quantity: number;
  salesOrderLineId: number;
  quantityShipped: number;
}

export interface Shipment {
  id?: number;
  shipmentNumber: string;
  salesOrderId: number;
  salesOrderNumber?: string;
  trackingNumber?: string | null;
  carrier?: string | null;
  status: ShipmentStatus;
  plannedShipDate?: string;
  actualShipDate?: string | null;
  createdAt?: string;
  lines?: ShipmentLine[];
}

export interface CreateShipmentRequest {
  carrier?: string;
  scheduledDate?: string;
}

export interface ShipShipmentRequest {
  trackingNumber: string;
  carrier: string;
}
