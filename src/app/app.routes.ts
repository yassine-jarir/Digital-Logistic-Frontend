import { Routes } from '@angular/router';
import { LoginComponent } from './features/auth/login.component';
import { AppLayout } from './core/layout/app-layout/app-layout';
import { Unauthorized } from './core/pages/unauthorized/unauthorized';
import { NotFound } from './core/pages/not-found/not-found';
import { authGuard } from './core/guards/auth.guard';
import { roleGuard } from './core/guards/role.guard';

export const routes: Routes = [
  { path: '', redirectTo: 'login', pathMatch: 'full' },
  { path: 'login', component: LoginComponent },
  { path: 'unauthorized', component: Unauthorized },

  {
    path: '',
    component: AppLayout,
    canActivate: [authGuard],
    children: [
      {
        path: 'client',
        loadChildren: () => import('./features/client/client.routes').then(m => m.CLIENT_ROUTES),
        canActivate: [roleGuard],
        data: { roles: ['CLIENT'] }
      },
      {
        path: 'warehouse',
        loadChildren: () => import('./features/warehouse/warehouse.routes').then(m => m.WAREHOUSE_ROUTES),
        canActivate: [roleGuard],
        data: { roles: ['WAREHOUSE_MANAGER'] }
      },
      {
        path: 'admin',
        loadChildren: () => import('./features/admin/admin.routes').then(m => m.ADMIN_ROUTES),
        canActivate: [roleGuard],
        data: { roles: ['ADMIN'] }
      },
    ],
  },

  { path: '**', component: NotFound },
];
