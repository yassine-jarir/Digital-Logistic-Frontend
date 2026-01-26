import { HttpInterceptorFn, HttpResponse } from '@angular/common/http';
import { of, throwError, delay } from 'rxjs';

export const mockBackendInterceptor: HttpInterceptorFn = (req, next) => {
  const { url, method } = req;

  // Only mock if backend is not available (for development)
  if (!url.includes('/api/')) {
    return next(req);
  }

  // Mock delay
  const mockDelay = 300;

  // ADMIN USERS
  if (url.includes('/api/admin/users') && method === 'GET') {
    return of(new HttpResponse({
      status: 200,
      body: [
        { id: '1', username: 'admin@test.com', email: 'admin@test.com', roles: ['ADMIN'], active: true },
        { id: '2', username: 'warehouse@test.com', email: 'warehouse@test.com', roles: ['WAREHOUSE_MANAGER'], active: true },
        { id: '3', username: 'client@test.com', email: 'client@test.com', roles: ['CLIENT'], active: true }
      ]
    })).pipe(delay(mockDelay));
  }

  // ADMIN WAREHOUSES
  if (url.includes('/api/admin/warehouses') && method === 'GET') {
    return of(new HttpResponse({
      status: 200,
      body: [
        { id: '1', name: 'Main Warehouse', location: 'New York', capacity: 10000, currentStock: 7500 },
        { id: '2', name: 'Secondary Warehouse', location: 'Los Angeles', capacity: 8000, currentStock: 5000 }
      ]
    })).pipe(delay(mockDelay));
  }

  // CLIENT WAREHOUSES
  if (url.includes('/api/client/warehouses') && method === 'GET') {
    return of(new HttpResponse({
      status: 200,
      body: [
        { id: '1', name: 'Main Warehouse', location: 'New York', capacity: 10000, currentStock: 7500 },
        { id: '2', name: 'Secondary Warehouse', location: 'Los Angeles', capacity: 8000, currentStock: 5000 }
      ]
    })).pipe(delay(mockDelay));
  }

  // ADMIN PRODUCTS
  if (url.includes('/api/products') && method === 'GET') {
    return of(new HttpResponse({
      status: 200,
      body: [
        { id: '1', name: 'Product A', sku: 'SKU-001', price: 99.99, stock: 100, category: 'Electronics' },
        { id: '2', name: 'Product B', sku: 'SKU-002', price: 49.99, stock: 250, category: 'Accessories' },
        { id: '3', name: 'Product C', sku: 'SKU-003', price: 149.99, stock: 50, category: 'Electronics' }
      ]
    })).pipe(delay(mockDelay));
  }

  // ADMIN SALES ORDERS
  if (url.includes('/api/admin/sales-orders') && method === 'GET') {
    return of(new HttpResponse({
      status: 200,
      body: [
        { id: '1', orderNumber: 'SO-001', clientName: 'Client A', status: 'PENDING', total: 499.95, createdAt: '2026-01-15' },
        { id: '2', orderNumber: 'SO-002', clientName: 'Client B', status: 'COMPLETED', total: 299.97, createdAt: '2026-01-14' }
      ]
    })).pipe(delay(mockDelay));
  }

  if (url.includes('/api/client/sales-orders') && method === 'GET') {
    return of(new HttpResponse({
      status: 200,
      body: [
        { id: '1', orderNumber: 'SO-001', clientName: 'Client A', status: 'PENDING', total: 499.95, createdAt: '2026-01-15' },
        { id: '2', orderNumber: 'SO-002', clientName: 'Client B', status: 'COMPLETED', total: 299.97, createdAt: '2026-01-14' }
      ]
    })).pipe(delay(mockDelay));
  }

  if (url.includes('/api/warehouse-manager/sales-orders') && method === 'GET') {
    return of(new HttpResponse({
      status: 200,
      body: [
        { id: '1', orderNumber: 'SO-001', clientName: 'Client A', status: 'PENDING', total: 499.95, createdAt: '2026-01-15' },
        { id: '2', orderNumber: 'SO-002', clientName: 'Client B', status: 'IN_PROGRESS', total: 299.97, createdAt: '2026-01-14' }
      ]
    })).pipe(delay(mockDelay));
  }

  if (url.includes('/api/admin/purchase-orders') && method === 'GET') {
    return of(new HttpResponse({
      status: 200,
      body: [
        { id: '1', orderNumber: 'PO-001', supplier: 'Supplier A', status: 'CREATED', total: 1999.99, createdAt: '2026-01-16' },
        { id: '2', orderNumber: 'PO-002', supplier: 'Supplier B', status: 'RECEIVED', total: 899.99, createdAt: '2026-01-12' }
      ]
    })).pipe(delay(mockDelay));
  }

  if (url.includes('/api/warehouse-manager/purchase-orders') && method === 'GET') {
    return of(new HttpResponse({
      status: 200,
      body: [
        { id: '1', orderNumber: 'PO-001', supplier: 'Supplier A', status: 'CREATED', total: 1999.99, createdAt: '2026-01-16' },
        { id: '2', orderNumber: 'PO-002', supplier: 'Supplier B', status: 'RECEIVED', total: 899.99, createdAt: '2026-01-12' }
      ]
    })).pipe(delay(mockDelay));
  }

  if (url.includes('/api/client/shipments') && method === 'GET') {
    return of(new HttpResponse({
      status: 200,
      body: [
        { id: '1', trackingNumber: 'TRK-001', orderId: 'SO-001', status: 'IN_TRANSIT', carrier: 'FedEx', plannedAt: '2026-01-15' },
        { id: '2', trackingNumber: 'TRK-002', orderId: 'SO-002', status: 'DELIVERED', carrier: 'UPS', deliveredAt: '2026-01-14' }
      ]
    })).pipe(delay(mockDelay));
  }

  if (url.includes('/api/client/reservations') && method === 'POST') {
    return of(new HttpResponse({
      status: 200,
      body: { message: 'Reservation processed successfully', reservationId: 'RES-' + Date.now() }
    })).pipe(delay(mockDelay));
  }

  return next(req);
};
