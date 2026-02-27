import { Line } from "react-chartjs-2";
import { alpha, Box, Grid, Typography, useTheme } from "@mui/material";
import { COLORS } from "../../theme/dashboardTheme";
import { getChartScales, getChartTooltip } from "../admin/dashboard/overview/shared/ChartConstants";
import ChartWrapper from "../admin/dashboard/overview/shared/ChartWrapper";
import { MOCK_RECOGNITION_TRENDS, MOCK_RECOGNITION_PERFORMANCE } from "../../data/mockdata.useranalytics";
import type { ScriptableContext } from "chart.js";

export default function RecognitionInsights() {
  const theme = useTheme();

  const data = {
    labels: MOCK_RECOGNITION_TRENDS.map(t => t.timestamp),
    datasets: [{
      label: "Confidence %",
      data: MOCK_RECOGNITION_TRENDS.map(t => t.confidence_score * 100),
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
    }],
  };

  const performanceStats = [
    { label: 'Avg Confidence', value: `${(MOCK_RECOGNITION_PERFORMANCE.avg_confidence * 100).toFixed(1)}%`, color: COLORS.navy },
    { label: 'Success Rate', value: `${MOCK_RECOGNITION_PERFORMANCE.success_rate}%`, color: COLORS.present },
    { label: 'False Rejections', value: `${MOCK_RECOGNITION_PERFORMANCE.false_rejection_rate}%`, color: COLORS.absent },
  ];

  return (
    <Box>
      {/* 3.6 AI Performance Insights Grid */}
      <Grid container spacing={2} sx={{ mb: 3 }}>
        {performanceStats.map((stat, index) => (
          <Grid size={{xs:4}} key={index}>
            <Box sx={{ 
              p: 2, 
              borderRadius: 2, 
              bgcolor: "background.default", 
              border: `1px solid ${theme.palette.divider}`,
              textAlign: 'center',
              transition: "0.3s",
              "&:hover": { borderColor: alpha(COLORS.navy, 0.2), bgcolor: "white" }
            }}>
              <Typography variant="caption" color="text.secondary" fontWeight="900" sx={{ textTransform: 'uppercase' }}>
                {stat.label}
              </Typography>
              <Typography variant="h5" fontWeight="900" sx={{ color: stat.color }}>
                {stat.value}
              </Typography>
            </Box>
          </Grid>
        ))}
      </Grid>

      {/* 3.5 Recognition Confidence Trend */}
      <ChartWrapper 
        label="AI Intelligence" 
        title="Recognition Confidence Trend"
        action={<Typography variant="caption" fontWeight="bold" color="text.secondary">v8-Face Live</Typography>}
      >
        {/* Changed from height to minHeight and added bottom padding to ensure labels fit */}
        <Box sx={{ minHeight: 280, width: '100%', pb: 4, mt: 1 }}>
          <Line 
            data={data} 
            options={{
              responsive: true,
              maintainAspectRatio: false,
              plugins: { 
                legend: { display: false }, 
                tooltip: getChartTooltip() 
              },
              scales: getChartScales(),
            }} 
          />
        </Box>
      </ChartWrapper>
    </Box>
  );
}