import React, { useMemo, useCallback } from "react";
import { ScatterChart, Scatter, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Label } from "recharts";
import { useTasks } from "@/contexts/tasks.context";
import "@/css/ValueComplexityMatrix.css";

interface TaskDataPoint {
  id: string;
  title: string;
  value: number;      // 1-3
  complexity: number; // 1-3
  status: string;
  priority: string;
}

const VALUE_SCALE_LABELS = ["Low Value", "Medium Value", "High Value"];
const COMPLEXITY_SCALE_LABELS = ["Low Complexity", "Medium Complexity", "High Complexity"];

// Màu sắc theo trạng thái
const STATUS_COLORS = {
  todo: "#ef4444",      // Red
  progress: "#f59e0b",  // Amber
  done: "#10b981",      // Emerald
  default: "#3b82f6"    // Blue
} as const;

const ValueComplexityMatrix: React.FC = () => {
  const { tasks } = useTasks();

  // Xử lý dữ liệu an toàn hơn
  const taskDataPoints: TaskDataPoint[] = useMemo(() => {
    if (!tasks || !Array.isArray(tasks)) {
      return [];
    }
    
    return tasks.map(t => {
      // Xử lý value an toàn
      let valueScore = 2; // default medium
      if (t.value) {
        if (typeof t.value === 'number') {
          valueScore = Math.max(1, Math.min(3, t.value));
        } else if (typeof t.value === 'string') {
          valueScore = t.value === 'low' ? 1 : t.value === 'medium' ? 2 : 3;
        }
      }
      
      // Xử lý complexity an toàn
      let complexityScore = 2; // default medium
      if (t.complexity) {
        complexityScore = t.complexity === "low" ? 1 : t.complexity === "medium" ? 2 : 3;
      }
      
      return {
        id: t.id,
        title: t.title || 'Untitled Task',
        value: valueScore,
        complexity: complexityScore,
        status: t.completed ? 'done' : 'todo',
        priority: t.priority || 'low'
      };
    });
  }, [tasks]);

  // Hàm lấy màu theo status (memoized)
  const getTaskColor = useCallback((point: TaskDataPoint): string => {
    return STATUS_COLORS[point.status as keyof typeof STATUS_COLORS] || STATUS_COLORS.default;
  }, []);

  // Hàm lấy kích thước dot theo priority (memoized)
  const getTaskSize = useCallback((priority: string): number => {
    switch(priority) {
      case 'high': return 8;
      case 'medium': return 6;
      case 'low': return 4;
      default: return 5;
    }
  }, []);

  // Custom tooltip component (memoized)
  const CustomTooltip = useCallback(({ active, payload }: any) => {
    if (!active || !payload || !payload.length) {
      return null;
    }

    const task = payload[0]?.payload as TaskDataPoint;
    if (!task) {
      return null;
    }

    return (
      <div className="value-complexity-tooltip">
        <div className="value-complexity-tooltip__header">
          <h4 className="value-complexity-tooltip__title">{task.title}</h4>
          <span 
            className={`value-complexity-tooltip__status value-complexity-tooltip__status--${task.status}`}
          >
            {task.status.toUpperCase()}
          </span>
        </div>
        <div className="value-complexity-tooltip__content">
          <div className="value-complexity-tooltip__item">
            <span className="value-complexity-tooltip__label">Value:</span>
            <span className="value-complexity-tooltip__value">
              {VALUE_SCALE_LABELS[task.value - 1] || 'Unknown'}
            </span>
          </div>
          <div className="value-complexity-tooltip__item">
            <span className="value-complexity-tooltip__label">Complexity:</span>
            <span className="value-complexity-tooltip__value">
              {COMPLEXITY_SCALE_LABELS[task.complexity - 1] || 'Unknown'}
            </span>
          </div>
          <div className="value-complexity-tooltip__item">
            <span className="value-complexity-tooltip__label">Priority:</span>
            <span 
              className={`value-complexity-tooltip__priority value-complexity-tooltip__priority--${task.priority}`}
            >
              {task.priority.toUpperCase()}
            </span>
          </div>
        </div>
      </div>
    );
  }, []);

  // Tối ưu hóa tick formatter
  const xAxisTickFormatter = useCallback((t: number) => {
    return VALUE_SCALE_LABELS[t - 1]?.split(' ')[0] || t.toString();
  }, []);

  const yAxisTickFormatter = useCallback((t: number) => {
    return COMPLEXITY_SCALE_LABELS[t - 1]?.split(' ')[0] || t.toString();
  }, []);

  return (
    <div className="value-complexity-matrix">
      <div className="value-complexity-matrix__header">
        <h3 className="value-complexity-matrix__title">
          <span className="value-complexity-matrix__title-icon">🎯</span>
          Value × Complexity Analysis
        </h3>
        <div className="value-complexity-matrix__legend">
          <div className="value-complexity-matrix__legend-group">
            <span className="value-complexity-matrix__legend-title">Status:</span>
            <div className="value-complexity-matrix__legend-items">
              {Object.entries(STATUS_COLORS).filter(([key]) => key !== 'default').map(([status, color]) => (
                <div key={status} className="value-complexity-matrix__legend-item">
                  <div 
                    className="value-complexity-matrix__legend-color"
                    style={{ backgroundColor: color }}
                  />
                  <span>{status}</span>
                </div>
              ))}
            </div>
          </div>
          <div className="value-complexity-matrix__legend-group">
            <span className="value-complexity-matrix__legend-title">Priority:</span>
            <div className="value-complexity-matrix__legend-items">
              <div className="value-complexity-matrix__legend-item">
                <div className="value-complexity-matrix__legend-size value-complexity-matrix__legend-size--small" />
                <span>Low</span>
              </div>
              <div className="value-complexity-matrix__legend-item">
                <div className="value-complexity-matrix__legend-size value-complexity-matrix__legend-size--medium" />
                <span>Medium</span>
              </div>
              <div className="value-complexity-matrix__legend-item">
                <div className="value-complexity-matrix__legend-size value-complexity-matrix__legend-size--large" />
                <span>High</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="value-complexity-matrix__chart-wrapper">
        <ResponsiveContainer width="100%" height={500}>
          <ScatterChart 
            data={taskDataPoints}
            margin={{ top: 40, right: 40, bottom: 60, left: 60 }}
          >
            <CartesianGrid 
              stroke="#e2e8f0" 
              strokeDasharray="2 2"
              opacity={0.7}
            />
            
            <XAxis
              type="number"
              dataKey="value"
              name="Value"
              domain={[0.5, 3.5]}
              ticks={[1, 2, 3]}
              tick={{ fill: '#64748b', fontSize: 12, fontWeight: 500 }}
              axisLine={{ stroke: '#cbd5e1', strokeWidth: 1 }}
              tickLine={{ stroke: '#cbd5e1' }}
              tickFormatter={xAxisTickFormatter}
            >
              <Label 
                value="Value Impact" 
                offset={-40} 
                position="insideBottom"
                style={{ 
                  textAnchor: 'middle', 
                  fill: '#374151', 
                  fontSize: 14, 
                  fontWeight: 600 
                }}
              />
            </XAxis>
            
            <YAxis
              type="number"
              dataKey="complexity"
              name="Complexity"
              domain={[0.5, 3.5]}
              ticks={[1, 2, 3]}
              tick={{ fill: '#64748b', fontSize: 12, fontWeight: 500 }}
              axisLine={{ stroke: '#cbd5e1', strokeWidth: 1 }}
              tickLine={{ stroke: '#cbd5e1' }}
              tickFormatter={yAxisTickFormatter}
            >
              <Label 
                value="Implementation Complexity" 
                angle={-90} 
                position="insideLeft"
                style={{ 
                  textAnchor: 'middle', 
                  fill: '#374151', 
                  fontSize: 14, 
                  fontWeight: 600 
                }}
              />
            </YAxis>

            <Tooltip 
              content={CustomTooltip}
              cursor={{ strokeDasharray: '3 3' }}
            />

            <Scatter
              name="Tasks"
              data={taskDataPoints}
              fill="#3b82f6"
              isAnimationActive={false}
            />
          </ScatterChart>
        </ResponsiveContainer>

        {/* Quadrant Labels */}
        <div className="value-complexity-quadrant value-complexity-quadrant--quick-wins">
          <div className="value-complexity-quadrant__label">
            <span className="value-complexity-quadrant__icon">⭐</span>
            <span className="value-complexity-quadrant__text">Quick Wins</span>
            <small>High Value, Low Complexity</small>
          </div>
        </div>
        
        <div className="value-complexity-quadrant value-complexity-quadrant--major-projects">
          <div className="value-complexity-quadrant__label">
            <span className="value-complexity-quadrant__icon">🚀</span>
            <span className="value-complexity-quadrant__text">Major Projects</span>
            <small>High Value, High Complexity</small>
          </div>
        </div>
        
        <div className="value-complexity-quadrant value-complexity-quadrant--fill-ins">
          <div className="value-complexity-quadrant__label">
            <span className="value-complexity-quadrant__icon">🔧</span>
            <span className="value-complexity-quadrant__text">Fill-ins</span>
            <small>Low Value, Low Complexity</small>
          </div>
        </div>
        
        <div className="value-complexity-quadrant value-complexity-quadrant--thankless-tasks">
          <div className="value-complexity-quadrant__label">
            <span className="value-complexity-quadrant__icon">⚠️</span>
            <span className="value-complexity-quadrant__text">Thankless Tasks</span>
            <small>Low Value, High Complexity</small>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ValueComplexityMatrix;
