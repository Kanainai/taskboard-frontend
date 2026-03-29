import { useState, useEffect } from 'react';
import { getTasks, createTask, updateTaskStatus, deleteTask } from '../api/tasks';
import { Plus, Clock, ChevronRight, CheckSquare, ChevronDown, Check } from 'lucide-react';
import Column from '../components/Column';
import CreateTaskModal from '../components/CreateTaskModal';
import ConfirmModal from '../components/ConfirmModal';
import theme from '../theme';

// Skeleton Card Component
const SkeletonCard = () => (
  <div style={{
    background: '#fff',
    border: '1px solid #E8E0D0',
    borderRadius: '10px',
    padding: '16px',
    marginBottom: '8px',
    animation: 'pulse 1.5s ease-in-out infinite',
  }}>
    <div style={{
      height: '14px',
      background: '#F3F0E8',
      borderRadius: '4px',
      marginBottom: '10px',
      width: '75%',
    }} />
    <div style={{
      height: '12px',
      background: '#F3F0E8',
      borderRadius: '4px',
      width: '40%',
    }} />
  </div>
);

export default function Board({ onTaskChange }) {
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [priorityFilter, setPriorityFilter] = useState('all');
  const [filterOpen, setFilterOpen] = useState(false);
  const [confirmDelete, setConfirmDelete] = useState({ isOpen: false, taskId: null, taskTitle: '' });
  const [confirmAdvance, setConfirmAdvance] = useState({ isOpen: false, task: null });
  const [activeTab, setActiveTab] = useState('pending');
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 768);

  const filterOptions = [
    { value: 'all', label: 'All Priorities', dot: null },
    { value: 'high', label: 'High', dot: '#EF4444' },
    { value: 'medium', label: 'Medium', dot: '#F59E0B' },
    { value: 'low', label: 'Low', dot: '#22C55E' },
  ];

  const selectedOption = filterOptions.find(o => o.value === priorityFilter);

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth <= 768);
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  useEffect(() => {
    fetchTasks();
  }, [priorityFilter]);

  const fetchTasks = async () => {
    setLoading(true);
    try {
      const filters = {};
      if (priorityFilter && priorityFilter !== 'all') filters.priority = priorityFilter;
      const response = await getTasks(filters);
      setTasks(response.data.tasks || response.data);
    } catch (error) {
      console.error('Error fetching tasks:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleCreateTask = async (taskData) => {
    await createTask(taskData);
    fetchTasks();
    if (onTaskChange) onTaskChange();
  };

  const handleAdvanceStatus = async (task) => {
    setConfirmAdvance({
      isOpen: true,
      task: task,
    });
  };

  const handleConfirmAdvance = async () => {
    try {
      await updateTaskStatus(confirmAdvance.task.id);
      setConfirmAdvance({ isOpen: false, task: null });
      fetchTasks();
      if (onTaskChange) onTaskChange();
    } catch (error) {
      console.error('Error updating task:', error);
      alert(error.response?.data?.error || 'Failed to update task');
      setConfirmAdvance({ isOpen: false, task: null });
    }
  };

  const handleCancelAdvance = () => {
    setConfirmAdvance({ isOpen: false, task: null });
  };

  const handleDeleteClick = (task) => {
    setConfirmDelete({
      isOpen: true,
      taskId: task.id,
      taskTitle: task.title,
    });
  };

  const handleConfirmDelete = async () => {
    try {
      await deleteTask(confirmDelete.taskId);
      setConfirmDelete({ isOpen: false, taskId: null, taskTitle: '' });
      fetchTasks();
      if (onTaskChange) onTaskChange();
    } catch (error) {
      console.error('Error deleting task:', error);
      alert(error.response?.data?.error || 'Failed to delete task');
      setConfirmDelete({ isOpen: false, taskId: null, taskTitle: '' });
    }
  };

  const handleCancelDelete = () => {
    setConfirmDelete({ isOpen: false, taskId: null, taskTitle: '' });
  };

  const pendingTasks = tasks.filter((t) => t.status === 'pending');
  const inProgressTasks = tasks.filter((t) => t.status === 'in_progress');
  const doneTasks = tasks.filter((t) => t.status === 'done');

  const MobileTabBar = () => (
    <div style={{
      display: 'flex',
      gap: '8px',
      marginBottom: '16px',
      padding: '0 4px'
    }}>
      {[
        { 
          key: 'pending', 
          label: 'Pending', 
          count: pendingTasks.length,
          bg: '#FEF3C7',
          activeBorder: '#F59E0B',
          icon: <Clock size={14} />
        },
        { 
          key: 'in_progress', 
          label: 'In Progress', 
          count: inProgressTasks.length,
          bg: '#DBEAFE',
          activeBorder: '#3B82F6',
          icon: <ChevronRight size={14} />
        },
        { 
          key: 'done', 
          label: 'Done', 
          count: doneTasks.length,
          bg: '#D1FAE5',
          activeBorder: '#22C55E',
          icon: <CheckSquare size={14} />
        }
      ].map(tab => (
        <button
          key={tab.key}
          onClick={() => setActiveTab(tab.key)}
          style={{
            flex: 1,
            padding: '10px 6px',
            border: 'none',
            borderRadius: '10px',
            background: activeTab === tab.key ? tab.bg : '#F9F7F2',
            outline: activeTab === tab.key 
              ? `2px solid ${tab.activeBorder}` 
              : '1px solid #E8E0D0',
            cursor: 'pointer',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            gap: '4px',
            transition: 'all 0.15s ease',
            fontFamily: theme.fonts.family,
          }}
        >
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: '4px',
            color: activeTab === tab.key ? '#1A1A1A' : '#6B7280'
          }}>
            {tab.icon}
            <span style={{
              fontSize: '12px',
              fontWeight: activeTab === tab.key ? 600 : 400
            }}>
              {tab.label}
            </span>
          </div>
          <span style={{
            background: activeTab === tab.key ? tab.activeBorder : '#E8E0D0',
            color: 'white',
            borderRadius: '9999px',
            padding: '1px 8px',
            fontSize: '11px',
            fontWeight: 700
          }}>
            {tab.count}
          </span>
        </button>
      ))}
    </div>
  );

  return (
    <div style={{
      flex: 1,
      display: 'flex',
      flexDirection: 'column',
      height: '100dvh',
      backgroundColor: theme.colors.pageBg,
      fontFamily: theme.fonts.family,
      overflow: 'hidden',
    }} className="board-page">
      {/* Page Header */}
      <div className="board-header" style={{
        padding: '2rem',
        paddingBottom: '1rem',
        flexShrink: 0,
        display: 'flex',
        alignItems: 'flex-start',
        justifyContent: 'space-between',
      }}>
        <div>
          <h1 className="board-title" style={{
            fontSize: '26px',
            fontWeight: 700,
            color: theme.colors.textPrimary,
            marginBottom: '0.25rem',
          }}>
            My Workspace
          </h1>
          <p style={{
            fontSize: '13px',
            color: '#9CA3AF',
          }}>
            Track and manage your tasks
          </p>
        </div>
        
        <div className="board-header-actions" style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
          {/* Custom Priority Filter Dropdown */}
          <div style={{ position: 'relative' }}>
            {/* Trigger button */}
            <button
              onClick={() => setFilterOpen(!filterOpen)}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                padding: '9px 14px',
                background: '#FFFFFF',
                border: '1px solid #E8E0D0',
                borderRadius: '8px',
                cursor: 'pointer',
                fontSize: '14px',
                color: '#1A1A1A',
                fontWeight: 500,
                minWidth: '150px',
                justifyContent: 'space-between',
                boxShadow: '0 1px 3px rgba(0,0,0,0.06)',
                fontFamily: theme.fonts.family,
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                {selectedOption.dot && (
                  <span style={{
                    width: '8px',
                    height: '8px',
                    borderRadius: '50%',
                    background: selectedOption.dot,
                    flexShrink: 0,
                  }} />
                )}
                {selectedOption.label}
              </div>
              <ChevronDown
                size={15}
                color="#6B7280"
                style={{
                  transform: filterOpen ? 'rotate(180deg)' : 'rotate(0)',
                  transition: 'transform 0.2s ease',
                }}
              />
            </button>

            {/* Dropdown menu */}
            {filterOpen && (
              <>
                {/* Backdrop to close on outside click */}
                <div
                  onClick={() => setFilterOpen(false)}
                  style={{
                    position: 'fixed',
                    inset: 0,
                    zIndex: 10,
                  }}
                />
                <div style={{
                  position: 'absolute',
                  top: 'calc(100% + 6px)',
                  right: 0,
                  background: '#FFFFFF',
                  border: '1px solid #E8E0D0',
                  borderRadius: '10px',
                  boxShadow: '0 8px 24px rgba(0,0,0,0.10)',
                  zIndex: 20,
                  minWidth: '160px',
                  overflow: 'hidden',
                  padding: '4px',
                }}>
                  {filterOptions.map(option => (
                    <button
                      key={option.value}
                      onClick={() => {
                        setPriorityFilter(option.value);
                        setFilterOpen(false);
                      }}
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '10px',
                        width: '100%',
                        padding: '9px 12px',
                        border: 'none',
                        borderRadius: '7px',
                        background: priorityFilter === option.value ? '#FEF3C7' : 'transparent',
                        color: priorityFilter === option.value ? '#D97706' : '#1A1A1A',
                        fontWeight: priorityFilter === option.value ? 600 : 400,
                        fontSize: '14px',
                        cursor: 'pointer',
                        textAlign: 'left',
                        transition: 'background 0.15s ease',
                        fontFamily: theme.fonts.family,
                      }}
                      onMouseEnter={e => {
                        if (priorityFilter !== option.value)
                          e.currentTarget.style.background = '#FAF7F2';
                      }}
                      onMouseLeave={e => {
                        if (priorityFilter !== option.value)
                          e.currentTarget.style.background = 'transparent';
                      }}
                    >
                      {option.dot ? (
                        <span style={{
                          width: '8px',
                          height: '8px',
                          borderRadius: '50%',
                          background: option.dot,
                          flexShrink: 0,
                        }} />
                      ) : (
                        <span style={{ width: '8px', flexShrink: 0 }} />
                      )}
                      {option.label}
                      {priorityFilter === option.value && (
                        <Check size={14} color="#D97706" style={{ marginLeft: 'auto' }} />
                      )}
                    </button>
                  ))}
                </div>
              </>
            )}
          </div>
          
          <button
            onClick={() => setIsModalOpen(true)}
            style={{
              padding: '10px 18px',
              backgroundColor: theme.colors.btnPrimary,
              color: theme.colors.btnPrimaryText,
              border: 'none',
              borderRadius: theme.borderRadius.md,
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              fontWeight: theme.fonts.weights.medium,
              transition: 'background-color 0.2s',
              fontFamily: theme.fonts.family,
              fontSize: '14px',
            }}
            onMouseEnter={(e) => e.target.style.backgroundColor = theme.colors.btnPrimaryHover}
            onMouseLeave={(e) => e.target.style.backgroundColor = theme.colors.btnPrimary}
          >
            <Plus size={16} />
            New Task
          </button>
        </div>
      </div>

      {/* Mobile Tabs */}
      {isMobile && (
        <div style={{ padding: '0 1rem', flexShrink: 0 }}>
          <MobileTabBar />
        </div>
      )}

      {/* Columns */}
      {isMobile ? (
        <div style={{ 
          height: 'calc(100dvh - 60px)', 
          overflowY: 'auto',
          padding: '0 1rem 1rem 1rem'
        }}>
          {activeTab === 'pending' && (
            <Column
              title="Pending"
              tasks={pendingTasks}
              loading={loading}
              onAdvance={handleAdvanceStatus}
              onDelete={handleDeleteClick}
              SkeletonCard={SkeletonCard}
            />
          )}
          {activeTab === 'in_progress' && (
            <Column
              title="In Progress"
              tasks={inProgressTasks}
              loading={loading}
              onAdvance={handleAdvanceStatus}
              onDelete={handleDeleteClick}
              SkeletonCard={SkeletonCard}
            />
          )}
          {activeTab === 'done' && (
            <Column
              title="Done"
              tasks={doneTasks}
              loading={loading}
              onAdvance={handleAdvanceStatus}
              onDelete={handleDeleteClick}
              SkeletonCard={SkeletonCard}
            />
          )}
        </div>
      ) : (
        <div style={{
          display: 'grid',
          gridTemplateColumns: '1fr 1fr 1fr',
          gap: '20px',
          padding: '0 2rem 2rem 2rem',
          height: 'calc(100dvh - 140px)',
          alignItems: 'start',
        }}>
          <Column
            title="Pending"
            tasks={pendingTasks}
            loading={loading}
            onAdvance={handleAdvanceStatus}
            onDelete={handleDeleteClick}
            SkeletonCard={SkeletonCard}
          />
          <Column
            title="In Progress"
            tasks={inProgressTasks}
            loading={loading}
            onAdvance={handleAdvanceStatus}
            onDelete={handleDeleteClick}
            SkeletonCard={SkeletonCard}
          />
          <Column
            title="Done"
            tasks={doneTasks}
            loading={loading}
            onAdvance={handleAdvanceStatus}
            onDelete={handleDeleteClick}
            SkeletonCard={SkeletonCard}
          />
        </div>
      )}

      <CreateTaskModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSubmit={handleCreateTask}
      />

      <ConfirmModal
        isOpen={confirmDelete.isOpen}
        onConfirm={handleConfirmDelete}
        onCancel={handleCancelDelete}
        taskTitle={confirmDelete.taskTitle}
        type="delete"
      />

      <ConfirmModal
        isOpen={confirmAdvance.isOpen}
        onConfirm={handleConfirmAdvance}
        onCancel={handleCancelAdvance}
        taskTitle={confirmAdvance.task?.title}
        type={confirmAdvance.task?.status === 'pending' ? 'start' : 'finish'}
      />
    </div>
  );
}
