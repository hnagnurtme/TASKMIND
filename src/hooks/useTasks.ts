import { useState } from "react";
import { Task } from "@/interface/task";

export const useTasks = () => {
  const [tasks, setTasks] = useState<Task[]>([]);

  const addTask = (taskData: Omit<Task, "id" | "completed" | "completedAt">) => {
    const newTask: Task = {
      id: `task_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      ...taskData,
      completed: false,
      completedAt: null,
    };
    setTasks((prev) => [newTask, ...prev]);
  };

  const toggleComplete = (taskId: string) => {
    setTasks((prev) =>
      prev.map((task) =>
        task.id === taskId
          ? {
              ...task,
              completed: !task.completed,
              completedAt: !task.completed ? new Date().toISOString() : null,
            }
          : task
      )
    );
  };

  const editTask = (editedTask: Task) => {
    setTasks((prev) =>
      prev.map((task) => (task.id === editedTask.id ? editedTask : task))
    );
  };

  const deleteTask = (taskId: string) => {
    setTasks((prev) => prev.filter((task) => task.id !== taskId));
  };

  const sortedTasks = [...tasks].sort((a, b) => {
    if (a.completed !== b.completed) return a.completed ? 1 : -1;
    
    const dateA = new Date(a.deadline);
    const dateB = new Date(b.deadline);
    
    // Handle Invalid Dates - put them at the end
    if (isNaN(dateA.getTime()) && isNaN(dateB.getTime())) return 0;
    if (isNaN(dateA.getTime())) return 1;
    if (isNaN(dateB.getTime())) return -1;
    
    return dateA.getTime() - dateB.getTime();
  });

  const stats = {
    total: tasks.length,
    incomplete: tasks.filter((t) => !t.completed).length,
    completed: tasks.filter((t) => t.completed).length,
    overdue: tasks.filter((t) => {
      if (t.completed) return false;
      const deadline = new Date(t.deadline);
      if (isNaN(deadline.getTime())) return false;
      
      const now = new Date();
      const nowOnly = new Date(now.getFullYear(), now.getMonth(), now.getDate());
      const deadlineOnly = new Date(deadline.getFullYear(), deadline.getMonth(), deadline.getDate());
      
      return deadlineOnly < nowOnly;
    }).length,
  };


  // DoNow: AI-like, ưu tiên task gấp + ưu tiên cao
  const doNowTasks = [...tasks].sort((a, b) => {
    if (a.completed !== b.completed) return a.completed ? 1 : -1;

    const priorityOrder = { high: 1, medium: 2, low: 3 };
    if (priorityOrder[a.priority] !== priorityOrder[b.priority]) {
      return priorityOrder[a.priority] - priorityOrder[b.priority];
    }

    return new Date(a.deadline).getTime() - new Date(b.deadline).getTime();
  });

  // Calendar: nhóm theo ngày deadline
  const calendarTasks = tasks.reduce<Record<string, Task[]>>((acc, task) => {
    const day = new Date(task.deadline).toLocaleDateString("vi-VN");
    if (!acc[day]) acc[day] = [];
    acc[day].push(task);
    return acc;
  }, {});

  // Analytics: thống kê productivity
  const analytics = {
    total: tasks.length,
    completed: tasks.filter((t) => t.completed).length,
    incomplete: tasks.filter((t) => !t.completed).length,
    overdue: tasks.filter(
      (t) => !t.completed && new Date(t.deadline) < new Date()
    ).length,
    byPriority: {
      high: tasks.filter((t) => t.priority === "high").length,
      medium: tasks.filter((t) => t.priority === "medium").length,
      low: tasks.filter((t) => t.priority === "low").length,
    },
  };


  return {
    tasks,
    sortedTasks,
    stats,
    addTask,
    toggleComplete,
    editTask,
    deleteTask,
    doNowTasks,
    calendarTasks,
    analytics,
  };
};
