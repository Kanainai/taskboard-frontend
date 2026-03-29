import TaskCard from './TaskCard';
import { Clock, ChevronRight, CheckSquare } from 'lucide-react';
import theme from '../theme';

export default function Column({ title, tasks, loading, onAdvance, onDelete, SkeletonCard }) {
  const headerColors = {
    'Pending': theme.colors.pendingHeader,
    'In Progress': theme.colors.inProgressHeader,
    'Done': theme.colors.doneHeader,
  };

  const statusIcons = {
    'Pending': <Clock size={16} color="#6B7280" />,
    'In Progress': <ChevronRight size={16} color="#3B82F6" />,
    'Done': <CheckSquare size={16} color="#22C55E" />,
  };

  return (
    <div style={{
      display: 'flex',
      flexDirection: 'column',
      height: '100%',
      overflow: 'hidden',
    }}>
      <div style={{
        backgroundColor: theme.colors.columnBg,
        borderRadius: theme.borderRadius.md,
        padding: '1rem',
        display: 'flex',
        flexDirection: 'column',
        height: '100%',
        overflow: 'hidden',
      }}>
        <div style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          marginBottom: '1rem',
          padding: '0.5rem 0.75rem',
          backgroundColor: headerColors[title] || theme.colors.columnBg,
          borderRadius: theme.borderRadius.sm,
          flexShrink: 0,
        }}>
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
          }}>
            {statusIcons[title]}
            <h2 style={{
              fontWeight: theme.fonts.weights.semibold,
              color: theme.colors.textPrimary,
              fontSize: '0.875rem',
              fontFamily: theme.fonts.family,
              margin: 0,
            }}>
              {title}
            </h2>
          </div>
          <span style={{
            padding: '0.25rem 0.5rem',
            fontSize: '0.75rem',
            fontWeight: theme.fonts.weights.medium,
            color: theme.colors.btnPrimaryText,
            backgroundColor: theme.colors.accent,
            borderRadius: theme.borderRadius.full,
          }}>
            {loading ? '...' : tasks.length}
          </span>
        </div>
        
        <div style={{
          overflowY: 'auto',
          flex: 1,
          paddingRight: '4px',
          paddingBottom: '16px',
          scrollbarWidth: 'none',
          msOverflowStyle: 'none',
        }}
        className="column-scroll"
        >
          {loading ? (
            [1, 2, 3].map(i => <SkeletonCard key={i} />)
          ) : (
            <>
              {tasks.map((task) => (
                <TaskCard
                  key={task.id}
                  task={task}
                  onAdvance={onAdvance}
                  onDelete={onDelete}
                />
              ))}
              
              {tasks.length === 0 && (
                <div style={{
                  textAlign: 'center',
                  padding: '2rem',
                  color: theme.colors.textMuted,
                  fontSize: '0.875rem',
                }}>
                  No tasks
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
}
