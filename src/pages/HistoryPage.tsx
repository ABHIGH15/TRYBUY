import { useNavigate } from 'react-router-dom';
import { useDecisionStore } from '../store/decisionStore';
import { ResolvedDecisionCard } from '../components/Home/DecisionCards';
import { ArrowLeft } from 'lucide-react';

export function HistoryPage() {
  const navigate = useNavigate();
  const decisionsDict = useDecisionStore(s => s.decisions);
  const decisions = Object.values(decisionsDict);
  
  const history = decisions
    .filter(d => d.state !== 'active')
    .sort((a, b) => (b.resolved_at || b.updated_at) - (a.resolved_at || a.updated_at));

  return (
    <div className="min-h-screen bg-paper pb-24">
      <header className="px-6 py-4 bg-paper-raised border-b border-line flex items-center gap-3 sticky top-0 z-20">
        <button 
          onClick={() => navigate('/')} 
          aria-label="Go back to Home"
          className="p-2 -ml-2 rounded-full hover:bg-closed-bg focus:ring-2 focus:ring-black outline-none flex-shrink-0 transition-colors"
        >
          <ArrowLeft className="w-5 h-5 text-ink" />
        </button>
        <div>
          <h1 className="text-xl font-medium font-display tracking-tight text-ink">History</h1>
          <p className="text-sm text-closed">{history.length} resolved</p>
        </div>
      </header>

      <main className="px-6 py-8">
        {history.length === 0 ? (
          <div className="text-center py-16 px-4">
            <h2 className="text-lg font-medium font-display text-ink mb-2">No history yet.</h2>
            <p className="text-sm text-closed">Your resolved decisions will appear here.</p>
          </div>
        ) : (
          <div className="">
            {history.map(decision => (
              <ResolvedDecisionCard key={decision.id} decision={decision} />
            ))}
          </div>
        )}
      </main>
    </div>
  );
}
