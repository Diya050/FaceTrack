import React from "react";
import { Box, Grid, Card, CardContent } from "@mui/material";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  LineElement,
  PointElement,
  ArcElement,
  Title,
  Tooltip,
  Legend,
  Filler,
} from "chart.js";


import WeeklyAttendanceBar from "./charts/WeeklyAttendanceBar";
import MonthlyTrendLine from "./charts/MonthlyTrendLine";
import DepartmentDonut from "./charts/DepartmentDonut";
import DepartmentBreakdownCard from "./departments/DepartmentBreakdownCard";


ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  LineElement,
  PointElement,
  ArcElement,
  Title,
  Tooltip,
  Legend,
  Filler
);

const Overview: React.FC = () => {
  return (
    <Box sx={{ mt: 3, p: 4, bgcolor: '#F8F9FA', minHeight: '100vh' }}>
      
     
      <Grid container spacing={3} sx={{ mb: 3 }}>
        <Grid size={{ xs: 12, md: 7 }}>
          <Card elevation={0}>
            <CardContent sx={{ p: 3 }}>
              <WeeklyAttendanceBar />
            </CardContent>
          </Card>
        </Grid>

        <Grid size={{ xs: 12, md: 5 }}>
          <Card elevation={0} sx={{ height: "100%" }}>
            <CardContent sx={{ p: 3 }}>
              <MonthlyTrendLine />
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      
      <Grid container spacing={3}>
        <Grid size={{ xs: 12, md: 4 }}>
          <Card elevation={0} sx={{ height: "100%" }}>
            <CardContent sx={{ p: 3 }}>
              <DepartmentDonut />
            </CardContent>
          </Card>
        </Grid>

        <Grid size={{ xs: 12, md: 8 }}>
          <Card elevation={0} sx={{ height: "100%" }}>
            <CardContent sx={{ p: 3 }}>
              <DepartmentBreakdownCard />
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Box>
  );
};

export default Overview;