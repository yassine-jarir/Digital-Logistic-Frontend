export interface Supplier {
  id: number;
  name: string;
  contactEmail: string;
  contactPhone: string;
  address: string;
  active: boolean;
  createdAt?: string;
  updatedAt?: string;
}

export interface CreateSupplierRequest {
  name: string;
  contactEmail: string;
  contactPhone: string;
  address: string;
  active?: boolean;
}

export interface UpdateSupplierRequest {
  name?: string;
  contactEmail?: string;
  contactPhone?: string;
  address?: string;
  active?: boolean;
}
