import { useState } from "react";
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
import { mockAttendanceRecords } from "../../../data/attendance.mock";
import type { AttendanceRecord } from "../../../data/attendance.mock";

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

  const filteredRecords = mockAttendanceRecords.filter((r) => {
    const flags = deriveFlags(r);

    const matchesSearch = r.employeeName
      .toLowerCase()
      .includes(search.toLowerCase());

    const derivedStatus =
      flags.absent
        ? "absent"
        : flags.late && flags.earlyLeave
        ? "late"
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
                  <TableCell
                    key={h}
                    sx={{
                      fontWeight: 800,
                      color: COLORS.navy,
                      borderBottom: `1px solid ${alpha(COLORS.navy, 0.08)}`,
                    }}
                  >
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

                const confidenceColor =
                  r.confidence === null
                    ? COLORS.slate
                    : r.confidence >= 85
                    ? COLORS.present
                    : r.confidence >= 65
                    ? COLORS.late
                    : COLORS.absent;

                return (
                  <TableRow
                    key={r.id}
                    sx={{
                      transition: "0.2s",
                      "&:hover": {
                        bgcolor: alpha(COLORS.cream, 0.25),
                      },
                    }}
                  >
                    <TableCell sx={{ fontWeight: 600 }}>
                      {r.employeeName}
                    </TableCell>
                    <TableCell>{r.date}</TableCell>
                    <TableCell>{r.checkIn ?? "—"}</TableCell>
                    <TableCell>{r.checkOut ?? "—"}</TableCell>
                    <TableCell>{workingHours ?? "—"}</TableCell>

                    <TableCell>
                      {flags.absent && (
                        <Chip
                          label="ABSENT"
                          size="small"
                          sx={{
                            bgcolor: alpha(COLORS.absent, 0.12),
                            color: COLORS.absent,
                            fontWeight: 800,
                            fontSize: "0.65rem",
                            mr: 0.5,
                          }}
                        />
                      )}

                      {flags.late && (
                        <Chip
                          label="LATE"
                          size="small"
                          sx={{
                            bgcolor: alpha(COLORS.late, 0.12),
                            color: COLORS.late,
                            fontWeight: 800,
                            fontSize: "0.65rem",
                            mr: 0.5,
                          }}
                        />
                      )}

                      {flags.earlyLeave && (
                        <Chip
                          label="EARLY LEAVE"
                          size="small"
                          sx={{
                            bgcolor: alpha(COLORS.early, 0.12),
                            color: COLORS.early,
                            fontWeight: 800,
                            fontSize: "0.65rem",
                          }}
                        />
                      )}

                      {!flags.absent &&
                        !flags.late &&
                        !flags.earlyLeave && (
                          <Chip
                            label="PRESENT"
                            size="small"
                            sx={{
                              bgcolor: alpha(COLORS.present, 0.12),
                              color: COLORS.present,
                              fontWeight: 800,
                              fontSize: "0.65rem",
                            }}
                          />
                        )}
                    </TableCell>

                    <TableCell
                      sx={{ fontWeight: 700, color: confidenceColor }}
                    >
                      {r.confidence !== null
                        ? `${r.confidence}%`
                        : "—"}
                    </TableCell>

                    <TableCell>{r.camera ?? "—"}</TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>

          {filteredRecords.length === 0 && (
            <Typography
              variant="body2"
              sx={{ textAlign: "center", mt: 4, color: COLORS.slate }}
            >
              No records found
            </Typography>
          )}
        </CardContent>
      </Card>
    </Box>
  );
}