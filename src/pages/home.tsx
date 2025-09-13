import TaskList from "@/components/TaskListItem";
import TaskProgress from "@/components/TaskProgress";
import { useTasks } from '@/contexts/tasks.context';
import { useState, useEffect } from 'react';
import "@/css/home.css";

export default function Home() {
  const { tasks } = useTasks();
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Simulate loading delay
    const timer = setTimeout(() => setIsLoading(false), 1000);
    return () => clearTimeout(timer);
  }, []);

  const completionPercent = tasks.length
    ? (tasks.filter((task) => task.completed).length / tasks.length) * 100
    : 0;

  if (isLoading) {
    return <div className="loading-screen">Loading...</div>;
  }

  return (
    <div className="main-content">
      <TaskProgress completionPercent={completionPercent} />
      <TaskList />
    </div>
  );
}