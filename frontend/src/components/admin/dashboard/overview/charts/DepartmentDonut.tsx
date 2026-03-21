// src/pages/admin/dashboard/charts/DepartmentDonut.tsx
import { Box, Typography } from "@mui/material";
import { Doughnut } from "react-chartjs-2";
import ChartWrapper from "../shared/ChartWrapper";

interface DeptSummaryItem {
  department: string;
  present: number;
  total: number;
}

interface Props {
  summary: DeptSummaryItem[];
}

const COLORS = ["#22C55E", "#3B82F6", "#F59E0B", "#EF4444", "#8B5CF6", "#EC4899"];

export default function DepartmentDonut({ summary }: Props) {
  if (!summary || summary.length === 0) {
    return <Typography color="text.secondary">No department data</Typography>;
  }

  const total = summary.reduce((acc, curr) => acc + curr.present, 0);

  if (total === 0) {
    return <Typography color="text.secondary">No attendance recorded</Typography>;
  }

  const chartData = {
    labels: summary.map((d) => d.department),
    datasets: [
      {
        data: summary.map((d) => d.present),
        backgroundColor: COLORS.slice(0, summary.length),
        borderWidth: 0,
        hoverOffset: 4,
      },
    ],
  };

  return (
    <ChartWrapper label="TODAY" title="Department Split">
      {/* 
        KEY FIX: position relative on this wrapper so the absolute center text 
        is anchored correctly inside the doughnut hole.
      */}
      <Box sx={{ position: "relative", width: "100%", height: "100%" }}>
        <Doughnut
          data={chartData}
          options={{
            maintainAspectRatio: false,
            cutout: "68%",
            plugins: {
              legend: {
                position: "bottom",
                labels: {
                  padding: 14,
                  usePointStyle: true,
                  pointStyleWidth: 8,
                  font: { size: 12 },
                },
              },
              tooltip: {
                callbacks: {
                  label: (ctx) =>
                    ` ${ctx.label}: ${ctx.parsed} (${Math.round((ctx.parsed / total) * 100)}%)`,
                },
              },
            },
          }}
        />

        {/* Center text — positioned over the hole */}
        <Box
          sx={{
            position: "absolute",
            // Push up above the legend (~40px)
            top: "calc(50% - 20px)",
            left: "50%",
            transform: "translate(-50%, -50%)",
            textAlign: "center",
            pointerEvents: "none",
          }}
        >
          <Typography sx={{ fontSize: 28, fontWeight: 800, lineHeight: 1, color: "#111827" }}>
            {total}
          </Typography>
          <Typography sx={{ fontSize: 11, fontWeight: 600, color: "#9CA3AF", mt: 0.3 }}>
            TOTAL
          </Typography>
        </Box>
      </Box>
    </ChartWrapper>
  );
}