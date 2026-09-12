import React from 'react';
import { useToastStore } from '../store/toastStore';

export const Toast: React.FC = () => {
  const { message } = useToastStore();

  if (!message) return null;

  return (
    <div className="fixed bottom-24 left-0 right-0 z-50 flex justify-center pointer-events-none px-4">
      <div className="bg-gray-900/90 backdrop-blur-md text-white text-sm font-bold px-6 py-3 rounded-full shadow-lg animate-slide-up text-center max-w-sm">
        {message}
      </div>
    </div>
  );
};
