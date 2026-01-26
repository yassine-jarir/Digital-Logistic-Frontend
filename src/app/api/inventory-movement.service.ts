import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { API_BASE_URL } from '../app.config';
import { InventoryMovement, CreateInventoryMovementRequest, InventoryMovementFilter } from '../core/models/inventory-movement.model';

@Injectable({ providedIn: 'root' })
export class InventoryMovementService {
  private http = inject(HttpClient);
  private base = inject(API_BASE_URL);
  private url = `${this.base}/inventory-movements`;

  // Get all inventory movements with optional filters
  getMovements(filter?: InventoryMovementFilter): Observable<InventoryMovement[]> {
    let params = new HttpParams();
    if (filter?.warehouseId) params = params.set('warehouseId', String(filter.warehouseId));
    if (filter?.productId) params = params.set('productId', String(filter.productId));
    if (filter?.movementType) params = params.set('movementType', filter.movementType);
    if (filter?.startDate) params = params.set('startDate', filter.startDate);
    if (filter?.endDate) params = params.set('endDate', filter.endDate);
    if (filter?.page) params = params.set('page', String(filter.page));
    if (filter?.size) params = params.set('size', String(filter.size));
    return this.http.get<InventoryMovement[]>(this.url, { params });
  }

  // Get movement by ID
  getMovement(id: number): Observable<InventoryMovement> {
    return this.http.get<InventoryMovement>(`${this.url}/${id}`);
  }

  // Create new movement record
  createMovement(body: CreateInventoryMovementRequest): Observable<InventoryMovement> {
    return this.http.post<InventoryMovement>(this.url, body);
  }

  // Convenience methods for backward compatibility
  list(query?: { dateFrom?: string; dateTo?: string; type?: string; warehouseId?: string; sku?: string }): Observable<InventoryMovement[]> {
    const filter: InventoryMovementFilter = {
      warehouseId: query?.warehouseId ? Number(query.warehouseId) : undefined,
      startDate: query?.dateFrom,
      endDate: query?.dateTo,
      movementType: query?.type as any
    };
    return this.getMovements(filter);
  }

  create(body: { warehouseId: string | number; productId: string | number; type: string; qty: number }): Observable<InventoryMovement> {
    const request: CreateInventoryMovementRequest = {
      warehouseId: Number(body.warehouseId),
      productId: Number(body.productId),
      movementType: body.type as any,
      quantity: body.qty
    };
    return this.createMovement(request);
  }
}
