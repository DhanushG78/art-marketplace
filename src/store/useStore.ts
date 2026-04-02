import { create } from "zustand";
import { persist } from "zustand/middleware";

// ─── Types ────────────────────────────────────────────────────────────────────

export type UserRole = "artist" | "buyer" | "admin";

export type AuthUser = {
  uid: string;
  name: string;
  email: string;
  role: UserRole;
};

export type CartItem = {
  id: string;
  title: string;
  price: number;
  image: string;
  artistName: string;
  quantity: number;
};

// ─── Store ────────────────────────────────────────────────────────────────────

type Store = {
  // Auth — populated by Firebase Auth listener in AuthProvider
  user: AuthUser | null;
  setUser: (user: AuthUser | null) => void;

  // Cart — persisted locally
  cart: CartItem[];
  addToCart: (item: Omit<CartItem, "quantity">) => void;
  removeFromCart: (id: string) => void;
  updateQuantity: (id: string, quantity: number) => void;
  clearCart: () => void;
};

export const useStore = create<Store>()(
  persist(
    (set, get) => ({
      // Auth
      user: null,
      setUser: (user) => set({ user }),

      // Cart
      cart: [],
      addToCart: (item) => {
        const existing = get().cart.find((c) => c.id === item.id);
        if (existing) {
          set({
            cart: get().cart.map((c) =>
              c.id === item.id ? { ...c, quantity: c.quantity + 1 } : c
            ),
          });
        } else {
          set({ cart: [...get().cart, { ...item, quantity: 1 }] });
        }
      },
      removeFromCart: (id) =>
        set({ cart: get().cart.filter((c) => c.id !== id) }),
      updateQuantity: (id, quantity) => {
        if (quantity <= 0) {
          set({ cart: get().cart.filter((c) => c.id !== id) });
        } else {
          set({
            cart: get().cart.map((c) =>
              c.id === id ? { ...c, quantity } : c
            ),
          });
        }
      },
      clearCart: () => set({ cart: [] }),
    }),
    { name: "artvault-store" }
  )
);
