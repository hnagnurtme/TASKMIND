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