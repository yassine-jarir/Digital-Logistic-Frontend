export type MovementType = 
  | 'PURCHASE_RECEIPT' 
  | 'SALES_SHIPMENT' 
  | 'ADJUSTMENT' 
  | 'TRANSFER' 
  | 'RESERVATION' 
  | 'RELEASE';

export interface InventoryMovement {
  id: number;
  warehouseId: number;
  warehouseName?: string;
  productId: number;
  productName?: string;
  sku?: string;
  movementType: MovementType;
  quantity: number;
  referenceType?: string;
  referenceId?: number;
  notes?: string;
  createdAt: string;
  createdBy?: string;
}

export interface CreateInventoryMovementRequest {
  warehouseId: number;
  productId: number;
  movementType: MovementType;
  quantity: number;
  referenceType?: string;
  referenceId?: number;
  notes?: string;
}

export interface InventoryMovementFilter {
  warehouseId?: number;
  productId?: number;
  movementType?: MovementType;
  startDate?: string;
  endDate?: string;
  page?: number;
  size?: number;
}
