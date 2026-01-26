export interface Inventory {
  id: number;
  warehouseId: number;
  warehouseName?: string;
  productId: number;
  productName?: string;
  sku?: string;
  qtyOnHand: number;
  qtyReserved: number;
  qtyAvailable: number;
  reorderPoint?: number;
  reorderQuantity?: number;
  lastUpdated?: string;
}

export interface CreateInventoryRequest {
  warehouseId: number;
  productId: number;
  qtyOnHand: number;
  qtyReserved?: number;
  reorderPoint?: number;
  reorderQuantity?: number;
}

export interface UpdateInventoryRequest {
  qtyOnHand?: number;
  qtyReserved?: number;
  reorderPoint?: number;
  reorderQuantity?: number;
}

export interface InventoryAvailability {
  productId: number;
  warehouseId: number;
  qtyOnHand: number;
  qtyReserved: number;
  qtyAvailable: number;
}
