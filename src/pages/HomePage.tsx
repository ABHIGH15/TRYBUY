import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Plus } from 'lucide-react';
import { useDashboard } from '../hooks/useDashboard';
import { ComparisonSetCard, PriceDecisionCard, ResolvedDecisionCard } from '../components/Home/DecisionCards';
import type { Decision, ComparisonSet } from '../types/domain';
import { analytics } from '../analytics';

export function HomePage() {
  const navigate = useNavigate();
  const dashboard = useDashboard();

  useEffect(() => {
    analytics.track('home_opened', {
      open_decision_count: dashboard.totalOpenDecisionsCount,
      active_trigger_count: dashboard.triggerCount
    });
  }, [dashboard.totalOpenDecisionsCount, dashboard.triggerCount]);

  const hasEmptyState = dashboard.totalOpenDecisionsCount === 0;

  return (
    <div className="min-h-screen bg-gray-50 pb-24">
      <header className="px-6 pt-10 pb-6 bg-white border-b border-gray-100 sticky top-0 z-10">
        <h1 className="text-2xl font-bold tracking-tight text-gray-900">Your open decisions</h1>
        {!hasEmptyState && dashboard.triggerCount > 0 && (
          <p className="text-sm font-medium text-orange-600 mt-1">
            {dashboard.triggerCount} {dashboard.triggerCount === 1 ? 'decision needs' : 'decisions need'} attention
          </p>
        )}
        {!hasEmptyState && dashboard.triggerCount === 0 && (
          <p className="text-sm text-gray-500 mt-1">Nothing requires your attention right now.</p>
        )}
      </header>

      <main className="px-6 py-8 space-y-12">
        {hasEmptyState ? (
          <div className="text-center py-16 px-4">
            <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <Plus className="w-8 h-8 text-gray-500" />
            </div>
            <h2 className="text-xl font-bold text-gray-900 mb-2">No open decisions yet.</h2>
            <p className="text-sm text-gray-500 mb-8 max-w-[250px] mx-auto">
              Found something you like but aren't ready to buy? Paste its link and TRYBUY will remember what you're waiting for.
            </p>
            <button
              onClick={() => navigate('/capture')}
              className="bg-black text-white px-6 py-3 rounded-full font-semibold shadow-sm hover:bg-gray-800 transition-colors"
            >
              Bring in a product
            </button>
          </div>
        ) : (
          <>
            {/* SECTION 1: Needs Attention (Triggered) */}
            {dashboard.triggeredDecisions.length > 0 && (
              <section className="space-y-4 animate-in fade-in slide-in-from-bottom-4 duration-500">
                <h2 className="text-sm font-bold text-gray-900 uppercase tracking-wider flex items-center gap-2">
                  Needs attention <span className="bg-orange-100 text-orange-700 w-5 h-5 rounded-full flex items-center justify-center text-xs">{dashboard.triggeredDecisions.length}</span>
                </h2>
                <div className="space-y-4">
                  {dashboard.triggeredDecisions.map(item => {
                    if ('decision_ids' in item) {
                      return <ComparisonSetCard key={item.id} set={item as ComparisonSet} isTriggered />;
                    } else {
                      return <PriceDecisionCard key={item.id} decision={item as Decision} isTriggered />;
                    }
                  })}
                </div>
              </section>
            )}

            {/* SECTION 2: Open Comparison Sets */}
            {dashboard.openComparisonSets.length > 0 && (
              <section className="space-y-4 animate-in fade-in slide-in-from-bottom-4 duration-500 delay-75">
                <h2 className="text-sm font-bold text-gray-900 uppercase tracking-wider">Comparison Sets</h2>
                <div className="space-y-4">
                  {dashboard.openComparisonSets.map(set => (
                    <ComparisonSetCard key={set.id} set={set} />
                  ))}
                </div>
              </section>
            )}

            {/* SECTION 3: Waiting for price */}
            {dashboard.waitingForPriceDecisions.length > 0 && (
              <section className="space-y-4 animate-in fade-in slide-in-from-bottom-4 duration-500 delay-100">
                <h2 className="text-sm font-bold text-gray-900 uppercase tracking-wider">Watching Price</h2>
                <div className="space-y-3">
                  {dashboard.waitingForPriceDecisions.map(decision => (
                    <PriceDecisionCard key={decision.id} decision={decision} />
                  ))}
                </div>
              </section>
            )}

            {/* SECTION 4: Recently Resolved */}
            {dashboard.recentlyResolved.length > 0 && (
              <section className="space-y-4 animate-in fade-in slide-in-from-bottom-4 duration-500 delay-150 pt-4 border-t border-gray-200">
                <div className="flex items-center justify-between">
                  <h2 className="text-sm font-bold text-gray-500 uppercase tracking-wider">Recently Resolved</h2>
                  <button onClick={() => navigate('/history')} className="text-xs font-semibold text-gray-400 hover:text-black">
                    View all
                  </button>
                </div>
                <div className="space-y-2">
                  {dashboard.recentlyResolved.map(decision => (
                    <ResolvedDecisionCard key={decision.id} decision={decision} />
                  ))}
                </div>
              </section>
            )}
          </>
        )}
      </main>
    </div>
  );
}
