import { create } from 'zustand';
import { CartItem, Product } from '../types';

interface CartState {
  items: CartItem[];
  addItem: (product: Product, quantity?: number) => void;
  removeItem: (productId: string) => void;
  updateQuantity: (productId: string, quantity: number) => void;
  clearCart: () => void;
  getTotalPrice: () => number;
  getTotalItems: () => number;
}

export const useCartStore = create<CartState>((set, get) => {
  // Safe check for browser environment
  const isBrowser = typeof window !== 'undefined';

  const getInitialItems = (): CartItem[] => {
    if (isBrowser) {
      const savedCart = localStorage.getItem('cart_items');
      try {
        return savedCart ? JSON.parse(savedCart) : [];
      } catch (e) {
        return [];
      }
    }
    return [];
  };

  const saveCart = (items: CartItem[]) => {
    if (isBrowser) {
      localStorage.setItem('cart_items', JSON.stringify(items));
    }
  };

  return {
    items: getInitialItems(),

    addItem: (product, quantity = 1) => {
      const currentItems = get().items;
      const existingItem = currentItems.find((item) => item.product.id === product.id);

      let newItems;
      if (existingItem) {
        newItems = currentItems.map((item) =>
          item.product.id === product.id
            ? { ...item, quantity: item.quantity + quantity }
            : item
        );
      } else {
        newItems = [...currentItems, { product, quantity }];
      }

      set({ items: newItems });
      saveCart(newItems);
    },

    removeItem: (productId) => {
      const newItems = get().items.filter((item) => item.product.id !== productId);
      set({ items: newItems });
      saveCart(newItems);
    },

    updateQuantity: (productId, quantity) => {
      if (quantity <= 0) {
        get().removeItem(productId);
        return;
      }
      const newItems = get().items.map((item) =>
        item.product.id === productId ? { ...item, quantity } : item
      );
      set({ items: newItems });
      saveCart(newItems);
    },

    clearCart: () => {
      set({ items: [] });
      saveCart([]);
    },

    getTotalPrice: () => {
      return get().items.reduce((total, item) => total + item.product.price * item.quantity, 0);
    },

    getTotalItems: () => {
      return get().items.reduce((total, item) => total + item.quantity, 0);
    },
  };
});
