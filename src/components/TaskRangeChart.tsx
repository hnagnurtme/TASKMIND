import React, { useEffect, useState } from "react";
import ReactApexChart from "react-apexcharts";
import { Task } from "@/interface/task";
import { ApexOptions } from "apexcharts";

interface TaskChartProps {
  tasks: Task[];
}

// map tasks thành dữ liệu rangeBar
const mapTasksToRangeData = (tasks: Task[]) => {
  return tasks.map((task) => ({
    x: task.title,
    y: [
      new Date().getTime(), // giả lập start date hiện tại
      new Date(task.deadline).getTime(),
    ],
  }));
};

const TaskRangeChart: React.FC<TaskChartProps> = ({ tasks }) => {
  const [series, setSeries] = useState([
    {
      data: mapTasksToRangeData(tasks),
    },
  ]);

  useEffect(() => {
    setSeries([
      {
        data: mapTasksToRangeData(tasks),
      },
    ]);
  }, [tasks]);

  const options: ApexOptions = {
    chart: {
      type: "rangeBar",
      height: 450,
      zoom: { enabled: false },
    },
    plotOptions: {
      bar: {
        horizontal: true,
        barHeight: "50%",
        distributed: true,
      },
    },
    xaxis: {
      type: "datetime",
      title: { text: "Thời gian" },
    },
    yaxis: {
      title: { text: "Task" },
    },
    title: {
      text: "Task Timeline",
      align: "center",
    },
    fill: {
      type: "gradient",
      gradient: {
        shade: "light",
        type: "horizontal",
        shadeIntensity: 0.25,
        inverseColors: false,
        stops: [0, 100],
      },
    },
    tooltip: {
      custom: function ({
        dataPointIndex,
      }: {
        series: number[];
        seriesIndex: number;
        dataPointIndex: number;
        w: any;
      }) {
        const task = tasks[dataPointIndex];
        return `<div style="padding:5px">
                  <strong>${task.title}</strong><br/>
                  Deadline: ${new Date(task.deadline).toLocaleString()}<br/>
                  Priority: ${task.priority}<br/>
                  Complexity: ${task.complexity}
                </div>`;
      },
    },
  };

  return (
    <div id="chart">
      <ReactApexChart
        options={options}
        series={series}
        type="rangeBar"
        height={450}
      />
    </div>
  );
};

export default TaskRangeChart;
