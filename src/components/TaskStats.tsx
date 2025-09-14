import React from 'react';
import "@/css/TaskListItem.css"; // Import the existing CSS that contains task-stats styles

export interface TaskStatsData {
    incomplete: number;
    completed: number;
    overdue: number;
}

interface TaskStatsProps {
    stats: TaskStatsData;
    title?: string;
    showWelcomeMessage?: boolean;
}

/**
 * Reusable TaskStats component for displaying task statistics
 * @param stats - The task statistics data
 * @param title - Optional custom title (defaults to "Welcome to TaskMind")
 * @param showWelcomeMessage - Whether to show the welcome message (defaults to true)
 */
const TaskStats: React.FC<TaskStatsProps> = ({ 
    stats, 
    title = "Welcome to TaskMind", 
    showWelcomeMessage = true 
}) => {
    return (
        <div className="task-stats">
            {showWelcomeMessage && (
                <h1 className="welcome">{title}</h1>
            )}
            <div className="stat-item">
                <span className="stat-number">{stats.incomplete}</span>
                <span className="stat-label-incomplete">Chưa hoàn thành</span>
            </div>
            <div className="stat-item">
                <span className="stat-number">{stats.completed}</span>
                <span className="stat-label-complete">Đã hoàn thành</span>
            </div>
            <div className="stat-item">
                <span className="stat-number">{stats.overdue}</span>
                <span className="stat-label-duedate">Quá hạn</span>
            </div>
        </div>
    );
};

export default TaskStats;