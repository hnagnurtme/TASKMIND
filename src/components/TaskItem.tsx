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
    const now = new Date();
    const diffTime = date.getTime() - now.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    if (diffDays < 0) return { text: "Quá hạn", className: "overdue", urgent: true };
    if (diffDays === 0) return { text: "Hôm nay", className: "today", urgent: true };
    if (diffDays === 1) return { text: "Ngày mai", className: "tomorrow", urgent: true };
    if (diffDays <= 7) return { text: `${diffDays} ngày`, className: "week", urgent: false };

    return { text: date.toLocaleDateString("vi-VN"), className: "future", urgent: false };
  };

  const formatDateTime = (dateTimeString: string) => {
    const date = new Date(dateTimeString);
    return date.toISOString().slice(0, 16); // Formats to 'yyyy-MM-ddThh:mm'
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
          aria-label={task.completed ? "Bỏ hoàn thành" : "Đánh dấu hoàn thành"}
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
              Hoàn thành lúc {formatDateTime(task.completedAt)}
            </span>
          </div>
        )}
      </div>

      {/* Nút thao tác */}
      <div className={`task-actions ${showActions ? "visible" : ""}`}>
        <button
          className="action-btn edit-btn"
          onClick={handleEdit}
          title={task.completed ? "Task đã hoàn thành, không thể chỉnh sửa" : "Chỉnh sửa task"}
          disabled={task.completed}
        >
          <span className="btn-icon">✏️</span>
        </button>

        <button
          className="action-btn delete-btn"
          onClick={handleDelete}
          title={task.completed ? "Task đã hoàn thành, không thể xóa" : "Xóa task"}
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
