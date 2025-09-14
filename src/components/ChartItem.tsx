import { useMemo } from "react"
import {
  PieChart, Pie, Cell, Tooltip as ReTooltip, Legend,
  BarChart, Bar, XAxis, YAxis, CartesianGrid,
  LineChart, Line,
  ResponsiveContainer
} from "recharts"
import { useTasks } from "@/contexts/tasks.context"
import "@/css/CharItem.css"
import { calculateTaskStats } from "@/utils/taskStats"

// ================== COLORS ==================
const COLORS = {
  high: "#ef4444",   // đỏ
  medium: "#f59e0b", // cam
  low: "#10b981",    // xanh lá
}
interface TaskStatsProps {
    stats: {
        incomplete: number;
        completed: number;
        overdue: number;
    };
}

function TaskStats ( { stats }: TaskStatsProps ) {
    return (
        <div className="task-stats">
            <h1 className="welcome">Welcome to TaskMind</h1>
            <div className="stat-item">
                <span className="stat-number">{ stats.incomplete }</span>
                <span className="stat-label-incomplete">Chưa hoàn thành</span>
            </div>
            <div className="stat-item">
                <span className="stat-number">{ stats.completed }</span>
                <span className="stat-label-complete">Đã hoàn thành</span>
            </div>
            <div className="stat-item">
                <span className="stat-number">{ stats.overdue }</span>
                <span className="stat-label-duedate">Quá hạn</span>
            </div>
        </div>
    );
}
export default function ChartItem() {
  const { tasks } = useTasks()

  // ---------- Data cho PieChart (Priority) ----------
  const priorityData = useMemo(() => {
    const counts = { high: 0, medium: 0, low: 0 }
    tasks.forEach((t) => {
      counts[t.priority]++
    })
    return Object.entries(counts).map(([key, value]) => ({
      name: key.charAt(0).toUpperCase() + key.slice(1),
      value,
      color: COLORS[key as keyof typeof COLORS],
    }))
  }, [tasks])

  // ---------- Data cho BarChart (Complexity) ----------
  const complexityData = useMemo(() => {
    const counts = { high: 0, medium: 0, low: 0 }
    tasks.forEach((t) => {
      counts[t.complexity]++
    })
    return Object.entries(counts).map(([key, value]) => ({
      name: key.charAt(0).toUpperCase() + key.slice(1),
      value,
      color: COLORS[key as keyof typeof COLORS],
    }))
  }, [tasks])

  // ---------- Data cho LineChart (Completed Trend) ----------
  const productivityData = useMemo(() => {
    const doneTasks = tasks.filter((t) => t.completed && t.completedAt)
    const byDate: Record<string, number> = {}
    doneTasks.forEach((t) => {
      if (t.completedAt) {
        const date = new Date(t.completedAt).toLocaleDateString("vi-VN")
        byDate[date] = (byDate[date] || 0) + 1
      }
    })
    return Object.entries(byDate).map(([date, count]) => ({
      date,
      count,
    }))
  }, [tasks])
  
  

  return (
    <div >
         <TaskStats stats={calculateTaskStats(tasks)} />
    <div className="charts-grid">
      {/* Donut Chart */}
      <div className="chart-card">
        <h3 className="chart-title">Tasks by Priority</h3>
        <ResponsiveContainer width="100%" height={350}>
          <PieChart>
            <Pie
              data={priorityData}
              dataKey="value"
              nameKey="name"
              innerRadius={60}
              outerRadius={100}
              paddingAngle={5}
              label
            >
              {priorityData.map((entry, index) => (
                <Cell key={index} fill={entry.color} />
              ))}
            </Pie>
            <Legend />
            <ReTooltip />
          </PieChart>
        </ResponsiveContainer>
      </div>

      {/* Bar Chart */}
      <div className="chart-card">
        <h3 className="chart-title">Tasks by Complexity</h3>
        <ResponsiveContainer width="100%" height={350}>
          <BarChart data={complexityData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="name" />
            <YAxis allowDecimals={false} />
            <ReTooltip />
            <Bar dataKey="value">
              {complexityData.map((entry, index) => (
                <Cell key={index} fill={entry.color} />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* Line Chart */}
      <div className="chart-card">
        <h3 className="chart-title">Completed Tasks Trend</h3>
        <ResponsiveContainer width="100%" height={350}>
          <LineChart data={productivityData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="date" />
            <YAxis allowDecimals={false} />
            <ReTooltip />
            <Line type="monotone" dataKey="count" stroke="#3b82f6" strokeWidth={2} />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
    </div>
  )
}

