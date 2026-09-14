import { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, Check, Plus, Edit2, Archive, X, ExternalLink } from 'lucide-react';
import { useDecisionStore } from '../store/decisionStore';
import { useComparisonSetItems } from '../hooks/useDashboard';
import { useToastStore } from '../store/toastStore';
import { analytics } from '../analytics';
import { formatPrice } from '../utils/format';

export function ComparisonPage() {
  const { setId } = useParams();
  const navigate = useNavigate();
  const { comparisonSets, renameComparisonSet, resolveComparisonSetItem, resolveComparisonSetNone, markComparisonSetDormant, undoResolution } = useDecisionStore();
  const { showToast } = useToastStore();
  
  const set = setId ? comparisonSets[setId] : null;
  const items = useComparisonSetItems(setId || '');
  const activeItems = items.filter(i => i.state === 'active');

  const [isEditingName, setIsEditingName] = useState(false);
  const [editedName, setEditedName] = useState(set?.name || '');

  if (!set) {
    return (
      <div className="p-8 text-center">
        <p className="text-closed">Comparison set not found.</p>
        <button onClick={() => navigate('/')} className="mt-4 text-black underline font-medium font-display">Go Home</button>
      </div>
    );
  }

  const handleRename = () => {
    if (editedName.trim() && editedName !== set.name) {
      renameComparisonSet(set.id, editedName.trim());
    }
    setIsEditingName(false);
  };

  const calculateDaysSinceSaved = (createdAt: number) => {
    return Math.floor((Date.now() - createdAt) / (1000 * 60 * 60 * 24));
  };

  const handleResolveWinner = (winnerId: string, resolutionType: 'bought' | 'replaced') => {
    if (!window.confirm(`Mark this as ${resolutionType}? The rest will be declined.`)) return;

    resolveComparisonSetItem(set.id, winnerId, resolutionType);
    
    showToast(resolutionType === 'bought' ? 'Decision saved! Chosen option marked as Bought.' : 'Decision saved! Marked as alternative.', {
      duration: 5000,
      action: {
        label: 'Undo',
        onClick: () => {
          undoResolution(winnerId);
          showToast('Decision reverted.');
        }
      }
    });

    const winner = items.find(i => i.id === winnerId);
    if (winner) {
      analytics.track('decision_resolved', {
        decision_id: winnerId,
        reason: 'comparing',
        resolution_type: resolutionType,
        days_since_saved: calculateDaysSinceSaved(winner.created_at)
      });
    }

    navigate('/');
  };

  const handleResolveNone = () => {
    if (!window.confirm('Mark all as declined?')) return;

    resolveComparisonSetNone(set.id);
    
    showToast('All options decided against.', {
      duration: 5000,
      action: {
        label: 'Undo',
        onClick: () => {
          if (items.length > 0) {
            undoResolution(items[0].id);
            showToast('Decision reverted.');
          }
        }
      }
    });

    if (activeItems.length > 0) {
      analytics.track('decision_resolved', {
        decision_id: activeItems[0].id,
        reason: 'comparing',
        resolution_type: 'declined',
        days_since_saved: calculateDaysSinceSaved(activeItems[0].created_at)
      });
    }

    navigate('/');
  };

  const handleResolveDormant = () => {
    if (!window.confirm('Set this entire comparison aside? (Mark Dormant)')) return;
    
    markComparisonSetDormant(set.id);
    
    showToast('Comparison marked as dormant.', {
      duration: 5000,
      action: {
        label: 'Undo',
        onClick: () => {
          if (items.length > 0) {
            undoResolution(items[0].id);
            showToast('Decision reverted.');
          }
        }
      }
    });

    if (activeItems.length > 0) {
      analytics.track('decision_dormant', {
        decision_id: activeItems[0].id,
        reason: 'comparing',
        days_since_saved: calculateDaysSinceSaved(activeItems[0].created_at)
      });
    }

    navigate('/');
  };

  // Ensure user cannot interact if set is already resolved (e.g. they navigated back)
  if (activeItems.length === 0) {
    return (
      <div className="p-8 text-center min-h-screen flex flex-col items-center justify-center bg-paper">
        <Archive className="w-12 h-12 text-gray-400 mb-4" />
        <h2 className="text-xl font-medium font-display text-ink mb-2">This comparison is resolved.</h2>
        <p className="text-sm text-closed mb-6">You have already made a decision here.</p>
        <button onClick={() => navigate('/')} className="bg-ink text-paper px-6 py-2 rounded-full font-medium font-display shadow-md">
          Return Home
        </button>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-paper pb-24">
      <header className="px-6 py-6 bg-paper-raised border-b border-line flex items-center justify-between sticky top-0 z-20">
        <div className="flex items-center gap-3 overflow-hidden pr-4">
          <button 
            onClick={() => navigate('/')} 
            aria-label="Go back"
            className="p-2 -ml-2 rounded-full hover:bg-closed-bg focus:ring-2 focus:ring-black outline-none flex-shrink-0 transition-colors"
          >
            <ArrowLeft className="w-5 h-5 text-ink" />
          </button>
          
          {isEditingName ? (
            <input
              autoFocus
              value={editedName}
              onChange={e => setEditedName(e.target.value)}
              onBlur={handleRename}
              onKeyDown={e => e.key === 'Enter' && handleRename()}
              className="font-medium font-display text-lg text-black bg-paper border-none outline-none ring-2 ring-black rounded px-2 py-1 w-full"
            />
          ) : (
            <h1 
              onClick={() => setIsEditingName(true)}
              className="text-xl font-medium font-display text-ink truncate cursor-pointer hover:bg-closed-bg px-2 py-1 -ml-2 rounded flex items-center gap-2"
            >
              {set.name}
              <Edit2 className="w-3 h-3 text-gray-400" />
            </h1>
          )}
        </div>
        
        <button 
          onClick={() => navigate('/capture')}
          className="flex-shrink-0 bg-closed-bg hover:bg-gray-200 text-black px-3 py-1.5 rounded-full text-xs font-medium font-display flex items-center gap-1 transition-colors"
        >
          <Plus className="w-3 h-3" /> Add item
        </button>
      </header>

      <main className="p-6">
        <p className="text-xs text-gray-500 mb-6 uppercase tracking-wider text-center">TRYBUY doesn't rank these for you — you decide</p>
        <div className="flex overflow-x-auto gap-4 pb-6 snap-x -mx-6 px-6 hide-scrollbar">
          {activeItems.map(item => (
            <div key={item.id} className="w-[85vw] max-w-[300px] flex-shrink-0 snap-center bg-paper-raised rounded-2xl border border-line shadow-sm overflow-hidden flex flex-col">
              <div className="aspect-[4/3] bg-closed-bg relative">
                {item.product.image_url ? (
                  <img src={item.product.image_url} alt={item.product.title} className="w-full h-full object-cover" />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-closed">
                    <span className="text-sm font-medium">No Image</span>
                  </div>
                )}
                <a 
                  href={item.product.source_url} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  aria-label="Open original product page"
                  className="absolute top-3 right-3 bg-paper-raised/90 backdrop-blur text-black p-2 rounded-full shadow hover:bg-paper-raised focus:ring-2 focus:ring-black outline-none transition-colors"
                >
                  <ExternalLink className="w-4 h-4" />
                </a>
              </div>
              
              <div className="p-5 flex-1 flex flex-col">
                <p className="text-xs font-medium font-display text-closed uppercase tracking-wider mb-1">
                  {item.product.merchant} • {new Date(item.created_at).toLocaleDateString(undefined, { month: 'short', day: 'numeric' })}
                </p>
                <h3 className="font-medium font-display text-ink text-lg mb-2 line-clamp-2">{item.product.title}</h3>
                <div className="text-xl font-black text-black mt-auto pt-4">
                  {formatPrice(item.product.price_at_save, item.product.currency)}
                </div>
              </div>
              
              <div className="p-4 border-t border-line bg-paper/50 flex flex-col gap-2">
                <button
                  onClick={() => handleResolveWinner(item.id, 'bought')}
                  className="w-full bg-ink text-paper py-2.5 rounded-xl font-medium font-display shadow-sm hover:bg-gray-800 transition-colors flex justify-center items-center gap-2 text-sm"
                >
                  <Check className="w-4 h-4" /> Bought this
                </button>
                <button
                  onClick={() => handleResolveWinner(item.id, 'replaced')}
                  className="w-full bg-paper-raised border border-line text-gray-700 py-2.5 rounded-xl font-medium font-display shadow-sm hover:bg-paper transition-colors flex justify-center items-center gap-2 text-sm"
                >
                  Bought alternative
                </button>
              </div>
            </div>
          ))}
        </div>

        <div className="mt-6 space-y-3">
          <button
            onClick={handleResolveNone}
            className="w-full bg-paper-raised border-2 border-line text-gray-700 py-4 rounded-xl font-medium font-display hover:border-gray-300 hover:bg-paper transition-colors flex justify-center items-center gap-2"
          >
            <X className="w-5 h-5" /> None of these
          </button>
          
          <button
            onClick={handleResolveDormant}
            className="w-full bg-transparent text-closed py-3 rounded-xl font-semibold hover:text-black hover:bg-closed-bg transition-colors flex justify-center items-center gap-2"
          >
            <Archive className="w-4 h-4" /> Not thinking about this anymore
          </button>
        </div>
      </main>
    </div>
  );
}
