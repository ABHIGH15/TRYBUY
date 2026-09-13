import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { Toast } from './components/Toast';
import { CapturePage } from './pages/CapturePage';
import { HomePage } from './pages/HomePage';
import { HistoryPage } from './pages/HistoryPage';
import { ComparisonPage } from './pages/ComparisonPage';
import { PriceDetailPage } from './pages/PriceDetailPage';
import { Navigation } from './components/Navigation';

function AppContent() {
  return (
    <div className="bg-white max-w-md mx-auto min-h-screen relative shadow-2xl overflow-x-hidden">
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/capture" element={<CapturePage />} />
        <Route path="/history" element={<HistoryPage />} />
        <Route path="/comparison/:setId" element={<ComparisonPage />} />
        <Route path="/price/:decisionId" element={<PriceDetailPage />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
      <Navigation />
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
