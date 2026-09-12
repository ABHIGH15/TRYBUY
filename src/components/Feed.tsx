import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { mockProducts } from '../store/data';
import { useProductStore } from '../store/productStore';
import { useExperimentStore } from '../store/experimentStore';
import { analytics } from '../analytics';
import { useToastStore } from '../store/toastStore';
import { Heart } from 'lucide-react';
import { useBagStore } from '../store/bagStore';
import { SmartSaveModal } from './SmartSaveModal';

export const Feed: React.FC = () => {
  const { savedItems, saveProduct, unsaveProduct } = useProductStore();
  const { variant, removeSimulatedEvent } = useExperimentStore();
  const { showToast } = useToastStore();
  const { addItem } = useBagStore();
  const [modalProductId, setModalProductId] = useState<string | null>(null);

  useEffect(() => {
    analytics.track('product_viewed', { source: 'feed', count: mockProducts.length });
  }, []);

  const handleSaveToggle = (e: React.MouseEvent, productId: string) => {
    e.preventDefault(); 
    e.stopPropagation();

    const isSaved = !!savedItems[productId];
    
    if (isSaved) {
      analytics.track('save_clicked', { productId, action: 'unsave', source: 'feed' });
      unsaveProduct(productId);
      removeSimulatedEvent(productId);
    } else {
      analytics.track('save_clicked', { productId, action: 'save', source: 'feed' });
      saveProduct(productId);
      
      if (variant === 'treatment') {
        analytics.track('intent_prompt_shown', { productId, source: 'feed' });
        setModalProductId(productId);
      } else {
        showToast('Saved');
      }
    }
  };

  const handleAddToBag = (e: React.MouseEvent, productId: string) => {
    e.preventDefault();
    e.stopPropagation();
    analytics.track('bag_item_added', { productId, source: 'feed' });
    addItem(productId);
    showToast('Added to bag');
  };

  const ProductCard = ({ product }: { product: typeof mockProducts[0] }) => {
    const isSaved = !!savedItems[product.id];
    const discount = product.originalPrice > product.price 
      ? Math.round((1 - product.price / product.originalPrice) * 100) 
      : 0;

    return (
      <Link 
        to={`/product/${product.id}`} 
        className="block group"
      >
        <div className="relative aspect-[4/5] bg-gray-50 rounded-2xl overflow-hidden mb-3">
          <img 
            src={product.imageUrl} 
            alt={product.title} 
            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
            loading="lazy"
          />
          <button 
            onClick={(e) => handleSaveToggle(e, product.id)}
            aria-label={isSaved ? "Remove from saved items" : "Save product for later"}
            className="absolute top-3 right-3 p-2 bg-white/95 backdrop-blur-sm rounded-full shadow-sm active:scale-[0.8] transition-transform duration-200 hover:bg-white"
          >
            <Heart 
              className={`transition-colors duration-200 ${isSaved ? "fill-red-500 text-red-500" : "text-gray-900"}`} 
              size={18} 
            />
          </button>
        </div>
        <div className="px-1 flex flex-col h-full">
          <div className="flex justify-between items-start mb-2">
            <div className="flex-1 pr-2">
              <h3 className="font-bold text-gray-900 text-sm truncate">{product.brand}</h3>
              <p className="text-gray-500 text-xs mt-0.5 line-clamp-1">{product.title}</p>
            </div>
            <div className="text-right flex flex-col items-end shrink-0">
              <span className="font-bold text-sm text-gray-900">₹{product.price.toLocaleString()}</span>
              {discount > 0 && (
                <span className="text-[10px] font-bold text-red-500 mt-0.5">{discount}% OFF</span>
              )}
            </div>
          </div>
          <button 
            onClick={(e) => handleAddToBag(e, product.id)}
            className="mt-auto w-full py-2 bg-gray-100 text-gray-900 text-xs font-bold rounded-lg hover:bg-gray-200 active:scale-95 transition-all"
          >
            Add to Bag
          </button>
        </div>
      </Link>
    );
  };

  const trending = mockProducts.slice(0, 4);
  const secondLook = mockProducts.slice(4, 12);
  const basics = mockProducts.slice(12, 24);

  return (
    <div className="pb-20 max-w-md mx-auto min-h-screen bg-white">
      <header className="sticky top-0 z-10 bg-white/80 backdrop-blur-md border-b border-gray-100 px-4 py-4 flex items-center justify-between">
        <h1 className="font-black text-2xl tracking-tighter">TRYBUY</h1>
      </header>

      <div className="p-4 space-y-12">
        <section>
          <h2 className="font-black text-xl mb-4 tracking-tight">Trending Now</h2>
          <div className="grid grid-cols-2 gap-4">
            {trending.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        </section>

        <section>
          <h2 className="font-black text-xl mb-4 tracking-tight">Worth a second look</h2>
          <div className="flex gap-4 overflow-x-auto pb-4 -mx-4 px-4 snap-x hide-scrollbar">
            {secondLook.map((product) => (
              <div key={product.id} className="w-48 shrink-0 snap-start">
                <ProductCard product={product} />
              </div>
            ))}
          </div>
        </section>

        <section>
          <h2 className="font-black text-xl mb-4 tracking-tight">For your next look</h2>
          <div className="grid grid-cols-2 gap-4">
            {basics.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        </section>
      </div>

      <SmartSaveModal 
        productId={modalProductId!} 
        isOpen={!!modalProductId} 
        onClose={() => setModalProductId(null)} 
      />
    </div>
  );
};
