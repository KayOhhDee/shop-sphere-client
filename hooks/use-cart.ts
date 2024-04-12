import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";

import { Product } from "@/types";
import toast from "react-hot-toast";

interface CartStore {
  items: Product[];
  addItem: (item: Product) => void;
  removeItem: (id: string) => void;
  clearItems: () => void;
}

export const useCart = create(
  persist<CartStore>((set, get) => ({
    items: [],
    addItem: (data: Product) => {
      const currentItems = get().items;
      const existingItem = currentItems.find((item) => item.id === data.id);

      if (existingItem) {
        return toast("Item already in cart", { icon: "🛒" });
      }

      set({ items: [...currentItems, data] });
      toast.success("Item added to cart");
    },
    removeItem: (id: string) => {
      const currentItems = get().items;
      const updatedItems = currentItems.filter((item) => item.id !== id);

      set({ items: updatedItems });
      toast.success("Item removed from cart", { icon: "🛒" });
    },
    clearItems: () => set({ items: [] })
  }), {
    name: "cart-storage",
    storage: createJSONStorage(() => localStorage),
  })
);

