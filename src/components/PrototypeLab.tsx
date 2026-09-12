import React, { useState } from 'react';
import { useExperimentStore } from '../store/experimentStore';
import { useProductStore } from '../store/productStore';
import { mockProducts } from '../store/data';
import { analytics } from '../analytics';
import { FlaskConical, Zap, RefreshCw, Activity } from 'lucide-react';

import { useToastStore } from '../store/toastStore';

export const PrototypeLab: React.FC = () => {
  const { triggerSimulatedEvent, resetExperiment } = useExperimentStore();
  const { savedItems, resetProducts } = useProductStore();
  const { showToast } = useToastStore();
  const [showEvents, setShowEvents] = useState(false);
  const [selectedProductId, setSelectedProductId] = useState<string | null>(null);

  const handleSimulateForProduct = (productId: string) => {
    const savedItem = savedItems[productId];
    if (!savedItem) return;
    
    const product = mockProducts.find(p => p.id === productId);
    if (!product) return;

    if (savedItem.intent === 'PRICE_WATCH') {
      triggerSimulatedEvent({
        type: 'PRICE_DROP',
        productId: product.id,
        triggerReason: 'Because you were waiting for a price drop',
        message: `The ${product.title} is now cheaper.`,
        oldPrice: product.price,
        newPrice: Math.floor(product.price * 0.75),
        timestamp: Date.now()
      });
      analytics.track('purchase_simulated', { type: 'PRICE_DROP', productId: product.id });
      showToast('Simulated: Price Drop Alert');
    } else if (savedItem.intent === 'COMPARING') {
      triggerSimulatedEvent({
        type: 'ALTERNATIVE_FOUND',
        productId: product.id,
        triggerReason: 'Because you were comparing options',
        message: `An alternative to the ${product.brand} ${product.title} is trending.`,
        timestamp: Date.now()
      });
      analytics.track('purchase_simulated', { type: 'ALTERNATIVE_FOUND', productId: product.id });
      showToast('Simulated: Comparison Alert');
    } else if (savedItem.intent === 'BUYING_LATER') {
      triggerSimulatedEvent({
        type: 'TIMING_NUDGE',
        productId: product.id,
        triggerReason: 'Because you need this for later',
        message: `Your occasion is approaching. Ready to buy the ${product.title}?`,
        timestamp: Date.now()
      });
      analytics.track('purchase_simulated', { type: 'TIMING_NUDGE', productId: product.id });
      showToast('Simulated: Occasion Nudge');
    } else if (savedItem.intent === 'EXPLORING') {
      alert("This item is marked 'Just Exploring'. TryBuy intentionally suppresses notifications for low-intent items to prevent noise.");
    } else {
      alert("This item was saved without context. No specific re-engagement rule exists.");
    }
    
    setSelectedProductId(null);
  };

  const handleReset = () => {
    if(confirm("Reset all prototype state?")) {
      resetExperiment();
      resetProducts();
      analytics.clearEvents();
      window.location.reload();
    }
  };

  const events = analytics.getEvents();
  const savedItemsList = Object.values(savedItems);

  return (
    <div className="pb-20 max-w-md mx-auto min-h-screen bg-gray-900 text-gray-100 p-4 font-mono text-sm">
      <div className="bg-yellow-500 text-black font-black uppercase text-xs text-center py-2 -mx-4 -mt-4 mb-6 tracking-widest flex items-center justify-center gap-2">
        <span>🚧</span> Internal Demo / Experiment Tool <span>🚧</span>
      </div>
      
      <header className="mb-6 border-b border-gray-700 pb-4">
        <h1 className="text-xl font-bold flex items-center gap-2 text-green-400">
          <FlaskConical size={20} /> Prototype Lab
        </h1>
        <p className="text-gray-400 text-xs mt-1">Internal demo tools. Not real-world data.</p>
      </header>

      <div className="space-y-6">
        {/* Re-engagement Simulator */}
        <div className="bg-gray-800 p-4 rounded-lg border border-gray-700">
          <h2 className="font-bold mb-3 uppercase tracking-wider text-xs text-gray-400">Contextual Re-engagement Simulator</h2>
          <p className="text-xs text-gray-500 mb-4">Select a saved product to trigger its intent-specific event.</p>
          
          {savedItemsList.length === 0 ? (
            <div className="text-center p-4 border border-dashed border-gray-700 rounded text-gray-500">
              No saved items. Save an item first.
            </div>
          ) : (
            <div className="space-y-2 max-h-60 overflow-y-auto pr-1">
              {savedItemsList.map(item => {
                const p = mockProducts.find(prod => prod.id === item.productId);
                if (!p) return null;
                const isSelected = selectedProductId === p.id;
                
                return (
                  <div key={p.id} className="bg-gray-700 rounded border border-gray-600 overflow-hidden">
                    <div 
                      className={`p-3 flex justify-between items-center cursor-pointer hover:bg-gray-600 ${isSelected ? 'bg-gray-600' : ''}`}
                      onClick={() => setSelectedProductId(isSelected ? null : p.id)}
                    >
                      <div className="flex items-center gap-3">
                        <img src={p.imageUrl} className="w-8 h-10 object-cover rounded" />
                        <div>
                          <div className="font-bold text-gray-200 line-clamp-1">{p.brand} {p.title}</div>
                          <div className="text-xs text-green-400">Intent: {item.intent || 'NONE'}</div>
                        </div>
                      </div>
                      <span className="text-gray-400">{isSelected ? '▼' : '▶'}</span>
                    </div>
                    
                    {isSelected && (
                      <div className="p-3 bg-gray-900 border-t border-gray-600">
                        <button 
                          onClick={() => handleSimulateForProduct(p.id)}
                          className="w-full flex items-center justify-center gap-2 bg-green-700 hover:bg-green-600 py-2 rounded transition-colors text-white font-bold"
                        >
                          <Zap size={16} /> 
                          {item.intent === 'EXPLORING' ? 'Try Triggering Event' : 'Trigger Contextual Event'}
                        </button>
                        {item.intent === 'EXPLORING' && (
                          <p className="text-[10px] text-gray-500 mt-2 text-center">Spoiler: This will be blocked intentionally.</p>
                        )}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Danger Zone */}
        <div className="bg-gray-800 p-4 rounded-lg border border-gray-700">
          <button 
            onClick={handleReset}
            className="w-full flex items-center justify-center gap-2 text-red-400 border border-red-900 bg-red-900/20 hover:bg-red-900/40 py-2 rounded transition-colors"
          >
            <RefreshCw size={16} /> Reset All Data
          </button>
        </div>

        {/* Analytics Inspector */}
        <div className="bg-gray-800 p-4 rounded-lg border border-gray-700">
           <button 
            onClick={() => setShowEvents(!showEvents)}
            className="w-full flex items-center justify-between font-bold text-gray-300 py-2"
          >
            <span className="flex items-center gap-2"><Activity size={16} /> Event Log ({events.length})</span>
            <span>{showEvents ? '▼' : '▶'}</span>
          </button>
          
          {showEvents && (
            <div className="mt-3 space-y-2 max-h-60 overflow-y-auto">
              {events.slice().reverse().map((ev: any, i) => (
                <div key={i} className="text-xs bg-gray-900 p-2 rounded text-green-300 break-all">
                  <span className="text-gray-500">{new Date(ev.timestamp).toLocaleTimeString()}</span>{' '}
                  <span className="font-bold text-blue-300">{ev.eventName}</span>{' '}
                  {ev.properties && <span className="text-gray-400">{JSON.stringify(ev.properties)}</span>}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
