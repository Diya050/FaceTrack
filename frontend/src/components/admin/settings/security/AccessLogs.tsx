import { useState, useMemo } from "react";
import {
  Box, Typography, Stack, Paper, Chip, Divider,
  TextField, Select, MenuItem, FormControl, InputLabel,
  Table, TableBody, TableCell, TableContainer, TableHead,
  TableRow, TablePagination, Tooltip, IconButton, Button,
  InputAdornment, Alert,
} from "@mui/material";
import VpnKeyOutlinedIcon         from "@mui/icons-material/VpnKeyOutlined";
import SearchOutlinedIcon          from "@mui/icons-material/SearchOutlined";
import FilterListOutlinedIcon      from "@mui/icons-material/FilterListOutlined";
import DownloadOutlinedIcon        from "@mui/icons-material/DownloadOutlined";
import RefreshOutlinedIcon         from "@mui/icons-material/RefreshOutlined";
import CheckCircleOutlineIcon      from "@mui/icons-material/CheckCircleOutline";
import CancelOutlinedIcon          from "@mui/icons-material/CancelOutlined";
import LockOutlinedIcon            from "@mui/icons-material/LockOutlined";
import PersonOutlineOutlinedIcon   from "@mui/icons-material/PersonOutlineOutlined";
import DevicesOutlinedIcon         from "@mui/icons-material/DevicesOutlined";
import InfoOutlinedIcon            from "@mui/icons-material/InfoOutlined";

// ─── Types ────────────────────────────────────────────────────────────────────

type AccessStatus = "success" | "failed" | "blocked";
type AccessAction =
  | "LOGIN"
  | "LOGOUT"
  | "LOGIN_FAILED"
  | "TOKEN_REFRESH"
  | "PASSWORD_CHANGE"
  | "MFA_CHALLENGE"
  | "SESSION_EXPIRED"
  | "ACCOUNT_LOCKED";

interface AccessLogEntry {
  id: string;
  timestamp: string;
  user: string;
  email: string;
  action: AccessAction;
  status: AccessStatus;
  ip: string;
  location: string;
  device: string;
  userAgent: string;
}

// ─── Mock Data ────────────────────────────────────────────────────────────────

