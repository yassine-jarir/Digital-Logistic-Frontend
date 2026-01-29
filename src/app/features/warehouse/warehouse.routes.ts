import { Routes } from '@angular/router';
import { roleGuard } from '../../core/guards/role.guard';
import { WarehouseDashboardPageComponent } from './pages/warehouse-dashboard/warehouse-dashboard.component';
import { SalesOrdersListComponent } from './pages/sales-orders-list/sales-orders-list.component';
import { PurchaseOrderCreateComponent } from './pages/purchase-order-create/purchase-order-create.component';
import { PurchaseOrderDetailsComponent } from './pages/purchase-order-details/purchase-order-details.component';
import { PurchaseOrdersListComponent } from './pages/purchase-orders-list/purchase-orders-list.component';

export const WAREHOUSE_ROUTES: Routes = [
  {
    path: '',
    component: WarehouseDashboardPageComponent,
    canActivate: [roleGuard],
    data: { roles: ['WAREHOUSE_MANAGER', 'ADMIN'] }
  },
  {
    path: 'sales-orders',
    component: SalesOrdersListComponent,
    canActivate: [roleGuard],
    data: { roles: ['WAREHOUSE_MANAGER'] }
  },
  {
    path: 'purchase-orders',
    component: PurchaseOrdersListComponent,
    canActivate: [roleGuard],
    data: { roles: ['WAREHOUSE_MANAGER', 'ADMIN'] }
  },
  {
    path: 'purchase-orders/new',
    component: PurchaseOrderCreateComponent,
    canActivate: [roleGuard],
    data: { roles: ['WAREHOUSE_MANAGER', 'ADMIN'] }
  },
  {
    path: 'purchase-orders/:id',
    component: PurchaseOrderDetailsComponent,
    canActivate: [roleGuard],
    data: { roles: ['WAREHOUSE_MANAGER', 'ADMIN'] }
  }
];
