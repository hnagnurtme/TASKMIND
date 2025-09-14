import { useState } from "react";
import { Task } from "@/interface/task";

interface UseAddTaskProps {
  onAddTask: (task: Omit<Task, "id" | "completed" | "completedAt">) => void;
  onClose: () => void;
}

const useAddTask = ({ onAddTask, onClose }: UseAddTaskProps) => {
  const [formData, setFormData] = useState({
    title: "",
    deadline: "",
    value : "medium" as "high" | "medium" | "low",
    complexity: "medium" as "high" | "medium" | "low",
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
      newErrors.title = "Task name cannot be empty";
    }

    if (!formData.deadline) {
      newErrors.deadline = "Deadline cannot be empty";
    } else {
      const deadlineDate = new Date(formData.deadline);
      
      // Check for Invalid Date
      if (isNaN(deadlineDate.getTime())) {
        newErrors.deadline = "Invalid time format";
      } else {
        // Compare only dates, not time
        const now = new Date();
        const nowOnly = new Date(now.getFullYear(), now.getMonth(), now.getDate());
        const deadlineOnly = new Date(deadlineDate.getFullYear(), deadlineDate.getMonth(), deadlineDate.getDate());
        
        if (deadlineOnly < nowOnly) {
          newErrors.deadline = "Deadline cannot be in the past";
        }
      }
    }

    setErrors(newErrors);
    return !newErrors.title && !newErrors.deadline;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (validateForm()) {
      const deadlineDate = new Date(formData.deadline);
      
      // Double check for Invalid Date before submitting
      if (isNaN(deadlineDate.getTime())) {
        setErrors(prev => ({ ...prev, deadline: "Invalid time format" }));
        return;
      }

      onAddTask({
        title: formData.title.trim(),
        deadline: deadlineDate.toISOString(),
        value: formData.priority,
        complexity: formData.complexity,
        priority: formData.priority,
        note: formData.note.trim(),
      });

      resetForm();
      onClose();
    }
  };

  const resetForm = () => {
    setFormData({
      title: "",
      deadline: "",
      value: "medium",
      complexity: "medium",
      priority: "medium",
      note: "",
    });
    setErrors({ title: "", deadline: "" });
  };

  return {
    formData,
    errors,
    handleInputChange,
    handleSubmit,
    resetForm,
    setFormData, 
  };
};

export default useAddTask;