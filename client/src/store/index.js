import { create } from 'zustand';
import { persist } from 'zustand/middleware';

const CART_STORAGE_KEY = 'gokana-cart-items';

const loadCartItems = () => {
  if (typeof window === 'undefined') return [];
  try {
    const raw = window.localStorage.getItem(CART_STORAGE_KEY);
    const parsed = raw ? JSON.parse(raw) : [];
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
};

const saveCartItems = (items) => {
  if (typeof window === 'undefined') return;
  try {
    window.localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(items));
  } catch {
    // Ignore storage errors so cart actions still work in the current session.
  }
};

export const useCartStore = create((set, get) => {
  const setItems = (items, extra = {}) => {
    saveCartItems(items);
    set({ items, ...extra });
  };

  return {
    items: loadCartItems(),
    isOpen: false,

    openCart: () => set({ isOpen: true }),
    closeCart: () => set({ isOpen: false }),
    toggleCart: () => set((s) => ({ isOpen: !s.isOpen })),

    addItem: (product, variant = null, qty = 1, personalisation = null) => {
      const { items } = get();
      const key = String(product.id) + '-' + String(variant);
      const existing = items.find((i) => i.key === key);

      if (existing) {
        const nextItems = items.map((i) =>
          i.key === key ? { ...i, qty: i.qty + qty } : i
        );
        setItems(nextItems, { isOpen: true });
      } else {
        setItems(
          [...items, { key, product, variant, qty, personalisation }],
          { isOpen: true }
        );
      }
    },

    removeItem: (key) => {
      const nextItems = get().items.filter((i) => i.key !== key);
      setItems(nextItems);
    },

    updateQty: (key, qty) => {
      if (qty < 1) {
        get().removeItem(key);
        return;
      }

      const nextItems = get().items.map((i) =>
        i.key === key ? { ...i, qty } : i
      );
      setItems(nextItems);
    },

    clearCart: () => setItems([]),

    get itemCount() {
      return get().items.reduce((acc, i) => acc + i.qty, 0);
    },

    getSubtotal: () =>
      get().items.reduce((acc, i) => acc + i.product.price * i.qty, 0),
  };
});

export const useWishlistStore = create(
  persist(
    (set, get) => ({
      items: [],

      toggle: (product) => {
        const { items } = get();
        const exists = items.find((i) => i.id === product.id);
        set({
          items: exists
            ? items.filter((i) => i.id !== product.id)
            : [...items, product],
        });
      },

      has: (productId) => get().items.some((i) => i.id === productId),
    }),
    { name: 'gokana-wishlist' }
  )
);

export const useAuthStore = create(
  persist(
    (set, get) => ({
      user: null,
      token: null,
      isAdmin: false,

      login: (user, token) =>
        set({ user, token, isAdmin: user?.role === 'admin' }),

      logout: () => set({ user: null, token: null, isAdmin: false }),

      updateUser: (user) => set({ user }),

      getToken: () => get().token,
    }),
    { name: 'gokana-auth' }
  )
);
