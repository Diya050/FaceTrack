import { useState } from "react";
import { Paper, Grid, TextField, MenuItem, Button } from "@mui/material";

const statuses = ["All", "Present", "Late", "Absent", "Leave"];

type Props = {
  onFilter: (filters: {
    startDate?: string;
    endDate?: string;
    status?: string;
  }) => void;
};

const AttendanceFilters = ({ onFilter }: Props) => {

  /* ───────── STATE ───────── */
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [status, setStatus] = useState("All");

  /* ───────── HANDLER ───────── */
  const handleApply = () => {
    onFilter({
      startDate: startDate || undefined,
      endDate: endDate || undefined,
      status: status === "All" ? undefined : status.toLowerCase(),
    });
  };

  return (
    <Paper sx={{ p: 3, borderRadius: 3 }}>
      <Grid container spacing={2} alignItems="center">

        {/* FROM DATE */}
        <Grid size={{ xs: 12, md: 3 }}>
          <TextField
            type="date"
            label="From"
            fullWidth
            InputLabelProps={{ shrink: true }}
            value={startDate}
            onChange={(e) => setStartDate(e.target.value)}
          />
        </Grid>

        {/* TO DATE */}
        <Grid size={{ xs: 12, md: 3 }}>
          <TextField
            type="date"
            label="To"
            fullWidth
            InputLabelProps={{ shrink: true }}
            value={endDate}
            onChange={(e) => setEndDate(e.target.value)}
          />
        </Grid>

        {/* STATUS */}
        <Grid size={{ xs: 12, md: 3 }}>
          <TextField
            select
            label="Status"
            fullWidth
            value={status}
            onChange={(e) => setStatus(e.target.value)}
          >
            {statuses.map((s) => (
              <MenuItem key={s} value={s}>
                {s}
              </MenuItem>
            ))}
          </TextField>
        </Grid>

        {/* APPLY BUTTON */}
        <Grid size={{ xs: 12, md: 3 }}>
          <Button
            variant="contained"
            fullWidth
            sx={{ height: "56px" }}
            onClick={handleApply}
          >
            Apply Filters
          </Button>
        </Grid>

      </Grid>
    </Paper>
  );
};

export default AttendanceFilters;