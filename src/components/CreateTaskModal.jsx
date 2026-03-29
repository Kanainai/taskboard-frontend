import { useState } from 'react';
import { format } from 'date-fns';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import { X, Plus, Calendar, Flag, Type, User, ChevronDown, Check } from 'lucide-react';
import theme from '../theme';

export default function CreateTaskModal({ isOpen, onClose, onSubmit }) {
  const [title, setTitle] = useState('');
  const [dueDate, setDueDate] = useState(new Date());
  const [priority, setPriority] = useState('medium');
  const [assignedTo, setAssignedTo] = useState('');
  const [error, setError] = useState('');
  const [priorityOpen, setPriorityOpen] = useState(false);

  const priorityOptions = [
    { value: 'low', label: 'Low', dot: '#22C55E' },
    { value: 'medium', label: 'Medium', dot: '#F59E0B' },
    { value: 'high', label: 'High', dot: '#EF4444' },
  ];

  const selectedPriority = priorityOptions.find(o => o.value === priority);

  const formatDate = (date) => {
    if (!date) return '';
    return date.toISOString().split('T')[0];
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!title.trim()) {
      setError('Title is required');
      return;
    }

    if (!dueDate) {
      setError('Due date is required');
      return;
    }

    try {
      await onSubmit({
        title,
        due_date: formatDate(dueDate),
        priority,
        assigned_to: assignedTo,
      });
      setTitle('');
      setDueDate(new Date());
      setPriority('medium');
      setAssignedTo('');
      onClose();
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to create task');
    }
  };

  if (!isOpen) return null;

  return (
    <div style={{
      position: 'fixed',
      inset: 0,
      backgroundColor: 'rgba(0, 0, 0, 0.5)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      zIndex: 50,
    }}
    onClick={onClose}
    >
      <div className="modal-content" style={{
        backgroundColor: theme.colors.modalBg,
        borderRadius: theme.borderRadius.lg,
        padding: '1.5rem',
        maxWidth: '400px',
        width: '90%',
        boxShadow: theme.shadows.modal,
        fontFamily: theme.fonts.family,
      }}
      onClick={(e) => e.stopPropagation()}
      >
        <div style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          marginBottom: '1rem',
        }}>
          <h2 style={{
            fontSize: '1.25rem',
            fontWeight: theme.fonts.weights.semibold,
            color: theme.colors.textPrimary,
          }}>
            Create New Task
          </h2>
          <button
            onClick={onClose}
            style={{
              background: 'none',
              border: 'none',
              color: theme.colors.textMuted,
              cursor: 'pointer',
              padding: '4px',
              display: 'flex',
              alignItems: 'center',
              transition: 'color 0.2s',
            }}
            onMouseEnter={(e) => e.currentTarget.style.color = theme.colors.textPrimary}
            onMouseLeave={(e) => e.currentTarget.style.color = theme.colors.textMuted}
          >
            <X size={20} />
          </button>
        </div>

        {error && (
          <div style={{
            marginBottom: '1rem',
            padding: '0.75rem',
            backgroundColor: theme.colors.overdueBg,
            border: `1px solid ${theme.colors.overdueText}`,
            borderRadius: theme.borderRadius.md,
            color: theme.colors.overdueText,
            fontSize: '0.875rem',
          }}>
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <div style={{ marginBottom: '1rem' }}>
            <label style={{
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              fontSize: '0.875rem',
              fontWeight: theme.fonts.weights.medium,
              color: theme.colors.textPrimary,
              marginBottom: '0.5rem',
            }}>
              <Type size={14} />
              Title
            </label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              style={{
                width: '100%',
                padding: '0.5rem 0.75rem',
                border: `1px solid ${theme.colors.border}`,
                borderRadius: theme.borderRadius.md,
                outline: 'none',
                backgroundColor: theme.colors.cardBg,
                color: theme.colors.textPrimary,
                fontFamily: theme.fonts.family,
              }}
              onFocus={(e) => e.target.style.borderColor = theme.colors.borderFocus}
              onBlur={(e) => e.target.style.borderColor = theme.colors.border}
              placeholder="Enter task title"
            />
          </div>

          <div style={{ marginBottom: '1rem' }}>
            <label style={{
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              fontSize: '0.875rem',
              fontWeight: theme.fonts.weights.medium,
              color: theme.colors.textPrimary,
              marginBottom: '0.5rem',
            }}>
              <Calendar size={14} />
              Due Date
            </label>
            <DatePicker
              selected={dueDate}
              onChange={(date) => setDueDate(date)}
              minDate={new Date()}
              dateFormat="MMM dd, yyyy"
              placeholderText="Select due date"
              withPortal={window.innerWidth <= 768}
              popperPlacement="bottom-start"
              popperModifiers={[
                {
                  name: 'offset',
                  options: {
                    offset: [0, 8],
                  },
                },
                {
                  name: 'preventOverflow',
                  options: {
                    rootBoundary: 'viewport',
                    tether: false,
                    altAxis: true,
                  },
                },
              ]}
              customInput={
                <button
                  type="button"
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '8px',
                    width: '100%',
                    padding: '11px 14px',
                    background: '#FFFFFF',
                    border: '1px solid #E8E0D0',
                    borderRadius: '8px',
                    cursor: 'pointer',
                    fontSize: '14px',
                    color: dueDate ? '#1A1A1A' : '#9CA3AF',
                    fontWeight: 400,
                    textAlign: 'left',
                    fontFamily: theme.fonts.family,
                  }}
                >
                  <Calendar size={15} color="#9CA3AF" />
                  {dueDate
                    ? dueDate.toLocaleDateString('en-US', {
                        month: 'short',
                        day: '2-digit',
                        year: 'numeric',
                      })
                    : 'Select due date'}
                </button>
              }
            />
          </div>

          <div style={{ marginBottom: '1rem' }}>
            <label style={{
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              fontSize: '0.875rem',
              fontWeight: theme.fonts.weights.medium,
              color: theme.colors.textPrimary,
              marginBottom: '0.5rem',
            }}>
              <User size={14} />
              Assigned To
            </label>
            <input
              type="text"
              value={assignedTo}
              onChange={(e) => setAssignedTo(e.target.value)}
              style={{
                width: '100%',
                padding: '0.5rem 0.75rem',
                border: `1px solid ${theme.colors.border}`,
                borderRadius: theme.borderRadius.md,
                outline: 'none',
                backgroundColor: theme.colors.cardBg,
                color: theme.colors.textPrimary,
                fontFamily: theme.fonts.family,
              }}
              onFocus={(e) => e.target.style.borderColor = theme.colors.borderFocus}
              onBlur={(e) => e.target.style.borderColor = theme.colors.border}
              placeholder="Enter assignee name"
            />
          </div>

          <div style={{ marginBottom: '1.5rem' }}>
            <label style={{
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              fontSize: '0.875rem',
              fontWeight: theme.fonts.weights.medium,
              color: theme.colors.textPrimary,
              marginBottom: '0.5rem',
            }}>
              <Flag size={14} />
              Priority
            </label>
            
            {/* Custom Priority Dropdown */}
            <div style={{ position: 'relative' }}>
              {/* Trigger button */}
              <button
                type="button"
                onClick={() => setPriorityOpen(!priorityOpen)}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                  width: '100%',
                  padding: '11px 14px',
                  background: '#FFFFFF',
                  border: '1px solid #E8E0D0',
                  borderRadius: '8px',
                  cursor: 'pointer',
                  fontSize: '14px',
                  color: '#1A1A1A',
                  fontWeight: 500,
                  justifyContent: 'space-between',
                  boxShadow: '0 1px 3px rgba(0,0,0,0.06)',
                  fontFamily: theme.fonts.family,
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <span style={{
                    width: '8px',
                    height: '8px',
                    borderRadius: '50%',
                    background: selectedPriority.dot,
                    flexShrink: 0,
                  }} />
                  {selectedPriority.label}
                </div>
                <ChevronDown
                  size={15}
                  color="#6B7280"
                  style={{
                    transform: priorityOpen ? 'rotate(180deg)' : 'rotate(0)',
                    transition: 'transform 0.2s ease',
                  }}
                />
              </button>

              {/* Dropdown menu */}
              {priorityOpen && (
                <>
                  {/* Backdrop to close on outside click */}
                  <div
                    onClick={() => setPriorityOpen(false)}
                    style={{
                      position: 'fixed',
                      inset: 0,
                      zIndex: 10,
                    }}
                  />
                  <div style={{
                    position: 'absolute',
                    top: 'calc(100% + 6px)',
                    left: 0,
                    right: 0,
                    background: '#FFFFFF',
                    border: '1px solid #E8E0D0',
                    borderRadius: '10px',
                    boxShadow: '0 8px 24px rgba(0,0,0,0.10)',
                    zIndex: 20,
                    overflow: 'hidden',
                    padding: '4px',
                  }}>
                    {priorityOptions.map(option => (
                      <button
                        key={option.value}
                        type="button"
                        onClick={() => {
                          setPriority(option.value);
                          setPriorityOpen(false);
                        }}
                        style={{
                          display: 'flex',
                          alignItems: 'center',
                          gap: '10px',
                          width: '100%',
                          padding: '9px 12px',
                          border: 'none',
                          borderRadius: '7px',
                          background: priority === option.value ? '#FEF3C7' : 'transparent',
                          color: priority === option.value ? '#D97706' : '#1A1A1A',
                          fontWeight: priority === option.value ? 600 : 400,
                          fontSize: '14px',
                          cursor: 'pointer',
                          textAlign: 'left',
                          transition: 'background 0.15s ease',
                          fontFamily: theme.fonts.family,
                        }}
                        onMouseEnter={e => {
                          if (priority !== option.value)
                            e.currentTarget.style.background = '#FAF7F2';
                        }}
                        onMouseLeave={e => {
                          if (priority !== option.value)
                            e.currentTarget.style.background = 'transparent';
                        }}
                      >
                        <span style={{
                          width: '8px',
                          height: '8px',
                          borderRadius: '50%',
                          background: option.dot,
                          flexShrink: 0,
                        }} />
                        {option.label}
                        {priority === option.value && (
                          <Check size={14} color="#D97706" style={{ marginLeft: 'auto' }} />
                        )}
                      </button>
                    ))}
                  </div>
                </>
              )}
            </div>
          </div>

          <div style={{ display: 'flex', gap: '0.75rem' }}>
            <button
              type="button"
              onClick={onClose}
              style={{
                flex: 1,
                padding: '0.5rem 1rem',
                border: `1px solid ${theme.colors.border}`,
                borderRadius: theme.borderRadius.md,
                backgroundColor: theme.colors.btnSecondary,
                color: theme.colors.btnSecondaryText,
                cursor: 'pointer',
                transition: 'background-color 0.2s',
                fontFamily: theme.fonts.family,
                fontWeight: theme.fonts.weights.medium,
              }}
              onMouseEnter={(e) => e.target.style.backgroundColor = theme.colors.columnBg}
              onMouseLeave={(e) => e.target.style.backgroundColor = theme.colors.btnSecondary}
            >
              Cancel
            </button>
            <button
              type="submit"
              style={{
                flex: 1,
                padding: '0.5rem 1rem',
                backgroundColor: theme.colors.btnPrimary,
                color: theme.colors.btnPrimaryText,
                border: 'none',
                borderRadius: theme.borderRadius.md,
                cursor: 'pointer',
                transition: 'background-color 0.2s',
                fontFamily: theme.fonts.family,
                fontWeight: theme.fonts.weights.medium,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '6px',
              }}
              onMouseEnter={(e) => e.target.style.backgroundColor = theme.colors.btnPrimaryHover}
              onMouseLeave={(e) => e.target.style.backgroundColor = theme.colors.btnPrimary}
            >
              <Plus size={16} />
              Create Task
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
