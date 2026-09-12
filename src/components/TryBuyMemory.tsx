import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useProductStore } from '../store/productStore';
import type { SavedItem } from '../store/productStore';
import { useExperimentStore } from '../store/experimentStore';
import { analytics } from '../analytics';
import { mockProducts } from '../store/data';
import { Heart, Clock, Info } from 'lucide-react';
import { useToastStore } from '../store/toastStore';

const INTENT_HEADERS: Record<string, { title: string, icon: string, desc: string, text: string }> = {
  'PRICE_WATCH': { title: 'Waiting for a price drop', icon: '📉', desc: 'Things you love but want cheaper', text: 'You were waiting for a better price.' },
  'COMPARING': { title: 'Comparing options', icon: '⚖️', desc: 'Active decisions', text: 'You were comparing this with something else.' },
  'BUYING_LATER': { title: 'Buying it later', icon: '📅', desc: 'For an upcoming occasion', text: 'You need this for later.' },
  'EXPLORING': { title: 'Just exploring', icon: '✨', desc: 'Things that caught your eye', text: 'You were just exploring.' },
};

const formatTimeAgo = (timestamp: number) => {
  const diff = Date.now() - timestamp;
  const days = Math.floor(diff / (1000 * 60 * 60 * 24));
  if (days === 0) return 'Saved today';
  if (days === 1) return 'Saved yesterday';
  return `Saved ${days} days ago`;
};

