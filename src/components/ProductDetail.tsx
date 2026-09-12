import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { mockProducts } from '../store/data';
import { useProductStore } from '../store/productStore';
import { useExperimentStore } from '../store/experimentStore';
import { analytics } from '../analytics';
import { Heart, ChevronLeft, Share } from 'lucide-react';
import { SmartSaveModal } from './SmartSaveModal';
import { useToastStore } from '../store/toastStore';
import { useBagStore } from '../store/bagStore';

export const ProductDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const product = mockProducts.find(p => p.id === id);
  
  const { savedItems, saveProduct, unsaveProduct } = useProductStore();
  const { variant, removeSimulatedEvent } = useExperimentStore();
  const { showToast } = useToastStore();
  const { addItem } = useBagStore();
  const [modalProductId, setModalProductId] = useState<string | null>(null);

  useEffect(() => {
    if (product) {
      analytics.track('product_viewed', { productId: product.id, source: 'pdp' });
    }
  }, [product]);

  if (!product) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen p-4 bg-gray-50">
        <p className="text-gray-500 mb-4">Product not found.</p>
        <button onClick={() => navigate('/')} className="px-4 py-2 bg-gray-900 text-white rounded-lg font-bold">
          Back to Discover
        </button>
      </div>
    );
  }

  const isSaved = !!savedItems[product.id];
  const discount = product.originalPrice > product.price 
    ? Math.round((1 - product.price / product.originalPrice) * 100) 
    : 0;

  const handleSaveToggle = () => {
    if (isSaved) {
      analytics.track('save_clicked', { productId: product.id, action: 'unsave', source: 'pdp' });
      unsaveProduct(product.id);
      removeSimulatedEvent(product.id);
    } else {
      analytics.track('save_clicked', { productId: product.id, action: 'save', source: 'pdp' });
      saveProduct(product.id);
      
      if (variant === 'treatment') {
        analytics.track('intent_prompt_shown', { productId: product.id, source: 'pdp' });
        setModalProductId(product.id);
      } else {
        showToast('Saved');
      }
    }
  };

  return (
    <div className="bg-white min-h-screen pb-32 flex flex-col font-sans">
      <header className="sticky top-0 z-10 bg-white/90 backdrop-blur-md border-b border-gray-100 px-4 py-4 flex items-center justify-between">
        <button 
          onClick={() => navigate(-1)}
          className="p-2 -ml-2 rounded-full hover:bg-gray-100 active:scale-95 transition-all text-gray-900"
          aria-label="Go back"
        >
          <ChevronLeft size={24} />
        </button>
        <button 
          className="p-2 -mr-2 rounded-full hover:bg-gray-100 active:scale-95 transition-all text-gray-900"
          aria-label="Share product"
        >
          <Share size={20} />
        </button>
      </header>

      <div className="aspect-[4/5] w-full bg-gray-50 relative shrink-0">
        <img 
          src={product.imageUrl} 
          alt={product.title} 
          className="w-full h-full object-cover"
        />
      </div>

      <div className="p-5 flex-1">
        <div className="mb-2">
          <h1 className="text-2xl font-black text-gray-900 tracking-tight leading-none mb-1.5">{product.brand}</h1>
          <p className="text-gray-500 text-sm font-medium">{product.title}</p>
        </div>

        <div className="flex items-end gap-3 mt-5 mb-8">
          <span className="text-3xl font-black text-gray-900 tracking-tight">₹{product.price.toLocaleString()}</span>
          {discount > 0 && (
            <>
              <span className="text-sm font-bold text-gray-400 line-through mb-1.5">₹{product.originalPrice.toLocaleString()}</span>
              <span className="text-[10px] font-bold text-red-600 mb-2 px-2 py-1 bg-red-50 rounded uppercase tracking-wider">{discount}% off</span>
            </>
          )}
        </div>

        <div className="space-y-6">
          <div>
            <h2 className="text-xs font-bold text-gray-900 uppercase tracking-widest mb-3">Product Details</h2>
            <p className="text-sm text-gray-600 leading-relaxed font-medium">
              {product.description}
            </p>
          </div>
          
          <div className="border-t border-gray-100 pt-6">
            <ul className="text-sm text-gray-500 space-y-3 font-medium">
              <li className="flex gap-2 items-start"><span className="text-gray-900 font-bold w-24 shrink-0">Material</span> Premium construction</li>
              <li className="flex gap-2 items-start"><span className="text-gray-900 font-bold w-24 shrink-0">Care</span> Handle with care. Reference internal label for instructions.</li>
              <li className="flex gap-2 items-start"><span className="text-gray-900 font-bold w-24 shrink-0">Origin</span> Imported</li>
            </ul>
          </div>
        </div>
      </div>

      <div className="fixed bottom-0 w-full max-w-md mx-auto bg-white/90 backdrop-blur-md border-t border-gray-200 p-4 pb-8 flex gap-3 z-40">
        <button 
          onClick={handleSaveToggle}
          aria-label={isSaved ? "Remove from saved items" : "Save product for later"}
          className={`flex-[0.4] flex items-center justify-center gap-2 py-4 rounded-2xl font-bold active:scale-[0.98] transition-all duration-200 ${
            isSaved 
              ? 'bg-red-50 text-red-600 border border-red-100' 
              : 'bg-white text-gray-900 border border-gray-200 hover:bg-gray-50'
          }`}
        >
          <Heart className={`transition-colors duration-200 ${isSaved ? "fill-red-500" : ""}`} size={20} />
          {isSaved ? 'Saved' : 'Save'}
        </button>
        <button 
          onClick={() => {
            analytics.track('bag_item_added', { productId: product.id, source: 'pdp' });
            addItem(product.id);
            showToast('Added to bag');
          }}
          className="flex-1 py-4 bg-gray-900 text-white rounded-2xl font-bold hover:bg-gray-800 active:scale-[0.98] transition-all shadow-xl shadow-gray-900/20"
        >
          Add to Bag
        </button>
      </div>

      <SmartSaveModal 
        productId={modalProductId!} 
        isOpen={!!modalProductId} 
        onClose={() => setModalProductId(null)} 
      />
    </div>
  );
};
