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
  CircularProgress,
  Checkbox,
  ListItemText,
  FormControl,
  InputLabel,
  OutlinedInput,
} from "@mui/material";
import { COLORS } from "../../../theme/dashboardTheme";

// --- Types & Interfaces ---
interface AttendanceRecord {
  id: string;
  employeeName: string;
  department: string;
  date: string;
  checkIn: string | null;
  checkOut: string | null;
  status: string;
}

// --- Helper Functions ---
const formatDateForInput = (date: Date) => date.toISOString().split("T")[0];

const formatTime = (timeStr: string | null) => {
  if (!timeStr) return "—";
  const cleanTime = timeStr.split(".")[0]; // Removes microseconds
  return new Date(`1970-01-01T${cleanTime}`).toLocaleTimeString([], {
    hour: "2-digit",
    minute: "2-digit",
  });
};

function getWorkingHours(checkIn: string | null, checkOut: string | null) {
  if (!checkIn || !checkOut || checkIn === checkOut) return "—";
  try {
    const start = new Date(`1970-01-01T${checkIn.split(".")[0]}`).getTime();
    const end = new Date(`1970-01-01T${checkOut.split(".")[0]}`).getTime();
    const diffMs = end - start;
    if (diffMs <= 0) return "—";
    const totalMinutes = Math.floor(diffMs / 60000);
    const h = Math.floor(totalMinutes / 60);
    const m = totalMinutes % 60;
    return `${h}h ${m}m`;
  } catch {
    return "—";
  }
}

const statusOptions = [
  { value: "present", label: "Present", color: "#4CAF50" },
  { value: "absent", label: "Absent", color: "#F44336" },
  { value: "late", label: "Late", color: "#FF9800" },
  { value: "half_day", label: "Half Day", color: "#03A9F4" },
  { value: "on_leave", label: "On Leave", color: "#9C27B0" },
];

