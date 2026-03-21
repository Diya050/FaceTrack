import { useEffect, useState } from "react";
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
  CircularProgress,
} from "@mui/material";
import { COLORS } from "../../../theme/dashboardTheme";

type AttendanceCorrection = {
  id: string;
  employeeName: string;
  date: string;
  issueType: string;
  currentValue: string;
  requestedValue: string;
  reason: string;
  status: "pending" | "approved" | "rejected";
};

const STATUS_COLORS: Record<AttendanceCorrection["status"], string> = {
  pending: COLORS.late,
  approved: COLORS.present,
  rejected: COLORS.absent,
};

function formatIssue(type: string) {
  return type.replace(/_/g, " ").toUpperCase();
}

export default function AttendanceCorrections() {
  const [records, setRecords] = useState<AttendanceCorrection[]>([]);
  const [loading, setLoading] = useState(true);

  // ✅ FETCH DATA
  const fetchCorrections = async () => {
    try {
      const res = await fetch(
        "http://localhost:8000/api/v1/attendance-corrections",
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );

      const data = await res.json();

      const formatted = data.map((r: any) => ({
        id: r.id,
        employeeName: r.full_name,
        date: r.date,
        issueType: r.issue_type,
        currentValue: r.current_value,
        requestedValue: r.requested_value,
        reason: r.reason,
        status: r.status,
      }));

      setRecords(formatted);
    } catch (err) {
      console.error("Error fetching corrections", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCorrections();
  }, []);

  // ✅ UPDATE STATUS (API CALL)
  const updateStatus = async (
    id: string,
    status: "approved" | "rejected"
  ) => {
    try {
      await fetch(
        `http://localhost:8000/api/v1/attendance-corrections/${id}/${status}`,
        {
          method: "PUT",
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );

      // update UI after success
      setRecords((prev) =>
        prev.map((r) =>
          r.id === id ? { ...r, status } : r
        )
      );
    } catch (err) {
      console.error("Error updating status", err);
    }
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
          {loading ? (
            <CircularProgress />
          ) : (
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
                        borderBottom: `1px solid ${alpha(
                          COLORS.navy,
                          0.08
                        )}`,
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
                    <TableRow key={r.id}>
                      <TableCell sx={{ fontWeight: 600 }}>
                        {r.employeeName}
                      </TableCell>
                      <TableCell>{r.date}</TableCell>
                      <TableCell>
                        {formatIssue(r.issueType)}
                      </TableCell>
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
                              onClick={() =>
                                updateStatus(r.id, "approved")
                              }
                            >
                              Approve
                            </Button>
                            <Button
                              size="small"
                              variant="outlined"
                              color="error"
                              onClick={() =>
                                updateStatus(r.id, "rejected")
                              }
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
          )}

          {!loading && records.length === 0 && (
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