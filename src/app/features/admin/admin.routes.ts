import { Routes } from '@angular/router';
import { AdminDashboardPageComponent } from './pages/admin-dashboard/admin-dashboard.component';
import { ProductsComponent } from './pages/products/products.component';
import { ProductCreateComponent } from './pages/products/product-create.component';
import { UsersComponent } from './pages/users/users.component';
import { UserCreateComponent } from './pages/users/user-create.component';
import { WarehousesComponent } from './pages/warehouses/warehouses.component';
import { WarehouseCreateComponent } from './pages/warehouses/warehouse-create.component';
import { SuppliersComponent } from './pages/suppliers/suppliers.component';
import { SupplierCreateComponent } from './pages/suppliers/supplier-create.component';
import { PurchaseOrdersComponent } from './pages/purchase-orders/purchase-orders.component';
import { PurchaseOrderDetailComponent } from './pages/purchase-orders/purchase-order-detail.component';
import { SalesOrdersComponent } from './pages/sales-orders/sales-orders.component';

export const ADMIN_ROUTES: Routes = [
  {
    path: '',
    component: AdminDashboardPageComponent
  },
  // Products
  {
    path: 'products',
    component: ProductsComponent
  },
  {
    path: 'products/create',
    component: ProductCreateComponent
  },
  // Users
  {
    path: 'users',
    component: UsersComponent
  },
  {
    path: 'users/create',
    component: UserCreateComponent
  },
  // Warehouses
  {
    path: 'warehouses',
    component: WarehousesComponent
  },
  {
    path: 'warehouses/create',
    component: WarehouseCreateComponent
  },
  // Suppliers
  {
    path: 'suppliers',
    component: SuppliersComponent
  },
  {
    path: 'suppliers/create',
    component: SupplierCreateComponent
  },
  // Purchase Orders
  {
    path: 'purchase-orders',
    component: PurchaseOrdersComponent
  },
  {
    path: 'purchase-orders/:id',
    component: PurchaseOrderDetailComponent
  },
  // Sales Orders
  {
    path: 'sales-orders',
    component: SalesOrdersComponent
  }
];
