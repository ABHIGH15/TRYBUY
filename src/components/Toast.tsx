import React from 'react';
import { useToastStore } from '../store/toastStore';

export const Toast: React.FC = () => {
  const { message, action, hideToast } = useToastStore();

  if (!message) return null;

  return (
    <div className="fixed bottom-24 left-0 right-0 z-50 flex justify-center px-4">
      <div className="bg-gray-900/90 backdrop-blur-md text-white text-sm font-medium px-5 py-3 rounded-xl shadow-xl animate-in fade-in slide-in-from-bottom-4 duration-300 flex items-center gap-4 max-w-sm w-full mx-auto justify-between">
        <span className="truncate">{message}</span>
        {action && (
          <button 
            onClick={() => {
              action.onClick();
              hideToast();
            }}
            className="text-orange-300 font-bold uppercase tracking-wider text-xs hover:text-orange-200 whitespace-nowrap flex-shrink-0 px-2 py-1 bg-white/10 rounded-md active:bg-white/20 transition-colors"
          >
            {action.label}
          </button>
        )}
      </div>
    </div>
  );
};
