import React, { useState } from "react";
import { Task } from "@/interface/task";

interface AddTaskProps {
  isOpen: boolean;
  onClose: () => void;
  onAddTask: (task: Omit<Task, "id" | "completed" | "completedAt">) => void;
}

const AddTask: React.FC<AddTaskProps> = ({ isOpen, onClose, onAddTask }) => {
  const [formData, setFormData] = useState({
    title: "",
    deadline: "",
    energy: "medium" as "high" | "medium" | "low",
    priority: "medium" as "high" | "medium" | "low",
    note: "",
  });

  const [errors, setErrors] = useState({ title: "", deadline: "" });

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));

    if (errors[name as keyof typeof errors]) {
      setErrors((prev) => ({ ...prev, [name]: "" }));
    }
  };

  const validateForm = (): boolean => {
    const newErrors = { title: "", deadline: "" };

    if (!formData.title.trim()) {
      newErrors.title = "Tên task không được để trống";
    }

    if (!formData.deadline) {
      newErrors.deadline = "Deadline không được để trống";
    } else {
      const deadlineDate = new Date(formData.deadline);
      if (deadlineDate <= new Date()) {
        newErrors.deadline = "Deadline phải sau thời điểm hiện tại";
      }
    }

    setErrors(newErrors);
    return !newErrors.title && !newErrors.deadline;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (validateForm()) {
      onAddTask({
        title: formData.title.trim(),
        deadline: new Date(formData.deadline).toISOString(),
        energy: formData.energy,
        priority: formData.priority,
        note: formData.note.trim(),
      });

      // reset
      setFormData({
        title: "",
        deadline: "",
        energy: "medium",
        priority: "medium",
        note: "",
      });
      setErrors({ title: "", deadline: "" });
      onClose();
    }
  };

  const handleClose = () => {
    setFormData({
      title: "",
      deadline: "",
      energy: "medium",
      priority: "medium",
      note: "",
    });
    setErrors({ title: "", deadline: "" });
    onClose();
  };

  const getEnergyColor = (energy: string) => {
    switch (energy) {
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

  const getEnergyLabel = (energy: string) => {
    switch (energy) {
      case "high":
        return "High Energy ⚡";
      case "medium":
        return "Medium Energy 🔥";
      case "low":
        return "Low Energy 🌱";
      default:
        return "";
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "high":
        return "#dc2626"; // red
      case "medium":
        return "#2563eb"; // blue
      case "low":
        return "#16a34a"; // green
      default:
        return "#6b7280";
    }
  };

  const getPriorityLabel = (priority: string) => {
    switch (priority) {
      case "high":
        return "High Priority 🚨";
      case "medium":
        return "Medium Priority 📌";
      case "low":
        return "Low Priority 💤";
      default:
        return "";
    }
  };

  if (!isOpen) return null;

  return (
    <div className="modal-overlay" onClick={handleClose}>
      <div className="modal-container" onClick={(e) => e.stopPropagation()}>
        {/* Header */}
        <div className="modal-header">
          <h2 className="modal-title">
            <span className="task-icon">📝</span>
            Thêm Task Mới
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

          {/* Energy */}
          <div className="form-group">
            <label className="form-label">Energy Level</label>
            <div className="energy-selector">
              {(["high", "medium", "low"] as const).map((level) => (
                <label
                  key={level}
                  className={`energy-option ${formData.energy === level ? "selected" : ""}`}
                  style={
                    formData.energy === level
                      ? {
                          borderColor: getEnergyColor(level),
                          backgroundColor: `${getEnergyColor(level)}10`,
                        }
                      : {}
                  }
                >
                  <input
                    type="radio"
                    name="energy"
                    value={level}
                    checked={formData.energy === level}
                    onChange={handleInputChange}
                    className="energy-radio"
                  />
                  <span
                    className="energy-indicator"
                    style={{ backgroundColor: getEnergyColor(level) }}
                  ></span>
                  <span className="energy-text">{getEnergyLabel(level)}</span>
                </label>
              ))}
            </div>
          </div>

          {/* Priority */}
          <div className="form-group">
            <label className="form-label">Priority</label>
            <div className="priority-selector">
              {(["high", "medium", "low"] as const).map((level) => (
                <label
                  key={level}
                  className={`priority-option ${formData.priority === level ? "selected" : ""}`}
                  style={
                    formData.priority === level
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
                    checked={formData.priority === level}
                    onChange={handleInputChange}
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
              <span className="btn-icon">➕</span>
              Thêm Task
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddTask;
