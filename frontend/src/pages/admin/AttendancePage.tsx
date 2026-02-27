import { Box, Stack } from "@mui/material";
import { useEffect } from "react";
import { useLocation } from "react-router-dom";

// Attendance
import AttendanceRecords from "../../components/admin/attendance/AttendanceRecords";
import AttendanceCorrections from "../../components/admin/attendance/AttendanceCorrections";
import AttendanceExport from "../../components/admin/attendance/AttendanceExport";


const NAVBAR_HEIGHT = 64;

const AttendancePage = () => {
  const { hash } = useLocation();

  useEffect(() => {
    if (!hash) return;

    const id = hash.replace("#", "");
    const el = document.getElementById(id);

    if (!el) return;

    const y =
      el.getBoundingClientRect().top + window.scrollY - NAVBAR_HEIGHT - 16;

    window.scrollTo({
      top: y,
      behavior: "smooth",
    });
  }, [hash]);

  return (
    <Stack spacing={6}>
      <Box id="records">
        <AttendanceRecords />
      </Box>

      <Box id="corrections">
        <AttendanceCorrections />
      </Box>

      <Box id="export">
        <AttendanceExport />
      </Box>
    </Stack>
  );
};

export default AttendancePage;