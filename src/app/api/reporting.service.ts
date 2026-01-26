import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { API_BASE_URL } from '../app.config';

@Injectable({ providedIn: 'root' })
export class ReportingService {
  private http = inject(HttpClient);
  private base = inject(API_BASE_URL);
  private url = `${this.base}/reporting`;

  globalKPIs(): Observable<{ ordersByStatus: Record<string, number>; deliveryRate: number; stockOuts: number }> {
    return this.http.get<{ ordersByStatus: Record<string, number>; deliveryRate: number; stockOuts: number }>(`${this.url}/kpis`);
  }

  clientKPIs(): Observable<{ created: number; reserved: number; shipped: number; delivered: number; canceled: number }> {
    return this.http.get<{ created: number; reserved: number; shipped: number; delivered: number; canceled: number }>(`${this.url}/client-kpis`);
  }
}
