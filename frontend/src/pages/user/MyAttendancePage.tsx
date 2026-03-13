import { useEffect, useState } from "react";
import { Box, Typography, Paper, Grid, Snackbar, Alert } from "@mui/material";

import AttendanceFilters from "../../components/attendance/AttendanceFilters";
import AttendanceCalendar from "../../components/attendance/AttendanceCalendar";
import AttendanceTable from "../../components/attendance/AttendanceTable";
import LeaveManagementPanel from "../../components/attendance/LeaveManagementPanel";
import CorrectionForm from "../../components/attendance/CorrectionForm";

import CalendarMonthIcon from "@mui/icons-material/CalendarMonth";
import CancelIcon from "@mui/icons-material/Cancel";
import ScheduleIcon from "@mui/icons-material/Schedule";
import PercentIcon from "@mui/icons-material/Percent";

const MyAttendancePage = () => {

  const [attendance, setAttendance] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [snackOpen, setSnackOpen] = useState(false);

  useEffect(() => {

    const mockData = [
      {
        date: "2026-03-01",
        status: "Present",
        checkIn: "09:12",
        checkOut: "18:05",
        hours: "8h 53m",
        confidence: "97%",
        camera: "Gate-2",
        method: "Live"
      },
      {
        date: "2026-03-02",
        status: "Late",
        checkIn: "09:45",
        checkOut: "18:00",
        hours: "8h 15m",
        confidence: "92%",
        camera: "Gate-1",
        method: "Live"
      },
      {
        date: "2026-03-03",
        status: "Absent",
        checkIn: "--",
        checkOut: "--",
        hours: "--",
        confidence: "--",
        camera: "--",
        method: "--"
      }
    ];

    setTimeout(() => {
      setAttendance(mockData);
      setLoading(false);
    }, 800);

  }, []);

  const presentDays = attendance.filter(a => a.status === "Present").length;
  const absentDays = attendance.filter(a => a.status === "Absent").length;
  const lateDays = attendance.filter(a => a.status === "Late").length;

  const attendancePercent =
    attendance.length === 0
      ? 0
      : Math.round((presentDays / attendance.length) * 100);

  const stats = [
    {
      title: "Present Days",
      value: presentDays,
      color: "#4CAF50",
      icon: <CalendarMonthIcon />
    },
    {
      title: "Absent Days",
      value: absentDays,
      color: "#F44336",
      icon: <CancelIcon />
    },
    {
      title: "Late Marks",
      value: lateDays,
      color: "#FB8C00",
      icon: <ScheduleIcon />
    },
    {
      title: "Attendance %",
      value: `${attendancePercent}%`,
      color: "#7E57C2",
      icon: <PercentIcon />
    }
  ];

  return (
    <Box sx={{ p: { xs: 2, md: 3 }, maxWidth: 1400, mx: "auto", mt:8 }}>

      <Typography
        variant="h4"
        fontWeight="bold"
        mb={3}
        sx={{ fontSize: { xs: "1.7rem", md: "2.2rem" } }}
      >
        My Attendance
      </Typography>

      {/* KPI CARDS */}

      <Grid container spacing={3}>

  {stats.map((stat) => (

    <Grid size={{ xs: 12, sm: 6, md: 3 }} key={stat.title}>

      <Paper
        sx={{
          p: 3,
          borderRadius: 3,
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          transition: "0.25s",
          "&:hover": {
            transform: "translateY(-4px)",
            boxShadow: 6
          }
        }}
      >

        <Box>

          <Typography color="text.secondary">
            {stat.title}
          </Typography>

          <Typography variant="h4" fontWeight="bold">
            {stat.value}
          </Typography>

        </Box>

        <Box
          sx={{
            bgcolor: stat.color + "20",
            color: stat.color,
            p: 1.5,
            borderRadius: 2
          }}
        >
          {stat.icon}
        </Box>

      </Paper>

    </Grid>

  ))}

</Grid>

      {/* FILTERS */}

      <Box mt={4}>
        <AttendanceFilters
          onFilter={() => setSnackOpen(true)}
        />
      </Box>

      {/* CALENDAR */}

      <Box mt={4}>
        <AttendanceCalendar />
      </Box>

      {/* TABLE */}

      <Box mt={4}>

        {loading ? (
          <Typography>Loading attendance...</Typography>
        ) : (
          <AttendanceTable rows={attendance} />
        )}

      </Box>

      {/* LEAVE PANEL */}

      <Box mt={4}>
        <LeaveManagementPanel />
      </Box>

      {/* DISPUTE FORM */}

      <Box mt={4}>
        <CorrectionForm />
      </Box>

      {/* SNACKBAR */}

      <Snackbar
        open={snackOpen}
        autoHideDuration={3000}
        onClose={() => setSnackOpen(false)}
      >

        <Alert severity="success">
          Filters applied successfully
        </Alert>

      </Snackbar>

    </Box>
  );
};

export default MyAttendancePage;