const MOCK_LOGS: AccessLogEntry[] = [
  { id: "a1",  timestamp: "2026-03-08T09:14:22Z", user: "Prachi Sharma",   email: "prachi@facetrack.io",   action: "LOGIN",           status: "success", ip: "192.168.1.10",  location: "Mumbai, IN",    device: "Chrome / Windows",  userAgent: "Mozilla/5.0 (Windows NT 10.0)" },
  { id: "a2",  timestamp: "2026-03-08T09:02:11Z", user: "Rohan Mehta",     email: "rohan@facetrack.io",    action: "LOGIN_FAILED",    status: "failed",  ip: "10.0.0.45",     location: "Delhi, IN",     device: "Firefox / Linux",   userAgent: "Mozilla/5.0 (X11; Linux)" },
  { id: "a3",  timestamp: "2026-03-08T08:55:40Z", user: "Neha Gupta",      email: "neha@facetrack.io",     action: "LOGOUT",          status: "success", ip: "172.16.0.3",    location: "Pune, IN",      device: "Safari / macOS",    userAgent: "Mozilla/5.0 (Macintosh)" },
  { id: "a4",  timestamp: "2026-03-08T08:47:05Z", user: "Unknown",         email: "attacker@unknown.com",  action: "LOGIN_FAILED",    status: "blocked", ip: "45.33.32.156",  location: "Frankfurt, DE", device: "curl / Unknown",    userAgent: "curl/7.68.0" },
  { id: "a5",  timestamp: "2026-03-08T08:30:18Z", user: "Amit Patel",      email: "amit@facetrack.io",     action: "MFA_CHALLENGE",   status: "success", ip: "192.168.2.22",  location: "Ahmedabad, IN", device: "Chrome / Android",  userAgent: "Mozilla/5.0 (Linux; Android)" },
  { id: "a6",  timestamp: "2026-03-08T08:15:00Z", user: "Sneha Joshi",     email: "sneha@facetrack.io",    action: "PASSWORD_CHANGE", status: "success", ip: "192.168.1.55",  location: "Bangalore, IN", device: "Edge / Windows",    userAgent: "Mozilla/5.0 (Windows NT 10.0)" },
  { id: "a7",  timestamp: "2026-03-08T08:02:33Z", user: "Karan Singh",     email: "karan@facetrack.io",    action: "SESSION_EXPIRED", status: "failed",  ip: "10.10.10.10",   location: "Hyderabad, IN", device: "Chrome / Windows",  userAgent: "Mozilla/5.0 (Windows NT 10.0)" },
  { id: "a8",  timestamp: "2026-03-07T22:48:17Z", user: "Unknown",         email: "bot@malicious.net",     action: "ACCOUNT_LOCKED",  status: "blocked", ip: "91.108.4.20",   location: "Moscow, RU",    device: "Python / Unknown",  userAgent: "python-requests/2.26" },
  { id: "a9",  timestamp: "2026-03-07T21:30:05Z", user: "Prachi Sharma",   email: "prachi@facetrack.io",   action: "TOKEN_REFRESH",   status: "success", ip: "192.168.1.10",  location: "Mumbai, IN",    device: "Chrome / Windows",  userAgent: "Mozilla/5.0 (Windows NT 10.0)" },
  { id: "a10", timestamp: "2026-03-07T20:15:44Z", user: "Rohan Mehta",     email: "rohan@facetrack.io",    action: "LOGIN",           status: "success", ip: "10.0.0.45",     location: "Delhi, IN",     device: "Firefox / Linux",   userAgent: "Mozilla/5.0 (X11; Linux)" },
  { id: "a11", timestamp: "2026-03-07T19:50:22Z", user: "Deepika Nair",    email: "deepika@facetrack.io",  action: "LOGIN",           status: "success", ip: "172.16.5.8",    location: "Chennai, IN",   device: "Chrome / macOS",    userAgent: "Mozilla/5.0 (Macintosh)" },
  { id: "a12", timestamp: "2026-03-07T18:22:09Z", user: "Unknown",         email: "scanner@probe.io",      action: "LOGIN_FAILED",    status: "blocked", ip: "198.51.100.77", location: "Singapore, SG", device: "Unknown",           userAgent: "Masscan" },
  { id: "a13", timestamp: "2026-03-07T17:44:56Z", user: "Amit Patel",      email: "amit@facetrack.io",     action: "LOGOUT",          status: "success", ip: "192.168.2.22",  location: "Ahmedabad, IN", device: "Chrome / Android",  userAgent: "Mozilla/5.0 (Linux; Android)" },
  { id: "a14", timestamp: "2026-03-07T16:11:30Z", user: "Sneha Joshi",     email: "sneha@facetrack.io",    action: "MFA_CHALLENGE",   status: "failed",  ip: "192.168.1.55",  location: "Bangalore, IN", device: "Edge / Windows",    userAgent: "Mozilla/5.0 (Windows NT 10.0)" },
  { id: "a15", timestamp: "2026-03-07T15:05:14Z", user: "Karan Singh",     email: "karan@facetrack.io",    action: "PASSWORD_CHANGE", status: "success", ip: "10.10.10.10",   location: "Hyderabad, IN", device: "Chrome / Windows",  userAgent: "Mozilla/5.0 (Windows NT 10.0)" },
];

// ─── Helpers ──────────────────────────────────────────────────────────────────

const fmtTs = (iso: string) => {
  const d = new Date(iso);
  return d.toLocaleString("en-IN", {
    day: "2-digit", month: "short", year: "numeric",
    hour: "2-digit", minute: "2-digit", second: "2-digit", hour12: false,
  });
};

const STATUS_META: Record<AccessStatus, { label: string; color: "success" | "error" | "warning" }> = {
  success: { label: "Success", color: "success" },
  failed:  { label: "Failed",  color: "error" },
  blocked: { label: "Blocked", color: "warning" },
};

const ACTION_LABELS: Record<AccessAction, string> = {
  LOGIN:            "Login",
  LOGOUT:           "Logout",
  LOGIN_FAILED:     "Login Failed",
  TOKEN_REFRESH:    "Token Refresh",
  PASSWORD_CHANGE:  "Password Change",
  MFA_CHALLENGE:    "MFA Challenge",
  SESSION_EXPIRED:  "Session Expired",
  ACCOUNT_LOCKED:   "Account Locked",
};

