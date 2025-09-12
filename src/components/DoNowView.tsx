import TaskItem from "@/components/TaskItem";
import { Task } from "@/interface/task";

interface Props {
  tasks: Task[];
  onToggleComplete: (id: string) => void;
  onEdit: (task: Task) => void;
  onDelete: (id: string) => void;
}

export default function DoNowView({ tasks, onToggleComplete, onEdit, onDelete }: Props) {
  return (
    <div className="view-container">
      <h2 className="view-title">⚡ Do Now (ưu tiên gấp)</h2>
      {tasks.length === 0 && <p>Không có task nào cần làm ngay 🎉</p>}
      {tasks.map((task) => (
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
