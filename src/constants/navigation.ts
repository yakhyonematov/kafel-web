export interface NavItem {
  label: string;
  href: string;
}

export const NAVIGATION_LINKS: NavItem[] = [
  { label: 'Asosiy', href: '/' },
  { label: 'Mahsulotlar', href: '/products' },
  { label: 'Biz haqimizda', href: '/about' },
  { label: 'Filiallar', href: '/#branches' },
  { label: 'Kontakt', href: '/#contact' },
];

export const ADMIN_NAVIGATION_LINKS: NavItem[] = [
  { label: 'Dashboard', href: '/admin/dashboard' },
  { label: 'Buyurtmalar', href: '/admin/orders' },
  { label: 'Mahsulotlar', href: '/admin/products' },
  { label: 'Zavodlar', href: '/admin/factories' },
  { label: 'Galereya', href: '/admin/gallery' },
  { label: 'Xodimlar', href: '/admin/users' },
];
