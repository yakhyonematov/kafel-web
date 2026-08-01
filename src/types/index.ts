export type Role = 'ADMIN' | 'MANAGER';
export type SurfaceType = 'GLOSSY' | 'MATTE';
export type OrderStatus = 'NEW' | 'ACCEPTED';

export interface User {
  id: string;
  username: string;
  name: string;
  role: Role;
  createdAt: string;
  updatedAt: string;
}

export interface Factory {
  id: string;
  name: string;
  location?: string;
  description?: string;
  products?: Product[];
  _count?: {
    products: number;
  };
  createdAt?: string;
  updatedAt?: string;
}

export interface GalleryImage {
  id: string;
  productId: string;
  imageUrl: string;
  roomType?: string;
  createdAt: string;
}

export interface Product {
  id: string;
  code: string;
  name: string;
  factoryId: string;
  factory: Omit<Factory, 'products'>;
  size: string;
  thickness: string;
  color: string;
  surface: SurfaceType;
  usage: string;
  boxSize: number;
  price: number;
  stock: number;
  isActive: boolean;
  mainImage: string;
  galleryImages?: GalleryImage[];
  createdAt: string;
  updatedAt: string;
}

export interface CartItem {
  product: Product;
  quantity: number; // in boxes or square meters (we'll count in square meters but translate to boxes)
}

export interface PaginatedResponse<T> {
  data: T[];
  meta: {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  };
}

export interface FilterProductParams {
  factoryId?: string;
  surface?: SurfaceType;
  usage?: string;
  search?: string;
  page?: number;
  limit?: number;
}

export interface OrderItem {
  id: string;
  orderId: string;
  productId: string;
  quantity: number;
  price: number;
  createdAt: string;
  product: {
    id: string;
    code: string;
    name: string;
    mainImage: string;
    size: string;
  };
}

export interface Order {
  id: string;
  customerName: string;
  phone: string;
  comment?: string | null;
  status: OrderStatus;
  totalPrice: number;
  items: OrderItem[];
  createdAt: string;
  updatedAt: string;
}

export interface CreateOrderPayload {
  customerName: string;
  phone: string;
  comment?: string;
  items: { productId: string; quantity: number }[];
}

export interface AuthResponse {
  accessToken: string;
  user: {
    id: string;
    username: string;
    name: string;
    role: Role;
  };
}
