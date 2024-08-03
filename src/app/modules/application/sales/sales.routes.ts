export const SALES_ROUTES = [
  {
    path: '',
    loadComponent: () => import('./pages/sales-index/sales-index.component').then((m) => m.SalesIndexComponent),
  },
  {
    path: 'create',
    loadComponent: () => import('./pages/sales-create/sales-create.component').then((m) => m.SalesCreateComponent),
  },
  {
    path: ':id',
    loadComponent: () => import('./pages/sales-show/sales-show.component').then((m) => m.SalesShowComponent),
  },
  {
    path: ':id/edit',
    loadComponent: () => import('./pages/sales-edit/sales-edit.component').then((m) => m.SalesEditComponent),
  },
];
