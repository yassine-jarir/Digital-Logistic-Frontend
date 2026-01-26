// Warehouse model matching backend API
export interface Warehouse {
  id?: number;
  code: string;
  name: string;
  location?: string;
  address?: string;
  city?: string;
  country?: string;
  capacity?: number;
  managerId?: number;
  active: boolean;
  createdAt?: string;
  updatedAt?: string;
  products?: WarehouseProduct[];
}

export interface WarehouseProduct {
  productId: number;
  productName: string;
  qtyOnHand: number;
  qtyReserved: number;
  qtyAvailable: number;
}

export interface CreateWarehouseRequest {
  code: string;
  name: string;
  address?: string;
  city?: string;
  country?: string;
  capacity?: number;
}

export interface UpdateWarehouseRequest {
  name?: string;
  address?: string;
  city?: string;
  country?: string;
  capacity?: number;
  active?: boolean;
}
