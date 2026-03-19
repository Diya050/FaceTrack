import { useState, useEffect } from "react";
import {
  Box,
  Card,
  CardContent,
  Typography,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  TextField,
  Select,
  MenuItem,
  Stack,
  Chip,
  alpha,
} from "@mui/material";
import { COLORS } from "../../../theme/dashboardTheme";

interface AttendanceRecord {
  id: string;
  employeeName: string;
  date: string;
  checkIn: string | null;
  checkOut: string | null;
  confidence: number | null;
  camera: string | null;
}

const LATE_AFTER = "09:30";
const EARLY_BEFORE = "17:00";

function isAfter(time: string, limit: string) {
  return time.localeCompare(limit) === 1;
}

function isBefore(time: string, limit: string) {
  return time.localeCompare(limit) === -1;
}

function getWorkingHours(checkIn: string | null, checkOut: string | null) {
  if (!checkIn || !checkOut) return null;

  const [inH, inM] = checkIn.split(":").map(Number);
  const [outH, outM] = checkOut.split(":").map(Number);

  const start = inH * 60 + inM;
  const end = outH * 60 + outM;

  const diff = end - start;
  if (diff <= 0) return null;

  const hours = Math.floor(diff / 60);
  const minutes = diff % 60;

  return `${hours}h ${minutes}m`;
}

function deriveFlags(r: AttendanceRecord) {
  if (!r.checkIn) {
    return {
      absent: true,
      late: false,
      earlyLeave: false,
    };
  }

  return {
    absent: false,
    late: isAfter(r.checkIn, LATE_AFTER),
    earlyLeave:
      r.checkOut ? isBefore(r.checkOut, EARLY_BEFORE) : false,
  };
}

export default function AttendanceRecords() {
  const [search, setSearch] = useState("");
  const [status, setStatus] = useState("all");
  const [confidence, setConfidence] = useState("all");
  const [records, setRecords] = useState<AttendanceRecord[]>([]);

  // ✅ FETCH FROM BACKEND
  useEffect(() => {
    fetchAttendance();
  }, []);

  const fetchAttendance = () => {
    fetch("http://localhost:8000/api/v1/attendance/organization", {
      headers: {
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
    })
      .then((res) => res.json())
      .then((data) => {
        if (!Array.isArray(data)) {
    console.error("Backend error:", data);
    return;
  }
        const formatted = data.map((item: any) => ({
          id: item.user_id + item.date,
          employeeName: item.full_name || "User",
          date: item.date,
          checkIn: item.check_in,
          checkOut: item.check_out,
          confidence: item.confidence ?? null,
          camera: item.camera_name || "N/A",
        }));

        setRecords(formatted);
      })
      .catch((err) => {
        console.error("Error fetching attendance", err);
      });
  };

  // ✅ FILTER LOGIC
  const filteredRecords = records.filter((r) => {
    const flags = deriveFlags(r);

    const matchesSearch = r.employeeName
      .toLowerCase()
      .includes(search.toLowerCase());

    const derivedStatus =
      flags.absent
        ? "absent"
        : flags.late
        ? "late"
        : flags.earlyLeave
        ? "early_leave"
        : "present";

    const matchesStatus =
      status === "all" || derivedStatus === status;

    const matchesConfidence =
      confidence === "all" ||
      (confidence === "high" && r.confidence !== null && r.confidence >= 85) ||
      (confidence === "medium" &&
        r.confidence !== null &&
        r.confidence >= 65 &&
        r.confidence < 85) ||
      (confidence === "low" &&
        (r.confidence === null || r.confidence < 65));

    return matchesSearch && matchesStatus && matchesConfidence;
  });

  return (
    <Box sx={{ mt: 8, p: 4, bgcolor: "#F8F9FA", minHeight: "100vh" }}>
      <Typography
        variant="h5"
        sx={{ fontWeight: 800, color: COLORS.navy, mb: 3 }}
      >
        Attendance Records
      </Typography>

      <Card elevation={0} sx={{ borderRadius: 4 }}>
        <CardContent sx={{ p: 3 }}>
          {/* FILTERS */}
          <Stack direction="row" spacing={2} mb={3}>
            <TextField
              placeholder="Search employee"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              size="small"
              sx={{ width: 240 }}
            />

            <Select
              value={status}
              onChange={(e) => setStatus(e.target.value)}
              size="small"
              sx={{ width: 180 }}
            >
              <MenuItem value="all">All Status</MenuItem>
              <MenuItem value="present">Present</MenuItem>
              <MenuItem value="late">Late</MenuItem>
              <MenuItem value="early_leave">Early Leave</MenuItem>
              <MenuItem value="absent">Absent</MenuItem>
            </Select>

            <Select
              value={confidence}
              onChange={(e) => setConfidence(e.target.value)}
              size="small"
              sx={{ width: 200 }}
            >
              <MenuItem value="all">All Confidence</MenuItem>
              <MenuItem value="high">High (≥85%)</MenuItem>
              <MenuItem value="medium">Medium (65–84%)</MenuItem>
              <MenuItem value="low">Low (&lt;65%)</MenuItem>
            </Select>
          </Stack>

          {/* TABLE */}
          <Table>
            <TableHead>
              <TableRow>
                {[
                  "Employee",
                  "Date",
                  "Check In",
                  "Check Out",
                  "Working Hours",
                  "Status",
                  "Confidence",
                  "Camera",
                ].map((h) => (
                  <TableCell key={h} sx={{ fontWeight: 800 }}>
                    {h}
                  </TableCell>
                ))}
              </TableRow>
            </TableHead>

            <TableBody>
              {filteredRecords.map((r) => {
                const flags = deriveFlags(r);
                const workingHours = getWorkingHours(
                  r.checkIn,
                  r.checkOut
                );

                return (
                  <TableRow key={r.id}>
                    <TableCell>{r.employeeName}</TableCell>
                    <TableCell>{r.date}</TableCell>
                    <TableCell>{r.checkIn ?? "—"}</TableCell>
                    <TableCell>{r.checkOut ?? "—"}</TableCell>
                    <TableCell>{workingHours ?? "—"}</TableCell>

                    <TableCell>
                      {flags.absent && <Chip label="ABSENT" />}
                      {flags.late && <Chip label="LATE" />}
                      {flags.earlyLeave && <Chip label="EARLY LEAVE" />}
                      {!flags.absent && !flags.late && !flags.earlyLeave && (
                        <Chip label="PRESENT" />
                      )}
                    </TableCell>

                    <TableCell>
                      {r.confidence ? `${r.confidence}%` : "—"}
                    </TableCell>

                    <TableCell>{r.camera ?? "—"}</TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>

          {filteredRecords.length === 0 && (
            <Typography sx={{ textAlign: "center", mt: 4 }}>
              No records found
            </Typography>
          )}
        </CardContent>
      </Card>
    </Box>
  );
}