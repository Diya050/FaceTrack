import React, { useMemo, useState } from "react";
import {
  Avatar,
  Box,
  Button,
  Card,
  CardContent,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Divider,
  FormControlLabel,
  Grid,
  Chip,
  IconButton,
  InputAdornment,
  MenuItem,
  Paper,
  Select,
  Stack,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TextField,
  Tooltip,
  Typography,
  useTheme,
  useMediaQuery,
  TablePagination,
} from "@mui/material";
import {
  Edit,
  Delete,
  Search as SearchIcon,
  ToggleOff,
  ToggleOn,
} from "@mui/icons-material";

import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip as ChartTooltip,
  Legend,
  Filler,
} from "chart.js";
import { Line } from "react-chartjs-2";

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  ChartTooltip,
  Legend,
  Filler
);

/*  Types  */

export type UserStatus = "Active" | "Suspended" | "Left";
export type UserRole =
  | "Super Admin"
  | "HR Admin"
  | "Manager"
  | "Employee"
  | "Viewer";

export interface UserProfile {
  id: string;
  employeeId: string;
  name: string;
  email: string;
  avatarUrl?: string;
  department: string;
  role: UserRole;
  shift: string;
  status: UserStatus;

  biometric: {
    recognitionEnabled: boolean;
    enrolled: boolean;
    livenessScore: number;
    lastRecognizedAt?: string;
  };

  recognition: {
    avgConfidence: number;
    confidenceHistory: number[];
  };

  attendance: {
    monthlyPercent: number;
    lateCount: number;
    todayStatus?: "Present" | "Absent" | "Late" | "Override";
  };
}

/*  Mock Data  */

const MOCK_USERS: UserProfile[] = [
  {
    id: "u1",
    employeeId: "EMP-1001",
    name: "Neha Gupta",
    email: "neha.gupta@example.com",
    avatarUrl: "https://i.pravatar.cc/150?img=5",
    department: "Head Office / Block A / Floor 1",
    role: "Manager",
    shift: "General Shift",
    status: "Active",
    biometric: {
      recognitionEnabled: true,
      enrolled: true,
      livenessScore: 92,
      lastRecognizedAt: "2026-03-01 09:12",
    },
    recognition: {
      avgConfidence: 94,
      confidenceHistory: [92, 95, 93, 94, 96, 90, 94],
    },
    attendance: {
      monthlyPercent: 96,
      lateCount: 2,
      todayStatus: "Present",
    },
  },
  {
    id: "u2",
    employeeId: "EMP-1002",
    name: "Vijay Oberoi",
    email: "vijay.oberoi@example.com",
    avatarUrl: "https://i.pravatar.cc/150?img=8",
    department: "Head Office / Block B / Floor 3",
    role: "HR Admin",
    shift: "Morning Shift",
    status: "Active",
    biometric: {
      recognitionEnabled: true,
      enrolled: true,
      livenessScore: 95,
      lastRecognizedAt: "2026-03-01 09:25",
    },
    recognition: {
      avgConfidence: 93,
      confidenceHistory: [92, 95, 93, 94, 96, 90, 94],
    },
    attendance: {
      monthlyPercent: 97,
      lateCount: 3,
      todayStatus: "Present",
    },
  },
];

/*  Utils  */

const formatPercent = (v: number) => `${Math.round(v)}%`;

/*  Main  */