export const TryBuyMemory: React.FC = () => {
  const { savedItems, unsaveProduct } = useProductStore();
  const { simulatedEvents, removeSimulatedEvent } = useExperimentStore();
  const { showToast } = useToastStore();
  
  useEffect(() => {
    analytics.track('memory_viewed');
    
    simulatedEvents.forEach(ev => {
      if (savedItems[ev.productId]) {
        analytics.track('reengagement_viewed', { type: ev.type, productId: ev.productId });
      }
    });
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const items = Object.values(savedItems).sort((a, b) => b.savedAt - a.savedAt);
  
  const groupedItems = items.reduce((acc, item) => {
    const key = item.intent || 'UNCATEGORIZED';
    if (!acc[key]) acc[key] = [];
    acc[key].push(item);
    return acc;
  }, {} as Record<string, SavedItem[]>);

  // Sort groups by the most recent item inside them
  const sortedIntentGroups = Object.entries(groupedItems).sort((a, b) => {
    const maxA = Math.max(...a[1].map(i => i.savedAt));
    const maxB = Math.max(...b[1].map(i => i.savedAt));
    return maxB - maxA;
  });

  const handleUnsave = (e: React.MouseEvent, productId: string) => {
    e.preventDefault();
    e.stopPropagation();
    analytics.track('save_clicked', { productId, action: 'unsave', source: 'memory' });
    unsaveProduct(productId);
    removeSimulatedEvent(productId);
    showToast('Removed from memory');
  };

  return (
    <div className="pb-24 max-w-md mx-auto min-h-screen bg-gray-50 flex flex-col font-sans">
      <header className="sticky top-0 bg-white/90 backdrop-blur-md z-10 border-b border-gray-100 px-4 py-4 flex items-center justify-between">
        <h1 className="font-black text-2xl tracking-tighter text-gray-900">Memory</h1>
      </header>

      {/* Simulated Re-engagement Context */}
      {simulatedEvents.length > 0 && (
        <div className="p-4 bg-blue-50 border-b border-blue-100 shadow-inner">
          <div className="flex items-center gap-2 mb-3 px-1">
            <span className="w-2 h-2 rounded-full bg-blue-600 animate-pulse"></span>
            <h2 className="text-xs font-black text-blue-900 uppercase tracking-widest">TryBuy Remembered</h2>
          </div>
          <div className="space-y-3">
            {simulatedEvents.map((ev, i) => {
              const product = mockProducts.find(p => p.id === ev.productId);
              if (!product || !savedItems[ev.productId]) return null;
              
              return (
                <Link 
                  to={`/product/${product.id}`} 
                  key={i} 
                  onClick={() => analytics.track('reengagement_clicked', { type: ev.type, productId: ev.productId })}
                  className="block bg-white p-4 rounded-2xl shadow-sm border border-blue-100 relative overflow-hidden active:scale-[0.98] transition-transform"
                >
                  <div className="absolute top-0 left-0 w-1 h-full bg-blue-600"></div>
                  <div className="flex gap-4">
                    <div className="w-16 h-20 rounded-xl bg-gray-50 overflow-hidden shrink-0 border border-gray-100">
                      <img src={product.imageUrl} alt="" className="w-full h-full object-cover" />
                    </div>
                    <div className="flex flex-col justify-center flex-1">
                      <div className="text-[10px] font-black text-blue-600 mb-1 tracking-wider uppercase">
                        {ev.triggerReason}
                      </div>
                      <p className="text-sm text-gray-900 font-bold leading-tight mb-2">{ev.message}</p>
                      {ev.oldPrice && ev.newPrice && (
                        <div className="flex items-center gap-2 bg-green-50 self-start px-2 py-1 rounded-md border border-green-100">
                          <span className="text-sm font-black text-green-700">₹{ev.newPrice.toLocaleString()}</span>
                          <span className="text-xs font-bold text-gray-400 line-through">₹{ev.oldPrice.toLocaleString()}</span>
                        </div>
                      )}
                    </div>
                  </div>
                </Link>
              );
            })}
          </div>
        </div>
      )}

      <div className="p-4 space-y-8 flex-1">
        {items.length === 0 ? (
          <div className="flex flex-col items-center justify-center mt-12 px-4 text-center">
            <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Info className="text-gray-400" size={24} />
            </div>
            <p className="text-lg font-black tracking-tight mb-2 text-gray-900">Your Memory is empty</p>
            <p className="text-sm text-gray-500 mb-8 leading-relaxed font-medium">Save something you're considering and TryBuy will remember why.</p>
            <Link to="/" className="inline-block px-8 py-4 bg-gray-900 text-white rounded-xl font-bold active:scale-95 transition-transform shadow-xl shadow-gray-900/20">
              Discover Products
            </Link>
          </div>
        ) : (
          sortedIntentGroups.map(([intent, groupItems]) => {
            const isUncategorized = intent === 'UNCATEGORIZED';
            const header = isUncategorized 
              ? { title: 'Saved without context', icon: '📌', desc: 'You skipped providing a reason', text: '' }
              : INTENT_HEADERS[intent];

            if (!header) return null;

            return (
              <section key={intent} className="space-y-4 animate-fade-in">
                <div className="flex items-baseline gap-2 px-1">
                  <span className="text-lg">{header.icon}</span>
                  <div>
                    <h2 className="text-lg font-black text-gray-900 tracking-tight leading-tight">{header.title}</h2>
                    <p className="text-xs text-gray-500 font-medium mt-0.5">{header.desc}</p>
                  </div>
                </div>
                
                <div className="space-y-3">
                  {groupItems.map((item) => {
                    const product = mockProducts.find(p => p.id === item.productId);
                    if (!product) return null;
                    
                    return (
                      <Link 
                        to={`/product/${product.id}`} 
                        key={product.id} 
                        onClick={() => analytics.track('saved_product_revisited', { productId: product.id })}
                        className="flex gap-4 bg-white p-3 rounded-2xl shadow-sm border border-gray-100 active:scale-[0.98] transition-transform relative group"
                      >
                        <div className="w-20 h-28 rounded-xl bg-gray-50 relative overflow-hidden shrink-0 border border-gray-50">
                          <img src={product.imageUrl} alt={product.title} className="w-full h-full object-cover" loading="lazy" />
                        </div>
                        <div className="flex flex-col py-1 pr-10 flex-1">
                          <h3 className="font-bold text-gray-900 text-sm tracking-tight">{product.brand}</h3>
                          <p className="text-xs text-gray-500 truncate mb-1 font-medium">{product.title}</p>
                          <div className="font-black text-sm text-gray-900 mb-auto">₹{product.price.toLocaleString()}</div>
                          
                          <div className="mt-3 space-y-1.5">
                            <div className="flex items-center gap-1.5 text-[10px] text-gray-400 font-bold uppercase tracking-wider">
                              <Clock size={12} />
                              {formatTimeAgo(item.savedAt)}
                            </div>
                            {!isUncategorized && (
                              <div className="pt-2 border-t border-gray-50">
                                <p className="text-xs font-bold text-gray-700">
                                  "{header.text}"
                                </p>
                              </div>
                            )}
                          </div>
                        </div>

                        <button 
                          onClick={(e) => handleUnsave(e, product.id)}
                          aria-label="Remove from memory"
                          className="absolute top-2 right-2 p-3 bg-transparent hover:bg-gray-50 rounded-full active:scale-90 transition-colors"
                        >
                          <Heart className="fill-red-500 text-red-500" size={18} />
                        </button>
                      </Link>
                    );
                  })}
                </div>
              </section>
            );
          })
        )}
      </div>
    </div>
  );
};
