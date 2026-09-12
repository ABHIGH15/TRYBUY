import { NavLink } from 'react-router-dom';
import { Compass, Bookmark, ShoppingBag, User } from 'lucide-react';
import { useProductStore } from '../store/productStore';
import { useBagStore } from '../store/bagStore';

export const BottomNav: React.FC = () => {
  const { savedItems } = useProductStore();
  const { items } = useBagStore();
  const savedCount = Object.keys(savedItems).length;
  const bagCount = items.length;

  return (
    <nav className="fixed bottom-0 w-full max-w-md mx-auto bg-white border-t border-gray-200 pb-safe z-50">
      <div className="flex justify-around items-center h-16">
        <NavLink 
          to="/" 
          className={({ isActive }) => `flex flex-col items-center justify-center w-full h-full space-y-1 ${isActive ? 'text-black' : 'text-gray-400 hover:text-gray-600'}`}
        >
          <Compass size={24} />
          <span className="text-[10px] font-bold tracking-wide uppercase">Discover</span>
        </NavLink>
        
        <NavLink 
          to="/memory" 
          className={({ isActive }) => `flex flex-col items-center justify-center w-full h-full space-y-1 ${isActive ? 'text-gray-900' : 'text-gray-400 hover:text-gray-900'}`}
        >
          <div className="relative">
            <Bookmark size={24} />
            {savedCount > 0 && (
              <div className="absolute -top-1 -right-1 w-4 h-4 bg-gray-900 text-white text-[9px] font-bold rounded-full flex items-center justify-center border-2 border-white">
                {savedCount}
              </div>
            )}
          </div>
          <span className="text-[10px] font-bold tracking-wide uppercase">TryBuy</span>
        </NavLink>
        
        <NavLink 
          to="/bag" 
          className={({ isActive }) => `flex flex-col items-center justify-center w-full h-full space-y-1 ${isActive ? 'text-gray-900' : 'text-gray-400 hover:text-gray-900'}`}
        >
          <div className="relative">
            <ShoppingBag size={24} />
            {bagCount > 0 && (
              <div className="absolute -top-1 -right-1 w-4 h-4 bg-gray-900 text-white text-[9px] font-bold rounded-full flex items-center justify-center border-2 border-white">
                {bagCount}
              </div>
            )}
          </div>
          <span className="text-[10px] font-bold tracking-wide uppercase">Bag</span>
        </NavLink>
        
        <NavLink 
          to="/profile" 
          className={({ isActive }) => `flex flex-col items-center justify-center w-full h-full space-y-1 ${isActive ? 'text-gray-900' : 'text-gray-400 hover:text-gray-900'}`}
        >
          <User size={24} />
          <span className="text-[10px] font-bold tracking-wide uppercase">Profile</span>
        </NavLink>
      </div>
    </nav>
  );
};
