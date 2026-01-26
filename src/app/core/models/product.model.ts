export interface Product {
  id?: number;
  sku: string;
  name: string;
  description?: string;
  category?: string;
  costPrice: number;
  sellingPrice: number;
  profit?: number;
  active: boolean;
  createdAt?: string;
  updatedAt?: string;
}

export interface CreateProductRequest {
  sku: string;
  name: string;
  description?: string;
  category?: string;
  costPrice: number;
  sellingPrice: number;
  active?: boolean;
}

export interface UpdateProductRequest {
  name?: string;
  description?: string;
  category?: string;
  costPrice?: number;
  sellingPrice?: number;
  active?: boolean;
}
