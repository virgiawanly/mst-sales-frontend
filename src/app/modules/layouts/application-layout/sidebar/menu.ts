import { MenuItem } from './menu.model';

export const MENU: MenuItem[] = [
  {
    id: 0,
    label: 'dashboard',
    isTitle: true,
  },
  {
    id: 1,
    label: 'dashboard',
    icon: 'home',
    link: '/application',
  },
  {
    id: 1,
    label: 'transaction',
    isTitle: true,
  },
  {
    id: 2,
    label: 'sales',
    icon: 'baggage-claim',
    link: '#',
    subItems: [
      {
        id: 2.1,
        label: 'sales-list',
        link: '/application/sales',
        parentId: 1,
      },
      {
        id: 2.2,
        label: 'add-sales',
        link: '/application/sales/create',
        parentId: 1,
      },
    ],
  },
  {
    id: 3,
    label: 'master-data',
    isTitle: true,
  },
  {
    id: 4,
    label: 'items',
    icon: 'package',
    link: '/application/barang',
  },
  {
    id: 5,
    label: 'customers',
    icon: 'users',
    link: '/application/customer',
  },
];
