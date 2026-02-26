import { Line } from "react-chartjs-2";
import { COLORS } from "../../../../../theme/dashboardTheme";
import { getChartScales, getChartTooltip } from "../shared/ChartConstants";
import ChartWrapper from "../shared/ChartWrapper";
import TrendBadge from "../shared/TrendBadge";
import { mockMonthlyTrend } from "../../../../../data/dashboard.mock";
import type { ScriptableContext }  from "chart.js";
import { alpha } from "@mui/material"

export default function MonthlyTrendLine() {
  const data = {
    labels: mockMonthlyTrend.labels,
    datasets: [{
      label: "Attendance %",
      data: mockMonthlyTrend.rate,
      borderColor: COLORS.present,
      tension: 0.4,
      fill: true,
      pointRadius: 4,
      borderWidth: 3,
        backgroundColor: (ctx: ScriptableContext<"line">) => {
          const canvas = ctx.chart.ctx;
          const gradient = canvas.createLinearGradient(0, 0, 0, 200);
          gradient.addColorStop(0, alpha(COLORS.present, 0.15));
          gradient.addColorStop(1, alpha(COLORS.present, 0));
          return gradient;
        },
      },
    ],
  };

  return (
    <ChartWrapper 
      label="30 Days" 
      title="Attendance Trend"
      action={<TrendBadge trend="down" value="-2.1% vs last month" />}
    >
      <Line 
        data={data} 
        options={{
          responsive: true,
          maintainAspectRatio: false,
          plugins: { legend: { display: false }, tooltip: getChartTooltip() },
          scales: getChartScales(),
        }} 
      />
    </ChartWrapper>
  );
}