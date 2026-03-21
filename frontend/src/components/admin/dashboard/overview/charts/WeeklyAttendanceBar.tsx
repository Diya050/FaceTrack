// src/pages/admin/dashboard/charts/WeeklyAttendanceBar.tsx
import { Box, Stack, Typography } from "@mui/material";
import { Bar } from "react-chartjs-2";
import ChartWrapper from "../shared/ChartWrapper";
import { getChartScales, getChartTooltip } from "../shared/ChartConstants";


interface WeeklyReport {
  labels: string[];
  present: number[];
  absent: number[];
  late: number[];
}

interface Props {
  report: WeeklyReport;
}

const LEGEND = [
  { color: "#22C55E", label: "Present" },
  { color: "#EF4444", label: "Absent" },
  { color: "#F59E0B", label: "Late" },
];

export default function WeeklyAttendanceBar({ report }: Props) {
  if (!report || report.labels.length === 0) {
    return <Typography color="text.secondary">No data available</Typography>;
  }
const data = {
  labels: report.labels,
  datasets: [
    {
      label: "Present",
      data: report.present,
      backgroundColor: "#22C55E",
      borderRadius: 6,
      barThickness: 10,
      categoryPercentage: 0.6,  // ✅ here
      barPercentage: 0.6,        // ✅ here
    },
    {
      label: "Absent",
      data: report.absent,
      backgroundColor: "#EF4444",
      borderRadius: 6,
      barThickness: 10,
      categoryPercentage: 0.6,
      barPercentage: 0.6,
    },
    {
      label: "Late",
      data: report.late,
      backgroundColor: "#F59E0B",
      borderRadius: 6,
      barThickness: 10,
      categoryPercentage: 0.6,
      barPercentage: 0.6,
    },
  ],
};


  const legend = (
    <Stack direction="row" spacing={2}>
      {LEGEND.map(({ color, label }) => (
        <Stack key={label} direction="row" spacing={0.75} alignItems="center">
          <Box sx={{ width: 8, height: 8, borderRadius: "50%", bgcolor: color }} />
          <Typography sx={{ fontSize: 11, color: "#6B7280", fontWeight: 500 }}>
            {label}
          </Typography>
        </Stack>
      ))}
    </Stack>
  );

  return (
    <ChartWrapper label="THIS WEEK" title="Weekly Attendance" action={legend}>
      <Bar
        data={data}
        options={{
          responsive: true,
          maintainAspectRatio: false,
          plugins: {
            legend: { display: false },
            tooltip: getChartTooltip(),
          },
          scales: getChartScales()
        }}
      />
    </ChartWrapper>
  );
}