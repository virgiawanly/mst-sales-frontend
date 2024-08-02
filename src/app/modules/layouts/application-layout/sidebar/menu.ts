import { MenuItem } from './menu.model';

export const MENU: MenuItem[] = [
  {
    id: 12,
    label: 'Transaksi',
    isTitle: true,
  },
  {
    id: 13,
    label: 'Sales',
    icon: 'baggage-claim',
    link: '/application/sales',
  },
  {
    id: 0,
    label: 'Master Data',
    isTitle: true,
  },
  {
    id: 1,
    label: 'Barang',
    icon: 'package',
    link: '/application/barang',
  },
  {
    id: 11,
    label: 'Customer',
    icon: 'users',
    link: '/application/customers',
  },
];
