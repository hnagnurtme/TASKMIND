export interface Task {
  id: string;
  title: string;
  deadline: string;
  value? :'high' | 'medium' | 'low';
  complexity: 'high' | 'medium' | 'low';
  priority: "high" | "medium" | "low";
  note: string;
  completed: boolean;
  completedAt: string | null;
}