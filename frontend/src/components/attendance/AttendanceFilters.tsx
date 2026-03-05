import { Paper, Grid, TextField, MenuItem, Button } from "@mui/material";

const statuses = ["All", "Present", "Late", "Absent", "Leave"];

const AttendanceFilters = ({ onFilter }: any) => {
  return (
    <Paper sx={{ p: 3, borderRadius: 3 }}>

      <Grid container spacing={2} alignItems="center">

        <Grid size={{ xs: 12, md: 3 }}>
          <TextField
            type="date"
            label="From"
            fullWidth
            InputLabelProps={{ shrink: true }}
          />
        </Grid>

        <Grid size={{ xs: 12, md: 3 }}>
          <TextField
            type="date"
            label="To"
            fullWidth
            InputLabelProps={{ shrink: true }}
          />
        </Grid>

        <Grid size={{ xs: 12, md: 3 }}>
          <TextField
            select
            label="Status"
            fullWidth
            defaultValue="All"
          >
            {statuses.map((s) => (
              <MenuItem key={s} value={s}>
                {s}
              </MenuItem>
            ))}
          </TextField>
        </Grid>

        <Grid size={{ xs: 12, md: 3 }}>
          <Button
            variant="contained"
            fullWidth
            sx={{ height: "56px" }}
            onClick={onFilter}
          >
            Apply Filters
          </Button>
        </Grid>

      </Grid>

    </Paper>
  );
};

export default AttendanceFilters;