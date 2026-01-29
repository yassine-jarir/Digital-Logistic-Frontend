import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../../environments/environment';
import { SalesOrder } from '../../../core/models/sales-order.model';

@Injectable({
  providedIn: 'root'
})
export class WarehouseSalesOrderService {
  private readonly http = inject(HttpClient);
  private readonly baseUrl = `${environment.apiUrl}/warehouse-manager/sales-orders`;

  /**
   * List all sales orders for fulfillment operations
   * GET /api/warehouse-manager/sales-orders
   */
  getAll(): Observable<SalesOrder[]> {
    return this.http.get<SalesOrder[]>(this.baseUrl);
  }
}
