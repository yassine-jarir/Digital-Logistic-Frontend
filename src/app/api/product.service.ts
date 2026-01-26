import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { API_BASE_URL } from '../app.config';
import { Product } from '../core/models/product.model';

@Injectable({ providedIn: 'root' })
export class ProductService {
  private http = inject(HttpClient);
  private base = inject(API_BASE_URL);
  private url = `${this.base}/products`;

  // ADMIN: Get all products
  getAllProducts(): Observable<Product[]> {
    return this.http.get<Product[]>(`${this.url}/all`);
  }

  // ADMIN: Get product by ID
  getProduct(id: number): Observable<Product> {
    return this.http.get<Product>(`${this.url}/${id}`);
  }

  // ADMIN: Create new product
  createProduct(body: Partial<Product>): Observable<Product> {
    return this.http.post<Product>(this.url, body);
  }

  // ADMIN: Update product
  updateProduct(id: number, body: Partial<Product>): Observable<Product> {
    return this.http.put<Product>(`${this.url}/${id}`, body);
  }

  // ADMIN: Deactivate product by SKU
  deactivateProduct(sku: string): Observable<Product> {
    return this.http.put<Product>(`${this.url}/${sku}/deactivate`, {});
  }

  // Convenience methods
  list(query?: { page?: number; size?: number; search?: string; category?: string; active?: boolean }): Observable<Product[]> {
    return this.getAllProducts();
  }

  get(id: string): Observable<Product> {
    return this.getProduct(Number(id));
  }

  create(body: Partial<Product>): Observable<Product> {
    return this.createProduct(body);
  }

  update(id: string, body: Partial<Product>): Observable<Product> {
    return this.updateProduct(Number(id), body);
  }

  deactivate(sku: string): Observable<Product> {
    return this.deactivateProduct(sku);
  }
}