// ─── Sub-components ───────────────────────────────────────────────────────────

interface SectionCardProps {
  icon: React.ReactNode;
  title: string;
  subtitle: string;
  children: React.ReactNode;
  action?: React.ReactNode;
}

const SectionCard = ({ icon, title, subtitle, children, action }: SectionCardProps) => (
  <Paper variant="outlined" sx={{ borderRadius: 2, borderColor: "divider", overflow: "hidden" }}>
    <Stack
      direction="row"
      alignItems="center"
      spacing={1.5}
      sx={{ px: 2.5, py: 2, borderBottom: "1px solid", borderColor: "divider", bgcolor: "action.hover" }}
    >
      <Box
        sx={{
          width: 34, height: 34, borderRadius: 1.5, bgcolor: "primary.main",
          display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0,
        }}
      >
        {icon}
      </Box>
      <Box flex={1}>
        <Typography variant="subtitle1" fontWeight={700} color="text.primary" lineHeight={1.2}>
          {title}
        </Typography>
        <Typography variant="caption" color="text.secondary">{subtitle}</Typography>
      </Box>
      {action}
    </Stack>
    <Box p={2.5}>{children}</Box>
  </Paper>
);

// ─── Summary Cards ────────────────────────────────────────────────────────────

const SummaryCard = ({
  label, value, icon, color,
}: {
  label: string;
  value: number;
  icon: React.ReactNode;
  color: string;
}) => (
  <Paper
    variant="outlined"
    sx={{ flex: 1, minWidth: 130, p: 2, borderRadius: 2, borderColor: "divider" }}
  >
    <Stack direction="row" alignItems="center" spacing={1.5}>
      <Box
        sx={{
          width: 36, height: 36, borderRadius: 1.5,
          bgcolor: `${color}.main`, opacity: 0.9,
          display: "flex", alignItems: "center", justifyContent: "center",
        }}
      >
        {icon}
      </Box>
      <Box>
        <Typography variant="h6" fontWeight={700} color="text.primary" lineHeight={1}>
          {value}
        </Typography>
        <Typography variant="caption" color="text.secondary">{label}</Typography>
      </Box>
    </Stack>
  </Paper>
);

// ─── Main Component ───────────────────────────────────────────────────────────

