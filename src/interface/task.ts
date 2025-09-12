export interface Task {
  id: string;
  title: string;
  deadline: string;
  energy: 'high' | 'medium' | 'low';
  priority: "high" | "medium" | "low";
  note: string;
  completed: boolean;
  completedAt: string | null;
}