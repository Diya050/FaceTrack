import { Box, Typography, TextField, Button, Paper, Grid } from "@mui/material";

const UserProfilePage = () => {
  return (
    <Box sx={{ p: 4 }}>

      <Typography variant="h5" fontWeight="bold" mb={3}>
        My Profile
      </Typography>

      <Paper sx={{ p: 4, borderRadius: 3 }}>

        <Grid container spacing={3}>

          <Grid size={{ xs: 12, md: 6 }}>
            <TextField fullWidth label="Full Name" defaultValue="Pranjal Amulani" />
          </Grid>

          <Grid size={{ xs: 12, md: 6 }}>
            <TextField fullWidth label="Email" defaultValue="user@email.com" />
          </Grid>

          <Grid size={{ xs: 12, md: 6 }}>
            <TextField fullWidth label="Employee ID" defaultValue="EMP1023" />
          </Grid>

          <Grid size={{ xs: 12, md: 6 }}>
            <TextField fullWidth label="Department" defaultValue="Engineering" />
          </Grid>

          <Grid size={{ xs: 12 }}>
            <TextField fullWidth label="Office Location" defaultValue="Main Office" />
          </Grid>

        </Grid>

        <Box mt={3}>
          <Button variant="contained">
            Save Changes
          </Button>
        </Box>

      </Paper>

    </Box>
  );
};

export default UserProfilePage;