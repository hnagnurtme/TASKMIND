import React, { useMemo, useCallback } from "react";
import { ScatterChart, Scatter, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Label } from "recharts";
import { useTasks } from "@/contexts/tasks.context";
import "@/css/ValueComplexityMatrix.css";

interface TaskDataPoint {
  id: string;
  title: string;
  value: number;      // 1-3 với jitter
  complexity: number; // 1-3 với jitter
  originalValue: number;    // Giá trị gốc để hiển thị trong tooltip
  originalComplexity: number; // Giá trị gốc để hiển thị trong tooltip
  status: string;     // 'completed' | 'pending' | 'overdue'
  priority: string;
  deadline: string;
  isCompleted: boolean;
}

const VALUE_SCALE_LABELS = ["Low Value", "Medium Value", "High Value"];
const COMPLEXITY_SCALE_LABELS = ["Low Complexity", "Medium Complexity", "High Complexity"];

// Màu sắc theo trạng thái
const STATUS_COLORS = {
  completed: "#10b981",    // Xanh lá - Đã hoàn thành
  pending: "#3b82f6",      // Xanh dương - Đang chờ (chưa quá hạn)
  overdue: "#ef4444",      // Đỏ - Quá hạn
  progress: "#f59e0b",     // Vàng cam - Đang làm (có thể thêm logic sau)
  default: "#64748b"       // Xám - Mặc định
} as const;

const ValueComplexityMatrix: React.FC = () => {
  const { tasks } = useTasks();

  // Xử lý dữ liệu an toàn hơn và thêm jitter để tránh chồng lấp
  const taskDataPoints: TaskDataPoint[] = useMemo(() => {
    if (!tasks || !Array.isArray(tasks)) {
      return [];
    }
    
    // Theo dõi số lượng tasks tại mỗi vị trí để tạo jitter
    const positionCounts: Record<string, number> = {};
    
    return tasks.map((t, index) => {
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
      
      // Tạo key cho vị trí để theo dõi số lượng tasks
      const positionKey = `${valueScore}-${complexityScore}`;
      positionCounts[positionKey] = (positionCounts[positionKey] || 0) + 1;
      const positionIndex = positionCounts[positionKey];
      
      // Thêm jitter nhỏ để tránh chồng lấp (0.1 unit max)
      const jitterRadius = 0.08;
      const angle = (positionIndex * 60 + index * 20) * (Math.PI / 180); // Góc dựa trên vị trí
      const distance = Math.min(positionIndex * 0.02, jitterRadius); // Khoảng cách tăng dần
      
      const jitteredValue = valueScore + Math.cos(angle) * distance;
      const jitteredComplexity = complexityScore + Math.sin(angle) * distance;
      
      // Xác định trạng thái task dựa trên completed và deadline
      const currentDate = new Date();
      const deadlineDate = new Date(t.deadline);
      let taskStatus = 'pending'; // Mặc định là đang chờ
      
      if (t.completed) {
        taskStatus = 'completed'; // Đã hoàn thành
      } else if (deadlineDate < currentDate) {
        taskStatus = 'overdue'; // Quá hạn
      } else {
        taskStatus = 'pending'; // Còn hạn, đang chờ làm
      }
      
      return {
        id: t.id,
        title: t.title || 'Untitled Task',
        value: jitteredValue,
        complexity: jitteredComplexity,
        originalValue: valueScore,
        originalComplexity: complexityScore,
        status: taskStatus,
        priority: t.priority || 'low',
        deadline: t.deadline,
        isCompleted: t.completed
      };
    });
  }, [tasks]);

  // Custom tooltip component (memoized)
  const CustomTooltip = useCallback(({ active, payload }: any) => {
    if (!active || !payload || !payload.length) {
      return null;
    }

    const task = payload[0]?.payload as TaskDataPoint;
    if (!task) {
      return null;
    }

    // Format deadline
    const deadlineDate = new Date(task.deadline);
    const formattedDeadline = deadlineDate.toLocaleDateString('vi-VN');
    const isOverdue = deadlineDate < new Date() && !task.isCompleted;

    // Status labels
    const statusLabels = {
      completed: 'HOÀN THÀNH',
      pending: 'ĐANG CHỜ',
      overdue: 'QUÁ HẠN'
    };

    return (
      <div className="value-complexity-tooltip">
        <div className="value-complexity-tooltip__header">
          <h4 className="value-complexity-tooltip__title">{task.title}</h4>
          <span 
            className={`value-complexity-tooltip__status value-complexity-tooltip__status--${task.status}`}
          >
            {statusLabels[task.status as keyof typeof statusLabels] || task.status.toUpperCase()}
          </span>
        </div>
        <div className="value-complexity-tooltip__content">
          <div className="value-complexity-tooltip__item">
            <span className="value-complexity-tooltip__label">Deadline:</span>
            <span className={`value-complexity-tooltip__value ${isOverdue ? 'text-red-600' : ''}`}>
              {formattedDeadline}
            </span>
          </div>
          <div className="value-complexity-tooltip__item">
            <span className="value-complexity-tooltip__label">Value:</span>
            <span className="value-complexity-tooltip__value">
              {VALUE_SCALE_LABELS[task.originalValue - 1] || 'Unknown'}
            </span>
          </div>
          <div className="value-complexity-tooltip__item">
            <span className="value-complexity-tooltip__label">Complexity:</span>
            <span className="value-complexity-tooltip__value">
              {COMPLEXITY_SCALE_LABELS[task.originalComplexity - 1] || 'Unknown'}
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

  // Nhóm tasks theo status để tạo scatter riêng biệt
  const tasksByStatus = useMemo(() => {
    const grouped = taskDataPoints.reduce((acc, task) => {
      if (!acc[task.status]) {
        acc[task.status] = [];
      }
      acc[task.status].push(task);
      return acc;
    }, {} as Record<string, TaskDataPoint[]>);
    
    return grouped;
  }, [taskDataPoints]);

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
              <div className="value-complexity-matrix__legend-item">
                <div 
                  className="value-complexity-matrix__legend-color"
                  style={{ backgroundColor: STATUS_COLORS.completed }}
                />
                <span>Hoàn thành</span>
              </div>
              <div className="value-complexity-matrix__legend-item">
                <div 
                  className="value-complexity-matrix__legend-color"
                  style={{ backgroundColor: STATUS_COLORS.pending }}
                />
                <span>Đang chờ</span>
              </div>
              <div className="value-complexity-matrix__legend-item">
                <div 
                  className="value-complexity-matrix__legend-color"
                  style={{ backgroundColor: STATUS_COLORS.overdue }}
                />
                <span>Quá hạn</span>
              </div>
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
                offset={-15}
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

            {/* Render scatter cho từng status với màu khác nhau */}
            {Object.entries(tasksByStatus).map(([status, tasks]) => (
              <Scatter
                key={status}
                name={status}
                data={tasks}
                fill={STATUS_COLORS[status as keyof typeof STATUS_COLORS] || STATUS_COLORS.default}
                isAnimationActive={false}
              />
            ))}
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
