import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export interface BagItem {
  productId: string;
  quantity: number;
}

interface BagState {
  items: BagItem[];
  addItem: (productId: string) => void;
  removeItem: (productId: string) => void;
  updateQuantity: (productId: string, quantity: number) => void;
  clearBag: () => void;
}

export const useBagStore = create<BagState>()(
  persist(
    (set) => ({
      items: [],
      addItem: (productId) => set((state) => {
        const existingItem = state.items.find(i => i.productId === productId);
        if (existingItem) {
          return {
            items: state.items.map(i => 
              i.productId === productId ? { ...i, quantity: i.quantity + 1 } : i
            )
          };
        }
        return { items: [...state.items, { productId, quantity: 1 }] };
      }),
      removeItem: (productId) => set((state) => ({
        items: state.items.filter(i => i.productId !== productId)
      })),
      updateQuantity: (productId, quantity) => set((state) => {
        if (quantity <= 0) {
          return { items: state.items.filter(i => i.productId !== productId) };
        }
        return {
          items: state.items.map(i => 
            i.productId === productId ? { ...i, quantity } : i
          )
        };
      }),
      clearBag: () => set({ items: [] }),
    }),
    {
      name: 'trybuy-bag-storage',
    }
  )
);
