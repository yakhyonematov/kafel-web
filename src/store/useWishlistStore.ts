import { create } from 'zustand';

interface WishlistState {
  productIds: string[];
  toggle: (productId: string) => void;
  isWishlisted: (productId: string) => boolean;
}

const STORAGE_KEY = 'wishlist_ids';

export const useWishlistStore = create<WishlistState>((set, get) => {
  const isBrowser = typeof window !== 'undefined';

  const getInitialIds = (): string[] => {
    if (!isBrowser) return [];
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      return saved ? JSON.parse(saved) : [];
    } catch (e) {
      return [];
    }
  };

  const saveIds = (ids: string[]) => {
    if (isBrowser) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(ids));
    }
  };

  return {
    productIds: getInitialIds(),

    toggle: (productId) => {
      const current = get().productIds;
      const next = current.includes(productId)
        ? current.filter((id) => id !== productId)
        : [...current, productId];
      set({ productIds: next });
      saveIds(next);
    },

    isWishlisted: (productId) => get().productIds.includes(productId),
  };
});
