export type ReservationStatus = 'RESERVED' | 'RELEASED' | 'FULFILLED' | 'CANCELLED';

export interface Reservation {
  id: number;
  salesOrderId: number;
  salesOrderNumber?: string;
  productId: number;
  productName?: string;
  sku?: string;
  warehouseId: number;
  warehouseName?: string;
  quantity: number;
  status: ReservationStatus;
  reservedAt: string;
  expiresAt?: string;
  fulfilledAt?: string;
  cancelledAt?: string;
}

export interface ProcessReservationRequest {
  salesOrderId: number;
}

export interface ReservationResult {
  fullyReserved: boolean;
  partiallyReserved: boolean;
  backordersCreated: boolean;
  reservedItems: ReservedItem[];
  backorderItems: BackorderItem[];
  message: string;
}

export interface ReservedItem {
  productId: number;
  productName: string;
  requestedQty: number;
  reservedQty: number;
  warehouseId: number;
  warehouseName: string;
}

export interface BackorderItem {
  productId: number;
  backorderedQty: number;
  status: string;
}
