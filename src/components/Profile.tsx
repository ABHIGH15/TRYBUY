import React, { useEffect } from 'react';
import { Trash2, ShoppingBag, Heart, Info, Download } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useProductStore } from '../store/productStore';
import { useBagStore } from '../store/bagStore';
import { useExperimentStore } from '../store/experimentStore';
import { analytics } from '../analytics';


export const Profile: React.FC = () => {
  const { savedItems, resetProducts } = useProductStore();
  const { items: bagItems, clearBag } = useBagStore();
  const { variant, setVariant, resetExperiment } = useExperimentStore();

  useEffect(() => {
    analytics.track('profile_viewed');
  }, []);

  const handleExport = () => {
    const events = analytics.getEvents();
    const blob = new Blob([JSON.stringify(events, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `trybuy_session_${Date.now()}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleReset = () => {
    if (window.confirm("Are you sure you want to reset all your TryBuy data? This will clear your memory and bag.")) {
      analytics.track('prototype_data_reset');
      
      resetProducts();
      clearBag();
      resetExperiment();
      analytics.clearEvents();
      
      window.location.href = '/';
    }
  };

  const savedCount = Object.keys(savedItems).length;
  const bagCount = bagItems.length;

  return (
    <div className="pb-20 max-w-md mx-auto min-h-screen bg-gray-50 flex flex-col font-sans">
      <header className="sticky top-0 z-10 bg-white/80 backdrop-blur-md border-b border-gray-100 px-4 py-4 flex items-center">
        <h1 className="font-black text-xl tracking-tight text-gray-900 ml-1">Profile</h1>
      </header>

      <div className="p-4 space-y-6">
        {/* Your TRYBUY */}
        <section className="space-y-3">
          <h2 className="text-xs font-bold text-gray-400 uppercase tracking-widest ml-1">Your TryBuy</h2>
          
          <div className="flex gap-3">
            <Link to="/memory" className="flex-1 bg-white p-4 rounded-2xl shadow-sm border border-gray-100 active:scale-95 transition-transform group">
              <div className="flex items-center gap-2 mb-2">
                <Heart size={16} className="text-gray-400 group-hover:text-red-500 transition-colors" />
                <span className="text-xs font-bold text-gray-500 uppercase tracking-wide">Saved</span>
              </div>
              <span className="text-3xl font-black text-gray-900 block">{savedCount}</span>
            </Link>

            <Link to="/bag" className="flex-1 bg-white p-4 rounded-2xl shadow-sm border border-gray-100 active:scale-95 transition-transform group">
              <div className="flex items-center gap-2 mb-2">
                <ShoppingBag size={16} className="text-gray-400 group-hover:text-blue-500 transition-colors" />
                <span className="text-xs font-bold text-gray-500 uppercase tracking-wide">In Bag</span>
              </div>
              <span className="text-3xl font-black text-gray-900 block">{bagCount}</span>
            </Link>
          </div>
        </section>

        {/* About */}
        <section className="bg-white p-5 rounded-2xl shadow-sm border border-gray-100">
          <div className="flex items-center gap-2 mb-3 text-gray-900">
            <Info size={18} />
            <h2 className="font-bold text-sm tracking-tight">About TRYBUY</h2>
          </div>
          <p className="text-sm text-gray-600 leading-relaxed font-medium">
            TRYBUY remembers what you liked — and why you weren't ready to buy.
          </p>
        </section>

        {/* Prototype Controls */}
        <section className="pt-4 space-y-6">
          <div className="space-y-3">
            <h2 className="text-xs font-bold text-gray-400 uppercase tracking-widest ml-1">Testing Controls</h2>
            
            {/* Experiment Arm Selector */}
            <div className="bg-white p-4 rounded-2xl shadow-sm border border-gray-100 space-y-3">
              <div className="text-sm font-bold text-gray-900">Experiment Arm</div>
              <div className="flex gap-2">
                <button 
                  onClick={() => setVariant('control')}
                  className={`flex-1 py-2.5 rounded-xl font-bold transition-all text-sm ${variant === 'control' ? 'bg-blue-600 text-white shadow-md shadow-blue-600/20' : 'bg-gray-50 text-gray-500 hover:bg-gray-100'}`}
                >
                  Control (No Save Modal)
                </button>
                <button 
                  onClick={() => setVariant('treatment')}
                  className={`flex-1 py-2.5 rounded-xl font-bold transition-all text-sm ${variant === 'treatment' ? 'bg-purple-600 text-white shadow-md shadow-purple-600/20' : 'bg-gray-50 text-gray-500 hover:bg-gray-100'}`}
                >
                  Treatment (Smart Save)
                </button>
              </div>
            </div>

            {/* Export & Reset */}
            <div className="grid grid-cols-2 gap-3">
              <button 
                onClick={handleExport}
                className="flex flex-col items-center justify-center gap-1.5 py-4 bg-white border border-gray-200 text-gray-900 rounded-xl font-bold active:scale-95 transition-all shadow-sm"
              >
                <Download size={18} className="text-blue-600" />
                <span className="text-xs">Export Analytics</span>
              </button>

              <button 
                onClick={handleReset}
                className="flex flex-col items-center justify-center gap-1.5 py-4 bg-red-50 border border-red-100 text-red-600 rounded-xl font-bold active:scale-95 transition-all shadow-sm"
              >
                <Trash2 size={18} />
                <span className="text-xs">Reset All Data</span>
              </button>
            </div>
            
            <Link 
              to="/internal-lab"
              className="w-full flex items-center justify-center gap-2 py-4 mt-2 bg-gray-900 text-white hover:bg-gray-800 rounded-xl font-bold active:scale-95 transition-all shadow-xl shadow-gray-900/20"
            >
              🚧 Prototype Lab (Demo Tool)
            </Link>
          </div>
        </section>
      </div>
    </div>
  );
};
