import React, { useEffect } from "react";
import useAddTask from "@/hooks/useAddTask";
import { Task } from "@/interface/task";
import "@/css/components/TaskModal.css";

// --- Helper functions ---
const getComplexityColor = (complexity: string) => {
  switch (complexity) {
    case "high": return "#dc2626";    // Red - Urgent/Difficult
    case "medium": return "#ea580c";  // Orange - Moderate
    case "low": return "#16a34a";     // Green - Simple
    default: return "#6b7280";
  }
};

const getComplexityLabel = (complexity: string) => {
  switch (complexity) {
    case "high": return "🔥 Hard";      // Fire for difficulty
    case "medium": return "⚡ Medium";  // Lightning for moderate  
    case "low": return "🌱 Easy";       // Plant for simple
    default: return "";
  }
};

const getValueColor = (value: string) => {
  switch (value) {
    case "high": return "#7c3aed";     // Purple - Premium/Valuable
    case "medium": return "#2563eb";   // Blue - Standard value
    case "low": return "#059669";      // Teal - Basic value
    default: return "#6b7280";
  }
};

const getValueLabel = (value: string) => {
  switch (value) {
    case "high": return "💎 High";      // Diamond for high value
    case "medium": return "🎯 Medium";  // Target for medium value
    case "low": return "📝 Low";        // Note for low value
    default: return "";
  }
};

const calculatePriority = (value: string, complexity: string, deadline: string) => {
  const now = new Date();
  const due = new Date(deadline);
  const hoursLeft = (due.getTime() - now.getTime()) / (1000 * 60 * 60);

  if (hoursLeft <= 24 || value === "high" || complexity === "high") return "high";
  if (hoursLeft <= 72 || value === "medium" || complexity === "medium") return "medium";
  return "low";
};

// --- Selectors ---
const ComplexitySelector: React.FC<{
  selectedComplexity: string;
  onChange: (complexity: string) => void;
}> = ({ selectedComplexity, onChange }) => (
  <div className="task-modal-field-group">
    <label className="task-modal-field-label">🏷️ Complexity Level</label>
    <div className="task-modal-complexity-grid">
      {(["high", "medium", "low"] as const).map((level) => (
        <label
          key={level}
          className={`task-modal-complexity-item ${selectedComplexity === level ? "task-modal-active" : ""}`}
          style={
            selectedComplexity === level
              ? { borderColor: getComplexityColor(level), backgroundColor: `${getComplexityColor(level)}10` }
              : {}
          }
        >
          <input
            type="radio"
            name="complexity"
            value={level}
            checked={selectedComplexity === level}
            onChange={() => onChange(level)}
            className="task-modal-radio-input"
          />
          <span className="task-modal-indicator-dot" style={{ backgroundColor: getComplexityColor(level) }}></span>
          <span className="task-modal-option-text">{getComplexityLabel(level)}</span>
        </label>
      ))}
    </div>
  </div>
);

const ValueSelector: React.FC<{
  selectedValue: string;
  onChange: (value: string) => void;
}> = ({ selectedValue, onChange }) => (
  <div className="task-modal-field-group">
    <label className="task-modal-field-label">⭐ Task Value</label>
    <div className="task-modal-value-grid">
      {(["high", "medium", "low"] as const).map((level) => (
        <label
          key={level}
          className={`task-modal-value-item ${selectedValue === level ? "task-modal-active" : ""}`}
          style={
            selectedValue === level
              ? { borderColor: getValueColor(level), backgroundColor: `${getValueColor(level)}15` }
              : {}
          }
        >
          <input
            type="radio"
            name="value"
            value={level}
            checked={selectedValue === level}
            onChange={() => onChange(level)}
            className="task-modal-radio-input"
          />
          <span className="task-modal-indicator-dot" style={{ backgroundColor: getValueColor(level) }}></span>
          <span className="task-modal-option-text">{getValueLabel(level)}</span>
        </label>
      ))}
    </div>
  </div>
);

