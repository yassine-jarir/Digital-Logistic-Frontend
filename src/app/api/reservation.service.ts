import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { API_BASE_URL } from '../app.config';
import { Reservation, ProcessReservationRequest, ReservationResult } from '../core/models/reservation.model';

@Injectable({ providedIn: 'root' })
export class ReservationService {
  private http = inject(HttpClient);
  private base = inject(API_BASE_URL);

  // CLIENT: Process reservation for sales order (request body)
  processReservation(body: ProcessReservationRequest): Observable<ReservationResult> {
    return this.http.post<ReservationResult>(`${this.base}/client/reservations/process`, body);
  }

  // CLIENT: Process reservation by sales order ID (path parameter)
  processReservationForSalesOrder(salesOrderId: number | string): Observable<ReservationResult> {
    return this.http.post<ReservationResult>(`${this.base}/client/reservations/${salesOrderId}/process`, {});
  }

  // Get reservations for a sales order
  getReservationsForOrder(salesOrderId: number): Observable<Reservation[]> {
    return this.http.get<Reservation[]>(`${this.base}/client/reservations/sales-order/${salesOrderId}`);
  }

  // Get all reservations (if available)
  getAllReservations(): Observable<Reservation[]> {
    return this.http.get<Reservation[]>(`${this.base}/client/reservations`);
  }
}
