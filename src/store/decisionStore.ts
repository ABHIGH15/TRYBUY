import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import type { 
  Decision, 
  ComparisonSet, 
  Reason, 
  ResolutionType 
} from '../types/domain.ts';
import { 
  validateDecision, 
  validateComparisonSet 
} from '../types/domain.ts';

interface DecisionState {
  decisions: Record<string, Decision>;
  comparisonSets: Record<string, ComparisonSet>;
  
  // Actions
  addDecision: (decision: Decision) => void;
  updateDecisionReason: (id: string, reason: Reason) => void;
  resolveDecision: (id: string, type: ResolutionType, note?: string) => void;
  markDormant: (id: string) => void;
  undoResolution: (id: string) => void;
  
  createComparisonSet: (compSet: ComparisonSet) => void;
  renameComparisonSet: (setId: string, newName: string) => void;
  addToComparisonSet: (setId: string, decisionId: string) => void;
  resolveComparisonSetItem: (setId: string, winnerId: string, resolutionType: Extract<ResolutionType, 'bought' | 'replaced'>) => void;
  resolveComparisonSetNone: (setId: string) => void;
  markComparisonSetDormant: (setId: string) => void;
  
  recheckPrice: (id: string, newPrice: number) => void;
  markUnreachable: (id: string) => void;
  
  seedExamples: () => void;
  clearExamples: () => void;
}

