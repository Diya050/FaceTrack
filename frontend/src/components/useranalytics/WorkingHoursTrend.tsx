import { useEffect, useState } from "react";
import { Line } from "react-chartjs-2";
import { alpha, Box } from "@mui/material";
import { COLORS } from "../../theme/dashboardTheme";
import { getChartScales, getChartTooltip } from "../admin/dashboard/ChartConstants";
import ChartWrapper from "../admin/dashboard/ChartWrapper";
import TrendBadge from "../admin/dashboard/TrendBedge";
import { getWorkingHoursTrend } from "../../services/userAnalyticsService";
import type { WorkingHoursResponse } from "../../types/userAnalyticsBackend.types";
import type { ScriptableContext } from "chart.js";

export default function WorkingHoursTrend() {
  const [dataResp, setDataResp] = useState<WorkingHoursResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

useEffect(() => {
  let mounted = true;
  getWorkingHoursTrend(7)
    .then((res) => {
      if (!mounted) return;
      setDataResp(res);
      setError(null);
    })
    .catch((err) => {
      console.error(err);
      if (!mounted) return;
      setError("Failed to load working hours");
    })
    .finally(() => {
      if (!mounted) return;
      setLoading(false);
    });

  return () => { 
    mounted = false; 
  };
}, []);
  const points = dataResp?.points ?? [];
  const avgHours = dataResp?.avg_hours ?? 0;
  const isOvertime = avgHours > 8;

  const chartData = {
    labels: points.map(d => new Date(d.date).toLocaleDateString(undefined, { weekday: 'short' })),
    datasets: [
      {
        label: "Actual Hours",
        data: points.map(d => d.actual),
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
        data: points.map(() => 8),
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
      <Box sx={{ height: 250, mt: 1 }}>
        {loading ? (
          <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100%' }}>
            <div>Loading...</div>
          </Box>
        ) : error ? (
          <Box sx={{ p: 2 }}>
            <div style={{ color: 'red' }}>{error}</div>
          </Box>
        ) : (
          <Line 
            data={chartData} 
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
        )}
      </Box>
    </ChartWrapper>
  );
}
