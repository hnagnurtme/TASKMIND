import React, { useMemo } from "react";
import {
  PieChart, Pie, Cell, Legend, Tooltip as ReTooltip,
  BarChart, Bar, XAxis, YAxis, CartesianGrid,
  LineChart, Line, ResponsiveContainer
} from "recharts";
import { useTasks } from "@/contexts/tasks.context";
import "@/css/CharItem.css";


// ================== COLORS ==================
const COLORS = { high: "#ef4444", medium: "#f59e0b", low: "#10b981" };

// Gradient màu heatmap
const HEATMAP_COLORS = ["#f0f9ff", "#7dd3fc", "#0ea5e9", "#0369a1", "#1e3a8a"];
type HeatmapDataRow = { complexity: string; Low: number; Medium: number; High: number };
const TASK_PRIORITIES: (keyof Omit<HeatmapDataRow, "complexity">)[] = ["Low", "Medium", "High"];

// ================== DashboardCharts ==================
const DashboardCharts: React.FC = () => {
  const { tasks } = useTasks();

  // ----- PieChart: Priority -----
  const priorityData = useMemo(() => {
    const counts = { high: 0, medium: 0, low: 0 };
    tasks.forEach(t => counts[t.priority]++);
    return Object.entries(counts).map(([key, value]) => ({
      name: key.charAt(0).toUpperCase() + key.slice(1),
      value,
      color: COLORS[key as keyof typeof COLORS],
    }));
  }, [tasks]);

  // ----- BarChart: Complexity -----
  const complexityData = useMemo(() => {
    const counts = { high: 0, medium: 0, low: 0 };
    tasks.forEach(t => counts[t.complexity]++);
    return Object.entries(counts).map(([key, value]) => ({
      name: key.charAt(0).toUpperCase() + key.slice(1),
      value,
      color: COLORS[key as keyof typeof COLORS],
    }));
  }, [tasks]);

  // ----- LineChart: Completed Trend -----
  const productivityData = useMemo(() => {
    const doneTasks = tasks.filter(t => t.completed && t.completedAt);
    const byDate: Record<string, number> = {};
    doneTasks.forEach(t => {
      if (t.completedAt) {
        const date = new Date(t.completedAt).toLocaleDateString("vi-VN");
        byDate[date] = (byDate[date] || 0) + 1;
      }
    });
    return Object.entries(byDate).map(([date, count]) => ({ date, count }));
  }, [tasks]);

  // ----- Heatmap: Complexity × Priority -----
  const heatmapData: HeatmapDataRow[] = useMemo(() => {
    const counts: Record<string, Record<string, number>> = {
      Low: { Low: 0, Medium: 0, High: 0 },
      Medium: { Low: 0, Medium: 0, High: 0 },
      High: { Low: 0, Medium: 0, High: 0 },
    };
    tasks.forEach(t => {
      const comp = t.complexity.charAt(0).toUpperCase() + t.complexity.slice(1);
      const prio = t.priority.charAt(0).toUpperCase() + t.priority.slice(1);
      counts[comp][prio] = (counts[comp][prio] || 0) + 1;
    });
    return Object.entries(counts).map(([complexity, obj]) => ({ complexity, ...obj })) as HeatmapDataRow[];
  }, [tasks]);
  const maxCount = Math.max(1, ...heatmapData.flatMap(row => TASK_PRIORITIES.map(p => row[p])));
  const getHeatmapColor = (count: number) => HEATMAP_COLORS[Math.floor((count / maxCount) * (HEATMAP_COLORS.length - 1))];

  const CustomTooltip = ({ active, payload, label }: any) => {
    if (!active || !payload || !payload.length) return null;
    return (
      <div className="heatmap-tooltip">
        <p className="heatmap-tooltip__label">{`Complexity: ${label}`}</p>
        {payload.map((entry: any, idx: number) => (
          <p key={idx} style={{ color: entry.color }}>{`${entry.dataKey}: ${entry.value} tasks`}</p>
        ))}
      </div>
    );
  };

  return (
    <div className="dashboard-charts">

      <div className="charts-grid">
        {/* Heatmap trên cùng */}
        <div className="chart-card heatmap-card">
          <h3 className="chart-title">Complexity × Priority Heatmap</h3>
          <ResponsiveContainer width="100%" height={180}>
            <BarChart
              data={heatmapData}
              layout="vertical"
              margin={{ top: 20, right: 30, left: 60, bottom: 20 }}
              barCategoryGap={8}
            >
              <XAxis type="number" allowDecimals={false} />
              <YAxis type="category" dataKey="complexity" />
              <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
              <ReTooltip content={<CustomTooltip />} />
              {TASK_PRIORITIES.map(prio => (
                <Bar key={prio} dataKey={prio} stackId="stack" radius={[0,4,4,0]}>
                  {heatmapData.map((entry, i) => <Cell key={i} fill={getHeatmapColor(entry[prio])} />)}
                </Bar>
              ))}
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* PieChart: Priority */}
        <div className="chart-card">
          <h3 className="chart-title">Tasks by Priority</h3>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie data={priorityData} dataKey="value" nameKey="name" innerRadius={60} outerRadius={100} paddingAngle={5} label>
                {priorityData.map((entry, idx) => <Cell key={idx} fill={entry.color} />)}
              </Pie>
              <Legend />
              <ReTooltip />
            </PieChart>
          </ResponsiveContainer>
        </div>

        {/* BarChart: Complexity */}
        <div className="chart-card">
          <h3 className="chart-title">Tasks by Complexity</h3>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={complexityData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis allowDecimals={false} />
              <ReTooltip />
              <Bar dataKey="value">{complexityData.map((entry, idx) => <Cell key={idx} fill={entry.color} />)}</Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* LineChart: Productivity */}
        <div className="chart-card">
          <h3 className="chart-title">Completed Tasks Trend</h3>
          <ResponsiveContainer width="100%" height={300}>
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
  );
};

export default DashboardCharts;
