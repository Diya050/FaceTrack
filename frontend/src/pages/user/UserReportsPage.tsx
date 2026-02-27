import React from 'react';
import { 
  Box, 
  Container, 
  Grid, 
  Typography, 
  ThemeProvider, 
  CssBaseline,
  Stack,
  alpha,
  Card
} from '@mui/material';
import { dashboardTheme, COLORS } from "../../theme/dashboardTheme";

// Component Imports
import ExportActions from '../../components/useranalytics/ExportActions';
import MonthlyAttendanceChart from '../../components/useranalytics/MonthlyAttendanceChart';
import WorkingHoursTrend from '../../components/useranalytics/WorkingHoursTrend';
import RecognitionInsights from '../../components/useranalytics/RecognitionInsights';
import ProductivityMetrics from '../../components/useranalytics/ProductivityMetrics';

const UserReports: React.FC = () => {
  return (
    <ThemeProvider theme={dashboardTheme}>
      <CssBaseline />
      <Box sx={{ bgcolor: "background.default", minHeight: "100vh", py: 6 }}>
        <Container maxWidth="lg">
          
          {/* Header Area */}
          <Box sx={{ 
            mb: 5, 
            display: 'flex', 
            justifyContent: 'space-between', 
            alignItems: 'center',
            pb: 3,
            borderBottom: `1px solid ${alpha(COLORS.navy, 0.05)}`
          }}>
            <Stack spacing={0.5}>
              <Typography variant="h4" fontWeight="900" color="primary">
                Personal Insights
              </Typography>
              <Typography variant="body1" color="text.secondary" fontWeight="500">
                AI-driven analysis of your attendance and recognition performance.
              </Typography>
            </Stack>
            <ExportActions />
          </Box>

          {/* Analytics Sections */}
          <Grid container spacing={4}>
            
            {/* Row 1: Core Attendance & Working Hours */}
            <Grid size={{xs:12,lg:6}}>
              <Card sx={{ p: 3, height: '100%' }}>
                <MonthlyAttendanceChart />
              </Card>
            </Grid>
            
            <Grid size={{xs:12,lg:6}}>
              <Card sx={{ p: 3, height: '100%' }}>
                <WorkingHoursTrend />
              </Card>
            </Grid>

            {/* Row 2: AI Recognition Performance */}
            <Grid size={{xs:12}}>
              <Card sx={{ p: 3 }}>
                <RecognitionInsights />
              </Card>
            </Grid>

            {/* Row 3: Behavioral Insights */}
            <Grid size={{xs:12}}>
              <Card sx={{ p: 4 }}>
                <ProductivityMetrics />
              </Card>
            </Grid>

          </Grid>

          {/* Footer Branding */}
          <Box sx={{ mt: 8, textAlign: 'center', opacity: 0.5 }}>
            <Typography variant="caption" fontWeight="900" sx={{ letterSpacing: 2, color: COLORS.navy }}>
              FACETREK • INTELLIGENT ATTENDANCE SYSTEM
            </Typography>
          </Box>

        </Container>
      </Box>
    </ThemeProvider>
  );
};

export default UserReports;