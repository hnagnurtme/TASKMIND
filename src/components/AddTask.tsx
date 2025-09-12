import React, { useEffect } from "react";
import useAddTask from "@/hooks/useAddTask";
import { Task } from "@/interface/task";

const getComplexityColor = (complexity: string) => {
  switch (complexity) {
    case "high":
      return "#ef4444";
    case "medium":
      return "#f59e0b";
    case "low":
      return "#10b981";
    default:
      return "#6b7280";
  }
};

const getComplexityLabel = (complexity: string) => {
  switch (complexity) {
    case "high":
      return " High ⚡";
    case "medium":
      return " Medium 🔥";
    case "low":
      return " Low 🌱";
    default:
      return "";
  }
};

const getPriorityColor = (priority: string) => {
  switch (priority) {
    case "high":
      return "#dc2626"; 
    case "medium":
      return "#2563eb"; 
    case "low":
      return "#16a34a"; 
    default:
      return "#6b7280";
  }
};

const getPriorityLabel = (priority: string) => {
  switch (priority) {
    case "high":
      return " High 🚨";
    case "medium":
      return " Medium 📌";
    case "low":
      return " Low 💤";
    default:
      return "";
  }
};


const ComplexitySelector: React.FC<{
  selectedComplexity: string;
  onChange: (complexity: string) => void;
}> = ({ selectedComplexity, onChange }) => {
  return (
    <div className="form-group">
      <label className="form-label">Complexity Level</label>
      <div className="complexity-selector">
        {(["high", "medium", "low"] as const).map((level) => (
          <label
            key={level}
            className={`complexity-option ${selectedComplexity === level ? "selected" : ""}`}
            style={
              selectedComplexity === level
                ? {
                    borderColor: getComplexityColor(level),
                    backgroundColor: `${getComplexityColor(level)}10`,
                  }
                : {}
            }
          >
            <input
              type="radio"
              name="complexity"
              value={level}
              checked={selectedComplexity === level}
              onChange={() => onChange(level)}
              className="complexity-radio"
            />
            <span
              className="complexity-indicator"
              style={{ backgroundColor: getComplexityColor(level) }}
            ></span>
            <span className="complexity-text">{getComplexityLabel(level)}</span>
          </label>
        ))}
      </div>
    </div>
  );
};

const PrioritySelector: React.FC<{
  selectedPriority: string;
  onChange: (priority: string) => void;
}> = ({ selectedPriority, onChange }) => {
  return (
    <div className="form-group">
      <label className="form-label">Priority</label>
      <div className="priority-selector">
        {(["high", "medium", "low"] as const).map((level) => (
          <label
            key={level}
            className={`priority-option ${selectedPriority === level ? "selected" : ""}`}
            style={
              selectedPriority === level
                ? {
                    borderColor: getPriorityColor(level),
                    backgroundColor: `${getPriorityColor(level)}10`,
                  }
                : {}
            }
          >
            <input
              type="radio"
              name="priority"
              value={level}
              checked={selectedPriority === level}
              onChange={() => onChange(level)}
              className="priority-radio"
            />
            <span
              className="priority-indicator"
              style={{ backgroundColor: getPriorityColor(level) }}
            ></span>
            <span className="priority-text">{getPriorityLabel(level)}</span>
          </label>
        ))}
      </div>
    </div>
  );
};

// Main Component
interface TaskModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (task: Omit<Task, "id" | "completed" | "completedAt">) => void;
  taskToEdit?: Task | null;
}

const TaskModal: React.FC<TaskModalProps> = ({ isOpen, onClose, onSubmit, taskToEdit }) => {
  const { formData, errors, handleInputChange, handleSubmit, resetForm, setFormData } = useAddTask({
    onAddTask: onSubmit,
    onClose,
  });

  useEffect(() => {
    if (taskToEdit) {
      setFormData({
        title: taskToEdit.title,
        deadline: taskToEdit.deadline,
        complexity: taskToEdit.complexity,
        priority: taskToEdit.priority,
        note: taskToEdit.note || "",
      });
    } else {
      resetForm();
    }
  }, [taskToEdit]);

  const handleClose = () => {
    resetForm();
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="modal-overlay" onClick={handleClose}>
      <div className="modal-container" onClick={(e) => e.stopPropagation()}>
        {/* Header */}
        <div className="modal-header">
          <h2 className="modal-title">
            <span className="task-icon">📝</span>
            {taskToEdit ? "Chỉnh sửa Task" : "Thêm Task Mới"}
          </h2>
          <button className="close-button" onClick={handleClose}>
            ✕
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="modal-form">
          {/* Title */}
          <div className="form-group">
            <label htmlFor="title" className="form-label">
              Tên Task *
            </label>
            <input
              type="text"
              id="title"
              name="title"
              value={formData.title}
              onChange={handleInputChange}
              placeholder="Ví dụ: Finish AI report"
              className={`form-input ${errors.title ? "input-error" : ""}`}
              maxLength={100}
            />
            {errors.title && <span className="error-message">{errors.title}</span>}
          </div>

          {/* Deadline */}
          <div className="form-group">
            <label htmlFor="deadline" className="form-label">
              Deadline *
            </label>
            <input
              type="datetime-local"
              id="deadline"
              name="deadline"
              value={formData.deadline}
              onChange={handleInputChange}
              className={`form-input ${errors.deadline ? "input-error" : ""}`}
            />
            {errors.deadline && <span className="error-message">{errors.deadline}</span>}
          </div>

          {/* Complexity */}
          <ComplexitySelector
            selectedComplexity={formData.complexity}
            onChange={(complexity) =>
              handleInputChange({
                target: { name: "complexity", value: complexity },
              } as React.ChangeEvent<HTMLInputElement>)
            }
          />

          {/* Priority */}
          <PrioritySelector
            selectedPriority={formData.priority}
            onChange={(priority) =>
              handleInputChange({
                target: { name: "priority", value: priority },
              } as React.ChangeEvent<HTMLInputElement>)
            }
          />

          {/* Note */}
          <div className="form-group">
            <label htmlFor="note" className="form-label">
              Ghi chú
            </label>
            <textarea
              id="note"
              name="note"
              value={formData.note}
              onChange={handleInputChange}
              placeholder="Thêm ghi chú cho task này..."
              className="form-textarea"
              rows={3}
              maxLength={300}
            />
            <div className="character-count">{formData.note.length}/300</div>
          </div>

          {/* Footer */}
          <div className="modal-footer">
            <button type="button" onClick={handleClose} className="btn-cancel">
              Hủy
            </button>
            <button type="submit" className="btn-submit">
              <span className="btn-icon">{taskToEdit ? "✏️" : "➕"}</span>
              {taskToEdit ? "Cập nhật Task" : "Thêm Task"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default TaskModal;
