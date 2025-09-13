// src/components/TaskProgress.tsx
import React from "react";

interface TaskProgressProps {
  completionPercent: number; // 0 - 100
  size?: number; // chiều cao thanh, default 8px
  filledColor?: string; // màu phần đã hoàn thành
  emptyColor?: string; // màu phần chưa hoàn thành
}

const TaskProgress: React.FC<TaskProgressProps> = ({
  completionPercent,
  size = 8,
  filledColor = "#10b981",
  emptyColor = "#e5e7eb",
}) => {
  const clampedPercent = Math.round(
    Math.max(0, Math.min(100, completionPercent)) * 100
  ); 

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 4 }}>
      {/* Thanh tiến độ */}
      <div
        style={{
          width: "100%",
          height: `${size}px`,
          backgroundColor: emptyColor,
          borderRadius: size / 2,
          overflow: "hidden",
        }}
      >
        <div
          style={{
            width: `${clampedPercent}%`,
            height: "100%",
            backgroundColor: filledColor,
            transition: "width 0.3s ease",
          }}
        />
      </div>

      {/* % hoàn thành */}
      <div style={{ fontSize: 12, color: "#374151", textAlign: "right" }}>
        {clampedPercent}% hoàn thành
      </div>
    </div>
  );
};

export default TaskProgress;

// ----------------------------
