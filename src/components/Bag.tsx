import React, { useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ShoppingBag, ChevronLeft, Minus, Plus, Trash2 } from 'lucide-react';
import { useBagStore } from '../store/bagStore';
import { mockProducts } from '../store/data';
import { useToastStore } from '../store/toastStore';
import { analytics } from '../analytics';

export const Bag: React.FC = () => {
  const navigate = useNavigate();
  const { items, updateQuantity, removeItem } = useBagStore();
  const { showToast } = useToastStore();

  useEffect(() => {
    analytics.track('bag_viewed');
  }, []);

  const bagItems = items.map(item => {
    const product = mockProducts.find(p => p.id === item.productId);
    return { ...item, product };
  }).filter(item => item.product !== undefined);

  const subtotal = bagItems.reduce((acc, item) => acc + (item.product!.price * item.quantity), 0);

  const handleRemove = (productId: string) => {
    analytics.track('bag_item_removed', { productId });
    removeItem(productId);
  };

  const handleQuantity = (productId: string, newQuantity: number) => {
    if (newQuantity <= 0) {
      handleRemove(productId);
      return;
    }
    analytics.track('bag_quantity_changed', { productId, quantity: newQuantity });
    updateQuantity(productId, newQuantity);
  };

  const handleCheckout = () => {
    analytics.track('checkout_attempted', { subtotal, itemCount: items.length });
    showToast('Checkout isn\'t available in this prototype.');
  };

  return (
    <div className="pb-20 max-w-md mx-auto min-h-screen bg-gray-50 flex flex-col font-sans">
      <header className="sticky top-0 z-10 bg-white/80 backdrop-blur-md border-b border-gray-100 px-4 py-4 flex items-center justify-between">
        <button 
          onClick={() => navigate(-1)}
          className="p-2 -ml-2 rounded-full hover:bg-gray-100 active:scale-95 transition-all text-gray-900"
        >
          <ChevronLeft size={24} />
        </button>
        <h1 className="font-black text-xl tracking-tight text-gray-900">Shopping Bag</h1>
        <div className="w-10"></div>
      </header>

      {bagItems.length === 0 ? (
        <div className="flex-1 flex flex-col items-center justify-center p-8 text-center text-gray-500 mt-12">
          <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-5">
            <ShoppingBag size={32} className="text-gray-400 stroke-2" />
          </div>
          <h2 className="text-xl font-black text-gray-900 mb-2 tracking-tight">Your bag is empty</h2>
          <p className="mb-8 font-medium text-gray-500">Looks like you haven't added anything to your bag yet.</p>
          <Link 
            to="/"
            className="px-8 py-4 bg-gray-900 text-white rounded-xl font-bold active:scale-95 transition-transform shadow-xl shadow-gray-900/20"
          >
            Start Shopping
          </Link>
        </div>
      ) : (
        <>
          <div className="flex-1 p-4 space-y-4">
            {bagItems.map((item) => (
              <div key={item.productId} className="flex gap-4 bg-white p-3 rounded-2xl shadow-sm border border-gray-100 relative group">
                <Link to={`/product/${item.productId}`} className="w-24 h-32 rounded-xl bg-gray-50 overflow-hidden shrink-0 border border-gray-50">
                  <img src={item.product!.imageUrl} alt={item.product!.title} className="w-full h-full object-cover" />
                </Link>
                <div className="flex flex-col justify-between flex-1 py-1 pr-6">
                  <div>
                    <h3 className="font-bold text-gray-900 text-sm tracking-tight line-clamp-2 mb-0.5 pr-2">{item.product!.brand}</h3>
                    <p className="text-xs text-gray-500 font-medium truncate">{item.product!.title}</p>
                  </div>
                  
                  <div className="flex items-end justify-between mt-auto">
                    <p className="font-black text-sm text-gray-900">₹{item.product!.price.toLocaleString()}</p>
                    <div className="flex items-center gap-3 bg-gray-50 rounded-full px-1.5 py-1.5 border border-gray-100">
                      <button 
                        onClick={() => handleQuantity(item.productId, item.quantity - 1)}
                        className="w-7 h-7 flex items-center justify-center rounded-full hover:bg-white hover:shadow-sm transition-all active:scale-90 text-gray-600"
                        aria-label="Decrease quantity"
                      >
                        <Minus size={14} strokeWidth={3} />
                      </button>
                      <span className="text-xs font-bold w-4 text-center text-gray-900">{item.quantity}</span>
                      <button 
                        onClick={() => handleQuantity(item.productId, item.quantity + 1)}
                        className="w-7 h-7 flex items-center justify-center rounded-full hover:bg-white hover:shadow-sm transition-all active:scale-90 text-gray-600"
                        aria-label="Increase quantity"
                      >
                        <Plus size={14} strokeWidth={3} />
                      </button>
                    </div>
                  </div>
                </div>

                <button 
                  onClick={() => handleRemove(item.productId)}
                  className="absolute top-2 right-2 p-3 text-gray-400 hover:text-red-500 bg-transparent hover:bg-gray-50 rounded-full active:scale-90 transition-colors"
                  aria-label="Remove item"
                >
                  <Trash2 size={18} />
                </button>
              </div>
            ))}
          </div>

          <div className="p-4 bg-white/90 backdrop-blur-md border-t border-gray-200 shadow-[0_-10px_20px_-10px_rgba(0,0,0,0.05)] sticky bottom-0">
            <div className="flex justify-between mb-2 text-sm text-gray-500 font-bold">
              <span>Subtotal</span>
              <span className="text-gray-900">₹{subtotal.toLocaleString()}</span>
            </div>
            <div className="flex justify-between mb-4 text-sm text-gray-500 font-bold">
              <span>Shipping</span>
              <span className="text-gray-900">Calculated at checkout</span>
            </div>
            <div className="flex justify-between mb-6 text-xl font-black text-gray-900">
              <span>Total</span>
              <span>₹{subtotal.toLocaleString()}</span>
            </div>
            <button 
              onClick={handleCheckout}
              className="w-full py-4 bg-gray-900 text-white rounded-2xl font-bold hover:bg-gray-800 active:scale-[0.98] transition-all shadow-xl shadow-gray-900/20 mb-2"
            >
              Proceed to Checkout
            </button>
          </div>
        </>
      )}
    </div>
  );
};