const UserProfiles: React.FC = () => {
  const [users, setUsers] = useState<UserProfile[]>(MOCK_USERS);
  const [search, setSearch] = useState("");
  const [filterRole, setFilterRole] = useState("all");
  const [filterStatus, setFilterStatus] = useState("all");
  const [detailUser, setDetailUser] = useState<UserProfile | null>(null);

  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);

  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));

  const filtered = useMemo(() => {
    const q = search.toLowerCase();
    return users.filter((u) => {
      if (filterRole !== "all" && u.role !== filterRole) return false;
      if (filterStatus !== "all" && u.status !== filterStatus) return false;
      if (!q) return true;
      return (
        u.name.toLowerCase().includes(q) ||
        u.employeeId.toLowerCase().includes(q) ||
        u.email.toLowerCase().includes(q) ||
        u.department.toLowerCase().includes(q)
      );
    });
  }, [users, search, filterRole, filterStatus]);

  const paginated = useMemo(() => {
    const start = page * rowsPerPage;
    return filtered.slice(start, start + rowsPerPage);
  }, [filtered, page, rowsPerPage]);

  return (
    <Box sx={{ mt: 0, p: { xs: 2, md: 4 }, bgcolor: "#F8F9FA" }}>
      <Stack
        direction={{ xs: "column", md: "row" }}
        justifyContent="space-between"
        spacing={2}
        mb={3}
      >
        <Typography variant="h5" fontWeight={600}>
          User Profiles
        </Typography>

        <Stack direction={{ xs: "column", md: "row" }} spacing={2}>
          <TextField
            size="small"
            placeholder="Search users"
            value={search}
            onChange={(e) => {
              setSearch(e.target.value);
              setPage(0);
            }}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <SearchIcon />
                </InputAdornment>
              ),
            }}
          />

          <Select
            size="small"
            value={filterRole}
            onChange={(e) => {
              setFilterRole(String(e.target.value));
              setPage(0);
            }}
          >
            <MenuItem value="all">All roles</MenuItem>
            <MenuItem value="Manager">Manager</MenuItem>
            <MenuItem value="Employee">Employee</MenuItem>
            <MenuItem value="HR Admin">HR Admin</MenuItem>
          </Select>

          <Select
            size="small"
            value={filterStatus}
            onChange={(e) => {
              setFilterStatus(String(e.target.value));
              setPage(0);
            }}
          >
            <MenuItem value="all">All status</MenuItem>
            <MenuItem value="Active">Active</MenuItem>
            <MenuItem value="Suspended">Suspended</MenuItem>
          </Select>
        </Stack>
      </Stack>

      <Card elevation={0}>
        <CardContent>
          <TableContainer component={Paper} elevation={0} sx={{ overflowX: "auto" }}>
            <Table size="small">
              <TableHead>
                <TableRow>
                  <TableCell>User</TableCell>
                  <TableCell sx={{ display: { xs: "none", md: "table-cell" } }}>Department</TableCell>
                  <TableCell>Role</TableCell>
                  <TableCell>Attendance</TableCell>
                  <TableCell>Recognition</TableCell>
                  <TableCell sx={{ display: { xs: "none", md: "table-cell" } }}>Liveness</TableCell>
                  <TableCell align="right">Actions</TableCell>
                </TableRow>
              </TableHead>

              <TableBody>
                {paginated.map((u) => (
                  <TableRow key={u.id} hover>
                    <TableCell>
                      <Stack direction="row" spacing={1} alignItems="center">
                        <Avatar src={u.avatarUrl} />
                        <Box>
                          <Typography fontWeight={600}>{u.name}</Typography>
                          <Typography variant="caption">{u.employeeId}</Typography>
                        </Box>
                      </Stack>
                    </TableCell>

                    <TableCell sx={{ display: { xs: "none", md: "table-cell" } }}>
                      {u.department}
                    </TableCell>

                    <TableCell>{u.role}</TableCell>

                    <TableCell>
                      {formatPercent(u.attendance.monthlyPercent)}
                      <Typography variant="caption" display="block">
                        Late: {u.attendance.lateCount}
                      </Typography>
                    </TableCell>

                    <TableCell>
                      <FormControlLabel
                        onChange={() =>
                          setUsers((prev) =>
                            prev.map((x) =>
                              x.id === u.id
                                ? {
                                    ...x,
                                    biometric: {
                                      ...x.biometric,
                                      recognitionEnabled:
                                        !x.biometric.recognitionEnabled,
                                    },
                                  }
                                : x
                            )
                          )
                        }
                        control={
                          u.biometric.recognitionEnabled ? (
                            <ToggleOn color="primary" />
                          ) : (
                            <ToggleOff />
                          )
                        }
                        label=""
                      />
                    </TableCell>

                    <TableCell sx={{ display: { xs: "none", md: "table-cell" } }}>
                      {u.biometric.enrolled
                        ? `${u.biometric.livenessScore}%`
                        : "—"}
                    </TableCell>

                    <TableCell align="right">
                      <Tooltip title="View details">
                        <IconButton size="small" onClick={() => setDetailUser(u)}>
                          <Edit fontSize="small" />
                        </IconButton>
                      </Tooltip>

                      <Tooltip title="Delete user">
                        <IconButton size="small">
                          <Delete fontSize="small" />
                        </IconButton>
                      </Tooltip>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>

          <TablePagination
            component="div"
            count={filtered.length}
            page={page}
            onPageChange={(_, p) => setPage(p)}
            rowsPerPage={rowsPerPage}
            onRowsPerPageChange={(e) => {
              setRowsPerPage(parseInt(e.target.value, 10));
              setPage(0);
            }}
            rowsPerPageOptions={[5, 10, 25]}
          />
        </CardContent>
      </Card>

      <Dialog
        open={!!detailUser}
        onClose={() => setDetailUser(null)}
        maxWidth="md"
        fullWidth
        fullScreen={isMobile}
      >
        <DialogTitle>User Details</DialogTitle>
        <DialogContent>
          {detailUser && <UserDetailPanel user={detailUser} />}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDetailUser(null)}>Close</Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

/*  Details Panel  */

const UserDetailPanel: React.FC<{ user: UserProfile }> = ({ user }) => {
  const chartData = useMemo(
    () => ({
      labels: user.recognition.confidenceHistory.map((_, i) => String(i + 1)),
      datasets: [
        {
          label: "Confidence %",
          data: user.recognition.confidenceHistory,
          fill: true,
          borderColor: "#1976d2",
          backgroundColor: "rgba(25,118,210,0.12)",
          tension: 0.3,
        },
      ],
    }),
    [user]
  );

  return (
    <Grid container spacing={2} mt={6}>
      <Grid size={{ xs: 12, md: 4 }}>
        <Paper sx={{ p: 2 }}>
          <Stack spacing={1} alignItems="center">
            <Avatar src={user.avatarUrl} sx={{ width: 80, height: 80 }} />
            <Typography fontWeight={600}>{user.name}</Typography>
            <Chip label={user.role} size="small" />
            <Divider sx={{ width: "100%" }} />
            <Typography variant="body2">Department</Typography>
            <Typography variant="caption">{user.department}</Typography>
          </Stack>
        </Paper>
      </Grid>

      <Grid size={{ xs: 12, md: 8 }}>
        <Paper sx={{ p: 2 }}>
          <Typography variant="subtitle2" gutterBottom>
            Recognition Confidence
          </Typography>
          <Box height={180}>
            <Line data={chartData} />
          </Box>
        </Paper>
      </Grid>
    </Grid>
  );
};

export default UserProfiles;