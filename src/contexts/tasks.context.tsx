import React, { createContext, useContext, useState, useMemo, useEffect } from 'react';
import { Task } from '@/interface/task';
import { TaskService } from '@/module/task/TaskService';
import { getSessionUid } from '@/utils/storage';
interface TasksContextType {
  tasks: Task[];
  sortedTasks: Task[];
  stats: {
    total: number;
    incomplete: number;
    completed: number;
    overdue: number;
  };
  addTask: (taskData: Omit<Task, 'id' | 'completed' | 'completedAt'>) => void;
  toggleComplete: (taskId: string) => void;
  editTask: (editedTask: Task) => void;
  deleteTask: (taskId: string) => void;
}

const TasksContext = createContext<TasksContextType | undefined>(undefined);

export const TasksProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [tasks, setTasks] = useState<Task[]>([]);

  // -------------------
  // Load tasks từ Firestore khi mount
  // -------------------
  useEffect(() => {
    const uid = getSessionUid();
    if (!uid) return;

    const loadTasks = async () => {
      try {
        const userTasks = await TaskService.getAllTasksById(uid) ?? []; 
        setTasks(userTasks);
        console.log('Loaded tasks for user:', uid, userTasks);
      } catch (err) {
        console.error('Error loading tasks from DB:', err);
      }
    };

    loadTasks();
  }, []);

  const sortedTasks = useMemo(() => {
    return [...tasks].sort((a, b) => {
      if (a.completed !== b.completed) return a.completed ? 1 : -1;
      return new Date(a.deadline).getTime() - new Date(b.deadline).getTime();
    });
  }, [tasks]);

  const stats = useMemo(() => {
    return {
      total: tasks.length,
      incomplete: tasks.filter((t) => !t.completed).length,
      completed: tasks.filter((t) => t.completed).length,
      overdue: tasks.filter(
        (t) => !t.completed && new Date(t.deadline) <= new Date()
      ).length,
    };
  }, [tasks]);

  const addTask = (taskData: Omit<Task, 'id' | 'completed' | 'completedAt'>) => {
    const newTask: Task = {
      id: `task_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      ...taskData,
      completed: false,
      completedAt: null,
    };

    const uid = getSessionUid();
    console.log('Adding task for user:', uid, JSON.stringify(newTask));
    TaskService.upsertTask(uid!, newTask);
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
    const uid = getSessionUid();
    console.log('Update task for user:', uid, JSON.stringify(editedTask));
    TaskService.upsertTask(uid!, editedTask);
  };

  const deleteTask = (taskId: string) => {
    setTasks((prev) => prev.filter((task) => task.id !== taskId));
    const uid = getSessionUid();
    console.log('Delete task for user:', uid, taskId);
    TaskService.deleteTask(uid!, taskId);
  };

  return (
    <TasksContext.Provider value={{ tasks, sortedTasks, stats, addTask, toggleComplete, editTask, deleteTask }}>
      {children}
    </TasksContext.Provider>
  );
};

export const useTasks = (): TasksContextType => {
  const context = useContext(TasksContext);
  if (!context) {
    throw new Error('useTasks must be used within a TasksProvider');
  }
  return context;
};