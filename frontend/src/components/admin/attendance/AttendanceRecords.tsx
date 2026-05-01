import { useState, useEffect, useCallback, useMemo } from "react"; // Added useMemo
import {
  Box, Card, CardContent, Typography, Table, TableHead, TableRow, TableCell,
  TableBody, TextField, Select, MenuItem, Stack, Chip, CircularProgress,
  Checkbox, ListItemText, FormControl, InputLabel, OutlinedInput,
  TablePagination, Divider // Added TablePagination and Divider
} from "@mui/material";
import { COLORS } from "../../../theme/dashboardTheme";
import { jwtDecode } from "jwt-decode";

// --- Interfaces ---
interface AttendanceRecord {
  id: string;
  employeeName: string;
  department: string;
  date: string;
  checkIn: string | null;
  checkOut: string | null;
  status: string;
}

interface DecodedToken {
  role: string;
  department_id?: string;
  organization_id: string;
}

// --- Helpers ---
const formatDateForInput = (date: Date) => date.toISOString().split("T")[0];

const formatTime = (timeStr) => {
  if (!timeStr) return "—";
  try {
    return new Date(timeStr).toLocaleTimeString("en-IN", {
      hour: "2-digit",
      minute: "2-digit",
      hour12: true,
    });
  } catch {
    return "—";
  }
};

