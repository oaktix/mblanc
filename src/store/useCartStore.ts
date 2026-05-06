import { create } from "zustand";
import { persist } from "zustand/middleware";

export interface CartItem {
  id: string;
  name: string;
  slug: string;
  price: number;
  image: string;
  quantity: number;
  variationId?: string;
  size?: string;
  color?: string;
}

interface CartState {
  items: CartItem[];
  addItem: (item: CartItem) => void;
  removeItem: (id: string, variationId?: string) => void;
  updateQuantity: (id: string, quantity: number, variationId?: string) => void;
  clearCart: () => void;
  getTotalItems: () => number;
  getTotalPrice: () => number;
}

export const useCartStore = create<CartState>()(
  persist(
    (set, get) => ({
      items: [],
      addItem: (item) => {
        const currentItems = get().items;
        const existingItemIndex = currentItems.findIndex(
          (i) => i.id === item.id && i.variationId === item.variationId
        );

        if (existingItemIndex > -1) {
          const updatedItems = [...currentItems];
          updatedItems[existingItemIndex].quantity += item.quantity;
          set({ items: updatedItems });
        } else {
          set({ items: [...currentItems, item] });
        }
      },
      removeItem: (id, variationId) => {
        set({
          items: get().items.filter(
            (i) => !(i.id === id && i.variationId === variationId)
          ),
        });
      },
      updateQuantity: (id, quantity, variationId) => {
        const updatedItems = get().items.map((i) => {
          if (i.id === id && i.variationId === variationId) {
            return { ...i, quantity: Math.max(1, quantity) };
          }
          return i;
        });
        set({ items: updatedItems });
      },
      clearCart: () => set({ items: [] }),
      getTotalItems: () => get().items.reduce((acc, item) => acc + item.quantity, 0),
      getTotalPrice: () =>
        get().items.reduce((acc, item) => acc + item.price * item.quantity, 0),
    }),
    {
      name: "mblanc-cart-storage",
    }
  )
);
