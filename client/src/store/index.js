import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';

const cartStorage = createJSONStorage(() => localStorage);

export const useCartStore = create(
  persist(
    (set, get) => ({
      items: [],
      isOpen: false,

      openCart: () => set({ isOpen: true }),
      closeCart: () => set({ isOpen: false }),
      toggleCart: () => set((s) => ({ isOpen: !s.isOpen })),

      addItem: (product, variant = null, qty = 1, personalisation = null) => {
        const { items } = get();
        const key = `${product.id}-${variant}`;
        const existing = items.find((i) => i.key === key);
        if (existing) {
          set({
            items: items.map((i) =>
              i.key === key ? { ...i, qty: i.qty + qty } : i
            ),
            isOpen: true,
          });
        } else {
          set({
            items: [...items, { key, product, variant, qty, personalisation }],
            isOpen: true,
          });
        }
      },

      removeItem: (key) =>
        set((s) => ({ items: s.items.filter((i) => i.key !== key) })),

      updateQty: (key, qty) => {
        if (qty < 1) return get().removeItem(key);
        set((s) => ({
          items: s.items.map((i) => (i.key === key ? { ...i, qty } : i)),
        }));
      },

      clearCart: () => set({ items: [] }),

      get itemCount() {
        return get().items.reduce((acc, i) => acc + i.qty, 0);
      },

      getSubtotal: () =>
        get().items.reduce((acc, i) => acc + i.product.price * i.qty, 0),
    }),
    {
      name: 'gokana-cart',
      storage: cartStorage,
      partialize: (state) => ({
        items: state.items,
      }),
      version: 1,
      merge: (persistedState, currentState) => ({
        ...currentState,
        items: Array.isArray(persistedState?.items) ? persistedState.items : currentState.items,
        isOpen: false,
      }),
    }
  )
);

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
