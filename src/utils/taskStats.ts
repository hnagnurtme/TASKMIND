import { Task } from '@/interface/task';
import { TaskStatsData } from '@/components/TaskStats';

/**
 * Calculate task statistics from a list of tasks
 * @param tasks - Array of tasks to calculate statistics for
 * @returns TaskStatsData object with incomplete, completed, and overdue counts
 */
export const calculateTaskStats = (tasks: Task[]): TaskStatsData => {
    const now = new Date();
    
    const incomplete = tasks.filter(task => !task.completed).length;
    const completed = tasks.filter(task => task.completed).length;
    const overdue = tasks.filter(task => 
        new Date(task.deadline) < now && !task.completed
    ).length;

    return {
        incomplete,
        completed,
        overdue
    };
};

/**
 * Calculate task statistics with additional metrics
 * @param tasks - Array of tasks to calculate statistics for
 * @returns Extended statistics including percentages and upcoming deadlines
 */
export const calculateExtendedTaskStats = (tasks: Task[]) => {
    const basicStats = calculateTaskStats(tasks);
    const totalTasks = tasks.length;
    
    // Calculate percentages
    const completionPercentage = totalTasks > 0 ? 
        Math.round((basicStats.completed / totalTasks) * 100) : 0;
    const overduePercentage = totalTasks > 0 ? 
        Math.round((basicStats.overdue / totalTasks) * 100) : 0;

    // Calculate upcoming deadlines (tasks due within next 7 days)
    const nextWeek = new Date();
    nextWeek.setDate(nextWeek.getDate() + 7);
    
    const upcomingDeadlines = tasks.filter(task => {
        const dueDate = new Date(task.deadline);
        const now = new Date();
        return dueDate > now && dueDate <= nextWeek && !task.completed;
    }).length;

    return {
        ...basicStats,
        totalTasks,
        completionPercentage,
        overduePercentage,
        upcomingDeadlines
    };
};