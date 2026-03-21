import { useEffect, useState } from 'react';
import { Box, Typography, Stack, alpha } from '@mui/material';
import { Bar } from 'react-chartjs-2';
import { COLORS } from '../../theme/dashboardTheme';
import { getChartScales, getChartTooltip } from "../admin/dashboard/overview/shared/ChartConstants";
import ChartWrapper from "../admin/dashboard/overview/shared/ChartWrapper";
import { getMonthlyAttendanceStats } from '../../services/userAnalyticsService';

export default function MonthlyAttendanceChart() {
  
  const [stats, setStats] = useState<{ status: string; count: number; color?: string | null }[]>([]);
  
  
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let mounted = true;
    getMonthlyAttendanceStats(/* organizationId optional */)
      .then((res) => {
        if (!mounted) return;
        setStats(res.stats);
        setError(null); 
      })
      .catch((err) => {
        console.error(err);
        if (!mounted) return;
        setError('Failed to load attendance stats');
      })
      .finally(() => {
        if (!mounted) return;
        setLoading(false);
      });

    return () => { mounted = false; };
  }, []);

  const data = {
    labels: stats.map((s) => s.status),
    datasets: [
      {
        label: 'Days',
        data: stats.map((s) => s.count),
        backgroundColor: stats.map((s) => s.color || COLORS.navy),
        borderRadius: 6,
        barThickness: 32,
      },
    ],
  };

  return (
    <ChartWrapper 
      label="Monthly Summary" 
      title="Attendance Distribution"
      action={<Typography variant="caption" fontWeight="900" color="text.secondary">FEB 2026</Typography>}
    >
      <Box sx={{ height: 280, width: '100%' }}>
        {loading ? (
          <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100%' }}>
            <Typography variant="body2" color="text.secondary">Loading...</Typography>
          </Box>
        ) : error ? (
          <Box sx={{ p: 2 }}>
            <Typography color="error">{error}</Typography>
          </Box>
        ) : (
          <Bar 
            data={data} 
            options={{
              responsive: true,
              maintainAspectRatio: false,
              plugins: { legend: { display: false }, tooltip: getChartTooltip() },
              scales: getChartScales(),
            }} 
          />
        )}
      </Box>

      <Stack direction="row" flexWrap="wrap" spacing={2} sx={{ mt: 3, pt: 2, borderTop: `1px solid ${alpha(COLORS.navy, 0.05)}` }}>
        {stats.map((item) => (
          <Box key={item.status} sx={{ display: 'flex', alignItems: 'center' }}>
            <Box sx={{ width: 8, height: 8, borderRadius: '50%', bgcolor: item.color || COLORS.navy, mr: 1 }} />
            <Typography variant="caption" fontWeight="800" color="primary">
              {item.status}: <Box component="span" sx={{ color: 'text.secondary', fontWeight: '500' }}>{item.count}</Box>
            </Typography>
          </Box>
        ))}
      </Stack>
    </ChartWrapper>
  );
}
