export const BARANG_ROUTES = [
  {
    path: '',
    loadComponent: () => import('./pages/barang-index/barang-index.component').then((m) => m.BarangIndexComponent),
  },
  {
    path: 'create',
    loadComponent: () => import('./pages/barang-create/barang-create.component').then((m) => m.BarangCreateComponent),
  },
  {
    path: ':id',
    loadComponent: () => import('./pages/barang-show/barang-show.component').then((m) => m.BarangShowComponent),
  },
  {
    path: ':id/edit',
    loadComponent: () => import('./pages/barang-edit/barang-edit.component').then((m) => m.BarangEditComponent),
  },
];
