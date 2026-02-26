import { Box, Typography } from "@mui/material";
import { Doughnut } from "react-chartjs-2";
import { COLORS } from "../../../../../theme/dashboardTheme";
import { DEPT_COLORS } from "../shared/ChartConstants";
import ChartWrapper from "../shared/ChartWrapper";
import { mockDepartmentSummary } from "../../../../../data/dashboard.mock";
import { getChartTooltip } from "../shared/ChartConstants";

export default function DepartmentDonut() {
  const data = {
    labels: mockDepartmentSummary.map((d) => d.department),
    datasets: [{
      data: mockDepartmentSummary.map((d) => d.present),
      backgroundColor: DEPT_COLORS,
      borderWidth: 0,
    }],
  };


return (
  <ChartWrapper label="Today" title="Department Split" height={260}> {/* Increased height slightly */}
    <Box
      sx={{
        position: "relative",
        height: "100%",
        display: "flex",
        flexDirection: "column",
        justifyContent: "center", // Vertically centers the content
        alignItems: "center",
      }}
    >
      <Box sx={{ width: '100%', height: '100%', maxHeight: '200px' }}>
        <Doughnut
          data={data}
          options={{
            maintainAspectRatio: false,
            cutout: "70%", // Slightly thicker ring looks better with bold text
            plugins: {
              legend: {
                position: "bottom",
                labels: {
                  padding: 15,
                  usePointStyle: true,
                  font: { size: 11, weight: 600 }
                },
              },
              tooltip: getChartTooltip(),
            },
          }}
        />
      </Box>

      {/* The Centering Fix */}
      <Box
        sx={{
          position: "absolute",
          // This ensures it centers based on the DONUT, not the whole Box
          top: "40%", 
          left: "50%",
          transform: "translate(-50%, -50%)",
          textAlign: "center",
          pointerEvents: "none",
        }}
      >
        <Typography
          variant="h4"
          sx={{
            color: COLORS.navy,
            fontWeight: 900,
            lineHeight: 1,
          }}
        >
          {mockDepartmentSummary.reduce((a, b) => a + b.present, 0)}
        </Typography>
        <Typography
          variant="caption"
          sx={{
            color: COLORS.slate,
            fontWeight: 700,
            textTransform: "uppercase",
            fontSize: 10,
            letterSpacing: '0.05em'
          }}
        >
          Total
        </Typography>
      </Box>
    </Box>
  </ChartWrapper>
);
}