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
  // ISO date string (e.g., 2026-01-27T12:34:56Z)
  orderDate: string;
  status?: 'PENDING' | SalesOrderStatus;
  // Optional contextual fields expected by backend
  customerId?: string;
  currency?: string;
  notes?: string;
  clientId?: number;
  // Order line items (frontend may use `items` in UI)
  items: CreateSalesOrderLineRequest[];
  // Backend expects `lines`; include optional alias for posting
  lines?: CreateSalesOrderLineRequest[];
  // Optional addresses
  shippingAddress?: Address;
  billingAddress?: Address;
}

export interface CreateSalesOrderLineRequest {
  productId: number;
  sku?: string;
  quantity: number;
  unitPrice: number;
  warehouseId?: number;
}

export interface Address {
  line1: string;
  line2?: string;
  city: string;
  state?: string;
  postalCode: string;
  country: string;
}
