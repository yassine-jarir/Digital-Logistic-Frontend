import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { API_BASE_URL } from '../app.config';
import { PurchaseOrder, PurchaseOrderStatus, ReceivePurchaseOrderRequest, CreatePurchaseOrderRequest } from '../core/models/purchase-order.model';

@Injectable({ providedIn: 'root' })
export class PurchaseOrderService {
  private http = inject(HttpClient);
  private base = inject(API_BASE_URL);

  // WAREHOUSE_MANAGER endpoints
  getWarehousePurchaseOrders(): Observable<PurchaseOrder[]> {
    return this.http.get<PurchaseOrder[]>(`${this.base}/warehouse-manager/purchase-orders`);
  }

  getWarehouseOrderDetail(id: string | number): Observable<PurchaseOrder> {
    return this.http.get<PurchaseOrder>(`${this.base}/warehouse-manager/purchase-orders/${id}`);
  }

  createWarehouseOrder(body: CreatePurchaseOrderRequest): Observable<PurchaseOrder> {
    return this.http.post<PurchaseOrder>(`${this.base}/warehouse-manager/purchase-orders`, body);
  }

  // Receive entire purchase order - automatically receives all lines with full quantities
  receiveWarehouseOrder(id: string | number): Observable<PurchaseOrder> {
    return this.http.post<PurchaseOrder>(`${this.base}/warehouse-manager/purchase-orders/${id}/receive`, {});
  }

  // ADMIN endpoints
  getAdminPurchaseOrders(): Observable<PurchaseOrder[]> {
    return this.http.get<PurchaseOrder[]>(`${this.base}/admin/purchase-orders`);
  }

  getAdminPurchaseOrdersByStatus(status: PurchaseOrderStatus): Observable<PurchaseOrder[]> {
    const params = new HttpParams().set('status', status);
    return this.http.get<PurchaseOrder[]>(`${this.base}/admin/purchase-orders`, { params });
  }

  getAdminOrderDetail(id: string): Observable<PurchaseOrder> {
    return this.http.get<PurchaseOrder>(`${this.base}/admin/purchase-orders/${id}`);
  }

  // ADMIN: Approve purchase order (DRAFT → APPROVED)
  approvePurchaseOrder(id: number): Observable<PurchaseOrder> {
    return this.http.patch<PurchaseOrder>(`${this.base}/admin/purchase-orders/${id}/approve`, {});
  }

  createAdminOrder(body: CreatePurchaseOrderRequest): Observable<PurchaseOrder> {
    return this.http.post<PurchaseOrder>(`${this.base}/admin/purchase-orders`, body);
  }

  updateAdminOrder(id: string, body: any): Observable<PurchaseOrder> {
    return this.http.put<PurchaseOrder>(`${this.base}/admin/purchase-orders/${id}`, body);
  }

  deleteAdminOrder(id: string): Observable<void> {
    return this.http.delete<void>(`${this.base}/admin/purchase-orders/${id}`);
  }
}
