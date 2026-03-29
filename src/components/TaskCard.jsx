import { format, isPast, isToday } from 'date-fns';
import { Clock, Trash2, AlertTriangle, User, Play, CheckCircle } from 'lucide-react';
import theme from '../theme';

export default function TaskCard({ task, onAdvance, onDelete }) {
  const priorityColors = {
    high: theme.colors.priorityHigh,
    medium: theme.colors.priorityMedium,
    low: theme.colors.priorityLow,
  };

  const isOverdue = isPast(new Date(task.due_date)) && !isToday(new Date(task.due_date)) && task.status !== 'done';

  const getActionButton = () => {
    if (task.status === 'pending') {
      return {
        icon: <Play size={14} />,
        color: '#3B82F6',
        hoverColor: '#2563EB',
        title: 'Start task',
      };
    } else if (task.status === 'in_progress') {
      return {
        icon: <CheckCircle size={14} />,
        color: '#22C55E',
        hoverColor: '#16A34A',
        title: 'Mark as finished',
      };
    }
    return null;
  };

  const actionButton = getActionButton();

  return (
    <div style={{
      backgroundColor: theme.colors.cardBg,
      padding: '12px',
      borderRadius: theme.borderRadius.md,
      boxShadow: theme.shadows.card,
      border: `1px solid ${theme.colors.border}`,
      transition: 'all 0.15s ease',
      fontFamily: theme.fonts.family,
      cursor: 'pointer',
      marginBottom: '8px',
    }}
    onMouseEnter={(e) => {
      e.currentTarget.style.boxShadow = theme.shadows.cardHover;
      e.currentTarget.style.transform = 'translateY(-1px)';
    }}
    onMouseLeave={(e) => {
      e.currentTarget.style.boxShadow = theme.shadows.card;
      e.currentTarget.style.transform = 'translateY(0)';
    }}
    >
      {/* Title Row */}
      <div style={{
        display: 'flex',
        alignItems: 'flex-start',
        justifyContent: 'space-between',
        marginBottom: '8px',
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flex: 1 }}>
          <div style={{
            width: '8px',
            height: '8px',
            borderRadius: '50%',
            backgroundColor: priorityColors[task.priority],
            flexShrink: 0,
          }} />
          <h3 style={{
            fontWeight: 600,
            color: '#1A1A1A',
            fontSize: '14px',
            margin: 0,
            textTransform: 'none',
            lineHeight: 1.4,
          }}>
            {task.title}
          </h3>
        </div>
        
        {/* Action/Delete Button */}
        {task.status === 'done' ? (
          <button
            onClick={(e) => {
              e.stopPropagation();
              onDelete(task);
            }}
            style={{
              background: 'none',
              border: 'none',
              color: theme.colors.textMuted,
              cursor: 'pointer',
              padding: 0,
              transition: 'color 0.15s ease',
              flexShrink: 0,
              display: 'flex',
              alignItems: 'center',
            }}
            onMouseEnter={(e) => e.currentTarget.style.color = theme.colors.btnDanger}
            onMouseLeave={(e) => e.currentTarget.style.color = theme.colors.textMuted}
            title="Delete task"
          >
            <Trash2 size={14} />
          </button>
        ) : actionButton ? (
          <button
            onClick={(e) => {
              e.stopPropagation();
              onAdvance(task);
            }}
            style={{
              background: 'none',
              border: 'none',
              color: actionButton.color,
              cursor: 'pointer',
              padding: 0,
              transition: 'color 0.15s ease',
              flexShrink: 0,
              display: 'flex',
              alignItems: 'center',
            }}
            onMouseEnter={(e) => e.currentTarget.style.color = actionButton.hoverColor}
            onMouseLeave={(e) => e.currentTarget.style.color = actionButton.color}
            title={actionButton.title}
          >
            {actionButton.icon}
          </button>
        ) : null}
      </div>
      
      {/* Assigned To Row */}
      {task.assigned_to && (
        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: '6px',
          marginBottom: '8px',
        }}>
          <User size={12} color="#6B7280" />
          <span style={{
            fontSize: '12px',
            color: '#6B7280',
            textTransform: 'capitalize',
          }}>
            {task.assigned_to}
          </span>
        </div>
      )}
      
      {/* Date Row */}
      <div style={{
        display: 'flex',
        alignItems: 'center',
        gap: '6px',
      }}>
        {isOverdue ? (
          <AlertTriangle size={12} color="#EF4444" />
        ) : (
          <Clock size={12} color="#6B7280" />
        )}
        <span style={{
          fontSize: '12px',
          color: isOverdue ? '#EF4444' : '#6B7280',
          fontWeight: isOverdue ? 500 : 400,
        }}>
          {format(new Date(task.due_date), 'MMM dd, yyyy')}
        </span>
        {isOverdue && (
          <span style={{
            fontSize: '10px',
            padding: '2px 6px',
            borderRadius: '9999px',
            backgroundColor: '#FEF2F2',
            color: '#EF4444',
            fontWeight: 500,
          }}>
            Overdue
          </span>
        )}
      </div>
    </div>
  );
}