function getWorkingHours(checkIn, checkOut) {
  if (!checkIn || !checkOut) return "—";

  try {
    const inTime = new Date(checkIn);
    const outTime = new Date(checkOut);

    const diffMs = outTime - inTime;
    if (diffMs <= 0) return "—";

    const totalMinutes = Math.floor(diffMs / 60000);
    return `${Math.floor(totalMinutes / 60)}h ${totalMinutes % 60}m`;
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

export default function AttendanceRecords() {
  const [startDate, setStartDate] = useState(formatDateForInput(new Date(Date.now() - 7 * 24 * 60 * 60 * 1000)));
  const [endDate, setEndDate] = useState(formatDateForInput(new Date()));
  const [search, setSearch] = useState("");
  
  const [statusFilter, setStatusFilter] = useState<string[]>(
    statusOptions
      .map((opt) => opt.value)
      .filter((val) => val !== "absent")
  );

  const [records, setRecords] = useState<AttendanceRecord[]>([]);
  const [loading, setLoading] = useState(false);
  const [userRole, setUserRole] = useState<string | null>(null);

  // --- Pagination States ---
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);

  const fetchAttendance = useCallback(async () => {
    setLoading(true);
    const token = localStorage.getItem("token");
    if (!token) return;

    try {
      const decoded: DecodedToken = jwtDecode(token);
      setUserRole(decoded.role);

      const params = new URLSearchParams({
        start_date: startDate,
        end_date: endDate,
        limit: "200", // Increased limit since we now have pagination
      });

      let url = `http://127.0.0.1:8000/api/v1/attendance/organization?${params}`;
      
      if (decoded.role === "ADMIN" && decoded.department_id) {
        url = `http://127.0.0.1:8000/api/v1/attendance/department/${decoded.department_id}?${params}`;
      }

      const response = await fetch(url, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await response.json();

      if (Array.isArray(data)) {
        setRecords(data.map((item: any) => ({
          id: item.attendance_id,
          employeeName: item.full_name || "Unknown",
          department: item.department_name || "N/A",
          date: item.attendance_date,
          checkIn: item.first_check_in,
          checkOut: item.last_check_out,
          status: item.status,
        })));
      }
    } catch (err) {
      console.error("Fetch Error:", err);
    } finally {
      setLoading(false);
    }
  }, [startDate, endDate]);

  useEffect(() => {
    fetchAttendance();
  }, [fetchAttendance]);

  // --- Filter Logic ---
  const filteredRecords = useMemo(() => {
    return records.filter((r) => {
      const matchesSearch = 
        r.employeeName.toLowerCase().includes(search.toLowerCase()) || 
        r.department.toLowerCase().includes(search.toLowerCase());
      const matchesStatus = statusFilter.length === 0 || statusFilter.includes(r.status);
      return matchesSearch && matchesStatus;
    });
  }, [records, search, statusFilter]);

  // --- Pagination Logic: Slicing the data ---
  const paginatedRecords = useMemo(() => {
    const startIndex = page * rowsPerPage;
    return filteredRecords.slice(startIndex, startIndex + rowsPerPage);
  }, [filteredRecords, page, rowsPerPage]);

  // Reset page to 0 when filters change to avoid "empty page" bugs
  useEffect(() => {
    setPage(0);
  }, [search, statusFilter, startDate, endDate]);

  const handleChangePage = (_: unknown, newPage: number) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event: React.ChangeEvent<HTMLInputElement>) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  return (
    <Box sx={{ mt: 8, p: 4, bgcolor: "#F8F9FA", minHeight: "100vh" }}>
      <Typography variant="h5" sx={{ fontWeight: 800, color: COLORS.navy, mb: 1 }}>
        {userRole === "HR_ADMIN" ? "Organization Attendance" : "Department Attendance"}
      </Typography>
      <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
        {userRole === "ADMIN" ? "Viewing records for your assigned department only." : "Viewing records for the entire organization."}
      </Typography>

      <Card elevation={0} sx={{ borderRadius: 4, border: "1px solid #E0E0E0", overflow: "hidden" }}>
        <CardContent sx={{ p: 3 }}>
          <Stack direction={{ xs: "column", md: "row" }} spacing={2} mb={4}>
            <TextField label="From" type="date" size="small" value={startDate} onChange={(e) => setStartDate(e.target.value)} InputLabelProps={{ shrink: true }} />
            <TextField label="To" type="date" size="small" value={endDate} onChange={(e) => setEndDate(e.target.value)} InputLabelProps={{ shrink: true }} />
            <TextField placeholder="Search employee..." value={search} onChange={(e) => setSearch(e.target.value)} size="small" sx={{ flexGrow: 1 }} />
            
            <FormControl size="small" sx={{ width: 240 }}>
              <InputLabel>Filter Status</InputLabel>
              <Select
                multiple
                value={statusFilter}
                onChange={(e) => setStatusFilter(typeof e.target.value === "string" ? e.target.value.split(",") : e.target.value)}
                input={<OutlinedInput label="Filter Status" />}
                renderValue={(selected) => (
                  <Box sx={{ display: "flex", flexWrap: "wrap", gap: 0.5 }}>
                    {selected.map((val) => (
                      <Chip key={val} label={val.replace("_", " ").toUpperCase()} size="small" sx={{ height: 20, fontSize: "0.65rem" }} />
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

          <Table>
            <TableHead>
              <TableRow sx={{ bgcolor: "#F1F3F5" }}>
                {["Employee", "Dept", "Date", "In", "Out", "Duration", "Status"].map((h) => (
                  <TableCell key={h} sx={{ fontWeight: 800, color: COLORS.navy }}>{h}</TableCell>
                ))}
              </TableRow>
            </TableHead>
            <TableBody>
              {loading ? (
                <TableRow><TableCell colSpan={7} align="center" sx={{ py: 5 }}><CircularProgress size={30} /></TableCell></TableRow>
              ) : paginatedRecords.length === 0 ? (
                <TableRow><TableCell colSpan={7} align="center" sx={{ py: 5 }}>No records found.</TableCell></TableRow>
              ) : (
                paginatedRecords.map((r) => (
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
                          bgcolor: statusOptions.find(o => o.value === r.status)?.color || "#9E9E9E",
                          color: "white", fontWeight: "bold", fontSize: "0.7rem",
                        }}
                      />
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </CardContent>
        
        <Divider />
        
        {/* Pagination Component */}
        <TablePagination
          rowsPerPageOptions={[5, 10, 25, 50]}
          component="div"
          count={filteredRecords.length}
          rowsPerPage={rowsPerPage}
          page={page}
          onPageChange={handleChangePage}
          onRowsPerPageChange={handleChangeRowsPerPage}
          sx={{ borderTop: "1px solid #E0E0E0" }}
        />
      </Card>
    </Box>
  );
}