export const useDecisionStore = create<DecisionState>()(
  persist(
    (set) => ({
      decisions: {},
      comparisonSets: {},

      addDecision: (decision) => set((state) => {
        // Automatically clear examples on first real save
        const newDecisions = { ...state.decisions };
        const newSets = { ...state.comparisonSets };
        
        let hasExamples = false;
        Object.values(newDecisions).forEach(d => {
          if (d.is_example) {
            hasExamples = true;
            delete newDecisions[d.id];
          }
        });
        Object.values(newSets).forEach(s => {
          if (s.is_example) delete newSets[s.id];
        });

        newDecisions[decision.id] = decision;
        
        return { 
          decisions: newDecisions,
          comparisonSets: hasExamples ? newSets : state.comparisonSets 
        };
      }),

      clearExamples: () => set((state) => {
        const newDecisions = { ...state.decisions };
        const newSets = { ...state.comparisonSets };
        Object.values(newDecisions).forEach(d => { if (d.is_example) delete newDecisions[d.id]; });
        Object.values(newSets).forEach(s => { if (s.is_example) delete newSets[s.id]; });
        return { decisions: newDecisions, comparisonSets: newSets };
      }),

      seedExamples: () => set((state) => {
        const now = Date.now();
        const compSetId = 'example-set-1';
        
        const dummySet = {
          id: compSetId,
          name: 'Running Shoes',
          decision_ids: ['ex-1', 'ex-2'],
          created_at: now - 86400000 * 2,
          is_example: true
        };

        const dummyDecisions = {
          'ex-1': {
            id: 'ex-1', reason: 'comparing' as const, state: 'active' as const, resolution_type: null,
            unreachable: false, product: { title: 'Nike Pegasus 40', merchant: 'Nike', price_at_save: 10495, currency: 'INR', image_url: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?auto=format&fit=crop&q=80&w=200', source_url: 'https://example.com' },
            comparison_set_id: compSetId, extraction_status: 'auto' as const, created_at: now - 86400000 * 2, updated_at: now - 86400000 * 2, is_example: true
          },
          'ex-2': {
            id: 'ex-2', reason: 'comparing' as const, state: 'active' as const, resolution_type: null,
            unreachable: false, product: { title: 'Asics Novablast 3', merchant: 'Asics', price_at_save: 11999, currency: 'INR', image_url: 'https://images.unsplash.com/photo-1608231387042-66d1773070a5?auto=format&fit=crop&q=80&w=200', source_url: 'https://example.com' },
            comparison_set_id: compSetId, extraction_status: 'auto' as const, created_at: now - 86400000 * 2, updated_at: now - 86400000 * 2, is_example: true
          },
          'ex-3': {
            id: 'ex-3', reason: 'waiting_for_price' as const, state: 'active' as const, resolution_type: null,
            unreachable: false, product: { title: 'Sony WH-1000XM5', merchant: 'Amazon', price_at_save: 29990, currency: 'INR', image_url: 'https://images.unsplash.com/photo-1618366712010-f4ae9c647dcb?auto=format&fit=crop&q=80&w=200', source_url: 'https://example.com' },
            current_price: 24990, target_price: 25000, extraction_status: 'auto' as const, created_at: now - 86400000 * 5, updated_at: now, is_example: true
          },
          'ex-4': {
            id: 'ex-4', reason: 'waiting_for_price' as const, state: 'resolved' as const, resolution_type: 'bought' as const,
            unreachable: false, product: { title: 'Aer City Pack', merchant: 'Aer', price_at_save: 14900, currency: 'INR', image_url: 'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?auto=format&fit=crop&q=80&w=200', source_url: 'https://example.com' },
            current_price: 12900, target_price: 13000, extraction_status: 'auto' as const, created_at: now - 86400000 * 10, updated_at: now - 86400000 * 1, resolved_at: now - 86400000 * 1, is_example: true
          }
        };

        return {
          decisions: { ...state.decisions, ...dummyDecisions },
          comparisonSets: { ...state.comparisonSets, [compSetId]: dummySet }
        };
      }),

      updateDecisionReason: (id, reason) => set((state) => {
        const decision = state.decisions[id];
        if (!decision) return state;
        
        // If reason doesn't actually change, do nothing
        if (decision.reason === reason) return state;

        const now = Date.now();
        const updates: Partial<DecisionState> = {};
        const newDecisions = { ...state.decisions };
        const newComparisonSets = { ...state.comparisonSets };
        
        // If moving AWAY from comparing, we must cleanly remove from comparison set
        if (decision.reason === 'comparing' && reason === 'waiting_for_price') {
          const setId = decision.comparison_set_id;
          if (setId && newComparisonSets[setId]) {
            newComparisonSets[setId] = {
              ...newComparisonSets[setId],
              decision_ids: newComparisonSets[setId].decision_ids.filter(dId => dId !== id)
            };
          }
        }
        
        // Ensure new decision clears comparison_set_id if it's no longer comparing
        // And similarly drops price fields if moving from waiting_for_price -> comparing (though spec says current/target are optional and specific to waiting_for_price, it's safer to clear them to avoid semantic confusion)
        newDecisions[id] = {
          ...decision,
          reason,
          comparison_set_id: reason === 'comparing' ? decision.comparison_set_id : undefined,
          current_price: reason === 'waiting_for_price' ? decision.current_price : undefined,
          target_price: reason === 'waiting_for_price' ? decision.target_price : undefined,
          updated_at: now
        };
        
        updates.decisions = newDecisions;
        updates.comparisonSets = newComparisonSets;
        return updates;
      }),

      resolveDecision: (id, type, note) => set((state) => {
        const decision = state.decisions[id];
        if (!decision || decision.state !== 'active') return state; // Block resolving already resolved/dormant

        return {
          decisions: {
            ...state.decisions,
            [id]: {
              ...decision,
              state: 'resolved',
              resolution_type: type,
              resolution_note: note,
              resolved_at: Date.now(),
              updated_at: Date.now(),
            }
          }
        };
      }),

      markDormant: (id) => set((state) => {
        const decision = state.decisions[id];
        if (!decision || decision.state !== 'active') return state; // Block marking dormant if not active

        return {
          decisions: {
            ...state.decisions,
            [id]: {
              ...decision,
              state: 'dormant',
              resolution_type: null,
              resolved_at: Date.now(),
              updated_at: Date.now(),
            }
          }
        };
      }),

      undoResolution: (id) => set((state) => {
        const decision = state.decisions[id];
        if (!decision || decision.state === 'active') return state;

        const now = Date.now();
        const newDecisions = { ...state.decisions };

        const revert = (dId: string) => {
          const d = newDecisions[dId];
          if (d) {
            newDecisions[dId] = {
              ...d,
              state: 'active',
              resolution_type: null,
              resolved_at: undefined,
              updated_at: now,
            };
          }
        };

        if (decision.comparison_set_id) {
          const compSet = state.comparisonSets[decision.comparison_set_id];
          if (compSet) {
            // Restore entire set to active to preserve invariant
            compSet.decision_ids.forEach(revert);
          } else {
            // Orphaned set, just restore the item
            revert(id);
          }
        } else {
          revert(id);
        }

        return { decisions: newDecisions };
      }),

      createComparisonSet: (compSet) => set((state) => ({
        comparisonSets: { ...state.comparisonSets, [compSet.id]: compSet }
      })),

      renameComparisonSet: (setId, newName) => set((state) => {
        const compSet = state.comparisonSets[setId];
        if (!compSet) return state;
        return {
          comparisonSets: {
            ...state.comparisonSets,
            [setId]: { ...compSet, name: newName }
          }
        };
      }),

      addToComparisonSet: (setId, decisionId) => set((state) => {
        const compSet = state.comparisonSets[setId];
        const decision = state.decisions[decisionId];
        
        // Invariants:
        // 1. Comparison set must exist
        // 2. Decision must exist
        // 3. Decision reason MUST be 'comparing'
        // 4. Decision MUST be 'active'
        // 5. Decision cannot already be in another set (or we move it, but spec implies it belongs to one set)
        if (!compSet || !decision) return state;
        if (decision.reason !== 'comparing') return state;
        if (decision.state !== 'active') return state;
        
        const now = Date.now();
        
        // Remove from old set if changing sets
        const newComparisonSets = { ...state.comparisonSets };
        if (decision.comparison_set_id && decision.comparison_set_id !== setId) {
          const oldSet = newComparisonSets[decision.comparison_set_id];
          if (oldSet) {
            newComparisonSets[decision.comparison_set_id] = {
              ...oldSet,
              decision_ids: oldSet.decision_ids.filter(d => d !== decisionId)
            };
          }
        }
        
        newComparisonSets[setId] = {
          ...compSet,
          decision_ids: [...new Set([...compSet.decision_ids, decisionId])]
        };

        return {
          comparisonSets: newComparisonSets,
          decisions: {
            ...state.decisions,
            [decisionId]: {
              ...decision,
              comparison_set_id: setId,
              updated_at: now
            }
          }
        };
      }),

      resolveComparisonSetItem: (setId, winnerId, resolutionType) => set((state) => {
        const compSet = state.comparisonSets[setId];
        if (!compSet) return state;

        const now = Date.now();
        const newDecisions = { ...state.decisions };
        let hasChanges = false;

        // "No comparison set should be left with a mixture of resolved and active siblings"
        // Force process EVERY item in the set.
        compSet.decision_ids.forEach(id => {
          const d = newDecisions[id];
          if (d && d.state === 'active') {
            hasChanges = true;
            newDecisions[id] = {
              ...d,
              state: 'resolved',
              resolution_type: id === winnerId ? resolutionType : 'declined',
              resolved_at: now,
              updated_at: now,
            };
          }
        });

        return hasChanges ? { decisions: newDecisions } : state;
      }),

      resolveComparisonSetNone: (setId) => set((state) => {
        const compSet = state.comparisonSets[setId];
        if (!compSet) return state;

        const now = Date.now();
        const newDecisions = { ...state.decisions };
        let hasChanges = false;

        compSet.decision_ids.forEach(id => {
          const d = newDecisions[id];
          if (d && d.state === 'active') {
            hasChanges = true;
            newDecisions[id] = {
              ...d,
              state: 'resolved',
              resolution_type: 'declined',
              resolved_at: now,
              updated_at: now,
            };
          }
        });

        return hasChanges ? { decisions: newDecisions } : state;
      }),

      markComparisonSetDormant: (setId) => set((state) => {
        const compSet = state.comparisonSets[setId];
        if (!compSet) return state;

        const now = Date.now();
        const newDecisions = { ...state.decisions };
        let hasChanges = false;

        compSet.decision_ids.forEach(id => {
          const d = newDecisions[id];
          if (d && d.state === 'active') {
            hasChanges = true;
            newDecisions[id] = {
              ...d,
              state: 'dormant',
              resolution_type: null,
              resolved_at: now,
              updated_at: now,
            };
          }
        });

        return hasChanges ? { decisions: newDecisions } : state;
      }),

      recheckPrice: (id, newPrice) => set((state) => {
        const decision = state.decisions[id];
        if (!decision || decision.reason !== 'waiting_for_price') return state;

        return {
          decisions: {
            ...state.decisions,
            [id]: {
              ...decision,
              current_price: newPrice,
              unreachable: false, // successfully checked
              updated_at: Date.now()
            }
          }
        };
      }),

      markUnreachable: (id) => set((state) => {
        const decision = state.decisions[id];
        if (!decision) return state;

        return {
          decisions: {
            ...state.decisions,
            [id]: {
              ...decision,
              unreachable: true,
              updated_at: Date.now()
            }
          }
        };
      })
    }),
    {
      name: 'trybuy-decision-storage',
      storage: createJSONStorage(() => localStorage),
      merge: (persistedState: any, currentState: DecisionState) => {
        if (!persistedState || typeof persistedState !== 'object') return currentState;
        
        const validDecisions: Record<string, Decision> = {};
        const validComparisonSets: Record<string, ComparisonSet> = {};

        if (persistedState.decisions && typeof persistedState.decisions === 'object') {
          for (const [key, value] of Object.entries(persistedState.decisions)) {
            const validated = validateDecision(value);
            if (validated) {
              validDecisions[key] = validated;
            } else {
              console.warn(`[DecisionStore] Dropped invalid decision: ${key}`);
            }
          }
        }

        if (persistedState.comparisonSets && typeof persistedState.comparisonSets === 'object') {
          for (const [key, value] of Object.entries(persistedState.comparisonSets)) {
            const validated = validateComparisonSet(value);
            if (validated) {
              // Ensure decision_ids array only contains valid decisions that exist in validDecisions
              validComparisonSets[key] = {
                ...validated,
                decision_ids: validated.decision_ids.filter(id => !!validDecisions[id])
              };
            } else {
              console.warn(`[DecisionStore] Dropped invalid comparison set: ${key}`);
            }
          }
        }

        return {
          ...currentState,
          decisions: validDecisions,
          comparisonSets: validComparisonSets,
        };
      }
    }
  )
);
