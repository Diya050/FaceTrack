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

import {
  getMyAttendance,
  requestCorrection,
} from "../../services/attendanceService";

/* ───────── TYPES ───────── */

type AttendanceRow = {
  attendance_id: string;
  date: string;
  status: string;
  checkIn: string;
  checkOut: string;
  total: string;
  hours: string;
  confidence: string;
  camera: string;
  method: string;
};

/* ───────── COMPONENT ───────── */

const MyAttendancePage = () => {
  const [attendance, setAttendance] = useState<AttendanceRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [snackOpen, setSnackOpen] = useState(false);

  /* ───────── FETCH ATTENDANCE ───────── */

  const fetchAttendance = async (params?: any) => {
    try {
      setLoading(true);

      const data = await getMyAttendance(params);

      const mapped: AttendanceRow[] = data.map((item: any) => ({
        attendance_id: item.attendance_id,
        date: item.date,
        status: item.status,
        checkIn: item.check_in || "--",
        checkOut: item.check_out || "--",
        total: item.total || "--",
        hours: item.total || "--",
        confidence: "--",
        camera: item.camera_name || "--",
        method: item.recognition_method || "--",
      }));

      setAttendance(mapped);
    } catch (err) {
      console.error("Fetch attendance failed:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAttendance();
  }, []);

  /* ───────── FILTER HANDLER ───────── */

  const handleFilter = async (filters: {
    startDate?: string;
    endDate?: string;
    status?: string;
  }) => {
    await fetchAttendance({
      start_date: filters.startDate,
      end_date: filters.endDate,
      status: filters.status,
    });

    setSnackOpen(true);
  };

  /* ───────── CORRECTION HANDLER ───────── */

  const handleCorrectionSubmit = async (payload: {
    attendance_id: string;
    requested_check_in?: string;
    requested_check_out?: string;
    reason: string;
  }) => {
    try {
      await requestCorrection(payload);

      setSnackOpen(true);

      // Refresh data after correction
      fetchAttendance();
    } catch (err) {
      console.error("Correction failed:", err);
    }
  };

  /* ───────── KPI CALCULATION ───────── */

  const presentDays = attendance.filter((a) =>
    a.status.toLowerCase().includes("present")
  ).length;

  const absentDays = attendance.filter((a) =>
    a.status.toLowerCase().includes("absent")
  ).length;

  const lateDays = attendance.filter((a) =>
    a.status.toLowerCase().includes("late")
  ).length;

  const attendancePercent =
    attendance.length === 0
      ? 0
      : Math.round((presentDays / attendance.length) * 100);

  const stats = [
    {
      title: "Present Days",
      value: presentDays,
      color: "#4CAF50",
      icon: <CalendarMonthIcon />,
    },
    {
      title: "Absent Days",
      value: absentDays,
      color: "#F44336",
      icon: <CancelIcon />,
    },
    {
      title: "Late Marks",
      value: lateDays,
      color: "#FB8C00",
      icon: <ScheduleIcon />,
    },
    {
      title: "Attendance %",
      value: `${attendancePercent}%`,
      color: "#7E57C2",
      icon: <PercentIcon />,
    },
  ];

  /* ───────── UI ───────── */

  return (
    <Box sx={{ p: { xs: 2, md: 3 }, maxWidth: 1400, mx: "auto", mt: 8 }}>
      <Typography
        variant="h4"
        fontWeight="bold"
        mb={3}
        sx={{ fontSize: { xs: "1.7rem", md: "2.2rem" } }}
      >
        My Attendance
      </Typography>

      {/* KPI */}
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
                "&:hover": {
                  transform: "translateY(-4px)",
                  boxShadow: 6,
                },
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
                  borderRadius: 2,
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
        <AttendanceFilters onFilter={handleFilter} />
      </Box>

      {/* CALENDAR */}
      <Box mt={4}>
        <AttendanceCalendar data={attendance} />
      </Box>

      {/* TABLE */}
      <Box mt={4}>
        {loading ? (
          <Typography>Loading attendance...</Typography>
        ) : (
          <AttendanceTable rows={attendance} />
        )}
      </Box>

      {/* LEAVE */}
      <Box mt={4}>
        <LeaveManagementPanel />
      </Box>

      {/* CORRECTION */}
      <Box mt={4}>
        <CorrectionForm
          attendance={attendance}
          onSubmit={handleCorrectionSubmit}
        />
      </Box>

      {/* SNACKBAR */}
      <Snackbar
        open={snackOpen}
        autoHideDuration={3000}
        onClose={() => setSnackOpen(false)}
      >
        <Alert severity="success">
          Operation completed successfully
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default MyAttendancePage;