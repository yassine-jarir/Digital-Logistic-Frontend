import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { API_BASE_URL } from '../app.config';
import { Shipment, ShipmentStatus, CreateShipmentRequest, ShipShipmentRequest } from '../core/models/shipment.model';

@Injectable({ providedIn: 'root' })
export class ShipmentService {
  private http = inject(HttpClient);
  private base = inject(API_BASE_URL);

  // CLIENT: Get all shipments
  getClientShipments(query?: { orderId?: string | number; status?: ShipmentStatus }): Observable<Shipment[]> {
    let params = new HttpParams();
    if (query?.orderId) params = params.set('orderId', String(query.orderId));
    if (query?.status) params = params.set('status', query.status);
    return this.http.get<Shipment[]>(`${this.base}/client/shipments`, { params });
  }

  // CLIENT: Get shipment detail
  getClientShipmentDetail(id: string | number): Observable<Shipment> {
    return this.http.get<Shipment>(`${this.base}/client/shipments/${id}`);
  }

  // CLIENT: Create shipment for reserved sales order
  createShipment(salesOrderId: number | string): Observable<Shipment> {
    return this.http.post<Shipment>(`${this.base}/client/shipments/create/${salesOrderId}`, {});
  }

  // CLIENT: Mark shipment as shipped (add tracking info)
  shipShipment(shipmentId: number | string, body: ShipShipmentRequest): Observable<Shipment> {
    return this.http.post<Shipment>(`${this.base}/client/shipments/${shipmentId}/ship`, body);
  }

  // CLIENT: Mark shipment as delivered
  deliverShipment(shipmentId: number | string): Observable<Shipment> {
    return this.http.post<Shipment>(`${this.base}/client/shipments/${shipmentId}/deliver`, {});
  }
}
