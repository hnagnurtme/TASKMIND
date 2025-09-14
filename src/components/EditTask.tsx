// EditTask.tsx
import React, { useState } from "react";
import { Task } from "@/interface/task";

interface EditTaskProps {
  isOpen: boolean;
  task: Task | null;
  onClose: () => void;
  onSave: (task: Task) => void;
}

const EditTask: React.FC<EditTaskProps> = ({ isOpen, task, onClose, onSave }) => {
  const [title, setTitle] = useState(task?.title || "");
  const [deadline, setDeadline] = useState(task?.deadline || "");

  if (!isOpen || !task) return null;

  const handleSave = () => {
    onSave({ ...task, title, deadline });
    onClose();
  };

  return (
    <div className="modal-overlay">
      <div className="modal">
        <h2>✏️ Edit Task</h2>
        <input
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="Task Name"
        />
        <input
          type="date"
          value={deadline}
          onChange={(e) => setDeadline(e.target.value)}
        />
        <div className="modal-actions">
          <button onClick={handleSave}>Save</button>
          <button onClick={onClose}>Cancel</button>
        </div>
      </div>
    </div>
  );
};

export default EditTask;
