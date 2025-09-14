import { useState, useCallback } from "react";
import { Task } from "@/interface/task";
import "@/css/TaskItem.css";

interface TaskItemProps {
  task: Task;
  onToggleComplete: (taskId: string) => void;
  onEdit: (task: Task) => void;
  onDelete: (taskId: string) => void;
  loading?: boolean; // Added loading prop
}

const TaskItem = ({ task, onToggleComplete, onEdit, onDelete, loading }: TaskItemProps) => {
  const [showActions, setShowActions] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  const getComplexityConfig = (complexity: string) => {
    switch (complexity) {
      case "high":
        return { color: "#ef4444", bgColor: "#fef2f2", icon: "⚡", label: "High Complexity" };
      case "medium":
        return { color: "#f59e0b", bgColor: "#fffbeb", icon: "🔥", label: "Medium Complexity" };
      case "low":
        return { color: "#10b981", bgColor: "#f0fdf4", icon: "🌱", label: "Low Complexity" };
      default:
        return { color: "#6b7280", bgColor: "#f9fafb", icon: "📌", label: "Unknown" };
    }
  };

  const getPriorityConfig = (priority: string) => {
    switch (priority) {
      case "high":
        return { color: "#dc2626", bgColor: "#fee2e2", icon: "🚨", label: "High Priority" };
      case "medium":
        return { color: "#d97706", bgColor: "#fef3c7", icon: "⚠️", label: "Medium Priority" };
      case "low":
        return { color: "#2563eb", bgColor: "#dbeafe", icon: "🕒", label: "Low Priority" };
      default:
        return { color: "#6b7280", bgColor: "#f3f4f6", icon: "❔", label: "No Priority" };
    }
  };

  const formatDeadline = (deadline: string) => {
    const date = new Date(deadline);
    
    // Check for Invalid Date
    if (isNaN(date.getTime())) {
      return { text: "Invalid date", className: "invalid", urgent: false };
    }
    
    const now = new Date();
    
    // Reset time to compare only dates (not time)
    const dateOnly = new Date(date.getFullYear(), date.getMonth(), date.getDate());
    const nowOnly = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    
    const diffTime = dateOnly.getTime() - nowOnly.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    if (diffDays < 0) return { text: "Overdue", className: "overdue", urgent: true };
    if (diffDays === 0) return { text: "Today", className: "today", urgent: true };
    if (diffDays === 1) return { text: "Tomorrow", className: "tomorrow", urgent: true };
    if (diffDays <= 7) return { text: `${diffDays} days`, className: "week", urgent: false };

    return { text: date.toLocaleDateString("vi-VN"), className: "future", urgent: false };
  };

  const formatDateTime = (dateTimeString: string) => {
    const date = new Date(dateTimeString);
    
    // Check for Invalid Date
    if (isNaN(date.getTime())) {
      return "Invalid time";
    }
    
    // Format to local time instead of UTC
    const day = date.getDate().toString().padStart(2, '0');
    const month = (date.getMonth() + 1).toString().padStart(2, '0');
    const year = date.getFullYear();
    const hours = date.getHours().toString().padStart(2, '0');
    const minutes = date.getMinutes().toString().padStart(2, '0');
    
    return `${day}/${month}/${year} ${hours}:${minutes}`;
  };

  const handleDelete = useCallback(() => {
    if (!task.completed) {
      setIsDeleting(true);
      setTimeout(() => onDelete(task.id), 300);
    }
  }, [task.id, task.completed, onDelete]);

  const handleEdit = useCallback(() => {
    if (!task.completed) onEdit(task);
  }, [task, onEdit]);

  const complexityConfig = getComplexityConfig(task.complexity);
  const priorityConfig = getPriorityConfig(task.priority); 
  const deadlineInfo = formatDeadline(task.deadline);

  return (
    <div
      className={`task-item ${task.completed ? "completed" : "incomplete"} ${!task.completed && task.priority === "high" ? "high-priority" : ""} ${isDeleting ? "deleting" : ""} ${loading ? "loading" : ""}`}
      onMouseEnter={() => setShowActions(true)}
      onMouseLeave={() => setShowActions(false)}
    >
      {/* Checkbox */}
      <div className="task-status">
        <button
          className={`checkbox ${task.completed ? "checked" : ""}`}
          onClick={() => onToggleComplete(task.id)}
          aria-label={task.completed ? "Mark as incomplete" : "Mark as complete"}
        >
          {task.completed && <span className="checkmark">✓</span>}
        </button>
      </div>

      {/* Nội dung chính */}
      <div className="task-content">
        <div className="task-header">
          <h3 className={`task-title ${task.completed ? "completed-text" : ""}`}>
            {task.title}
          </h3>

          <div className="badges">
            <div
              className="complexity-badge"
              style={{
                color: complexityConfig.color,
                backgroundColor: complexityConfig.bgColor,
                borderColor: `${complexityConfig.color}30`,
              }}
              title={complexityConfig.label}
            >
              <span className="complexity-icon">{complexityConfig.icon}</span>
              <span className="complexity-text">{task.complexity}</span>
            </div>

            <div
              className="priority-badge"
              style={{
                color: priorityConfig.color,
                backgroundColor: priorityConfig.bgColor,
                borderColor: `${priorityConfig.color}30`,
              }}
              title={priorityConfig.label}
            >
              <span className="priority-icon">{priorityConfig.icon}</span>
              <span className="priority-text">{task.priority}</span>
            </div>
          </div>
        </div>

        <div className="task-meta">
          <div className={`deadline-info ${deadlineInfo.className}`}>
            <span className="deadline-icon">📅</span>
            <span className="deadline-text">{deadlineInfo.text}</span>
            {deadlineInfo.urgent && <span className="urgent-indicator">!</span>}
          </div>

          {task.note && (
            <div className="task-note">
              <span className="note-icon">📝</span>
              <span className="note-text">{task.note}</span>
            </div>
          )}
        </div>

        {task.completed && task.completedAt && (
          <div className="completion-info">
            <span className="completion-icon">✅</span>
            <span className="completion-text">
              Completed at {formatDateTime(task.completedAt)}
            </span>
          </div>
        )}
      </div>

      {/* Nút thao tác */}
      <div className={`task-actions ${showActions ? "visible" : ""}`}>
        <button
          className="action-btn edit-btn"
          onClick={handleEdit}
          title={task.completed ? "Task is completed, cannot edit" : "Edit task"}
          disabled={task.completed}
        >
          <span className="btn-icon">✏️</span>
        </button>

        <button
          className="action-btn delete-btn"
          onClick={handleDelete}
          title={task.completed ? "Task is completed, cannot delete" : "Delete task"}
          disabled={task.completed}
        >
          <span className="btn-icon">🗑️</span>
        </button>
      </div>

      {task.completed && (
        <div className="completion-overlay">
          <div className="completion-shine"></div>
        </div>
      )}
    </div>
  );
};

export default TaskItem;
