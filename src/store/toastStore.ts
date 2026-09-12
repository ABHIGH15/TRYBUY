import { create } from 'zustand';

interface ToastState {
  message: string | null;
  showToast: (message: string, duration?: number) => void;
  hideToast: () => void;
}

export const useToastStore = create<ToastState>((set) => ({
  message: null,
  showToast: (message, duration = 3000) => {
    set({ message });
    setTimeout(() => {
      set((state) => (state.message === message ? { message: null } : state));
    }, duration);
  },
  hideToast: () => set({ message: null }),
}));
