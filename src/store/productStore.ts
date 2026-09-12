import { create } from 'zustand';
import { persist } from 'zustand/middleware';


export type IntentType = 'EXPLORING' | 'PRICE_WATCH' | 'COMPARING' | 'BUYING_LATER';

export interface SavedItem {
  productId: string;
  savedAt: number;
  intent?: IntentType;
}

interface ProductState {
  savedItems: Record<string, SavedItem>;
  saveProduct: (productId: string) => void;
  updateIntent: (productId: string, intent: IntentType) => void;
  unsaveProduct: (productId: string) => void;
  resetProducts: () => void;
}

export const useProductStore = create<ProductState>()(
  persist(
    (set) => ({
      savedItems: {},
      saveProduct: (productId) => {
        set((state) => ({
          savedItems: {
            ...state.savedItems,
            [productId]: {
              productId,
              savedAt: Date.now(),
            }
          }
        }));
      },
      updateIntent: (productId, intent) => {
        set((state) => {
          const item = state.savedItems[productId];
          if (!item) return state;
          return {
            savedItems: {
              ...state.savedItems,
              [productId]: {
                ...item,
                intent
              }
            }
          };
        });
      },
      unsaveProduct: (productId) => {
        set((state) => {
          const newItems = { ...state.savedItems };
          delete newItems[productId];
          return { savedItems: newItems };
        });
      },
      resetProducts: () => set({ savedItems: {} })
    }),
    {
      name: 'trybuy-product-storage',
    }
  )
);
