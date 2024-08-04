import { MenuItem } from './menu.model';

export const MENU: MenuItem[] = [
  {
    id: 0,
    label: 'transaction',
    isTitle: true,
  },
  {
    id: 1,
    label: 'sales',
    icon: 'baggage-claim',
    link: '#',
    subItems: [
      {
        id: 1.1,
        label: 'sales-list',
        link: '/application/sales',
        parentId: 1,
      },
      {
        id: 1.2,
        label: 'add-sales',
        link: '/application/sales/create',
        parentId: 1,
      },
    ],
  },
  {
    id: 2,
    label: 'master-data',
    isTitle: true,
  },
  {
    id: 3,
    label: 'items',
    icon: 'package',
    link: '/application/barang',
  },
  {
    id: 4,
    label: 'customers',
    icon: 'users',
    link: '/application/customer',
  },
];
