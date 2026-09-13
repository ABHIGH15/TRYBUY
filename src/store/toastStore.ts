import { create } from 'zustand';

export interface ToastAction {
  label: string;
  onClick: () => void;
}

interface ToastState {
  message: string | null;
  action: ToastAction | null;
  showToast: (message: string, options?: { duration?: number, action?: ToastAction }) => void;
  hideToast: () => void;
}

export const useToastStore = create<ToastState>((set) => ({
  message: null,
  action: null,
  showToast: (message, options = {}) => {
    const duration = options.duration || 4000;
    set({ message, action: options.action || null });
    
    // Using a stable timeout reset mechanism if called rapidly
    if ((window as any).__toastTimeout) {
      clearTimeout((window as any).__toastTimeout);
    }
    
    (window as any).__toastTimeout = setTimeout(() => {
      set((state) => (state.message === message ? { message: null, action: null } : state));
    }, duration);
  },
  hideToast: () => set({ message: null, action: null }),
}));
