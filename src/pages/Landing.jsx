import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import theme from '../theme';

export default function Landing() {
  const [name, setName] = useState('');
  const [error, setError] = useState('');
  const [shake, setShake] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const savedName = localStorage.getItem('taskboard_user_name');
    if (savedName) {
      navigate('/board');
    }
  }, [navigate]);

  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (!name.trim()) {
      setError('Please enter your name to continue');
      setShake(true);
      setTimeout(() => setShake(false), 500);
      return;
    }

    localStorage.setItem('taskboard_user_name', name.trim());
    navigate('/board');
  };

  return (
    <div style={{
      position: 'fixed',
      inset: 0,
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      width: '100vw',
      height: '100dvh',
      margin: 0,
      padding: 0,
      overflow: 'hidden',
      backgroundColor: '#1a0a00',
      fontFamily: theme.fonts.family,
    }}>
      {/* Background Image Layer */}
      <div style={{
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundImage: "url('/bg.png')",
        backgroundSize: 'cover',
        backgroundPosition: 'center center',
        backgroundRepeat: 'no-repeat',
        backgroundColor: '#1a0a00',
        zIndex: 0,
      }} />
      
      {/* Content Layer */}
      <div className="landing-content" style={{
        position: 'relative',
        display: 'flex',
        width: '100%',
        height: '100%',
        margin: 0,
        padding: 0,
        zIndex: 1,
      }}>
        {/* Left Half - Blurred with Content */}
        <div className="landing-left" style={{
          position: 'relative',
          width: '50%',
          height: '100%',
          margin: 0,
          padding: 0,
          background: 'rgba(20, 10, 0, 0.60)',
          backdropFilter: 'blur(12px)',
          WebkitBackdropFilter: 'blur(12px)',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          alignItems: 'center',
        }}>
        <div className="landing-form-container" style={{ maxWidth: '420px', width: '100%', padding: '3rem' }}>
          {/* SVG Checkmark Icon */}
          <div style={{
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            marginBottom: '1.5rem',
          }}>
            <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="#F59E0B" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
              <polyline points="20 6 9 17 4 12" />
            </svg>
          </div>

          {/* App Name */}
          <h1 className="landing-title" style={{
            fontSize: '52px',
            fontWeight: 700,
            color: 'white',
            marginBottom: '1rem',
            textAlign: 'center',
            lineHeight: 1.2,
          }}>
            TaskBoard
          </h1>

          {/* Tagline */}
          <p className="landing-tagline" style={{
            fontSize: '18px',
            color: 'white',
            opacity: 0.85,
            marginBottom: '3rem',
            textAlign: 'center',
            lineHeight: 1.6,
          }}>
            Manage your tasks with clarity and focus.
          </p>

          {/* Form */}
          <form onSubmit={handleSubmit}>
            <input
              type="text"
              value={name}
              onChange={(e) => {
                setName(e.target.value);
                setError('');
              }}
              placeholder="Enter your name..."
              style={{
                width: '100%',
                padding: '14px 18px',
                fontSize: '16px',
                border: '1px solid rgba(255, 255, 255, 0.3)',
                borderRadius: '10px',
                backgroundColor: 'rgba(255, 255, 255, 0.15)',
                color: 'white',
                outline: 'none',
                transition: 'all 0.2s',
                marginBottom: error ? '0.5rem' : '12px',
                fontFamily: theme.fonts.family,
                animation: shake ? 'shake 0.5s' : 'none',
              }}
              onFocus={(e) => e.target.style.borderColor = 'white'}
              onBlur={(e) => e.target.style.borderColor = 'rgba(255, 255, 255, 0.3)'}
            />

            {error && (
              <p style={{
                color: '#FCA5A5',
                fontSize: '14px',
                marginBottom: '12px',
              }}>
                {error}
              </p>
            )}

            <button
              type="submit"
              style={{
                width: '100%',
                padding: '14px 18px',
                fontSize: '16px',
                fontWeight: 600,
                backgroundColor: '#F59E0B',
                color: 'white',
                border: 'none',
                borderRadius: '10px',
                cursor: 'pointer',
                transition: 'all 0.2s ease',
                fontFamily: theme.fonts.family,
                marginTop: '12px',
              }}
              onMouseEnter={(e) => e.target.style.backgroundColor = '#D97706'}
              onMouseLeave={(e) => e.target.style.backgroundColor = '#F59E0B'}
            >
              Get Started →
            </button>
          </form>

          {/* Small text */}
          <p style={{
            marginTop: '1rem',
            textAlign: 'center',
            color: 'rgba(255, 255, 255, 0.6)',
            fontSize: '13px',
          }}>
            Your tasks are waiting for you.
          </p>
        </div>
        </div>

        {/* Right Half - Clear Image */}
        <div className="landing-right" style={{
          position: 'relative',
          width: '50%',
          height: '100%',
          margin: 0,
          padding: 0,
        }}>
        </div>
      </div>

      {/* Shake Animation + Mobile Styles */}
      <style>{`
        @keyframes shake {
          0%, 100% { transform: translateX(0); }
          10%, 30%, 50%, 70%, 90% { transform: translateX(-10px); }
          20%, 40%, 60%, 80% { transform: translateX(10px); }
        }
        input::placeholder {
          color: rgba(255, 255, 255, 0.6);
        }
        
        @media (max-width: 768px) {
          .landing-content {
            flex-direction: column !important;
          }
          .landing-left {
            width: 100% !important;
            height: 100% !important;
            background: rgba(20, 10, 0, 0.85) !important;
          }
          .landing-right {
            display: none !important;
          }
          .landing-form-container {
            padding: 2rem 1.5rem !important;
          }
          .landing-title {
            font-size: 36px !important;
          }
          .landing-tagline {
            font-size: 16px !important;
            marginBottom: 2rem !important;
          }
        }
        
        @media (max-width: 480px) {
          .landing-form-container {
            padding: 1.5rem 1rem !important;
          }
          .landing-title {
            font-size: 32px !important;
          }
        }
      `}</style>
    </div>
  );
}
