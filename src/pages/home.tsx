import TaskList from "@/components/TaskListItem";
import TaskProgress from "@/components/TaskProgress";
import { useTasks } from '@/contexts/tasks.context';

export default function Home() {
  const { tasks } = useTasks();

  const completionPercent = tasks.length
    ? (tasks.filter((task) => task.completed).length / tasks.length) * 100
    : 0;

  return (
    <div className="main-content">
      <TaskProgress completionPercent={completionPercent} />
      <h1 className="home-title">Welcome to TaskMind</h1>
      < TaskList />
    </div>
  );
}