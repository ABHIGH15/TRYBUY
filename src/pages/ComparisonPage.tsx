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
        <p className="text-gray-500">Comparison set not found.</p>
        <button onClick={() => navigate('/')} className="mt-4 text-black underline font-bold">Go Home</button>
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
      <div className="p-8 text-center min-h-screen flex flex-col items-center justify-center bg-gray-50">
        <Archive className="w-12 h-12 text-gray-400 mb-4" />
        <h2 className="text-xl font-bold text-gray-900 mb-2">This comparison is resolved.</h2>
        <p className="text-sm text-gray-500 mb-6">You have already made a decision here.</p>
        <button onClick={() => navigate('/')} className="bg-black text-white px-6 py-2 rounded-full font-bold shadow-md">
          Return Home
        </button>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 pb-24">
      <header className="px-6 py-6 bg-white border-b border-gray-100 flex items-center justify-between sticky top-0 z-20">
        <div className="flex items-center gap-3 overflow-hidden pr-4">
          <button 
            onClick={() => navigate('/')} 
            aria-label="Go back"
            className="p-2 -ml-2 rounded-full hover:bg-gray-100 focus:ring-2 focus:ring-black outline-none flex-shrink-0 transition-colors"
          >
            <ArrowLeft className="w-5 h-5 text-gray-900" />
          </button>
          
          {isEditingName ? (
            <input
              autoFocus
              value={editedName}
              onChange={e => setEditedName(e.target.value)}
              onBlur={handleRename}
              onKeyDown={e => e.key === 'Enter' && handleRename()}
              className="font-bold text-lg text-black bg-gray-50 border-none outline-none ring-2 ring-black rounded px-2 py-1 w-full"
            />
          ) : (
            <h1 
              onClick={() => setIsEditingName(true)}
              className="text-xl font-bold text-gray-900 truncate cursor-pointer hover:bg-gray-100 px-2 py-1 -ml-2 rounded flex items-center gap-2"
            >
              {set.name}
              <Edit2 className="w-3 h-3 text-gray-400" />
            </h1>
          )}
        </div>
        
        <button 
          onClick={() => navigate('/capture')}
          className="flex-shrink-0 bg-gray-100 hover:bg-gray-200 text-black px-3 py-1.5 rounded-full text-xs font-bold flex items-center gap-1 transition-colors"
        >
          <Plus className="w-3 h-3" /> Add item
        </button>
      </header>

      <main className="p-6">
        <div className="flex overflow-x-auto gap-4 pb-6 snap-x -mx-6 px-6 hide-scrollbar">
          {activeItems.map(item => (
            <div key={item.id} className="w-[85vw] max-w-[300px] flex-shrink-0 snap-center bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden flex flex-col">
              <div className="aspect-[4/3] bg-gray-100 relative">
                {item.product.image_url ? (
                  <img src={item.product.image_url} alt={item.product.title} className="w-full h-full object-cover" />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-gray-500">
                    <span className="text-sm font-medium">No Image</span>
                  </div>
                )}
                <a 
                  href={item.product.source_url} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  aria-label="Open original product page"
                  className="absolute top-3 right-3 bg-white/90 backdrop-blur text-black p-2 rounded-full shadow hover:bg-white focus:ring-2 focus:ring-black outline-none transition-colors"
                >
                  <ExternalLink className="w-4 h-4" />
                </a>
              </div>
              
              <div className="p-5 flex-1 flex flex-col">
                <p className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-1">
                  {item.product.merchant} • {new Date(item.created_at).toLocaleDateString(undefined, { month: 'short', day: 'numeric' })}
                </p>
                <h3 className="font-bold text-gray-900 text-lg mb-2 line-clamp-2">{item.product.title}</h3>
                <div className="text-xl font-black text-black mt-auto pt-4">
                  {formatPrice(item.product.price_at_save, item.product.currency)}
                </div>
              </div>
              
              <div className="p-4 border-t border-gray-100 bg-gray-50/50 flex flex-col gap-2">
                <button
                  onClick={() => handleResolveWinner(item.id, 'bought')}
                  className="w-full bg-black text-white py-2.5 rounded-xl font-bold shadow-sm hover:bg-gray-800 transition-colors flex justify-center items-center gap-2 text-sm"
                >
                  <Check className="w-4 h-4" /> Bought this
                </button>
                <button
                  onClick={() => handleResolveWinner(item.id, 'replaced')}
                  className="w-full bg-white border border-gray-200 text-gray-700 py-2.5 rounded-xl font-bold shadow-sm hover:bg-gray-50 transition-colors flex justify-center items-center gap-2 text-sm"
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
            className="w-full bg-white border-2 border-gray-200 text-gray-700 py-4 rounded-xl font-bold hover:border-gray-300 hover:bg-gray-50 transition-colors flex justify-center items-center gap-2"
          >
            <X className="w-5 h-5" /> None of these
          </button>
          
          <button
            onClick={handleResolveDormant}
            className="w-full bg-transparent text-gray-500 py-3 rounded-xl font-semibold hover:text-black hover:bg-gray-100 transition-colors flex justify-center items-center gap-2"
          >
            <Archive className="w-4 h-4" /> Not thinking about this anymore
          </button>
        </div>
      </main>
    </div>
  );
}
