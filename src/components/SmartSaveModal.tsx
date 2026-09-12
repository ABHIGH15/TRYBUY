import React, { useEffect, useState } from 'react';
import { useProductStore } from '../store/productStore';
import type { IntentType } from '../store/productStore';
import { analytics } from '../analytics';
import { useToastStore } from '../store/toastStore';

interface SmartSaveModalProps {
  productId: string;
  isOpen: boolean;
  onClose: () => void;
}

const INTENT_OPTIONS: { id: IntentType; label: string }[] = [
  { id: 'PRICE_WATCH', label: 'Waiting for a price drop' },
  { id: 'COMPARING', label: 'Comparing with others' },
  { id: 'BUYING_LATER', label: 'Buying it later' },
  { id: 'EXPLORING', label: 'Just exploring' },
];

export const SmartSaveModal: React.FC<SmartSaveModalProps> = ({ productId, isOpen, onClose }) => {
  const { updateIntent } = useProductStore();
  const { showToast } = useToastStore();
  const [isRendered, setIsRendered] = useState(isOpen);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    if (isOpen) {
      setIsRendered(true);
      // Small delay ensures DOM is painted before we add visibility classes for animation
      const timer = setTimeout(() => setIsVisible(true), 10);
      return () => clearTimeout(timer);
    } else {
      setIsVisible(false);
      const timer = setTimeout(() => setIsRendered(false), 300);
      return () => clearTimeout(timer);
    }
  }, [isOpen]);

  // Handle escape key
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        handleSkip();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen]);

  if (!isRendered) return null;

  const handleSelect = (intent: IntentType) => {
    updateIntent(productId, intent);
    analytics.track('intent_selected', { productId, intent });
    showToast('Got it. We\'ll remember.');
    onClose();
  };

  const handleSkip = () => {
    analytics.track('intent_skipped', { productId });
    showToast('Saved');
    onClose();
  };
  
  const handleBackdropClick = () => {
    handleSkip(); // Clicking outside skips gracefully
  };

  return (
    <div 
      className="fixed inset-0 z-50 flex items-end justify-center sm:items-center p-0 sm:p-4"
      onClick={handleBackdropClick}
      role="dialog"
      aria-modal="true"
      aria-labelledby="modal-title"
    >
      {/* Backdrop */}
      <div 
        className={`absolute inset-0 bg-gray-900/40 backdrop-blur-sm transition-opacity duration-300 ${isVisible ? 'opacity-100' : 'opacity-0'}`} 
      />

      {/* Bottom Sheet / Modal */}
      <div 
        className={`bg-white w-full max-w-sm rounded-t-3xl sm:rounded-3xl p-6 shadow-2xl relative z-10 transition-all duration-300 ease-out transform ${isVisible ? 'translate-y-0 opacity-100 scale-100' : 'translate-y-full opacity-0 sm:translate-y-8 sm:scale-95'}`}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="mb-6 text-center sm:text-left">
          <div className="w-12 h-1.5 bg-gray-200 rounded-full mx-auto mb-5 sm:hidden"></div>
          <h3 id="modal-title" className="text-xl font-black text-gray-900 tracking-tight">
            <span className="text-gray-400 block text-[10px] font-black mb-1.5 uppercase tracking-widest">Saved</span>
            What are you waiting for?
          </h3>
          <p className="text-sm text-gray-500 font-medium mt-2 leading-relaxed">
            Tell TryBuy what matters to you — we'll remember it for later.
          </p>
        </div>
        
        <div className="space-y-3">
          {INTENT_OPTIONS.map((opt) => (
            <button
              key={opt.id}
              onClick={() => handleSelect(opt.id)}
              className="w-full flex items-center p-4 text-left border-2 border-gray-100 rounded-2xl hover:border-gray-900 focus:border-gray-900 focus:outline-none focus:ring-4 focus:ring-gray-100 bg-white transition-all active:scale-[0.98]"
            >
              <span className="font-bold text-gray-900">{opt.label}</span>
            </button>
          ))}
        </div>
        
        <button 
          onClick={handleSkip}
          className="w-full mt-4 py-4 text-sm font-bold text-gray-500 hover:text-gray-900 transition-colors focus:outline-none focus:underline"
        >
          Skip for now
        </button>
      </div>
    </div>
  );
};
