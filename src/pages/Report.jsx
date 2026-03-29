import { useState, useEffect } from 'react';
import { format } from 'date-fns';
import { getDailyReport, getOverdueTasks } from '../api/tasks';
import { Calendar, TrendingUp, CheckCircle, AlertCircle, Clock, LayoutDashboard, AlertTriangle } from 'lucide-react';
import theme from '../theme';

export default function Report() {
  const [selectedDate, setSelectedDate] = useState(format(new Date(), 'yyyy-MM-dd'));
  const [report, setReport] = useState(null);
  const [overdueTasks, setOverdueTasks] = useState([]);

  useEffect(() => {
    fetchReport();
    fetchOverdueTasks();
  }, [selectedDate]);

  const formatDate = (date) => {
    const d = new Date(date);
    return d.toISOString().split('T')[0];
  };

  const fetchReport = async () => {
    try {
      const formattedDate = formatDate(selectedDate);
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
      padding: '2rem',
      backgroundColor: theme.colors.pageBg,
      overflowY: 'auto',
      fontFamily: theme.fonts.family,
      minHeight: '100vh',
      paddingBottom: '40px',
    }} className="report-page">
      {/* Page Header */}
      <div style={{ marginBottom: '2rem', display: 'flex', alignItems: 'center', gap: '12px' }}>
        <TrendingUp size={28} color="#F59E0B" />
        <div>
          <h1 style={{
            fontSize: '28px',
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
        <div style={{ position: 'relative', width: 'fit-content' }}>
          <input
            type="date"
            value={selectedDate}
            onChange={(e) => setSelectedDate(e.target.value)}
            style={{
              padding: '10px 14px 10px 38px',
              border: '1px solid #E8E0D0',
              borderRadius: '8px',
              backgroundColor: 'white',
              color: theme.colors.textPrimary,
              outline: 'none',
              fontFamily: theme.fonts.family,
              fontSize: '14px',
            }}
            onFocus={(e) => e.target.style.borderColor = '#F59E0B'}
            onBlur={(e) => e.target.style.borderColor = '#E8E0D0'}
          />
          <Calendar size={16} color="#9CA3AF" style={{
            position: 'absolute',
            left: '12px',
            top: '50%',
            transform: 'translateY(-50%)',
            pointerEvents: 'none',
          }} />
        </div>
      </div>

      {/* Summary Cards */}
      {report && (
        <div className="stat-cards-row" style={{
          display: 'flex',
          flexDirection: isMobile ? 'column' : 'row',
          gap: '1.5rem',
          marginBottom: '2rem',
        }}>
          {/* Total Tasks Card */}
          <div style={{
            backgroundColor: 'white',
            border: '1px solid #E8E0D0',
            borderRadius: '12px',
            padding: '20px',
            position: 'relative',
          }}>
            <LayoutDashboard size={28} color="#F59E0B" style={{
              position: 'absolute',
              top: '20px',
              right: '20px',
              opacity: 1,
            }} />
            <div style={{
              fontSize: '32px',
              fontWeight: 700,
              color: '#F59E0B',
              marginBottom: '0.5rem',
            }}>
              {getTotalTasks()}
            </div>
            <div style={{
              fontSize: '13px',
              color: '#6B7280',
            }}>
              Total Tasks
            </div>
          </div>

          {/* Completed Card */}
          <div style={{
            backgroundColor: 'white',
            border: '1px solid #E8E0D0',
            borderRadius: '12px',
            padding: '20px',
            position: 'relative',
          }}>
            <CheckCircle size={28} color="#22C55E" style={{
              position: 'absolute',
              top: '20px',
              right: '20px',
              opacity: 1,
            }} />
            <div style={{
              fontSize: '32px',
              fontWeight: 700,
              color: '#F59E0B',
              marginBottom: '0.5rem',
            }}>
              {getCompletedTasks()}
            </div>
            <div style={{
              fontSize: '13px',
              color: '#6B7280',
            }}>
              Completed
            </div>
          </div>

          {/* Overdue Card */}
          <div style={{
            backgroundColor: 'white',
            border: '1px solid #E8E0D0',
            borderRadius: '12px',
            padding: '20px',
            position: 'relative',
          }}>
            <AlertCircle size={28} color="#EF4444" style={{
              position: 'absolute',
              top: '20px',
              right: '20px',
              opacity: 1,
            }} />
            <div style={{
              fontSize: '32px',
              fontWeight: 700,
              color: '#F59E0B',
              marginBottom: '0.5rem',
            }}>
              {overdueTasks.length}
            </div>
            <div style={{
              fontSize: '13px',
              color: '#6B7280',
            }}>
              Overdue
            </div>
          </div>
        </div>
      )}

      {/* Report Table */}
      {report && (
        <div className="report-table" style={{
          backgroundColor: 'white',
          borderRadius: '12px',
          border: '1px solid #E8E0D0',
          overflow: 'hidden',
          marginBottom: '2rem',
          overflowX: isMobile ? 'auto' : 'visible',
        }}>
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
              <tr style={{ backgroundColor: '#FAF7F2' }}>
                <th style={{
                  textAlign: 'left',
                  padding: '12px 20px',
                  fontSize: '12px',
                  fontWeight: 600,
                  color: '#6B7280',
                  textTransform: 'uppercase',
                  letterSpacing: '0.05em',
                }}>Priority</th>
                <th style={{
                  textAlign: 'center',
                  padding: '12px 20px',
                  fontSize: '12px',
                  fontWeight: 600,
                  color: '#6B7280',
                  textTransform: 'uppercase',
                  letterSpacing: '0.05em',
                }}>Pending</th>
                <th style={{
                  textAlign: 'center',
                  padding: '12px 20px',
                  fontSize: '12px',
                  fontWeight: 600,
                  color: '#6B7280',
                  textTransform: 'uppercase',
                  letterSpacing: '0.05em',
                }}>In Progress</th>
                <th style={{
                  textAlign: 'center',
                  padding: '12px 20px',
                  fontSize: '12px',
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
                    padding: '16px 20px',
                  }}>
                    <div style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '8px',
                    }}>
                      <span style={{
                        width: '8px',
                        height: '8px',
                        borderRadius: '50%',
                        backgroundColor: priorityColors[priority],
                      }} />
                      <span style={{
                        textTransform: 'capitalize',
                        color: '#1A1A1A',
                        fontWeight: 500,
                      }}>
                        {priority}
                      </span>
                    </div>
                  </td>
                  <td style={{
                    textAlign: 'center',
                    padding: '16px 20px',
                    fontSize: '15px',
                    fontWeight: 600,
                    color: '#1A1A1A',
                  }}>{counts.pending}</td>
                  <td style={{
                    textAlign: 'center',
                    padding: '16px 20px',
                    fontSize: '15px',
                    fontWeight: 600,
                    color: '#1A1A1A',
                  }}>{counts.in_progress}</td>
                  <td style={{
                    textAlign: 'center',
                    padding: '16px 20px',
                    fontSize: '15px',
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
      <div style={{ marginTop: '32px' }}>
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
          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
            {overdueTasks.map((task) => (
              <div
                key={task.id}
                style={{
                  backgroundColor: '#FEF2F2',
                  border: '1px solid #FECACA',
                  borderRadius: '8px',
                  padding: '12px 16px',
                }}
              >
                <div style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                  marginBottom: '4px',
                }}>
                  <AlertTriangle size={14} color="#EF4444" />
                  <span style={{
                    width: '6px',
                    height: '6px',
                    borderRadius: '50%',
                    backgroundColor: priorityColors[task.priority],
                  }} />
                  <h3 style={{
                    fontWeight: 600,
                    color: '#1A1A1A',
                    fontSize: '14px',
                  }}>
                    {task.title}
                  </h3>
                </div>
                <div style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '6px',
                  marginLeft: '30px',
                }}>
                  <Clock size={12} color="#EF4444" />
                  <p style={{
                    fontSize: '13px',
                    color: '#EF4444',
                    margin: 0,
                  }}>
                    Due: {format(new Date(task.due_date), 'MMM dd, yyyy')}
                  </p>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div style={{
            backgroundColor: 'white',
            border: '1px solid #E8E0D0',
            borderRadius: '12px',
            padding: '3rem',
            textAlign: 'center',
          }}>
            <CheckCircle size={48} color="#22C55E" style={{ margin: '0 auto 1rem' }} />
            <p style={{
              fontSize: '16px',
              color: '#22C55E',
              fontWeight: 500,
            }}>
              All caught up! No overdue tasks.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
