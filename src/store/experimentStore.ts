import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export type Variant = 'control' | 'treatment';

export interface SimulatedEvent {
  type: string;
  productId: string;
  triggerReason: string;
  message: string;
  oldPrice?: number;
  newPrice?: number;
  timestamp: number;
}

interface ExperimentState {
  variant: Variant;
  simulatedTimeOffsetMs: number; // For "time travel"
  simulatedEvents: SimulatedEvent[];
  setVariant: (variant: Variant) => void;
  simulateTimeJump: (days: number) => void;
  triggerSimulatedEvent: (event: SimulatedEvent) => void;
  removeSimulatedEvent: (productId: string) => void;
  resetExperiment: () => void;
}

export const useExperimentStore = create<ExperimentState>()(
  persist(
    (set) => ({
      variant: 'treatment',
      simulatedTimeOffsetMs: 0,
      simulatedEvents: [],
      setVariant: (variant) => set({ variant }),
      simulateTimeJump: (days) => set((state) => ({ 
        simulatedTimeOffsetMs: state.simulatedTimeOffsetMs + (days * 24 * 60 * 60 * 1000) 
      })),
      triggerSimulatedEvent: (event) => set((state) => {
        const filtered = state.simulatedEvents.filter(e => e.productId !== event.productId);
        return { simulatedEvents: [event, ...filtered] };
      }),
      removeSimulatedEvent: (productId) => set((state) => ({
        simulatedEvents: state.simulatedEvents.filter(e => e.productId !== productId)
      })),
      resetExperiment: () => set({ 
        variant: 'treatment',
        simulatedTimeOffsetMs: 0, 
        simulatedEvents: [] 
      }),
    }),
    {
      name: 'trybuy-experiment-storage',
    }
  )
);
