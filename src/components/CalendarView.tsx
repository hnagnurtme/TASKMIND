import TaskItem from "@/components/TaskItem";
import { Task } from "@/interface/task";

interface Props {
  calendarTasks: Record<string, Task[]>;
  onToggleComplete: (id: string) => void;
  onEdit: (task: Task) => void;
  onDelete: (id: string) => void;
}

export default function CalendarView({ calendarTasks, onToggleComplete, onEdit, onDelete }: Props) {
  return (
    <div className="view-container">
      <h2 className="view-title">📅 Lịch deadline</h2>
      {Object.keys(calendarTasks).length === 0 && <p>Chưa có deadline nào ✅</p>}
      {Object.entries(calendarTasks).map(([date, tasks]) => (
        <div key={date} className="calendar-day">
          <h3 className="calendar-date">{date}</h3>
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
      ))}
    </div>
  );
}
