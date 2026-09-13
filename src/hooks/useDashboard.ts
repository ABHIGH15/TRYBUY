import { useMemo } from 'react';
import { useDecisionStore } from '../store/decisionStore';
import type { Decision, ComparisonSet } from '../types/domain';

// IMPLEMENATION ASSUMPTION: 
// The locked spec mentions comparisons can surface based on a "stale/time threshold" 
// but does not mandate a specific magic number. 
// I am isolating this as a clearly named constant (7 days).
export const COMPARISON_STALE_MS = 7 * 24 * 60 * 60 * 1000;

export interface DashboardState {
  triggeredDecisions: (Decision | ComparisonSet)[];
  triggerCount: number;
  openComparisonSets: ComparisonSet[];
  waitingForPriceDecisions: Decision[];
  recentlyResolved: Decision[];
  totalOpenDecisionsCount: number;
}

export function useDashboard(): DashboardState {
  const decisionsMap = useDecisionStore(s => s.decisions);
  const setsMap = useDecisionStore(s => s.comparisonSets);

  return useMemo(() => {
    const allDecisions = Object.values(decisionsMap);
    const allSets = Object.values(setsMap);

    const activeDecisions = allDecisions.filter(d => d.state === 'active');
    
    // 1. Price Decisions
    const priceDecisions = activeDecisions.filter(d => d.reason === 'waiting_for_price');
    
    const triggeredPriceDecisions = priceDecisions.filter(d => {
      if (d.current_price === undefined) return false; // No price known yet
      // Trigger if current price is <= target price (if set), else trigger if current < baseline
      if (d.target_price !== undefined) {
        return d.current_price <= d.target_price;
      }
      return d.product.price_at_save !== undefined && d.current_price < d.product.price_at_save;
    });

    const untriggeredPriceDecisions = priceDecisions.filter(
      d => !triggeredPriceDecisions.includes(d)
    );

    // 2. Comparison Sets
    // A set is open if it has at least one active decision inside it.
    const openComparisonSets = allSets.filter(set => {
      return set.decision_ids.some(id => decisionsMap[id]?.state === 'active');
    });

    // 3. Recently Resolved
    const resolvedOrDormant = allDecisions.filter(d => d.state !== 'active');
    // Sort by most recently resolved/updated first
    const recentlyResolved = resolvedOrDormant
      .sort((a, b) => (b.resolved_at || b.updated_at) - (a.resolved_at || a.updated_at))
      .slice(0, 3); // top 3 as per spec

    return {
      triggeredDecisions: [...triggeredPriceDecisions], // Removed comparison sets from automatic triggers per P0
      triggerCount: triggeredPriceDecisions.length,
      openComparisonSets: openComparisonSets, // All open sets remain strictly user-driven
      waitingForPriceDecisions: untriggeredPriceDecisions,
      recentlyResolved,
      totalOpenDecisionsCount: activeDecisions.length
    };
  }, [decisionsMap, setsMap]);
}

export function useComparisonSetItems(setId: string): Decision[] {
  const decisionsMap = useDecisionStore(s => s.decisions);
  const set = useDecisionStore(s => s.comparisonSets[setId]);
  
  return useMemo(() => {
    if (!set) return [];
    return set.decision_ids
      .map(id => decisionsMap[id])
      .filter((d): d is Decision => !!d);
  }, [set, decisionsMap]);
}
