import { Grid, Paper, Typography } from "@mui/material";

const metrics = [
  { title: "Present Days", value: 18 },
  { title: "Absent Days", value: 2 },
  { title: "Late Marks", value: 3 },
  { title: "Leave Taken", value: 1 },
  { title: "Attendance %", value: "90%" },
  { title: "Avg Work Hours", value: "7.8h" },
];

const UserKPISection = () => {
  return (
    <Grid container spacing={3} mb={4}>
      {metrics.map((metric) => (
        <Grid size={{ xs: 12, md: 2 }} key={metric.title}>
          <Paper sx={{ p: 2 }}>
            <Typography color="text.secondary">
              {metric.title}
            </Typography>

            <Typography variant="h6" fontWeight="bold">
              {metric.value}
            </Typography>
          </Paper>
        </Grid>
      ))}
    </Grid>
  );
};

export default UserKPISection;