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
  Chip,
  Stack,
  Button,
  alpha,
} from "@mui/material";
import { COLORS } from "../../../theme/dashboardTheme";
import { mockAttendanceCorrections, } from "../../../data/attendanceCorrections.mock";
import type { AttendanceCorrection } from "../../../data/attendanceCorrections.mock";

const STATUS_COLORS: Record<AttendanceCorrection["status"], string> = {
  pending: COLORS.late,
  approved: COLORS.present,
  rejected: COLORS.absent,
};

function formatIssue(type: AttendanceCorrection["issueType"]) {
  return type.replace(/_/g, " ").toUpperCase();
}

export default function AttendanceCorrections() {
  const [records, setRecords] = useState(mockAttendanceCorrections);

  const updateStatus = (id: string, status: AttendanceCorrection["status"]) => {
    setRecords((prev) =>
      prev.map((r) =>
        r.id === id ? { ...r, status } : r
      )
    );
  };

  return (
    <Box sx={{ p: 4 }}>
      <Typography
        variant="h5"
        sx={{ fontWeight: 800, color: COLORS.navy, mb: 3 }}
      >
        Attendance Correction Requests
      </Typography>

      <Card elevation={0} sx={{ borderRadius: 4 }}>
        <CardContent sx={{ p: 3 }}>
          <Table>
            <TableHead>
              <TableRow>
                {[
                  "Employee",
                  "Date",
                  "Issue",
                  "Current",
                  "Requested",
                  "Reason",
                  "Status",
                  "Action",
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
              {records.map((r) => {
                const statusColor = STATUS_COLORS[r.status];

                return (
                  <TableRow
                    key={r.id}
                    sx={{
                      "&:hover": {
                        bgcolor: alpha(COLORS.cream, 0.25),
                      },
                    }}
                  >
                    <TableCell sx={{ fontWeight: 600 }}>
                      {r.employeeName}
                    </TableCell>
                    <TableCell>{r.date}</TableCell>
                    <TableCell>{formatIssue(r.issueType)}</TableCell>
                    <TableCell>{r.currentValue}</TableCell>
                    <TableCell>{r.requestedValue}</TableCell>
                    <TableCell sx={{ maxWidth: 240 }}>
                      {r.reason}
                    </TableCell>

                    <TableCell>
                      <Chip
                        label={r.status.toUpperCase()}
                        size="small"
                        sx={{
                          bgcolor: alpha(statusColor, 0.12),
                          color: statusColor,
                          fontWeight: 800,
                          fontSize: "0.65rem",
                          border: `1px solid ${alpha(statusColor, 0.2)}`,
                        }}
                      />
                    </TableCell>

                    <TableCell>
                      {r.status === "pending" ? (
                        <Stack direction="row" spacing={1}>
                          <Button
                            size="small"
                            variant="contained"
                            sx={{ bgcolor: COLORS.present }}
                            onClick={() => updateStatus(r.id, "approved")}
                          >
                            Approve
                          </Button>
                          <Button
                            size="small"
                            variant="outlined"
                            color="error"
                            onClick={() => updateStatus(r.id, "rejected")}
                          >
                            Reject
                          </Button>
                        </Stack>
                      ) : (
                        "—"
                      )}
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>

          {records.length === 0 && (
            <Typography
              variant="body2"
              sx={{ textAlign: "center", mt: 4, color: COLORS.slate }}
            >
              No correction requests
            </Typography>
          )}
        </CardContent>
      </Card>
    </Box>
  );
}