// --- Main Component ---
export default function AttendanceRecords() {
  // 1. State Management
  const [startDate, setStartDate] = useState(
    formatDateForInput(new Date(Date.now() - 7 * 24 * 60 * 60 * 1000))
  );
  const [endDate, setEndDate] = useState(formatDateForInput(new Date()));
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<string[]>([]);
  const [records, setRecords] = useState<AttendanceRecord[]>([]);
  const [loading, setLoading] = useState(false);

  // 2. Fetch Data
  useEffect(() => {
    fetchAttendance();
  }, [startDate, endDate]);

  const fetchAttendance = () => {
    setLoading(true);
    const params = new URLSearchParams({
      start_date: startDate,
      end_date: endDate,
      limit: "100",
    });

    fetch(`http://127.0.0.1:8000/api/v1/attendance/organization?${params}`, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
    })
      .then((res) => res.json())
      .then((data) => {
        if (Array.isArray(data)) {
          const formatted = data.map((item: any) => ({
            id: item.attendance_id,
            employeeName: item.full_name || "Unknown",
            department: item.department_name || "N/A",
            date: item.attendance_date,
            checkIn: item.first_check_in,
            checkOut: item.last_check_out,
            status: item.status,
          }));
          setRecords(formatted);
        }
      })
      .catch((err) => console.error("API Error:", err))
      .finally(() => setLoading(false));
  };

  // 3. Filter Logic
  const filteredRecords = records.filter((r) => {
    const matchesSearch =
      r.employeeName.toLowerCase().includes(search.toLowerCase()) ||
      r.department.toLowerCase().includes(search.toLowerCase());
    const matchesStatus =
      statusFilter.length === 0 || statusFilter.includes(r.status);
    return matchesSearch && matchesStatus;
  });

  const handleStatusChange = (event: any) => {
    const { value } = event.target;
    setStatusFilter(typeof value === "string" ? value.split(",") : value);
  };

  return (
    <Box sx={{ mt: 8, p: 4, bgcolor: "#F8F9FA", minHeight: "100vh" }}>
      <Typography variant="h5" sx={{ fontWeight: 800, color: COLORS.navy, mb: 3 }}>
        Organization Attendance
      </Typography>

      <Card elevation={0} sx={{ borderRadius: 4, border: "1px solid #E0E0E0" }}>
        <CardContent sx={{ p: 3 }}>
          {/* --- Filters Bar --- */}
          <Stack direction={{ xs: "column", md: "row" }} spacing={2} mb={4}>
            <TextField
              label="From"
              type="date"
              size="small"
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
              InputLabelProps={{ shrink: true }}
            />
            <TextField
              label="To"
              type="date"
              size="small"
              value={endDate}
              onChange={(e) => setEndDate(e.target.value)}
              InputLabelProps={{ shrink: true }}
            />
            <TextField
              placeholder="Search employee or department..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              size="small"
              sx={{ flexGrow: 1 }}
            />

            {/* Checklist Multi-Select */}
            <FormControl size="small" sx={{ width: 240 }}>
              <InputLabel id="status-checkbox-label">Filter Status</InputLabel>
              <Select
                labelId="status-checkbox-label"
                multiple
                value={statusFilter}
                onChange={handleStatusChange}
                input={<OutlinedInput label="Filter Status" />}
                renderValue={(selected) => (
                  <Box sx={{ display: "flex", flexWrap: "wrap", gap: 0.5 }}>
                    {selected.map((val) => (
                      <Chip
                        key={val}
                        label={val.replace("_", " ").toUpperCase()}
                        size="small"
                        sx={{ height: 20, fontSize: "0.65rem" }}
                      />
                    ))}
                  </Box>
                )}
              >
                {statusOptions.map((opt) => (
                  <MenuItem key={opt.value} value={opt.value}>
                    <Checkbox checked={statusFilter.indexOf(opt.value) > -1} />
                    <ListItemText primary={opt.label} />
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Stack>

          {/* --- Data Table --- */}
          <Table>
            <TableHead>
              <TableRow sx={{ bgcolor: "#F1F3F5" }}>
                {["Employee", "Dept", "Date", "In", "Out", "Duration", "Status"].map((h) => (
                  <TableCell key={h} sx={{ fontWeight: 800, color: COLORS.navy }}>
                    {h}
                  </TableCell>
                ))}
              </TableRow>
            </TableHead>

            <TableBody>
              {loading ? (
                <TableRow>
                  <TableCell colSpan={7} align="center" sx={{ py: 5 }}>
                    <CircularProgress size={30} />
                  </TableCell>
                </TableRow>
              ) : (
                filteredRecords.map((r) => {
                  const statusInfo = statusOptions.find((o) => o.value === r.status);
                  return (
                    <TableRow key={r.id} hover>
                      <TableCell sx={{ fontWeight: 600 }}>{r.employeeName}</TableCell>
                      <TableCell>{r.department}</TableCell>
                      <TableCell>{r.date}</TableCell>
                      <TableCell>{formatTime(r.checkIn)}</TableCell>
                      <TableCell>{formatTime(r.checkOut)}</TableCell>
                      <TableCell>{getWorkingHours(r.checkIn, r.checkOut)}</TableCell>
                      <TableCell>
                        <Chip
                          label={r.status.replace("_", " ").toUpperCase()}
                          size="small"
                          sx={{
                            bgcolor: statusInfo?.color || "#9E9E9E",
                            color: "white",
                            fontWeight: "bold",
                            fontSize: "0.7rem",
                          }}
                        />
                      </TableCell>
                    </TableRow>
                  );
                })
              )}
            </TableBody>
          </Table>

          {!loading && filteredRecords.length === 0 && (
            <Box sx={{ textAlign: "center", py: 10 }}>
              <Typography variant="body1" color="text.secondary">
                No attendance records found for this selection.
              </Typography>
            </Box>
          )}
        </CardContent>
      </Card>
    </Box>
  );
}