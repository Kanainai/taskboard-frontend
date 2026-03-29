import { useEffect } from 'react';
import theme from '../theme';

export default function ConfirmModal({ 
  isOpen, 
  onConfirm, 
  onCancel, 
  taskTitle,
  type = 'delete', // 'delete', 'start', or 'finish'
}) {
  useEffect(() => {
    const handleEscape = (e) => {
      if (e.key === 'Escape' && isOpen) {
        onCancel();
      }
    };

    document.addEventListener('keydown', handleEscape);
    return () => document.removeEventListener('keydown', handleEscape);
  }, [isOpen, onCancel]);

  if (!isOpen) return null;

  const config = {
    delete: {
      icon: (
        <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="#EF4444" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
          <polyline points="3,6 5,6 21,6"/>
          <path d="M19,6l-1,14a2,2,0,0,1-2,2H8a2,2,0,0,1-2-2L5,6"/>
          <path d="M10,11v6"/>
          <path d="M14,11v6"/>
          <path d="M9,6V4a1,1,0,0,1,1-1h4a1,1,0,0,1,1,1v2"/>
        </svg>
      ),
      iconBg: '#FEF2F2',
      title: 'Delete Task?',
      message: taskTitle ? 
        <>Are you sure you want to delete <strong>"{taskTitle}"</strong>? This action cannot be undone.</> :
        'This action cannot be undone. Only completed tasks can be deleted.',
      confirmText: 'Delete Task',
      confirmColor: theme.colors.btnDanger,
      confirmHoverColor: '#DC2626',
    },
    start: {
      icon: (
        <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="#3B82F6" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
          <polygon points="5 3 19 12 5 21 5 3"/>
        </svg>
      ),
      iconBg: '#EFF6FF',
      title: 'Start Task?',
      message: taskTitle ? 
        <>Are you ready to start working on <strong>"{taskTitle}"</strong>?</> :
        'This will move the task to In Progress.',
      confirmText: 'Start Now',
      confirmColor: '#3B82F6',
      confirmHoverColor: '#2563EB',
    },
    finish: {
      icon: (
        <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="#22C55E" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
          <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/>
          <polyline points="22 4 12 14.01 9 11.01"/>
        </svg>
      ),
      iconBg: '#F0FDF4',
      title: 'Mark as Finished?',
      message: taskTitle ? 
        <>Are you sure <strong>"{taskTitle}"</strong> is complete?</> :
        'This will move the task to Done.',
      confirmText: 'Mark as Done',
      confirmColor: '#22C55E',
      confirmHoverColor: '#16A34A',
    },
  };

  const currentConfig = config[type];

  return (
    <div
      style={{
        position: 'fixed',
        inset: 0,
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        zIndex: 50,
        animation: 'fadeIn 0.2s ease-out',
      }}
      onClick={onCancel}
    >
      <div
        style={{
          backgroundColor: theme.colors.modalBg,
          borderRadius: theme.borderRadius.lg,
          padding: '2rem',
          maxWidth: '400px',
          width: '90%',
          boxShadow: theme.shadows.modal,
          animation: 'slideIn 0.3s ease-out',
        }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Icon */}
        <div style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          margin: '0 auto 16px',
        }}>
          <div style={{
            width: '72px',
            height: '72px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            backgroundColor: currentConfig.iconBg,
            borderRadius: '50%',
          }}>
            {currentConfig.icon}
          </div>
        </div>

        {/* Heading */}
        <h2 style={{
          fontSize: '1.5rem',
          fontWeight: theme.fonts.weights.bold,
          color: theme.colors.textPrimary,
          textAlign: 'center',
          marginBottom: '0.75rem',
          fontFamily: theme.fonts.family,
        }}>
          {currentConfig.title}
        </h2>

        {/* Subtext */}
        <p style={{
          fontSize: '0.875rem',
          color: theme.colors.textSecondary,
          textAlign: 'center',
          marginBottom: '2rem',
          lineHeight: 1.6,
          fontFamily: theme.fonts.family,
        }}>
          {currentConfig.message}
        </p>

        {/* Buttons */}
        <div style={{
          display: 'flex',
          gap: '0.75rem',
        }}>
          <button
            onClick={onCancel}
            style={{
              flex: 1,
              padding: '0.75rem 1.5rem',
              fontSize: '1rem',
              fontWeight: theme.fonts.weights.medium,
              backgroundColor: theme.colors.btnSecondary,
              color: theme.colors.btnSecondaryText,
              border: `2px solid ${theme.colors.border}`,
              borderRadius: theme.borderRadius.md,
              cursor: 'pointer',
              transition: 'all 0.2s',
              fontFamily: theme.fonts.family,
            }}
            onMouseEnter={(e) => e.target.style.backgroundColor = theme.colors.columnBg}
            onMouseLeave={(e) => e.target.style.backgroundColor = theme.colors.btnSecondary}
          >
            Cancel
          </button>

          <button
            onClick={onConfirm}
            style={{
              flex: 1,
              padding: '0.75rem 1.5rem',
              fontSize: '1rem',
              fontWeight: theme.fonts.weights.medium,
              backgroundColor: currentConfig.confirmColor,
              color: theme.colors.btnDangerText,
              border: 'none',
              borderRadius: theme.borderRadius.md,
              cursor: 'pointer',
              transition: 'all 0.2s',
              fontFamily: theme.fonts.family,
            }}
            onMouseEnter={(e) => e.target.style.backgroundColor = currentConfig.confirmHoverColor}
            onMouseLeave={(e) => e.target.style.backgroundColor = currentConfig.confirmColor}
          >
            {currentConfig.confirmText}
          </button>
        </div>
      </div>

      {/* Animations */}
      <style>{`
        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        @keyframes slideIn {
          from {
            opacity: 0;
            transform: translateY(-20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
      `}</style>
    </div>
  );
}
