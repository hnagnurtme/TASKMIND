// src/components/TaskProgress.tsx
import React from "react";

interface TaskProgressProps {
  completionPercent: number; // 0 - 100
  size?: number; // bar height, default 8px
  filledColor?: string; // color for completed portion
  emptyColor?: string; // color for remaining portion
}

const TaskProgress: React.FC<TaskProgressProps> = ({
  completionPercent,
  size = 8,
  filledColor = "#10b981",
  emptyColor = "#e5e7eb",
}) => {
    const roundedPercent = Math.max(0, Math.min(100, completionPercent));
    const clampedPercent = Math.round(roundedPercent * 100) / 100;

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 4 }}>
      {/* Progress bar */}
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

      {/* Completion percentage */}
      <div style={{ fontSize: 12, color: "#374151", textAlign: "right" }}>
        {clampedPercent}% completed
      </div>
    </div>
  );
};

export default TaskProgress;


// ----------------------------
