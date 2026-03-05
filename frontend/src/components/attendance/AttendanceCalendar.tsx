import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import interactionPlugin from "@fullcalendar/interaction";

import { Paper, Typography, Box, Chip } from "@mui/material";

const events = [
  { title: "Present", date: "2026-03-01", color: "#4CAF50" },
  { title: "Late", date: "2026-03-02", color: "#FB8C00" },
  { title: "Absent", date: "2026-03-03", color: "#F44336" },
  { title: "Leave", date: "2026-03-05", color: "#2196F3" },
];

const AttendanceCalendar = () => {

  const handleDateClick = (info: any) => {
    alert(`Attendance details for ${info.dateStr}`);
  };

  return (
    <Paper sx={{ p:3, borderRadius:3 }}>

      <Typography variant="h6" fontWeight="bold" mb={2}>
        Monthly Calendar
      </Typography>

      {/* Legend */}

      <Box display="flex" gap={2} mb={2} flexWrap="wrap">

        <Chip label="Present" sx={{ bgcolor:"#4CAF50", color:"white" }} />
        <Chip label="Late" sx={{ bgcolor:"#FB8C00", color:"white" }} />
        <Chip label="Absent" sx={{ bgcolor:"#F44336", color:"white" }} />
        <Chip label="Leave" sx={{ bgcolor:"#2196F3", color:"white" }} />

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