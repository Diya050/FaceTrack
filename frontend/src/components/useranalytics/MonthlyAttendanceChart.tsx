
import { Box, Typography, Stack, alpha } from '@mui/material';
import { Bar } from 'react-chartjs-2';
import { MOCK_ATTENDANCE_STATS } from '../../data/mockdata.useranalytics';
import { COLORS } from '../../theme/dashboardTheme';
import { getChartScales, getChartTooltip } from "../admin/dashboard/overview/shared/ChartConstants";
import ChartWrapper from "../admin/dashboard/overview/shared//ChartWrapper";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

export default function MonthlyAttendanceChart() {
  const data = {
    labels: MOCK_ATTENDANCE_STATS.map((s) => s.status),
    datasets: [
      {
        label: 'Days',
        data: MOCK_ATTENDANCE_STATS.map((s) => s.count),
        backgroundColor: MOCK_ATTENDANCE_STATS.map((s) => s.color),
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
        <Bar 
          data={data} 
          options={{
            responsive: true,
            maintainAspectRatio: false,
            plugins: { legend: { display: false }, tooltip: getChartTooltip() },
            scales: getChartScales(),
          }} 
        />
      </Box>

      <Stack direction="row" flexWrap="wrap" spacing={2} sx={{ mt: 3, pt: 2, borderTop: `1px solid ${alpha(COLORS.navy, 0.05)}` }}>
        {MOCK_ATTENDANCE_STATS.map((item) => (
          <Box key={item.status} sx={{ display: 'flex', alignItems: 'center' }}>
            <Box sx={{ width: 8, height: 8, borderRadius: '50%', bgcolor: item.color, mr: 1 }} />
            <Typography variant="caption" fontWeight="800" color="primary">
              {item.status}: <Box component="span" sx={{ color: 'text.secondary', fontWeight: '500' }}>{item.count}</Box>
            </Typography>
          </Box>
        ))}
      </Stack>
    </ChartWrapper>
  );
}