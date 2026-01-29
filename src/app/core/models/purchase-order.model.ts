export type PurchaseOrderStatus = 'DRAFT' | 'CREATED' | 'APPROVED' | 'RECEIVED' | 'CANCELLED';

export interface PurchaseOrder {
  id?: number;
  orderNumber: string;
  supplierId: number;
  supplierName: string;
  warehouseId: number;
  warehouseName?: string;
  status: PurchaseOrderStatus;
  orderDate: string;
  expectedDeliveryDate?: string;
  lines: PurchaseOrderLine[];
  totalAmount?: number;
  createdAt?: string;
  updatedAt?: string;
}

export interface PurchaseOrderLine {
  id?: number;
  productSku: string;
  productName?: string;
  orderedQuantity: number;
  receivedQuantity: number;
  unitPrice?: number;
  totalPrice?: number;
}

export interface CreatePurchaseOrderRequest {
  supplierId: number;
  warehouseId: number;
  orderDate: string;
  lines: CreatePurchaseOrderLineRequest[];
}

export interface CreatePurchaseOrderLineRequest {
  productId: number;
  orderedQuantity: number;
  unitCost: number;
}

export interface ReceivePurchaseOrderRequest {
  lines: ReceivePurchaseOrderLineRequest[];
}

export interface ReceivePurchaseOrderLineRequest {
  lineId: number;
  receivedQuantity: number;
}