// --- Main Component ---
interface TaskModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (task: Omit<Task, "id" | "completed" | "completedAt">) => void;
  taskToEdit?: Task | null;
}

const TaskModal: React.FC<TaskModalProps> = ({ isOpen, onClose, onSubmit, taskToEdit }) => {
  const { formData, errors, handleInputChange, resetForm, setFormData } = useAddTask({
    onAddTask: onSubmit,
    onClose,
  });

  useEffect(() => {
    if (taskToEdit) {
      const value = taskToEdit.value || "medium";
      const priority = taskToEdit.priority || calculatePriority(value, taskToEdit.complexity, taskToEdit.deadline);
      setFormData({
        title: taskToEdit.title,
        deadline: taskToEdit.deadline,
        complexity: taskToEdit.complexity,
        value: value,
        priority: priority,
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

  const handleCustomSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // tự tính priority
    const priority = calculatePriority(formData.value, formData.complexity, formData.deadline);
    onSubmit({
      title: formData.title,
      deadline: formData.deadline,
      complexity: formData.complexity,
      value: formData.value,
      priority,
      note: formData.note,
    });
    resetForm();
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="task-modal-backdrop" onClick={handleClose}>
      <div className="task-modal-container" onClick={(e) => e.stopPropagation()}>
        <div className="task-modal-header">
          <h2 className="task-modal-title">
            {taskToEdit ? "Edit Task" : "Create New Task"}
          </h2>
          <button className="task-modal-close-btn" onClick={handleClose}>×</button>
        </div>

        <form onSubmit={handleCustomSubmit} className="task-modal-form">
          {/* Title */}
          <div className="task-modal-field-group">
            <label htmlFor="title" className="task-modal-field-label">📋 Task Name *</label>
            <input
              type="text"
              id="title"
              name="title"
              value={formData.title}
              onChange={handleInputChange}
              placeholder="💡 Example: Complete AI report..."
              className={`task-modal-input ${errors.title ? "task-modal-input-error" : ""}`}
              maxLength={100}
            />
            {errors.title && <span className="task-modal-error-text">{errors.title}</span>}
          </div>

          {/* Deadline */}
          <div className="task-modal-field-group">
            <label htmlFor="deadline" className="task-modal-field-label">⏰ Completion Deadline *</label>
            <input
              type="datetime-local"
              id="deadline"
              name="deadline"
              value={formData.deadline}
              onChange={handleInputChange}
              className={`task-modal-input ${errors.deadline ? "task-modal-input-error" : ""}`}
            />
            {errors.deadline && <span className="task-modal-error-text">{errors.deadline}</span>}
          </div>

          {/* Complexity */}
          <ComplexitySelector
            selectedComplexity={formData.complexity}
            onChange={(c) =>
              handleInputChange({ target: { name: "complexity", value: c } } as React.ChangeEvent<HTMLInputElement>)
            }
          />

          {/* Value */}
          <ValueSelector
            selectedValue={formData.value || "medium"}
            onChange={(v) =>
              handleInputChange({ target: { name: "value", value: v } } as React.ChangeEvent<HTMLInputElement>)
            }
          />

          {/* Note */}
          <div className="task-modal-field-group">
            <label htmlFor="note" className="task-modal-field-label">📝 Additional Notes</label>
            <textarea
              id="note"
              name="note"
              value={formData.note}
              onChange={handleInputChange}
              placeholder="💭 Add detailed description for this task..."
              className="task-modal-textarea"
              rows={3}
              maxLength={300}
            />
            <div className="task-modal-char-counter">{formData.note.length}/300</div>
          </div>

          {/* Footer */}
          <div className="task-modal-footer">
            <button type="button" onClick={handleClose} className="task-modal-btn-secondary">
              ❌ Cancel
            </button>
            <button type="submit" className="task-modal-btn-primary">
              {taskToEdit ? "💾 Update" : "✨ Create"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default TaskModal;
