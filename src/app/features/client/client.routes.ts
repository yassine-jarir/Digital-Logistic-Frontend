import { Routes } from '@angular/router';
import { ClientDashboardPageComponent } from './pages/client-dashboard/client-dashboard.component';
import { ClientSalesOrdersComponent } from './pages/sales-orders/sales-orders.component';
import { ClientSalesOrderCreateComponent } from './pages/sales-orders/sales-order-create.component';
import { ClientWarehousesComponent } from './pages/warehouses/warehouses.component';
import { ClientShipmentsComponent } from './pages/shipments/shipments.component';
import { ClientShipmentCreateComponent } from './pages/shipments/shipment-create.component';
import { ClientShipmentShipComponent } from './pages/shipments/shipment-ship.component';
import { ClientShipmentDeliverComponent } from './pages/shipments/shipment-deliver.component';
import { ClientProductsComponent } from './pages/products/products.component';

export const CLIENT_ROUTES: Routes = [
  {
    path: '',
    component: ClientDashboardPageComponent
  },
  {
    path: 'products',
    component: ClientProductsComponent
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
  },
  {
    path: 'shipments/create',
    component: ClientShipmentCreateComponent
  },
  {
    path: 'shipments/ship',
    component: ClientShipmentShipComponent
  },
  {
    path: 'shipments/deliver',
    component: ClientShipmentDeliverComponent
  }
];
