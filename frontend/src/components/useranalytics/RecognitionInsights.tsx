import { useEffect, useState } from "react";
import { Line } from "react-chartjs-2";
import { alpha, Box, Grid, Typography, useTheme } from "@mui/material";
import { COLORS } from "../../theme/dashboardTheme";
import { getChartScales, getChartTooltip } from "../admin/dashboard/overview/shared/ChartConstants";
import ChartWrapper from "../admin/dashboard/overview/shared/ChartWrapper";
import { getRecognitionInsights } from "../../services/userAnalyticsService";
import type { RecognitionInsightsResponse } from "../../types/userAnalyticsBackend.types";
import type { ScriptableContext } from "chart.js";

export default function RecognitionInsights() {
  const theme = useTheme();
  const [insights, setInsights] = useState<RecognitionInsightsResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
  let mounted = true;
  getRecognitionInsights(72, 60, 30)
    .then((res) => {
      if (!mounted) return;
      setInsights(res);
      setError(null);
    })
    .catch((err) => {
      console.error(err);
      if (!mounted) return;
      setError("Failed to load recognition insights");
    })
    .finally(() => {
      if (!mounted) return;
      setLoading(false);
    });

  return () => {
    mounted = false;
  };
}, []);

  const trendPoints = insights?.trends ?? [];
  const perf = insights?.performance;

  const data = {
    labels: trendPoints.map(t => new Date(t.timestamp).toLocaleString()),
    datasets: [{
      label: "Confidence %",
      data: trendPoints.map(t => t.confidence_score * 100),
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

  return (
    <Box>
      <Grid container spacing={2} sx={{ mb: 3 }}>
        {perf ? (
          [ 
            { label: 'Avg Confidence', value: `${(perf.avg_confidence * 100).toFixed(1)}%`, color: COLORS.navy },
            { label: 'Success Rate', value: `${perf.success_rate}%`, color: COLORS.present },
            { label: 'False Rejections', value: `${perf.false_rejection_rate}%`, color: COLORS.absent },
          ].map((stat, index) => (
            <Grid size={{xs:4}} key={index}>
              <Box sx={{ p: 2, borderRadius: 2, bgcolor: "background.default", border: `1px solid ${theme.palette.divider}`, textAlign: 'center' }}>
                <Typography variant="caption" color="text.secondary" fontWeight="900" sx={{ textTransform: 'uppercase' }}>{stat.label}</Typography>
                <Typography variant="h5" fontWeight="900" sx={{ color: stat.color }}>{stat.value}</Typography>
              </Box>
            </Grid>
          ))
        ) : null}
      </Grid>

      <ChartWrapper label="AI Intelligence" title="Recognition Confidence Trend" action={<Typography variant="caption" fontWeight="bold" color="text.secondary">{insights?.model_version ?? 'vN'}</Typography>}>
        <Box sx={{ minHeight: 280, width: '100%', pb: 4, mt: 1 }}>
          {loading ? (
            <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100%' }}>Loading...</Box>
          ) : error ? (
            <Box sx={{ p: 2 }}><Typography color="error">{error}</Typography></Box>
          ) : (
            <Line data={data} options={{ responsive: true, maintainAspectRatio: false, plugins: { legend: { display: false }, tooltip: getChartTooltip() }, scales: getChartScales() }} />
          )}
        </Box>
      </ChartWrapper>
    </Box>
  );
}
