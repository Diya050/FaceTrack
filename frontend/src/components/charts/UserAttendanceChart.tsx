import { useEffect, useState } from "react";
import { Doughnut } from "react-chartjs-2";
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from "chart.js";
import { Box, CircularProgress } from "@mui/material";
import { getChartDistribution,type ChartDistributionData } from "../../services/userDashboardService";

ChartJS.register(ArcElement, Tooltip, Legend);

const UserAttendanceChart = () => {
  const [chartData, setChartData] = useState<ChartDistributionData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchChartData = async () => {
      try {
        const data = await getChartDistribution();
        setChartData(data);
      } catch (error) {
        console.error("Error fetching chart data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchChartData();
  }, []);

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" height="100%">
        <CircularProgress />
      </Box>
    );
  }

  const safeData = chartData || { on_time: 0, late: 0, early_out: 0, absent: 0 };

  const data = {
    labels: ["On Time", "Late", "Early Out", "Absent"],
    datasets: [
      {
        data: [
          safeData.on_time, 
          safeData.late, 
          safeData.early_out, 
          safeData.absent
        ],
        backgroundColor: [
          "#4CAF50", 
          "#FFC107", 
          "#FF7043", 
          "#F44336", 
        ],
        borderWidth: 0,
      },
    ],
  };

  return (
    <Doughnut 
      data={data} 
      options={{
        maintainAspectRatio: false,
        plugins: {
          legend: {
            position: 'bottom',
          }
        }
      }} 
    />
  );
};

export default UserAttendanceChart;