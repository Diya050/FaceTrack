import React from 'react';
import { Box, Typography, Stack } from '@mui/material';
import { Bar } from 'react-chartjs-2';
import { MOCK_ATTENDANCE_STATS } from '../../data/mockdata.useranalytics';
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

const MonthlyAttendanceChart: React.FC = () => {
  const data = {
    labels: MOCK_ATTENDANCE_STATS.map(s => s.status),
    datasets: [
      {
        label: 'Days',
        data: MOCK_ATTENDANCE_STATS.map(s => s.count),
        backgroundColor: MOCK_ATTENDANCE_STATS.map(s => s.color),
        borderRadius: 4,
      },
    ],
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { display: false },
    },
    scales: {
      y: { beginAtZero: true }
    }
  };

  return (
    <Box>
      <Typography variant="h6" fontWeight="600" sx={{ mb: 2 }}>
        Monthly Attendance Overview
      </Typography>
      
      <Box sx={{ height: 250, width: '100%' }}>
        <Bar data={data} options={options} />
      </Box>

      <Stack direction="row" flexWrap="wrap" spacing={2} sx={{ mt: 3 }}>
        {MOCK_ATTENDANCE_STATS.map((item) => (
          <Box key={item.status} sx={{ display: 'flex', alignItems: 'center' }}>
            <Box sx={{ width: 12, height: 12, borderRadius: '50%', bgcolor: item.color, mr: 1 }} />
            <Typography variant="caption" color="text.secondary">
              {item.status}: <strong>{item.count}</strong>
            </Typography>
          </Box>
        ))}
      </Stack>
    </Box>
  );
};

export default MonthlyAttendanceChart;