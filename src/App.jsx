import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { useEffect, useState } from 'react';
import Sidebar from './components/Sidebar';
import ProtectedRoute from './components/ProtectedRoute';
import Board from './pages/Board';
import Report from './pages/Report';
import Landing from './pages/Landing';
import { pingApi, getOverdueTasks } from './api/tasks';
import { Menu, X } from 'lucide-react';
import './index.css';

function App() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [overdueCount, setOverdueCount] = useState(0);

  useEffect(() => {
    // Warm up Laravel API on app load
    pingApi();
    // Fetch initial overdue count
    fetchOverdueCount();
  }, []);

  const fetchOverdueCount = async () => {
    try {
      const response = await getOverdueTasks();
      const count = Array.isArray(response.data) ? response.data.length : (response.data.tasks ? response.data.tasks.length : 0);
      setOverdueCount(count);
    } catch (error) {
      console.error('Error fetching overdue tasks:', error);
    }
  };

  const AppLayout = ({ children }) => (
    <div style={{ display: 'flex', height: '100dvh', position: 'relative' }}>
      {/* Mobile Menu Button - Hide when sidebar is open */}
      {!isMobileMenuOpen && (
        <button
          onClick={() => setIsMobileMenuOpen(true)}
          style={{
            position: 'fixed',
            top: '1rem',
            left: '1rem',
            zIndex: 1000,
            backgroundColor: 'white',
            color: '#F59E0B',
            border: '1px solid #E8E0D0',
            borderRadius: '8px',
            padding: '10px',
            cursor: 'pointer',
            display: 'none',
            alignItems: 'center',
            justifyContent: 'center',
            boxShadow: '0 2px 8px rgba(0, 0, 0, 0.1)',
            transition: 'all 0.2s',
          }}
          className="mobile-menu-btn"
          onMouseEnter={(e) => {
            e.currentTarget.style.backgroundColor = '#FEF3C7';
            e.currentTarget.style.boxShadow = '0 4px 12px rgba(0, 0, 0, 0.15)';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.backgroundColor = 'white';
            e.currentTarget.style.boxShadow = '0 2px 8px rgba(0, 0, 0, 0.1)';
          }}
        >
          <Menu size={20} />
        </button>
      )}

      {/* Sidebar - Desktop always visible, Mobile toggleable */}
      <div
        style={{
          position: 'fixed',
          left: isMobileMenuOpen ? 0 : '-100%',
          top: 0,
          height: '100dvh',
          zIndex: 99999,
          transition: 'left 0.3s ease',
        }}
        className="sidebar-container"
      >
        <Sidebar onClose={() => setIsMobileMenuOpen(false)} overdueCount={overdueCount} />
      </div>

      {/* Overlay for mobile */}
      {isMobileMenuOpen && (
        <div
          onClick={() => setIsMobileMenuOpen(false)}
          style={{
            position: 'fixed',
            inset: 0,
            backgroundColor: 'rgba(0, 0, 0, 0.4)',
            zIndex: 99998,
          }}
          className="mobile-overlay"
        />
      )}

      {/* Main Content */}
      <div style={{ flex: 1, marginLeft: 0, overflowY: 'auto', height: '100dvh' }} className="main-content">
        {children}
      </div>

      <style>{`
        @media (max-width: 1200px) {
          .mobile-menu-btn {
            display: flex !important;
          }
          .sidebar-container {
            position: fixed !important;
          }
          .main-content {
            margin-left: 0 !important;
            width: 100% !important;
          }
        }
        @media (min-width: 1201px) {
          .sidebar-container {
            position: relative !important;
            left: 0 !important;
          }
          .mobile-overlay {
            display: none !important;
          }
          .main-content {
            margin-left: 0;
          }
        }
      `}</style>
    </div>
  );

  return (
    <Router>
      <Routes>
        {/* Landing page without sidebar */}
        <Route path="/" element={<Landing />} />
        
        {/* Board and Report with sidebar - Protected routes */}
        <Route path="/board" element={
          <ProtectedRoute>
            <AppLayout>
              <Board onTaskChange={fetchOverdueCount} />
            </AppLayout>
          </ProtectedRoute>
        } />
        
        <Route path="/report" element={
          <ProtectedRoute>
            <AppLayout>
              <Report onTaskChange={fetchOverdueCount} />
            </AppLayout>
          </ProtectedRoute>
        } />
      </Routes>
    </Router>
  );
}

export default App;
