import { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, ExternalLink, RefreshCw, CheckCircle2, XCircle, ArrowRightLeft, Archive, AlertTriangle } from 'lucide-react';
import { useDecisionStore } from '../store/decisionStore';
import { extractMetadata } from '../services/extraction';
import { useToastStore } from '../store/toastStore';
import { formatPrice } from '../utils/format';
import { analytics } from '../analytics';
import type { ResolutionType } from '../types/domain';

export function PriceDetailPage() {
  const { decisionId } = useParams();
  const navigate = useNavigate();
  const { decisions, recheckPrice, markUnreachable, resolveDecision, markDormant, undoResolution } = useDecisionStore();
  const { showToast } = useToastStore();
  
  const decision = decisionId ? decisions[decisionId] : null;
  const [isChecking, setIsChecking] = useState(false);
  const [note, setNote] = useState('');

  if (!decision || decision.reason !== 'waiting_for_price') {
    return (
      <div className="p-8 text-center">
        <p className="text-gray-500">Price decision not found.</p>
        <button onClick={() => navigate('/')} className="mt-4 text-black underline font-bold">Go Home</button>
      </div>
    );
  }

  const { product, current_price, target_price, unreachable, state } = decision;

  const handleRecheck = async () => {
    if (isChecking) return;
    setIsChecking(true);
    
    analytics.track('price_recheck_triggered', {
      decision_id: decision.id,
      trigger: 'manual'
    });

    try {
      const result = await extractMetadata(product.source_url);
      
      if (result.status === 'auto' || result.status === 'partial') {
        if (result.price !== undefined) {
          recheckPrice(decision.id, result.price);
          showToast(`Price updated to $${result.price.toFixed(2)}`);
        } else {
          showToast('Could not extract current price.', { duration: 3000 });
        }
      } else {
        showToast('Extraction failed. Price unchanged.', { duration: 3000 });
      }
    } catch (err) {
      showToast('Could not check right now. Network or proxy error.', { duration: 3000 });
    } finally {
      setIsChecking(false);
    }
  };

  const calculateDaysSinceSaved = (createdAt: number) => {
    return Math.floor((Date.now() - createdAt) / (1000 * 60 * 60 * 24));
  };

  const handleResolve = (type: ResolutionType | 'dormant') => {
    if (type === 'dormant') {
      markDormant(decision.id); // Dormant doesn't take note currently in store
    } else {
      resolveDecision(decision.id, type, note.trim() || undefined);
    }
    
    let message = 'Decision resolved.';
    if (type === 'bought') message = 'Marked as Bought.';
    if (type === 'replaced') message = 'Marked as Replaced.';
    if (type === 'declined') message = 'Decided against.';
    if (type === 'dormant') message = 'Marked as Dormant.';

    showToast(message, {
      duration: 5000,
      action: {
        label: 'Undo',
        onClick: () => {
          undoResolution(decision.id);
          showToast('Decision reverted.');
        }
      }
    });

    if (type === 'dormant') {
      analytics.track('decision_dormant', {
        decision_id: decision.id,
        reason: 'waiting_for_price',
        days_since_saved: calculateDaysSinceSaved(decision.created_at)
      });
    } else {
      analytics.track('decision_resolved', {
        decision_id: decision.id,
        reason: 'waiting_for_price',
        resolution_type: type,
        days_since_saved: calculateDaysSinceSaved(decision.created_at)
      });
    }

    navigate('/');
  };

  if (state !== 'active') {
    return (
      <div className="p-8 text-center min-h-screen flex flex-col items-center justify-center bg-gray-50">
        <Archive className="w-12 h-12 text-gray-400 mb-4" />
        <h2 className="text-xl font-bold text-gray-900 mb-2">This decision is resolved.</h2>
        <button onClick={() => navigate('/')} className="bg-black text-white px-6 py-2 rounded-full font-bold shadow-md">
          Return Home
        </button>
      </div>
    );
  }

  const priceDrop = current_price !== undefined && product.price_at_save !== undefined && current_price < product.price_at_save;
  const displayPrice = current_price !== undefined ? current_price : product.price_at_save;

  return (
    <div className="min-h-screen bg-gray-50 pb-24">
      <header className="px-6 py-4 bg-white border-b border-gray-100 flex items-center justify-between sticky top-0 z-20">
        <button 
          onClick={() => navigate('/')} 
          aria-label="Go back"
          className="p-2 -ml-2 rounded-full hover:bg-gray-100 focus:ring-2 focus:ring-black outline-none flex-shrink-0 transition-colors"
        >
          <ArrowLeft className="w-5 h-5 text-gray-900" />
        </button>
        <span className="font-bold text-gray-900 uppercase tracking-wider text-xs">Price Watch</span>
        <div className="w-9" /> {/* Spacer */}
      </header>

      <main className="p-6">
        <div className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden mb-8">
          <div className="aspect-[4/3] bg-gray-100 relative">
            {product.image_url ? (
              <img src={product.image_url} alt={product.title} className="w-full h-full object-cover" />
            ) : (
              <div className="w-full h-full flex items-center justify-center text-gray-500">
                <span className="text-sm font-medium">No Image</span>
              </div>
            )}
            <a 
              href={product.source_url} 
              target="_blank" 
              rel="noopener noreferrer"
              aria-label="Open original product page"
              className="absolute top-3 right-3 bg-white/90 backdrop-blur text-black p-2 rounded-full shadow hover:bg-white focus:ring-2 focus:ring-black outline-none transition-colors"
            >
              <ExternalLink className="w-4 h-4" />
            </a>

            {!unreachable && (
              <button 
                onClick={() => {
                  if (window.confirm('Are you sure this link is permanently broken?')) {
                    markUnreachable(decision.id);
                  }
                }}
                className="absolute top-3 left-3 bg-white/90 backdrop-blur text-red-600 px-3 py-1.5 rounded-full shadow hover:bg-white text-xs font-bold flex items-center gap-1"
              >
                <AlertTriangle className="w-3 h-3" /> Mark broken
              </button>
            )}
          </div>
          
          <div className="p-5">
            <p className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-1">{product.merchant}</p>
            <h1 className="font-bold text-gray-900 text-xl mb-6">{product.title}</h1>
            
            {unreachable ? (
              <div className="bg-red-50 text-red-700 p-4 rounded-xl flex items-start gap-3 mb-6">
                <AlertTriangle className="w-5 h-5 flex-shrink-0 mt-0.5" />
                <div className="text-sm">
                  <span className="font-bold block mb-1">Source unreachable</span>
                  We couldn't connect to the retailer's page to verify the price.
                </div>
              </div>
            ) : (
              <div className="flex items-end justify-between mb-6 bg-gray-50 p-4 rounded-xl">
                <div>
                  <p className="text-xs font-bold text-gray-500 uppercase mb-1">Current Price</p>
                  <div className="flex items-baseline gap-2">
                    <span className="text-3xl font-black text-black">{formatPrice(displayPrice, product.currency)}</span>
                    {priceDrop && product.price_at_save !== undefined && (
                      <span className="text-sm font-bold text-gray-500 line-through">{formatPrice(product.price_at_save, product.currency)}</span>
                    )}
                  </div>
                </div>
                {target_price !== undefined && (
                  <div className="text-right">
                    <p className="text-xs font-bold text-gray-500 uppercase mb-1">Target</p>
                    <span className="text-lg font-bold text-black">{formatPrice(target_price, product.currency)}</span>
                  </div>
                )}
              </div>
            )}

            <button
              onClick={handleRecheck}
              disabled={isChecking}
              className="w-full bg-white border border-gray-200 text-gray-900 py-3 rounded-xl font-bold shadow-sm hover:bg-gray-50 disabled:opacity-50 transition-colors flex justify-center items-center gap-2"
            >
              <RefreshCw className={`w-4 h-4 ${isChecking ? 'animate-spin' : ''}`} /> 
              {isChecking ? 'Checking...' : 'Recheck price now'}
            </button>
            <p className="text-center text-xs text-gray-400 mt-3">
              Last checked: {new Date(decision.updated_at).toLocaleDateString()}
            </p>
          </div>
        </div>

        <section>
          <h2 className="text-sm font-bold text-gray-900 uppercase tracking-wider mb-4">Resolve this decision</h2>
          <input 
            type="text" 
            placeholder="Add a note (optional)..."
            value={note}
            onChange={e => setNote(e.target.value)}
            className="w-full mb-4 px-4 py-3 bg-white border border-gray-200 rounded-xl text-sm outline-none focus:border-black"
          />
          <div className="grid grid-cols-2 gap-3">
            <button
              onClick={() => handleResolve('bought')}
              className="bg-green-50 hover:bg-green-100 border border-green-200 text-green-700 p-4 rounded-xl font-bold text-sm flex flex-col items-center gap-2 transition-colors"
            >
              <CheckCircle2 className="w-6 h-6" /> Bought
            </button>
            <button
              onClick={() => handleResolve('replaced')}
              className="bg-blue-50 hover:bg-blue-100 border border-blue-200 text-blue-700 p-4 rounded-xl font-bold text-sm flex flex-col items-center gap-2 transition-colors"
            >
              <ArrowRightLeft className="w-6 h-6" /> Bought Alternative
            </button>
            <button
              onClick={() => handleResolve('declined')}
              className="bg-white hover:bg-gray-50 border border-gray-200 text-gray-700 p-4 rounded-xl font-bold text-sm flex flex-col items-center gap-2 transition-colors"
            >
              <XCircle className="w-6 h-6" /> Decided Against
            </button>
            <button
              onClick={() => handleResolve('dormant')}
              className="bg-white hover:bg-gray-50 border border-gray-200 text-gray-700 p-4 rounded-xl font-bold text-sm flex flex-col items-center gap-2 transition-colors"
            >
              <Archive className="w-6 h-6" /> Dormant
            </button>
          </div>
        </section>
      </main>
    </div>
  );
}
