import { Routes } from '@angular/router';
import { authGuard } from '../../core/guards/auth.guard';
import { ApplicationLayoutComponent } from '../layouts/application-layout/application-layout.component';

export const APPLICATION_ROUTES: Routes = [
  {
    path: '',
    component: ApplicationLayoutComponent,
    children: [
      {
        path: 'dashboard',
        canActivate: [authGuard],
        loadChildren: () => import('./dashboard/dashboard.routes').then((m) => m.DASHBOARD_ROUTES),
      },
      {
        path: 'barang',
        canActivate: [authGuard],
        loadChildren: () => import('./barang/barang.routes').then((m) => m.BARANG_ROUTES),
      },
      {
        path: 'customer',
        canActivate: [authGuard],
        loadChildren: () => import('./customer/customer.routes').then((m) => m.CUSTOMER_ROUTES),
      },
      {
        path: 'sales',
        canActivate: [authGuard],
        loadChildren: () => import('./sales/sales.routes').then((m) => m.SALES_ROUTES),
      },
      {
        path: '**',
        pathMatch: 'full',
        redirectTo: 'dashboard',
      },
    ],
  },
];
