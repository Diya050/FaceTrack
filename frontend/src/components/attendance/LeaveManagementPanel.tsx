import { Paper, Typography, Grid, TextField, Button } from "@mui/material";
import { useState } from "react";
import AppSnackbar from "../notifications/AppSnackbar";

const LeaveManagementPanel = () => {

  const [open,setOpen] = useState(false);

  const handleSubmit = () => {
    setOpen(true);
  };

  return (
    <>
      <Paper sx={{ p:3, borderRadius:3 }}>

        <Typography variant="h6" fontWeight="bold" mb={2}>
          Apply Leave
        </Typography>

        <Grid container spacing={2}>

          <Grid size={{ xs:12, md:3 }}>
            <TextField
              type="date"
              label="Start Date"
              fullWidth
              InputLabelProps={{ shrink: true }}
            />
          </Grid>

          <Grid size={{ xs:12, md:3 }}>
            <TextField
              type="date"
              label="End Date"
              fullWidth
              InputLabelProps={{ shrink: true }}
            />
          </Grid>

          <Grid size={{ xs:12, md:4 }}>
            <TextField label="Reason" fullWidth />
          </Grid>

          <Grid size={{ xs:12, md:2 }}>
            <Button variant="contained" fullWidth onClick={handleSubmit}>
              Submit
            </Button>
          </Grid>

        </Grid>

      </Paper>

      <AppSnackbar
        open={open}
        message="Leave request submitted successfully"
        severity="success"
        onClose={()=>setOpen(false)}
      />
    </>
  );
};

export default LeaveManagementPanel;