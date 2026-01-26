import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { API_BASE_URL } from '../app.config';
import { Warehouse } from '../core/models/warehouse.model';

@Injectable({ providedIn: 'root' })
export class WarehouseService {
  private http = inject(HttpClient);
  private base = inject(API_BASE_URL);

  // CLIENT endpoints
  getClientWarehouses(): Observable<Warehouse[]> {
    return this.http.get<Warehouse[]>(`${this.base}/client/warehouses`);
  }

  getClientWarehouse(id: string | number): Observable<Warehouse> {
    return this.http.get<Warehouse>(`${this.base}/client/warehouses/${id}`);
  }

  // ADMIN endpoints
  getAdminWarehouses(): Observable<Warehouse[]> {
    return this.http.get<Warehouse[]>(`${this.base}/admin/warehouses`);
  }

  getAdminWarehouse(id: string): Observable<Warehouse> {
    return this.http.get<Warehouse>(`${this.base}/admin/warehouses/${id}`);
  }

  createAdminWarehouse(body: Partial<Warehouse>): Observable<Warehouse> {
    return this.http.post<Warehouse>(`${this.base}/admin/warehouses`, body);
  }

  updateAdminWarehouse(id: string, body: Partial<Warehouse>): Observable<Warehouse> {
    return this.http.put<Warehouse>(`${this.base}/admin/warehouses/${id}`, body);
  }

  deleteAdminWarehouse(id: string): Observable<void> {
    return this.http.delete<void>(`${this.base}/admin/warehouses/${id}`);
  }
}
