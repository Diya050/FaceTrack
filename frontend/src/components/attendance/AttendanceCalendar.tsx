import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import interactionPlugin from "@fullcalendar/interaction";

import { Paper, Typography, Box, Chip } from "@mui/material";

/* ───────── TYPES ───────── */

type AttendanceRow = {
  date: string;
  status: string;
};

type Props = {
  data: AttendanceRow[];
};

/* ───────── HELPERS ───────── */

const getColor = (status: string) => {
  const s = status.toLowerCase();

  if (s.includes("present")) return "#4CAF50";
  if (s.includes("late")) return "#FB8C00";
  if (s.includes("absent")) return "#F44336";
  if (s.includes("leave")) return "#2196F3";

  return "#9E9E9E"; // fallback
};

/* ───────── COMPONENT ───────── */

const AttendanceCalendar = ({ data }: Props) => {

  /* Convert backend data → calendar events */
  const events = data.map((item) => ({
    title: item.status,
    date: item.date,
    color: getColor(item.status),
  }));

  const handleDateClick = (info: any) => {
    const record = data.find((d) => d.date === info.dateStr);

    if (record) {
      alert(`${info.dateStr}: ${record.status}`);
    } else {
      alert(`${info.dateStr}: No record`);
    }
  };

  return (
    <Paper sx={{ p: 3, borderRadius: 3 }}>
      <Typography variant="h6" fontWeight="bold" mb={2}>
        Monthly Calendar
      </Typography>

      {/* Legend */}
      <Box display="flex" gap={2} mb={2} flexWrap="wrap">
        <Chip label="Present" sx={{ bgcolor: "#4CAF50", color: "white" }} />
        <Chip label="Late" sx={{ bgcolor: "#FB8C00", color: "white" }} />
        <Chip label="Absent" sx={{ bgcolor: "#F44336", color: "white" }} />
        <Chip label="Leave" sx={{ bgcolor: "#2196F3", color: "white" }} />
      </Box>

      <FullCalendar
        plugins={[dayGridPlugin, interactionPlugin]}
        initialView="dayGridMonth"
        events={events}
        dateClick={handleDateClick}
        height="auto"
      />
    </Paper>
  );
};

export default AttendanceCalendar;