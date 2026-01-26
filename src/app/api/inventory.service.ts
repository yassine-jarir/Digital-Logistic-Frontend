import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { API_BASE_URL } from '../app.config';
import { Inventory, CreateInventoryRequest, UpdateInventoryRequest, InventoryAvailability } from '../core/models/inventory.model';

@Injectable({ providedIn: 'root' })
export class InventoryService {
  private http = inject(HttpClient);
  private base = inject(API_BASE_URL);
  private url = `${this.base}/inventory`;

  // ADMIN: Get all inventory records
  getAllInventory(): Observable<Inventory[]> {
    return this.http.get<Inventory[]>(this.url);
  }

  // ADMIN: Get inventory by ID
  getInventory(id: number): Observable<Inventory> {
    return this.http.get<Inventory>(`${this.url}/${id}`);
  }

  // ADMIN: Get inventory by warehouse
  getInventoryByWarehouse(warehouseId: number): Observable<Inventory[]> {
    return this.http.get<Inventory[]>(`${this.url}/warehouse/${warehouseId}`);
  }

  // ADMIN: Create inventory record
  createInventory(body: CreateInventoryRequest): Observable<Inventory> {
    return this.http.post<Inventory>(this.url, body);
  }

  // ADMIN: Update inventory
  updateInventory(id: number, body: UpdateInventoryRequest): Observable<Inventory> {
    return this.http.put<Inventory>(`${this.url}/${id}`, body);
  }

  // ADMIN: Delete inventory record
  deleteInventory(id: number): Observable<void> {
    return this.http.delete<void>(`${this.url}/${id}`);
  }

  // Convenience methods for backward compatibility
  listByWarehouse(warehouseId: string | number, query?: { sku?: string; category?: string }): Observable<Inventory[]> {
    return this.getInventoryByWarehouse(Number(warehouseId));
  }

  availability(productId: string | number, warehouseId?: string | number): Observable<InventoryAvailability> {
    let params = new HttpParams().set('productId', String(productId));
    if (warehouseId) params = params.set('warehouseId', String(warehouseId));
    return this.http.get<InventoryAvailability>(`${this.url}/availability`, { params });
  }
}
