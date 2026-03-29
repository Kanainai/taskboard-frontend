const theme = {
  colors: {
    // Backgrounds
    pageBg: '#FFFDF7',
    sidebarBg: '#F5F0E8',
    cardBg: '#FFFFFF',
    columnBg: '#FAF7F2',
    modalBg: '#FFFFFF',
    
    // Borders
    border: '#E8E0D0',
    borderFocus: '#F59E0B',
    
    // Text
    textPrimary: '#1A1A1A',
    textSecondary: '#6B7280',
    textMuted: '#9CA3AF',
    
    // Accent (Amber)
    accent: '#F59E0B',
    accentHover: '#D97706',
    accentLight: '#FEF3C7',
    
    // Priority
    priorityHigh: '#EF4444',
    priorityMedium: '#F59E0B',
    priorityLow: '#22C55E',
    
    // Status columns
    pendingHeader: '#FEF3C7',
    inProgressHeader: '#DBEAFE',
    doneHeader: '#D1FAE5',
    
    // Buttons
    btnPrimary: '#F59E0B',
    btnPrimaryText: '#FFFFFF',
    btnPrimaryHover: '#D97706',
    btnSecondary: '#FFFFFF',
    btnSecondaryText: '#1A1A1A',
    btnDanger: '#EF4444',
    btnDangerText: '#FFFFFF',
    
    // Overdue
    overdueText: '#EF4444',
    overdueBg: '#FEF2F2',
  },
  fonts: {
    family: "'Inter', sans-serif",
    weights: {
      regular: 400,
      medium: 500,
      semibold: 600,
      bold: 700,
    }
  },
  borderRadius: {
    sm: '6px',
    md: '10px',
    lg: '14px',
    xl: '20px',
    full: '9999px',
  },
  shadows: {
    card: '0 1px 3px rgba(0,0,0,0.06), 0 1px 2px rgba(0,0,0,0.04)',
    cardHover: '0 4px 12px rgba(0,0,0,0.08)',
    modal: '0 20px 60px rgba(0,0,0,0.15)',
  }
};

export default theme;
