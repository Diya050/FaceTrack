import { Line } from "react-chartjs-2";
import { alpha, Box } from "@mui/material";
import { COLORS } from "../../theme/dashboardTheme";
import { getChartScales, getChartTooltip } from "../admin/dashboard/overview/shared/ChartConstants";
import ChartWrapper from"../admin/dashboard/overview/shared/ChartWrapper";
import TrendBadge from "../admin/dashboard/overview/shared/TrendBadge";
import { MOCK_WORKING_HOURS } from "../../data/mockdata.useranalytics";
import type { ScriptableContext } from "chart.js";

export default function WorkingHoursTrend() {
  const avgHours = MOCK_WORKING_HOURS.reduce((acc, curr) => acc + curr.actual, 0) / MOCK_WORKING_HOURS.length;
  const isOvertime = avgHours > 8;

  const data = {
    labels: MOCK_WORKING_HOURS.map(d => d.date),
    datasets: [
      {
        label: "Actual Hours",
        data: MOCK_WORKING_HOURS.map(d => d.actual),
        borderColor: COLORS.early,
        tension: 0.4,
        fill: true,
        pointRadius: 4,
        borderWidth: 3,
        backgroundColor: (ctx: ScriptableContext<"line">) => {
          const canvas = ctx.chart.ctx;
          const gradient = canvas.createLinearGradient(0, 0, 0, 200);
          gradient.addColorStop(0, alpha(COLORS.early, 0.15));
          gradient.addColorStop(1, alpha(COLORS.early, 0));
          return gradient;
        },
      },
      {
        label: "Expected (8h)",
        data: MOCK_WORKING_HOURS.map(() => 8),
        borderColor: COLORS.slate,
        borderDash: [6, 6],
        pointRadius: 0,
        fill: false,
        borderWidth: 2,
      }
    ],
  };

  return (
    <ChartWrapper 
      label="Productivity" 
      title="Working Hours Trend"
      action={
        <TrendBadge 
          trend={isOvertime ? "up" : "down"} 
          value={`${isOvertime ? '+' : ''}${(avgHours - 8).toFixed(1)}h avg overtime`} 
        />
      }
    >
      {/* Height reduced to 250 to ensure X-axis labels (Mon, Tue...) are visible */}
      <Box sx={{ height: 250, mt: 1 }}>
        <Line 
          data={data} 
          options={{
            responsive: true,
            maintainAspectRatio: false,
            plugins: { 
              legend: { 
                display: true, 
                position: 'top', 
                align: 'end',
                labels: { boxWidth: 8, usePointStyle: true, font: { size: 11 } } 
              }, 
              tooltip: getChartTooltip() 
            },
            scales: getChartScales(),
          }} 
        />
      </Box>
    </ChartWrapper>
  );
}