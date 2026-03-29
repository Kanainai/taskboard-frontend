import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { format } from 'date-fns';
import { getOverdueTasks } from '../api/tasks';
import { CheckSquare, LayoutDashboard, BarChart2, AlertCircle, LogOut, Calendar, X } from 'lucide-react';
import theme from '../theme';

export default function Sidebar({ onClose }) {
  const location = useLocation();
  const navigate = useNavigate();
  const [overdueCount, setOverdueCount] = useState(0);
  const [userName, setUserName] = useState('');

  useEffect(() => {
    fetchOverdueCount();
    const savedName = localStorage.getItem('taskboard_user_name');
    if (savedName) {
      setUserName(savedName);
    }
  }, []);

  const displayName = userName ? userName.toUpperCase() : '';

  const fetchOverdueCount = async () => {
    try {
      const response = await getOverdueTasks();
      console.log('Overdue tasks response:', response.data);
      const count = Array.isArray(response.data) ? response.data.length : (response.data.tasks ? response.data.tasks.length : 0);
      console.log('Overdue count:', count);
      setOverdueCount(count);
    } catch (error) {
      console.error('Error fetching overdue tasks:', error);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('taskboard_user_name');
    navigate('/');
  };

  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return 'Good morning';
    if (hour < 17) return 'Good afternoon';
    return 'Good evening';
  };

  const getGreetingEmoji = () => {
    const hour = new Date().getHours();
    if (hour < 12) return '☀️';
    if (hour < 17) return '👋';
    return '🌙';
  };

  const getCurrentDate = () => {
    return format(new Date(), 'EEEE, MMMM d, yyyy');
  };

  const isActive = (path) => location.pathname === path;

  return (
    <div style={{
      width: '280px',
      minWidth: '280px',
      height: '100vh',
      backgroundColor: theme.colors.sidebarBg,
      borderRight: `1px solid ${theme.colors.border}`,
      display: 'flex',
      flexDirection: 'column',
      fontFamily: theme.fonts.family,
      overflowY: 'auto',
      position: 'relative',
      zIndex: 99999,
    }}>
      {/* Mobile Close Button */}
      <button
        onClick={onClose}
        className="mobile-close-btn"
        style={{
          position: 'absolute',
          top: '1rem',
          right: '1rem',
          background: 'rgba(0, 0, 0, 0.05)',
          border: 'none',
          borderRadius: '6px',
          padding: '6px',
          cursor: 'pointer',
          display: 'none',
          alignItems: 'center',
          justifyContent: 'center',
          transition: 'background 0.2s',
          zIndex: 10,
        }}
        onMouseEnter={(e) => e.currentTarget.style.background = 'rgba(0, 0, 0, 0.1)'}
        onMouseLeave={(e) => e.currentTarget.style.background = 'rgba(0, 0, 0, 0.05)'}
      >
        <X size={18} color="#6B7280" />
      </button>

      {/* Logo Area */}
      <div style={{ padding: '1.5rem', paddingBottom: '1rem' }}>
        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: '10px',
          marginBottom: '1.25rem',
        }}>
          <CheckSquare size={24} color="#F59E0B" />
          <h1 style={{
            fontSize: '18px',
            fontWeight: 700,
            color: '#1A1A1A',
            margin: 0,
          }}>
            TaskBoard
          </h1>
        </div>

        {/* Welcome Section */}
        {userName && (
          <div style={{
            backgroundColor: '#FEF3C7',
            borderRadius: '12px',
            padding: '14px',
            border: '1px solid #FDE68A',
            position: 'relative',
            overflow: 'hidden',
          }}>
            {/* Decorative gradient overlay */}
            <div style={{
              position: 'absolute',
              top: 0,
              right: 0,
              width: '80px',
              height: '80px',
              background: 'radial-gradient(circle, rgba(245, 158, 11, 0.1) 0%, transparent 70%)',
              pointerEvents: 'none',
            }} />
            
            <div style={{
              marginBottom: '10px',
            }}>
              <div style={{
                fontSize: '13px',
                color: '#92400E',
                fontWeight: 600,
                marginBottom: '4px',
                display: 'flex',
                alignItems: 'center',
                gap: '6px',
              }}>
                <span>{getGreetingEmoji()}</span>
                <span>{getGreeting()}</span>
              </div>
              <div style={{
                fontSize: '15px',
                color: '#1A1A1A',
                fontWeight: 700,
                wordBreak: 'break-word',
              }}>
                {displayName}
              </div>
            </div>
            
            {/* Current Date */}
            <div style={{
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              fontSize: '11px',
              color: '#78350F',
              fontWeight: 500,
            }}>
              <Calendar size={11} />
              <span style={{ wordBreak: 'break-word' }}>{getCurrentDate()}</span>
            </div>
          </div>
        )}
      </div>
      
      {/* Navigation */}
      <nav style={{ padding: '0 1rem', marginBottom: '1rem' }}>
        <Link
          to="/board"
          onClick={onClose}
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            padding: '10px 16px',
            marginBottom: '0.25rem',
            borderRadius: isActive('/board') ? '0 8px 8px 0' : '8px',
            textDecoration: 'none',
            transition: 'all 0.15s ease',
            backgroundColor: isActive('/board') ? '#FEF3C7' : 'transparent',
            color: isActive('/board') ? '#D97706' : '#6B7280',
            fontWeight: isActive('/board') ? 600 : 400,
            borderLeft: isActive('/board') ? '3px solid #F59E0B' : '3px solid transparent',
          }}
          onMouseEnter={(e) => {
            if (!isActive('/board')) {
              e.currentTarget.style.backgroundColor = '#FEF3C7';
              e.currentTarget.style.color = '#D97706';
            }
          }}
          onMouseLeave={(e) => {
            if (!isActive('/board')) {
              e.currentTarget.style.backgroundColor = 'transparent';
              e.currentTarget.style.color = '#6B7280';
            }
          }}
        >
          <LayoutDashboard size={16} />
          <span>Board</span>
        </Link>
        
        <Link
          to="/report"
          onClick={onClose}
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            padding: '10px 16px',
            marginBottom: '0.25rem',
            borderRadius: isActive('/report') ? '0 8px 8px 0' : '8px',
            textDecoration: 'none',
            transition: 'all 0.15s ease',
            backgroundColor: isActive('/report') ? '#FEF3C7' : 'transparent',
            color: isActive('/report') ? '#D97706' : '#6B7280',
            fontWeight: isActive('/report') ? 600 : 400,
            borderLeft: isActive('/report') ? '3px solid #F59E0B' : '3px solid transparent',
          }}
          onMouseEnter={(e) => {
            if (!isActive('/report')) {
              e.currentTarget.style.backgroundColor = '#FEF3C7';
              e.currentTarget.style.color = '#D97706';
            }
          }}
          onMouseLeave={(e) => {
            if (!isActive('/report')) {
              e.currentTarget.style.backgroundColor = 'transparent';
              e.currentTarget.style.color = '#6B7280';
            }
          }}
        >
          <BarChart2 size={16} />
          <span>Report</span>
        </Link>

        {/* Logout Button */}
        <button
          onClick={handleLogout}
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            padding: '10px 16px',
            marginBottom: '0.25rem',
            borderRadius: '8px',
            textDecoration: 'none',
            transition: 'all 0.15s ease',
            backgroundColor: 'transparent',
            color: '#6B7280',
            fontWeight: 400,
            border: 'none',
            cursor: 'pointer',
            width: '100%',
            textAlign: 'left',
            fontFamily: theme.fonts.family,
            fontSize: '14px',
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.backgroundColor = '#FEF2F2';
            e.currentTarget.style.color = '#EF4444';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.backgroundColor = 'transparent';
            e.currentTarget.style.color = '#6B7280';
          }}
        >
          <LogOut size={16} />
          <span>Logout</span>
        </button>
      </nav>

      {/* Overdue Badge */}
      <div style={{ padding: '0 1rem 1.5rem', marginTop: 'auto' }}>
        <div style={{
          height: '1px',
          backgroundColor: '#E8E0D0',
          marginBottom: '1rem',
        }} />
        
        <div style={{
          padding: '10px 14px',
          backgroundColor: overdueCount > 0 ? '#FEF2F2' : '#F9FAFB',
          border: `1px solid ${overdueCount > 0 ? '#FECACA' : '#E5E7EB'}`,
          borderRadius: '8px',
        }}>
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            whiteSpace: 'nowrap',
          }}>
            <AlertCircle size={14} color={overdueCount > 0 ? '#EF4444' : '#9CA3AF'} style={{ flexShrink: 0 }} />
            <span style={{
              fontSize: '13px',
              color: overdueCount > 0 ? '#EF4444' : '#6B7280',
              flex: 1,
              overflow: 'hidden',
              textOverflow: 'ellipsis',
            }}>
              Overdue Tasks
            </span>
            <span style={{
              minWidth: '24px',
              height: '24px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: '11px',
              fontWeight: 700,
              color: '#FFFFFF',
              backgroundColor: overdueCount > 0 ? '#EF4444' : '#9CA3AF',
              borderRadius: '9999px',
              padding: '0 6px',
              flexShrink: 0,
            }}>
              {overdueCount}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
