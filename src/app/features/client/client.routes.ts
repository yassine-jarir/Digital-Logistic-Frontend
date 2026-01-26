import { Routes } from '@angular/router';
import { ClientDashboardPageComponent } from './pages/client-dashboard/client-dashboard.component';
import { ClientSalesOrdersComponent } from './pages/sales-orders/sales-orders.component';
import { ClientSalesOrderCreateComponent } from './pages/sales-orders/sales-order-create.component';
import { ClientWarehousesComponent } from './pages/warehouses/warehouses.component';
import { ClientShipmentsComponent } from './pages/shipments/shipments.component';

export const CLIENT_ROUTES: Routes = [
  {
    path: '',
    component: ClientDashboardPageComponent
  },
  {
    path: 'orders',
    component: ClientSalesOrdersComponent
  },
  {
    path: 'orders/create',
    component: ClientSalesOrderCreateComponent
  },
  {
    path: 'warehouses',
    component: ClientWarehousesComponent
  },
  {
    path: 'shipments',
    component: ClientShipmentsComponent
  }
];
