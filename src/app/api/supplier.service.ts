import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { API_BASE_URL } from '../app.config';
import { Supplier, CreateSupplierRequest, UpdateSupplierRequest } from '../core/models/supplier.model';

@Injectable({ providedIn: 'root' })
export class SupplierService {
  private http = inject(HttpClient);
  private base = inject(API_BASE_URL);
  private url = `${this.base}/suppliers`;

  // ADMIN: Get all suppliers
  getAllSuppliers(): Observable<Supplier[]> {
    return this.http.get<Supplier[]>(this.url);
  }

  // ADMIN: Get active suppliers only
  getActiveSuppliers(): Observable<Supplier[]> {
    return this.http.get<Supplier[]>(`${this.url}/active`);
  }

  // WAREHOUSE_MANAGER: Get active suppliers
  getWarehouseActiveSuppliers(): Observable<Supplier[]> {
    return this.http.get<Supplier[]>(`${this.base}/warehouse-manager/suppliers/active`);
  }

  // ADMIN: Get supplier by ID
  getSupplier(id: number): Observable<Supplier> {
    return this.http.get<Supplier>(`${this.url}/${id}`);
  }

  // ADMIN: Create new supplier
  createSupplier(body: CreateSupplierRequest): Observable<Supplier> {
    return this.http.post<Supplier>(this.url, body);
  }

  // ADMIN: Update supplier
  updateSupplier(id: number, body: UpdateSupplierRequest): Observable<Supplier> {
    return this.http.put<Supplier>(`${this.url}/${id}`, body);
  }

  // ADMIN: Delete supplier
  deleteSupplier(id: number): Observable<void> {
    return this.http.delete<void>(`${this.url}/${id}`);
  }

  // ADMIN: Deactivate supplier (soft delete)
  deactivateSupplier(id: number): Observable<Supplier> {
    return this.http.patch<Supplier>(`${this.url}/${id}/deactivate`, {});
  }

  // Convenience methods for backward compatibility
  list(): Observable<Supplier[]> {
    return this.getAllSuppliers();
  }

  get(id: string | number): Observable<Supplier> {
    return this.getSupplier(Number(id));
  }

  create(body: CreateSupplierRequest): Observable<Supplier> {
    return this.createSupplier(body);
  }

  update(id: string | number, body: UpdateSupplierRequest): Observable<Supplier> {
    return this.updateSupplier(Number(id), body);
  }

  delete(id: string | number): Observable<void> {
    return this.deleteSupplier(Number(id));
  }

  deactivate(id: string | number): Observable<Supplier> {
    return this.deactivateSupplier(Number(id));
  }
}
