import React from "react";
import { Box, Stack, Typography } from "@mui/material";
import { Bar } from "react-chartjs-2";
import { MOCK_ATTENDANCE_STATS } from "../../data/mockdata.useranalytics";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";

import ChartWrapper from "../admin/dashboard/overview/shared/ChartWrapper";
import { getChartTooltip, getChartScales } from "../admin/dashboard/overview/shared/ChartConstants";

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

const MonthlyAttendanceChart: React.FC = () => {
  const totalDays = MOCK_ATTENDANCE_STATS.reduce((acc, curr) => acc + curr.count, 0);

  const data = {
    labels: MOCK_ATTENDANCE_STATS.map((s) => s.status),
    datasets: [
      {
        label: "Days",
        data: MOCK_ATTENDANCE_STATS.map((s) => s.count),
        backgroundColor: MOCK_ATTENDANCE_STATS.map((s) => s.color),
        borderRadius: 6,
        barThickness: 40,
      },
    ],
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { display: false },
      tooltip: getChartTooltip(),
    },
    scales: {
      ...getChartScales(),
      y: {
        beginAtZero: true,
        ticks: { stepSize: 2 },
      },
    },
  };

  return (
    <ChartWrapper
      label="Attendance"
      title="Monthly Attendance Overview"
      action={
        <Typography variant="caption" fontWeight={600}>
          Total: {totalDays} Days
        </Typography>
      }
    >
      <Box sx={{ height: 250, mt: 1 }}>
        <Bar data={data} options={options} />
      </Box>

      <Stack direction="row" flexWrap="wrap" spacing={2} sx={{ mt: 3 }}>
        {MOCK_ATTENDANCE_STATS.map((item) => (
          <Box key={item.status} sx={{ display: "flex", alignItems: "center" }}>
            <Box
              sx={{
                width: 12,
                height: 12,
                borderRadius: "50%",
                bgcolor: item.color,
                mr: 1,
              }}
            />
            <Typography variant="caption" color="text.secondary">
              {item.status}: <strong>{item.count}</strong>
            </Typography>
          </Box>
        ))}
      </Stack>
    </ChartWrapper>
  );
};

export default MonthlyAttendanceChart;