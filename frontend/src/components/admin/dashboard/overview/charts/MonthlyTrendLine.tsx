// src/pages/admin/dashboard/charts/MonthlyTrendLine.tsx
import { Line } from "react-chartjs-2";
import { alpha } from "@mui/material";
import type { ScriptableContext } from "chart.js";
import ChartWrapper from "../shared/ChartWrapper";
import { getChartScales, getChartTooltip } from "../shared/ChartConstants";
import { Typography } from "@mui/material";

interface MonthlyTrend {
  labels: string[];
  rate: number[];
}

interface Props {
  trend: MonthlyTrend;
}

export default function MonthlyTrendLine({ trend }: Props) {
  if (!trend || trend.labels.length === 0) {
    return <Typography color="text.secondary">No trend data available</Typography>;
  }

  const data = {
    labels: trend.labels,
    datasets: [
      {
        label: "Attendance %",
        data: trend.rate,
        borderColor: "#22C55E",
        tension: 0.4,
        fill: true,
        pointRadius: 2,
        pointHoverRadius: 6,
        borderWidth: 2.5,
        backgroundColor: (ctx: ScriptableContext<"line">) => {
          const { ctx: canvas, chartArea } = ctx.chart;
          if (!chartArea) return "transparent";
          const gradient = canvas.createLinearGradient(0, chartArea.top, 0, chartArea.bottom);
          gradient.addColorStop(0, alpha("#22C55E", 0.18));
          gradient.addColorStop(1, alpha("#22C55E", 0));
          return gradient;
        },
      },
    ],
  };

  return (
    <ChartWrapper label="30 DAYS" title="Attendance Trend">
      <Line
        data={data}
        options={{
          responsive: true,
          maintainAspectRatio: false,
          plugins: {
            legend: { display: false },
            tooltip: getChartTooltip(),
          },
          scales: getChartScales(),
        }}
      />
    </ChartWrapper>
  );
}