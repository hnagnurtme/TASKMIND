import React, { createContext, useContext, useState, useEffect, useMemo } from 'react';
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
  setTasksFromLogin: (tasks: Task[]) => void;
  addTask: (taskData: Omit<Task, 'id' | 'completed' | 'completedAt'>) => void;
  toggleComplete: (taskId: string) => void;
  editTask: (editedTask: Task) => void;
  deleteTask: (taskId: string) => void;
}

const TasksContext = createContext<TasksContextType | undefined>(undefined);

export const TasksProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [uid] = useState<string | null>(getSessionUid() ?? null);
  const [tasks, setTasks] = useState<Task[]>([]);

  // Load tasks realtime khi uid thay đổi
  useEffect(() => {
    if (!uid) return;

    let unsubscribe: (() => void) | null = null;

    const loadRealtimeTasks = async () => {
      unsubscribe = await TaskService.listenTasks(uid, (fetchedTasks) => {
        setTasks(fetchedTasks);
      });
    };

    loadRealtimeTasks();

    return () => {
      if (unsubscribe) unsubscribe();
    };
  }, [uid]);

  // Cho phép set tasks trực tiếp từ login response
  const setTasksFromLogin = (loginTasks: Task[]) => {
    setTasks(loginTasks);
  };

  const sortedTasks = useMemo(() => {
    return [...tasks].sort((a, b) => {
      if (a.completed !== b.completed) return a.completed ? 1 : -1;
      return new Date(a.deadline).getTime() - new Date(b.deadline).getTime();
    });
  }, [tasks]);

  const stats = useMemo(() => ({
    total: tasks.length,
    incomplete: tasks.filter(t => !t.completed).length,
    completed: tasks.filter(t => t.completed).length,
    overdue: tasks.filter(t => !t.completed && new Date(t.deadline) <= new Date()).length
  }), [tasks]);

  const addTask = (taskData: Omit<Task, 'id' | 'completed' | 'completedAt'>) => {
    const newTask: Task = {
      id: `task_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      ...taskData,
      completed: false,
      completedAt: null
    };
    if (!uid) return;
    TaskService.upsertTask(uid, newTask);
    setTasks(prev => [newTask, ...prev]);
  };

  const toggleComplete = (taskId: string) => {
    setTasks(prev => {
      const updated = prev.map(task =>
        task.id === taskId
          ? { ...task, completed: !task.completed, completedAt: !task.completed ? new Date().toISOString() : null }
          : task
      );
      if (uid) {
        const toggledTask = updated.find(t => t.id === taskId);
        if (toggledTask) TaskService.upsertTask(uid, toggledTask);
      }
      return updated;
    });
  };

  const editTask = (editedTask: Task) => {
    setTasks(prev => prev.map(t => t.id === editedTask.id ? editedTask : t));
    if (uid) TaskService.upsertTask(uid, editedTask);
  };

  const deleteTask = (taskId: string) => {
    setTasks(prev => prev.filter(t => t.id !== taskId));
    if (uid) TaskService.deleteTask(uid, taskId);
  };

  return (
    <TasksContext.Provider value={{ tasks, sortedTasks, stats, setTasksFromLogin, addTask, toggleComplete, editTask, deleteTask }}>
      {children}
    </TasksContext.Provider>
  );
};

export const useTasks = (): TasksContextType => {
  const context = useContext(TasksContext);
  if (!context) throw new Error('useTasks must be used within a TasksProvider');
  return context;
};
