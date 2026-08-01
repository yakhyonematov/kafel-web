export interface NavItem {
  label: string;
  href: string;
  icon?: string;
}

export const NAVIGATION_LINKS: NavItem[] = [
  { label: 'Asosiy', href: '/', icon: 'Home' },
  { label: 'Mahsulotlar', href: '/products', icon: 'LayoutGrid' },
  { label: 'Biz haqimizda', href: '/about', icon: 'Info' },
  { label: 'Filiallar', href: '/#branches', icon: 'MapPin' },
  { label: 'Kontakt', href: '/#contact', icon: 'MessageCircle' },
];

export const ADMIN_NAVIGATION_LINKS: NavItem[] = [
  { label: 'Dashboard', href: '/admin/dashboard', icon: 'LayoutDashboard' },
  { label: 'Buyurtmalar', href: '/admin/orders', icon: 'ShoppingCart' },
  { label: 'Mahsulotlar', href: '/admin/products', icon: 'Package' },
  { label: 'Zavodlar', href: '/admin/factories', icon: 'Factory' },
  { label: 'Galereya', href: '/admin/gallery', icon: 'Images' },
  { label: 'Xodimlar', href: '/admin/users', icon: 'Users' },
];
