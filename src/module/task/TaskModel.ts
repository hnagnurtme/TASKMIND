export interface TaskModel {
  id: string;
  title: string;
  deadline: string;
  complexity: 'high' | 'medium' | 'low';
  priority: "high" | "medium" | "low";
  note: string;
  completed: boolean;
  completedAt: string | null;
}