import { useState, useCallback } from "react";
import { Task } from "@/interface/task";

interface TaskItemProps {
  task: Task;
  onToggleComplete: (taskId: string) => void;
  onEdit: (task: Task) => void;
  onDelete: (taskId: string) => void;
}

const TaskItem = ({ task, onToggleComplete, onEdit, onDelete }: TaskItemProps) => {
  const [showActions, setShowActions] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  const getEnergyConfig = (energy: string) => {
    switch (energy) {
      case "high":
        return { color: "#ef4444", bgColor: "#fef2f2", icon: "⚡", label: "High Energy" };
      case "medium":
        return { color: "#f59e0b", bgColor: "#fffbeb", icon: "🔥", label: "Medium Energy" };
      case "low":
        return { color: "#10b981", bgColor: "#f0fdf4", icon: "🌱", label: "Low Energy" };
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

  const handleDelete = useCallback(() => {
    setIsDeleting(true);
    setTimeout(() => onDelete(task.id), 300);
  }, [task.id, onDelete]);

  const energyConfig = getEnergyConfig(task.energy);
  const priorityConfig = getPriorityConfig(task.priority); // 👈 thêm priority
  const deadlineInfo = formatDeadline(task.deadline);

  return (
    <div
      className={`task-item ${task.completed ? "completed" : ""} ${isDeleting ? "deleting" : ""}`}
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
            {/* Energy Badge */}
            <div
              className="energy-badge"
              style={{
                color: energyConfig.color,
                backgroundColor: energyConfig.bgColor,
                borderColor: `${energyConfig.color}30`,
              }}
              title={energyConfig.label}
            >
              <span className="energy-icon">{energyConfig.icon}</span>
              <span className="energy-text">{task.energy}</span>
            </div>

            {/* Priority Badge */}
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
              Hoàn thành lúc {new Date(task.completedAt).toLocaleString("vi-VN")}
            </span>
          </div>
        )}
      </div>

      {/* Nút thao tác */}
      <div className={`task-actions ${showActions ? "visible" : ""}`}>
        <button className="action-btn edit-btn" onClick={() => onEdit(task)} title="Chỉnh sửa task">
          <span className="btn-icon">✏️</span>
        </button>
        <button className="action-btn delete-btn" onClick={handleDelete} title="Xóa task">
          <span className="btn-icon">🗑️</span>
        </button>
      </div>

      {/* Overlay hoàn thành */}
      {task.completed && (
        <div className="completion-overlay">
          <div className="completion-shine"></div>
        </div>
      )}
    </div>
  );
};

export default TaskItem;
