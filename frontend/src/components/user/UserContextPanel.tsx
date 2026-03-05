import { Box, Typography, Chip, Grid } from "@mui/material";

const UserContextPanel = () => {
  return (
    <Box
      sx={{
        p: 3,
        mb: 4,
        background: "#f7f8fa",
        borderRadius: 3,
      }}
    >
      <Grid container spacing={2}>

        <Grid size={{ xs: 12, md: 3 }}>
          <Typography fontWeight="bold">User</Typography>
          <Typography>Pranjal Amulani</Typography>
        </Grid>

        <Grid size={{ xs: 12, md: 3 }}>
          <Typography fontWeight="bold">Employee ID</Typography>
          <Typography>EMP-1023</Typography>
        </Grid>

        <Grid size={{ xs: 12, md: 3 }}>
          <Typography fontWeight="bold">Department</Typography>
          <Typography>Computer Science</Typography>
        </Grid>

        <Grid size={{ xs: 12, md: 3 }}>
          <Typography fontWeight="bold">Role</Typography>
          <Typography>Software Intern</Typography>
        </Grid>

        <Grid size={{ xs: 12, md: 3 }}>
          <Typography fontWeight="bold">Shift</Typography>
          <Typography>09:30 AM – 06:00 PM</Typography>
        </Grid>

        <Grid size={{ xs: 12, md: 3 }}>
          <Typography fontWeight="bold">Attendance Window</Typography>
          <Typography>09:30 – 10:30 AM</Typography>
        </Grid>

        <Grid size={{ xs: 12, md: 3 }}>
          <Typography fontWeight="bold">Camera</Typography>
          <Chip label="Active" color="success" size="small" />
        </Grid>

        <Grid size={{ xs: 12, md: 3 }}>
          <Typography fontWeight="bold">Recognition Engine</Typography>
          <Chip label="Operational" color="primary" size="small" />
        </Grid>

      </Grid>
    </Box>
  );
};

export default UserContextPanel;