const AccessLogs = () => {
  const [search, setSearch]         = useState("");
  const [statusFilter, setStatus]   = useState<"all" | AccessStatus>("all");
  const [actionFilter, setAction]   = useState<"all" | AccessAction>("all");
  const [page, setPage]             = useState(0);
  const [rowsPerPage, setRows]      = useState(10);
  const [refreshKey, setRefreshKey] = useState(0);

  const filtered = useMemo(() => {
    const q = search.toLowerCase();
    return MOCK_LOGS.filter((log) => {
      if (statusFilter !== "all" && log.status !== statusFilter) return false;
      if (actionFilter !== "all" && log.action !== actionFilter) return false;
      if (q && !log.user.toLowerCase().includes(q) &&
               !log.email.toLowerCase().includes(q) &&
               !log.ip.includes(q) &&
               !log.location.toLowerCase().includes(q)) return false;
      return true;
    });
  }, [search, statusFilter, actionFilter, refreshKey]); // eslint-disable-line react-hooks/exhaustive-deps

  const paginated = filtered.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage);

  const counts = useMemo(() => ({
    total:   MOCK_LOGS.length,
    success: MOCK_LOGS.filter((l) => l.status === "success").length,
    failed:  MOCK_LOGS.filter((l) => l.status === "failed").length,
    blocked: MOCK_LOGS.filter((l) => l.status === "blocked").length,
  }), []);

  const handleExport = () => {
    const header = ["Timestamp", "User", "Email", "Action", "Status", "IP", "Location", "Device"].join(",");
    const rows = filtered.map((l) =>
      [fmtTs(l.timestamp), l.user, l.email, ACTION_LABELS[l.action], l.status, l.ip, l.location, l.device]
        .map((v) => `"${v}"`)
        .join(",")
    );
    const csv = [header, ...rows].join("\n");
    const blob = new Blob([csv], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "access-logs.csv";
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <Stack spacing={3}>
      {/* Header */}
      <Box>
        <Typography variant="h6" fontWeight={700} color="text.primary">
          Access Logs
        </Typography>
        <Typography variant="body2" color="text.secondary" mt={0.5}>
          Monitor authentication events, login attempts, and session activity across the platform.
        </Typography>
      </Box>

      {/* Summary */}
      <Stack direction="row" spacing={2} flexWrap="wrap" useFlexGap>
        <SummaryCard
          label="Total Events"
          value={counts.total}
          icon={<VpnKeyOutlinedIcon sx={{ fontSize: 18, color: "#fff" }} />}
          color="primary"
        />
        <SummaryCard
          label="Successful"
          value={counts.success}
          icon={<CheckCircleOutlineIcon sx={{ fontSize: 18, color: "#fff" }} />}
          color="success"
        />
        <SummaryCard
          label="Failed"
          value={counts.failed}
          icon={<CancelOutlinedIcon sx={{ fontSize: 18, color: "#fff" }} />}
          color="error"
        />
        <SummaryCard
          label="Blocked"
          value={counts.blocked}
          icon={<LockOutlinedIcon sx={{ fontSize: 18, color: "#fff" }} />}
          color="warning"
        />
      </Stack>

      {/* Security Notice */}
      {counts.blocked > 0 && (
        <Alert severity="warning" icon={<InfoOutlinedIcon />} sx={{ borderRadius: 2 }}>
          <strong>{counts.blocked} blocked access attempt{counts.blocked > 1 ? "s" : ""}</strong> detected in the
          current log window. Review IP addresses marked as <em>Blocked</em> and consider adding them to the IP
          deny-list.
        </Alert>
      )}

      {/* Log Table */}
      <SectionCard
        icon={<VpnKeyOutlinedIcon sx={{ fontSize: 18, color: "#fff" }} />}
        title="Authentication Events"
        subtitle="All login, logout, and session-related access events"
        action={
          <Stack direction="row" spacing={1}>
            <Tooltip title="Refresh logs">
              <IconButton
                size="small"
                onClick={() => { setRefreshKey((k) => k + 1); setPage(0); }}
                sx={{ color: "text.secondary" }}
              >
                <RefreshOutlinedIcon fontSize="small" />
              </IconButton>
            </Tooltip>
            <Button
              size="small"
              variant="outlined"
              startIcon={<DownloadOutlinedIcon />}
              onClick={handleExport}
              sx={{ fontSize: "0.75rem" }}
            >
              Export CSV
            </Button>
          </Stack>
        }
      >
        {/* Filters */}
        <Stack direction="row" spacing={2} mb={2} flexWrap="wrap" useFlexGap alignItems="center">
          <TextField
            size="small"
            placeholder="Search user, email, IP, location…"
            value={search}
            onChange={(e) => { setSearch(e.target.value); setPage(0); }}
            sx={{ minWidth: 260 }}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <SearchOutlinedIcon fontSize="small" sx={{ color: "text.secondary" }} />
                </InputAdornment>
              ),
            }}
          />

          <FormControl size="small" sx={{ minWidth: 140 }}>
            <InputLabel>Status</InputLabel>
            <Select
              label="Status"
              value={statusFilter}
              onChange={(e) => { setStatus(e.target.value as typeof statusFilter); setPage(0); }}
              startAdornment={<FilterListOutlinedIcon fontSize="small" sx={{ mr: 0.5, color: "text.secondary" }} />}
            >
              <MenuItem value="all">All Statuses</MenuItem>
              <MenuItem value="success">Success</MenuItem>
              <MenuItem value="failed">Failed</MenuItem>
              <MenuItem value="blocked">Blocked</MenuItem>
            </Select>
          </FormControl>

          <FormControl size="small" sx={{ minWidth: 170 }}>
            <InputLabel>Action</InputLabel>
            <Select
              label="Action"
              value={actionFilter}
              onChange={(e) => { setAction(e.target.value as typeof actionFilter); setPage(0); }}
            >
              <MenuItem value="all">All Actions</MenuItem>
              {(Object.keys(ACTION_LABELS) as AccessAction[]).map((a) => (
                <MenuItem key={a} value={a}>{ACTION_LABELS[a]}</MenuItem>
              ))}
            </Select>
          </FormControl>

          <Typography variant="caption" color="text.secondary" sx={{ ml: "auto !important" }}>
            {filtered.length} result{filtered.length !== 1 ? "s" : ""}
          </Typography>
        </Stack>

        <Divider sx={{ mb: 1.5 }} />

        {/* Table */}
        <TableContainer sx={{ borderRadius: 1.5, border: "1px solid", borderColor: "divider" }}>
          <Table size="small">
            <TableHead>
              <TableRow sx={{ bgcolor: "action.hover" }}>
                <TableCell sx={{ fontWeight: 700, fontSize: "0.75rem" }}>Timestamp</TableCell>
                <TableCell sx={{ fontWeight: 700, fontSize: "0.75rem" }}>
                  <Stack direction="row" alignItems="center" spacing={0.5}>
                    <PersonOutlineOutlinedIcon sx={{ fontSize: 14 }} />
                    <span>User</span>
                  </Stack>
                </TableCell>
                <TableCell sx={{ fontWeight: 700, fontSize: "0.75rem" }}>Action</TableCell>
                <TableCell sx={{ fontWeight: 700, fontSize: "0.75rem" }}>Status</TableCell>
                <TableCell sx={{ fontWeight: 700, fontSize: "0.75rem" }}>IP Address</TableCell>
                <TableCell sx={{ fontWeight: 700, fontSize: "0.75rem" }}>Location</TableCell>
                <TableCell sx={{ fontWeight: 700, fontSize: "0.75rem" }}>
                  <Stack direction="row" alignItems="center" spacing={0.5}>
                    <DevicesOutlinedIcon sx={{ fontSize: 14 }} />
                    <span>Device</span>
                  </Stack>
                </TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {paginated.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={7} align="center" sx={{ py: 4 }}>
                    <Typography variant="body2" color="text.secondary">
                      No access logs match the current filters.
                    </Typography>
                  </TableCell>
                </TableRow>
              ) : (
                paginated.map((log) => {
                  const sm = STATUS_META[log.status];
                  return (
                    <TableRow key={log.id} hover>
                      <TableCell sx={{ fontSize: "0.75rem", whiteSpace: "nowrap", color: "text.secondary" }}>
                        {fmtTs(log.timestamp)}
                      </TableCell>
                      <TableCell>
                        <Typography variant="subtitle2" fontSize="0.8rem" fontWeight={600} lineHeight={1.2}>
                          {log.user}
                        </Typography>
                        <Typography variant="caption" color="text.secondary">
                          {log.email}
                        </Typography>
                      </TableCell>
                      <TableCell>
                        <Chip
                          label={ACTION_LABELS[log.action]}
                          size="small"
                          variant="outlined"
                          sx={{ fontSize: "0.7rem", height: 20 }}
                        />
                      </TableCell>
                      <TableCell>
                        <Chip
                          label={sm.label}
                          size="small"
                          color={sm.color}
                          sx={{ fontSize: "0.7rem", height: 20, fontWeight: 600 }}
                        />
                      </TableCell>
                      <TableCell sx={{ fontSize: "0.75rem", fontFamily: "monospace", whiteSpace: "nowrap" }}>
                        {log.ip}
                      </TableCell>
                      <TableCell sx={{ fontSize: "0.75rem", whiteSpace: "nowrap" }}>
                        {log.location}
                      </TableCell>
                      <TableCell>
                        <Tooltip title={log.userAgent} arrow>
                          <Typography variant="caption" color="text.secondary" noWrap sx={{ maxWidth: 160, display: "block" }}>
                            {log.device}
                          </Typography>
                        </Tooltip>
                      </TableCell>
                    </TableRow>
                  );
                })
              )}
            </TableBody>
          </Table>
        </TableContainer>

        <TablePagination
          component="div"
          count={filtered.length}
          page={page}
          onPageChange={(_, p) => setPage(p)}
          rowsPerPage={rowsPerPage}
          onRowsPerPageChange={(e) => { setRows(parseInt(e.target.value, 10)); setPage(0); }}
          rowsPerPageOptions={[5, 10, 25]}
          sx={{ mt: 1, "& .MuiTablePagination-toolbar": { minHeight: 44 } }}
        />
      </SectionCard>
    </Stack>
  );
};

export default AccessLogs;