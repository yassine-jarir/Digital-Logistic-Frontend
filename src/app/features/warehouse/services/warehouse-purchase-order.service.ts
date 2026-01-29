import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../../environments/environment';
import { PurchaseOrder, CreatePurchaseOrderRequest } from '../../../core/models/purchase-order.model';

@Injectable({
  providedIn: 'root'
})
export class WarehousePurchaseOrderService {
  private readonly http = inject(HttpClient);
  private readonly baseUrl = `${environment.apiUrl}/warehouse-manager/purchase-orders`;

  /**
   * Create a new purchase order in DRAFT status
   * POST /api/warehouse-manager/purchase-orders
   */
  create(dto: CreatePurchaseOrderRequest): Observable<PurchaseOrder> {
    return this.http.post<PurchaseOrder>(this.baseUrl, dto);
  }

  /**
   * Receive the entire purchase order (receives all lines at full quantities)
   * POST /api/warehouse-manager/purchase-orders/{id}/receive
   */
  receive(id: number): Observable<PurchaseOrder> {
    return this.http.post<PurchaseOrder>(`${this.baseUrl}/${id}/receive`, {});
  }

  /**
   * Get purchase order details by ID
   * GET /api/warehouse-manager/purchase-orders/{id}
   */
  getById(id: number): Observable<PurchaseOrder> {
    return this.http.get<PurchaseOrder>(`${this.baseUrl}/${id}`);
  }
}
