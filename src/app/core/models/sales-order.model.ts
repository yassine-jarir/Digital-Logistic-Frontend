export type SalesOrderStatus = 'CREATED' | 'RESERVED' | 'SHIPPED' | 'DELIVERED' | 'CANCELED';

export interface SalesOrder {
  id?: number;
  orderNumber: string;
  clientId?: number;
  clientName?: string;
  customerName: string;
  customerEmail?: string;
  status: SalesOrderStatus;
  orderDate: string;
  lines: SalesOrderLine[];
  totalAmount?: number;
  warehouseId?: number;
  warehouseName?: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface SalesOrderLine {
  id?: number;
  productSku: string;
  productName?: string;
  quantity: number;
  unitPrice?: number;
  totalPrice?: number;
}

export interface CreateSalesOrderRequest {
  orderDate: string;
  status?: 'PENDING' | SalesOrderStatus;
  items: CreateSalesOrderLineRequest[];
}

export interface CreateSalesOrderLineRequest {
  productId: number;
  quantity: number;
  unitPrice: number;
}
