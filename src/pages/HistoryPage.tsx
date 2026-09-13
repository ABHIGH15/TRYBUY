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
    <div className="min-h-screen bg-gray-50 pb-24">
      <header className="px-6 py-4 bg-white border-b border-gray-100 flex items-center gap-3 sticky top-0 z-20">
        <button 
          onClick={() => navigate('/')} 
          aria-label="Go back to Home"
          className="p-2 -ml-2 rounded-full hover:bg-gray-100 focus:ring-2 focus:ring-black outline-none flex-shrink-0 transition-colors"
        >
          <ArrowLeft className="w-5 h-5 text-gray-900" />
        </button>
        <div>
          <h1 className="text-xl font-bold tracking-tight text-gray-900">History</h1>
          <p className="text-sm text-gray-500">{history.length} resolved</p>
        </div>
      </header>

      <main className="px-6 py-8">
        {history.length === 0 ? (
          <div className="text-center py-16 px-4">
            <h2 className="text-lg font-bold text-gray-900 mb-2">No history yet.</h2>
            <p className="text-sm text-gray-500">Your resolved decisions will appear here.</p>
          </div>
        ) : (
          <div className="space-y-3">
            {history.map(decision => (
              <ResolvedDecisionCard key={decision.id} decision={decision} />
            ))}
          </div>
        )}
      </main>
    </div>
  );
}
