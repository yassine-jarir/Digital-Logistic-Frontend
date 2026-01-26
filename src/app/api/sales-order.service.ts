import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { API_BASE_URL } from '../app.config';
import { SalesOrder, SalesOrderStatus, CreateSalesOrderRequest } from '../core/models/sales-order.model';

@Injectable({ providedIn: 'root' })
export class SalesOrderService {
  private http = inject(HttpClient);
  private base = inject(API_BASE_URL);

  // CLIENT endpoints
  createClientOrder(body: CreateSalesOrderRequest): Observable<any> {
    return this.http.post<any>(`${this.base}/client/sales-orders`, body);
  }

  getClientSalesOrders(query?: { page?: number; size?: number; status?: SalesOrderStatus }): Observable<SalesOrder[]> {
    let params = new HttpParams();
    if (query?.page) params = params.set('page', query.page);
    if (query?.size) params = params.set('size', query.size);
    if (query?.status) params = params.set('status', query.status);
    return this.http.get<SalesOrder[]>(`${this.base}/client/sales-orders`, { params });
  }

  getClientSalesOrder(id: string | number): Observable<SalesOrder> {
    return this.http.get<SalesOrder>(`${this.base}/client/sales-orders/${id}`);
  }

  // WAREHOUSE_MANAGER endpoints
  getWarehouseSalesOrders(): Observable<SalesOrder[]> {
    return this.http.get<SalesOrder[]>(`${this.base}/warehouse-manager/sales-orders`);
  }

  updateWarehouseOrder(id: string, body: any): Observable<SalesOrder> {
    return this.http.put<SalesOrder>(`${this.base}/warehouse-manager/sales-orders/${id}`, body);
  }

  // ADMIN endpoints
  getAdminSalesOrders(): Observable<SalesOrder[]> {
    return this.http.get<SalesOrder[]>(`${this.base}/admin/sales-orders`);
  }

  getAdminOrderDetail(id: string): Observable<SalesOrder> {
    return this.http.get<SalesOrder>(`${this.base}/admin/sales-orders/${id}`);
  }

  updateAdminOrder(id: string, body: any): Observable<SalesOrder> {
    return this.http.put<SalesOrder>(`${this.base}/admin/sales-orders/${id}`, body);
  }
}
