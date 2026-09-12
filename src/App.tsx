import { BrowserRouter, Routes, Route, useLocation } from 'react-router-dom';
import { Feed } from './components/Feed';
import { TryBuyMemory } from './components/TryBuyMemory';
import { PrototypeLab } from './components/PrototypeLab';
import { ProductDetail } from './components/ProductDetail';
import { Bag } from './components/Bag';
import { Profile } from './components/Profile';
import { BottomNav } from './components/BottomNav';
import { Toast } from './components/Toast';

function AppContent() {
  const location = useLocation();
  const isPdp = location.pathname.startsWith('/product/') || location.pathname === '/bag';

  return (
    <div className="bg-white max-w-md mx-auto min-h-screen relative shadow-2xl overflow-x-hidden">
      <Routes>
        <Route path="/" element={<Feed />} />
        <Route path="/product/:id" element={<ProductDetail />} />
        <Route path="/memory" element={<TryBuyMemory />} />
        <Route path="/bag" element={<Bag />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="/internal-lab" element={<PrototypeLab />} />
      </Routes>
      {!isPdp && <BottomNav />}
      <Toast />
    </div>
  );
}

function App() {
  return (
    <BrowserRouter>
      <div className="bg-gray-100 min-h-screen">
        <AppContent />
      </div>
    </BrowserRouter>
  );
}

export default App;
