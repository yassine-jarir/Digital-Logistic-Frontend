export type PurchaseOrderStatus = 'DRAFT' | 'CREATED' | 'APPROVED' | 'RECEIVED' | 'CANCELED';

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
  supplierName: string;
  warehouseId: number;
  expectedDeliveryDate?: string;
  lines: CreatePurchaseOrderLineRequest[];
}

export interface CreatePurchaseOrderLineRequest {
  productSku: string;
  quantity: number;
  unitPrice?: number;
}

export interface ReceivePurchaseOrderRequest {
  lines: ReceivePurchaseOrderLineRequest[];
}

export interface ReceivePurchaseOrderLineRequest {
  lineId: number;
  receivedQuantity: number;
}
