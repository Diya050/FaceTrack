import { Box, Typography, Stack, Divider, Grid, alpha } from "@mui/material";
import { COLORS } from "../../../../../theme/dashboardTheme";
import { DEPT_COLORS } from "../shared/ChartConstants";
import DepartmentProgressRow from "./DepartmentProgressRow";
import SectionLabel from "../../Kpisummery/shared/SectionLabel";
import { mockDepartmentSummary, mockOverviewStats } from "../../../../../data/dashboard.mock";

export default function DepartmentBreakdownCard() {
  const totalUsers = mockDepartmentSummary.reduce((a, d) => a + d.total, 0);
  const totalPresent = mockDepartmentSummary.reduce((a, d) => a + d.present, 0);

  return (
    <Box>
      <SectionLabel>Department Performance</SectionLabel>
      <Typography variant="h6" sx={{ color: COLORS.navy, fontWeight: 800, mb: 3 }}>
        Attendance Breakdown
      </Typography>

      <Stack spacing={3}>
        {mockDepartmentSummary.map((dept, index) => (
          <DepartmentProgressRow
            key={dept.department}
            label={dept.department}
            present={dept.present}
            total={dept.total}
            color={DEPT_COLORS[index % DEPT_COLORS.length]}
          />
        ))}
      </Stack>

      <Divider sx={{ my: 4, borderColor: alpha(COLORS.navy, 0.08) }} />

      <Grid container spacing={2}>
        {[
          { label: "Active Staff", value: totalUsers, color: COLORS.navy },
          { label: "On Premises", value: totalPresent, color: COLORS.present },
          { label: "Avg. Rate", value: `${mockOverviewStats.attendance_rate}%`, color: COLORS.navy },
        ].map((item) => (
          <Grid key={item.label} size={4} sx={{ textAlign: "center" }}>
            <Typography 
              variant="caption" 
              sx={{ 
                color: COLORS.slate, 
                fontWeight: 700, 
                textTransform: 'uppercase', 
                fontSize: 9,
                display: 'block' 
              }}
            >
              {item.label}
            </Typography>
            <Typography variant="h6" sx={{ color: item.color, fontWeight: 900 }}>
              {item.value}
            </Typography>
          </Grid>
        ))}
      </Grid>
    </Box>
  );
}