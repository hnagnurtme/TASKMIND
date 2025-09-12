import React, { useState } from 'react';
import TaskItem from './TaskItem';
import TaskModal from './AddTask'; // Updated import to TaskModal
import { useTasks } from '@/contexts/tasks.context';
import { Task } from '@/interface/task';

// ----------------------------
// TaskList Component chính
// ----------------------------
const TaskList: React.FC = () => {
  const {
    tasks,
    sortedTasks,
    stats,
    addTask,
    toggleComplete,
    editTask,
    deleteTask
  } = useTasks();

  const [showModal, setShowModal] = useState(false);
  const [taskToEdit, setTaskToEdit] = useState<Task | null>(null);

  const handleOpenAddModal = () => {
    setTaskToEdit(null);
    setShowModal(true);
  };

  const handleOpenEditModal = (task: any) => {
    setTaskToEdit(task);
    setShowModal(true);
  };

  return (
    <div className="task-list">
      <TaskListHeader
        taskCount={tasks.length}
        onOpenAddModal={handleOpenAddModal}
      />

      <TaskStats stats={stats} />

      <TasksContainer
        tasks={sortedTasks}
        onToggleComplete={toggleComplete}
        onEdit={handleOpenEditModal}
        onDelete={deleteTask}
        onOpenAddModal={handleOpenAddModal}
      />

      <TaskModal
        isOpen={showModal}
        onClose={() => setShowModal(false)}
        onSubmit={(task) => {
          if (taskToEdit) {
            editTask({
              id: taskToEdit.id,
              completed: taskToEdit.completed,
              completedAt: taskToEdit.completedAt,
              ...task
            });
          } else {
            addTask(task);
          }
        }}
        taskToEdit={taskToEdit}
      />
    </div>
  );
};

export default TaskList;

// ----------------------------
// Header
// ----------------------------
interface TaskListHeaderProps {
  taskCount: number;
  onOpenAddModal: () => void;
}

function TaskListHeader({ taskCount, onOpenAddModal }: TaskListHeaderProps) {
  return (
    <div className="task-list-header">
      <h2 className="list-title">📋 Danh sách công việc ({taskCount})</h2>
      <button className="add-task-btn" onClick={onOpenAddModal}>
        ➕ Thêm task
      </button>
    </div>
  );
}

// ----------------------------
// Stats
// ----------------------------
interface TaskStatsProps {
  stats: {
    incomplete: number;
    completed: number;
    overdue: number;
  };
}

function TaskStats({ stats }: TaskStatsProps) {
  return (
    <div className="task-stats">
      <div className="stat-item">
        <span className="stat-number">{stats.incomplete}</span>
        <span className="stat-label">Chưa hoàn thành</span>
      </div>
      <div className="stat-item">
        <span className="stat-number">{stats.completed}</span>
        <span className="stat-label">Đã hoàn thành</span>
      </div>
      <div className="stat-item">
        <span className="stat-number">{stats.overdue}</span>
        <span className="stat-label">Quá hạn</span>
      </div>
    </div>
  );
}

// ----------------------------
// Tasks Container
// ----------------------------
interface TasksContainerProps {
  tasks: any[];
  onToggleComplete: (id: string) => void;
  onEdit: (task: any) => void;
  onDelete: (id: string) => void;
  onOpenAddModal: () => void;
}

function TasksContainer({
  tasks,
  onToggleComplete,
  onEdit,
  onDelete,
  onOpenAddModal
}: TasksContainerProps) {
  if (tasks.length === 0) {
    return (
      <div className="empty-state">
        <div className="empty-icon">📝</div>
        <h3>Chưa có task nào</h3>
        <p>Thêm task đầu tiên để bắt đầu quản lý công việc của bạn!</p>
        <button className="empty-add-btn" onClick={onOpenAddModal}>
          ➕ Thêm task đầu tiên
        </button>
      </div>
    );
  }

  return (
    <div className="task-items">
      {tasks.map(task => (
        <TaskItem
          key={task.id}
          task={task}
          onToggleComplete={onToggleComplete}
          onEdit={onEdit}
          onDelete={onDelete}
        />
      ))}
    </div>
  );
}
