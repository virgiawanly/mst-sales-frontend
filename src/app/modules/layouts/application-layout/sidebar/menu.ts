import { MenuItem } from './menu.model';

export const MENU: MenuItem[] = [
  {
    id: 0,
    label: 'Transaksi',
    isTitle: true,
  },
  {
    id: 1,
    label: 'Sales',
    icon: 'baggage-claim',
    link: '#',
    subItems: [
      {
        id: 1.1,
        label: 'Sales List',
        link: '/application/sales',
        parentId: 1,
      },
      {
        id: 1.2,
        label: 'New Sales',
        link: '/application/sales/create',
        parentId: 1,
      },
    ],
  },
  {
    id: 2,
    label: 'Master Data',
    isTitle: true,
  },
  {
    id: 3,
    label: 'Barang',
    icon: 'package',
    link: '/application/barang',
  },
  {
    id: 4,
    label: 'Customer',
    icon: 'users',
    link: '/application/customer',
  },
];
