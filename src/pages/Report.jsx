import { useState, useEffect } from 'react';
import { format } from 'date-fns';
import { getDailyReport, getOverdueTasks } from '../api/tasks';
import { Calendar, TrendingUp, CheckCircle, AlertCircle, Clock, LayoutDashboard, AlertTriangle } from 'lucide-react';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import theme from '../theme';

export default function Report({ onTaskChange }) {
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [report, setReport] = useState(null);
  const [overdueTasks, setOverdueTasks] = useState([]);

  useEffect(() => {
    fetchReport();
    fetchOverdueTasks();
  }, [selectedDate]);

  const formatDate = (date) => {
    if (!date) return '';
    return date.toISOString().split('T')[0];
  };

  const fetchReport = async (dateString) => {
    try {
      const formattedDate = dateString || formatDate(selectedDate);
      console.log('Fetching report for date:', formattedDate);
      const response = await getDailyReport(formattedDate);
      console.log('Report response:', response.data);
      setReport(response.data);
    } catch (error) {
      console.error('Error fetching report:', error);
    }
  };

  const fetchOverdueTasks = async () => {
    try {
      const response = await getOverdueTasks();
      console.log('Overdue tasks response:', response.data);
      console.log('Overdue tasks count:', Array.isArray(response.data) ? response.data.length : 0);
      setOverdueTasks(response.data);
    } catch (error) {
      console.error('Error fetching overdue tasks:', error);
    }
  };

  const priorityColors = {
    high: '#EF4444',
    medium: '#F59E0B',
    low: '#22C55E',
  };

  const priorityDots = {
    high: '🔴',
    medium: '🟠',
    low: '🟢',
  };

  // Calculate totals
  const getTotalTasks = () => {
    if (!report) return 0;
    let total = 0;
    Object.values(report.summary).forEach(counts => {
      total += counts.pending + counts.in_progress + counts.done;
    });
    return total;
  };

  const getCompletedTasks = () => {
    if (!report) return 0;
    let completed = 0;
    Object.values(report.summary).forEach(counts => {
      completed += counts.done;
    });
    console.log('Completed tasks for selected date:', completed);
    return completed;
  };

  const [isMobile, setIsMobile] = useState(window.innerWidth <= 768);

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth <= 768);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  return (
    <div style={{
      flex: 1,
      padding: isMobile ? '16px' : '32px',
      backgroundColor: theme.colors.pageBg,
      overflowY: 'auto',
      fontFamily: theme.fonts.family,
      minHeight: '100dvh',
      paddingBottom: '40px',
    }} className="report-page">
      {/* Page Header */}
      <div style={{ marginBottom: '2rem', display: 'flex', alignItems: 'center', gap: '12px' }}>
        <TrendingUp size={28} color="#F59E0B" />
        <div>
          <h1 style={{
            fontSize: isMobile ? '22px' : '28px',
            fontWeight: 700,
            color: theme.colors.textPrimary,
            marginBottom: '0.25rem',
          }}>
            Daily Report
          </h1>
          <p style={{
            fontSize: '14px',
            color: '#6B7280',
          }}>
            Task summary by priority and status
          </p>
        </div>
      </div>

      {/* Date Picker */}
      <div style={{ marginBottom: '2rem' }}>
        <label style={{
          display: 'flex',
          alignItems: 'center',
          gap: '6px',
          fontSize: '13px',
          fontWeight: 500,
          color: '#374151',
          marginBottom: '0.5rem',
        }}>
          <Calendar size={14} />
          Select Date
        </label>
        <div style={{ position: 'relative', zIndex: 9999, marginBottom: '24px' }}>
          <DatePicker
            selected={selectedDate}
            onChange={(date) => {
              setSelectedDate(date);
              fetchReport(formatDate(date));
            }}
            dateFormat="MMM dd, yyyy"
            maxDate={new Date()}
            withPortal={window.innerWidth <= 768}
            popperPlacement="bottom-start"
            popperProps={{
              strategy: 'fixed'
            }}
            portalId="root"
            customInput={
              <button
                type="button"
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                  padding: '10px 14px',
                  background: '#FFFFFF',
                  border: '1px solid #E8E0D0',
                  borderRadius: '8px',
                  cursor: 'pointer',
                  fontSize: '14px',
                  color: '#1A1A1A',
                  fontWeight: 400,
                  textAlign: 'left',
                  minWidth: '180px',
                  fontFamily: theme.fonts.family,
                }}
              >
                <Calendar size={15} color="#9CA3AF" />
                {selectedDate
                  ? selectedDate.toLocaleDateString('en-US', {
                      month: 'short',
                      day: '2-digit',
                      year: 'numeric',
                    })
                  : 'Select date'}
              </button>
            }
          />
        </div>
      </div>

      {/* Summary Cards */}
      {report && (
        <div style={{
          display: 'flex',
          flexDirection: 'row',
          gap: isMobile ? '8px' : '1.5rem',
          marginBottom: isMobile ? '24px' : '2rem',
        }}>
          {/* Total Tasks Card */}
          <div style={{
            background: '#FFFFFF',
            border: '1px solid #E8E0D0',
            borderRadius: '12px',
            padding: isMobile ? '12px' : '24px',
            flex: 1,
            display: 'flex',
            flexDirection: 'column',
            gap: '8px',
            minWidth: 0,
          }}>
            <div style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'flex-start',
            }}>
              <div style={{
                fontSize: isMobile ? '24px' : '40px',
                fontWeight: '700',
                color: '#F59E0B',
                lineHeight: 1,
              }}>
                {getTotalTasks()}
              </div>
              <LayoutDashboard size={isMobile ? 20 : 32} color="#F59E0B" />
            </div>
            <div style={{
              fontSize: isMobile ? '11px' : '14px',
              color: '#6B7280',
              fontWeight: '500',
            }}>
              Total Tasks
            </div>
          </div>

          {/* Completed Card */}
          <div style={{
            background: '#FFFFFF',
            border: '1px solid #E8E0D0',
            borderRadius: '12px',
            padding: isMobile ? '12px' : '24px',
            flex: 1,
            display: 'flex',
            flexDirection: 'column',
            gap: '8px',
            minWidth: 0,
          }}>
            <div style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'flex-start',
            }}>
              <div style={{
                fontSize: isMobile ? '24px' : '40px',
                fontWeight: '700',
                color: '#F59E0B',
                lineHeight: 1,
              }}>
                {getCompletedTasks()}
              </div>
              <CheckCircle size={isMobile ? 20 : 32} color="#22C55E" />
            </div>
            <div style={{
              fontSize: isMobile ? '11px' : '14px',
              color: '#6B7280',
              fontWeight: '500',
            }}>
              Completed
            </div>
          </div>

          {/* Overdue Card */}
          <div style={{
            background: '#FFFFFF',
            border: '1px solid #E8E0D0',
            borderRadius: '12px',
            padding: isMobile ? '12px' : '24px',
            flex: 1,
            display: 'flex',
            flexDirection: 'column',
            gap: '8px',
            minWidth: 0,
          }}>
            <div style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'flex-start',
            }}>
              <div style={{
                fontSize: isMobile ? '24px' : '40px',
                fontWeight: '700',
                color: '#F59E0B',
                lineHeight: 1,
              }}>
                {overdueTasks.length}
              </div>
              <AlertCircle size={isMobile ? 20 : 32} color="#EF4444" />
            </div>
            <div style={{
              fontSize: isMobile ? '11px' : '14px',
              color: '#6B7280',
              fontWeight: '500',
            }}>
              Overdue
            </div>
          </div>
        </div>
      )}

      {/* Report Table */}
      {report && (
        <div style={{
          overflowX: 'auto',
          WebkitOverflowScrolling: 'touch',
          borderRadius: '12px',
          border: '1px solid #E8E0D0',
          marginBottom: isMobile ? '24px' : '2rem',
        }}>
          <table style={{
            width: '100%',
            minWidth: isMobile ? '400px' : '500px',
            borderCollapse: 'collapse',
            background: 'white',
          }}>
            <thead>
              <tr style={{ backgroundColor: '#FAF7F2' }}>
                <th style={{
                  textAlign: 'left',
                  padding: isMobile ? '8px 6px' : '12px 20px',
                  fontSize: isMobile ? '11px' : '12px',
                  fontWeight: 600,
                  color: '#6B7280',
                  textTransform: 'uppercase',
                  letterSpacing: '0.05em',
                  width: isMobile ? '80px' : 'auto',
                }}>Priority</th>
                <th style={{
                  textAlign: 'center',
                  padding: isMobile ? '8px 6px' : '12px 20px',
                  fontSize: isMobile ? '11px' : '12px',
                  fontWeight: 600,
                  color: '#6B7280',
                  textTransform: 'uppercase',
                  letterSpacing: '0.05em',
                }}>Pending</th>
                <th style={{
                  textAlign: 'center',
                  padding: isMobile ? '8px 6px' : '12px 20px',
                  fontSize: isMobile ? '11px' : '12px',
                  fontWeight: 600,
                  color: '#6B7280',
                  textTransform: 'uppercase',
                  letterSpacing: '0.05em',
                }}>In Progress</th>
                <th style={{
                  textAlign: 'center',
                  padding: isMobile ? '8px 6px' : '12px 20px',
                  fontSize: isMobile ? '11px' : '12px',
                  fontWeight: 600,
                  color: '#6B7280',
                  textTransform: 'uppercase',
                  letterSpacing: '0.05em',
                }}>Done</th>
              </tr>
            </thead>
            <tbody>
              {Object.entries(report.summary).map(([priority, counts]) => (
                <tr 
                  key={priority} 
                  style={{ 
                    borderBottom: '1px solid #F3F0E8',
                    transition: 'background-color 0.15s',
                  }}
                  onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#FAFAF8'}
                  onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
                >
                  <td style={{
                    padding: isMobile ? '8px 6px' : '16px 20px',
                  }}>
                    <div style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: isMobile ? '4px' : '8px',
                    }}>
                      <span style={{
                        width: isMobile ? '6px' : '8px',
                        height: isMobile ? '6px' : '8px',
                        borderRadius: '50%',
                        backgroundColor: priorityColors[priority],
                      }} />
                      <span style={{
                        textTransform: 'capitalize',
                        color: '#1A1A1A',
                        fontWeight: 500,
                        fontSize: isMobile ? '12px' : '14px',
                      }}>
                        {priority}
                      </span>
                    </div>
                  </td>
                  <td style={{
                    textAlign: 'center',
                    padding: isMobile ? '8px 6px' : '16px 20px',
                    fontSize: isMobile ? '12px' : '15px',
                    fontWeight: 600,
                    color: '#1A1A1A',
                  }}>{counts.pending}</td>
                  <td style={{
                    textAlign: 'center',
                    padding: isMobile ? '8px 6px' : '16px 20px',
                    fontSize: isMobile ? '12px' : '15px',
                    fontWeight: 600,
                    color: '#1A1A1A',
                  }}>{counts.in_progress}</td>
                  <td style={{
                    textAlign: 'center',
                    padding: isMobile ? '8px 6px' : '16px 20px',
                    fontSize: isMobile ? '12px' : '15px',
                    fontWeight: 600,
                    color: '#1A1A1A',
                  }}>{counts.done}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Section Divider */}
      <div style={{
        height: '1px',
        background: '#E8E0D0',
        margin: '32px 0',
      }} />

      {/* Overdue Tasks Section */}
      <div style={{ marginTop: isMobile ? '16px' : '32px' }}>
        <h2 style={{
          fontSize: '20px',
          fontWeight: 600,
          color: '#1A1A1A',
          marginBottom: '1rem',
          display: 'flex',
          alignItems: 'center',
          gap: '8px',
        }}>
          <AlertTriangle size={20} color="#EF4444" />
          Overdue Tasks
        </h2>

        {overdueTasks.length > 0 ? (
          <div className="overdue-list" style={{
            maxHeight: '300px',
            overflowY: 'auto',
            scrollbarWidth: 'none',
            msOverflowStyle: 'none',
          }}>
            {overdueTasks.map((task) => (
              <div
                key={task.id}
                style={{
                  background: '#FEF2F2',
                  border: '1px solid #FECACA',
                  borderRadius: '8px',
                  padding: isMobile ? '10px 12px' : '12px 16px',
                  marginBottom: '8px',
                  display: 'flex',
                  alignItems: 'center',
                  gap: isMobile ? '8px' : '12px',
                }}
              >
                <AlertTriangle size={14} color="#EF4444" />
                <span style={{
                  fontWeight: 600,
                  color: '#1A1A1A',
                  fontSize: isMobile ? '13px' : '14px',
                }}>
                  {task.title}
                </span>
                <div style={{ flex: 1 }} />
                <div style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '6px',
                }}>
                  <span style={{
                    width: '6px',
                    height: '6px',
                    borderRadius: '50%',
                    backgroundColor: priorityColors[task.priority],
                  }} />
                  <span style={{
                    fontSize: isMobile ? '12px' : '13px',
                    color: '#6B7280',
                    textTransform: 'capitalize',
                  }}>
                    {task.priority}
                  </span>
                </div>
                <div style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '4px',
                }}>
                  <Clock size={12} color="#EF4444" />
                  <span style={{
                    fontSize: isMobile ? '12px' : '13px',
                    color: '#EF4444',
                  }}>
                    {format(new Date(task.due_date), 'MMM dd, yyyy')}
                  </span>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '32px',
            background: '#F0FDF4',
            borderRadius: '12px',
            border: '1px solid #BBF7D0',
          }}>
            <CheckCircle size={36} color="#22C55E" style={{ marginBottom: '12px' }} />
            <p style={{
              fontSize: '16px',
              color: '#22C55E',
              fontWeight: 500,
              margin: 0,
            }}>
              All caught up! No overdue tasks.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
