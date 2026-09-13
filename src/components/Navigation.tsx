import { NavLink } from 'react-router-dom';
import { LayoutList, PlusCircle, ArchiveRestore } from 'lucide-react';

export function Navigation() {
  return (
    <nav className="fixed bottom-0 w-full max-w-md mx-auto bg-white border-t border-gray-100 pb-safe z-50 shadow-[0_-4px_24px_rgba(0,0,0,0.02)]">
      <div className="flex items-center justify-around px-6 py-3">
        
        <NavLink 
          to="/" 
          className={({ isActive }) => 
            `flex flex-col items-center gap-1 p-2 transition-colors ${isActive ? 'text-black' : 'text-gray-400 hover:text-gray-600'}`
          }
        >
          <LayoutList className="w-6 h-6" strokeWidth={2.5} />
          <span className="text-[10px] font-bold tracking-wide uppercase">Open</span>
        </NavLink>

        <NavLink 
          to="/capture" 
          className={({ isActive }) => 
            `flex flex-col items-center gap-1 p-2 transition-colors ${isActive ? 'text-black' : 'text-gray-400 hover:text-gray-600'}`
          }
        >
          <PlusCircle className="w-6 h-6" strokeWidth={2.5} />
          <span className="text-[10px] font-bold tracking-wide uppercase">Capture</span>
        </NavLink>

        <NavLink 
          to="/history" 
          className={({ isActive }) => 
            `flex flex-col items-center gap-1 p-2 transition-colors ${isActive ? 'text-black' : 'text-gray-400 hover:text-gray-600'}`
          }
        >
          <ArchiveRestore className="w-6 h-6" strokeWidth={2.5} />
          <span className="text-[10px] font-bold tracking-wide uppercase">History</span>
        </NavLink>

      </div>
    </nav>
  );
}
