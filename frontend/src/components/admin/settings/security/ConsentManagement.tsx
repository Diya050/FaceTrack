import { useState, useMemo } from "react";
import {
  Box, Typography, Stack, Paper, Chip, Divider,
  TextField, Select, MenuItem, FormControl, InputLabel,
  Table, TableBody, TableCell, TableContainer, TableHead,
  TableRow, TablePagination, Tooltip, IconButton, Button,
  InputAdornment, Alert, Switch, Dialog, DialogTitle,
  DialogContent, DialogContentText, DialogActions,
} from "@mui/material";
import VerifiedUserOutlinedIcon    from "@mui/icons-material/VerifiedUserOutlined";
import SearchOutlinedIcon          from "@mui/icons-material/SearchOutlined";
import FilterListOutlinedIcon      from "@mui/icons-material/FilterListOutlined";
import DownloadOutlinedIcon        from "@mui/icons-material/DownloadOutlined";
import RefreshOutlinedIcon         from "@mui/icons-material/RefreshOutlined";
import CheckCircleOutlineIcon      from "@mui/icons-material/CheckCircleOutline";
import CancelOutlinedIcon          from "@mui/icons-material/CancelOutlined";
import HourglassEmptyOutlinedIcon  from "@mui/icons-material/HourglassEmptyOutlined";
import PersonOutlineOutlinedIcon   from "@mui/icons-material/PersonOutlineOutlined";
import WarningAmberOutlinedIcon    from "@mui/icons-material/WarningAmberOutlined";
import InfoOutlinedIcon            from "@mui/icons-material/InfoOutlined";

// ─── Types ────────────────────────────────────────────────────────────────────

type ConsentStatus = "granted" | "revoked" | "pending";
type ConsentType =
  | "biometric_collection"
  | "attendance_tracking"
  | "data_sharing"
  | "notifications"
  | "data_retention";

interface ConsentRecord {
  id: string;
  user: string;
  email: string;
  department: string;
  consentType: ConsentType;
  status: ConsentStatus;
  grantedAt: string | null;
  revokedAt: string | null;
  method: "in-app" | "email" | "paper" | "api";
  ip: string;
  notes?: string;
}

// ─── Mock Data ────────────────────────────────────────────────────────────────

const MOCK_CONSENTS: ConsentRecord[] = [
  { id: "c1",  user: "Prachi Sharma",   email: "prachi@facetrack.io",   department: "Engineering",   consentType: "biometric_collection", status: "granted",  grantedAt: "2025-11-01T10:00:00Z", revokedAt: null,                   method: "in-app", ip: "192.168.1.10" },
  { id: "c2",  user: "Prachi Sharma",   email: "prachi@facetrack.io",   department: "Engineering",   consentType: "attendance_tracking",  status: "granted",  grantedAt: "2025-11-01T10:01:00Z", revokedAt: null,                   method: "in-app", ip: "192.168.1.10" },
  { id: "c3",  user: "Rohan Mehta",     email: "rohan@facetrack.io",    department: "HR",            consentType: "biometric_collection", status: "granted",  grantedAt: "2025-11-03T09:15:00Z", revokedAt: null,                   method: "email",  ip: "10.0.0.45" },
  { id: "c4",  user: "Rohan Mehta",     email: "rohan@facetrack.io",    department: "HR",            consentType: "data_sharing",         status: "revoked",  grantedAt: "2025-11-03T09:16:00Z", revokedAt: "2026-01-15T13:45:00Z", method: "in-app", ip: "10.0.0.45",    notes: "User requested data deletion" },
  { id: "c5",  user: "Neha Gupta",      email: "neha@facetrack.io",     department: "Finance",       consentType: "biometric_collection", status: "granted",  grantedAt: "2025-11-05T08:30:00Z", revokedAt: null,                   method: "paper",  ip: "172.16.0.3" },
  { id: "c6",  user: "Neha Gupta",      email: "neha@facetrack.io",     department: "Finance",       consentType: "notifications",        status: "revoked",  grantedAt: "2025-11-05T08:31:00Z", revokedAt: "2026-02-01T10:00:00Z", method: "in-app", ip: "172.16.0.3" },
  { id: "c7",  user: "Amit Patel",      email: "amit@facetrack.io",     department: "Operations",    consentType: "biometric_collection", status: "pending",  grantedAt: null,                   revokedAt: null,                   method: "email",  ip: "192.168.2.22", notes: "Invitation sent, awaiting response" },
  { id: "c8",  user: "Amit Patel",      email: "amit@facetrack.io",     department: "Operations",    consentType: "attendance_tracking",  status: "pending",  grantedAt: null,                   revokedAt: null,                   method: "email",  ip: "192.168.2.22" },
  { id: "c9",  user: "Sneha Joshi",     email: "sneha@facetrack.io",    department: "Marketing",     consentType: "biometric_collection", status: "granted",  grantedAt: "2025-12-01T11:00:00Z", revokedAt: null,                   method: "in-app", ip: "192.168.1.55" },
  { id: "c10", user: "Sneha Joshi",     email: "sneha@facetrack.io",    department: "Marketing",     consentType: "data_retention",       status: "granted",  grantedAt: "2025-12-01T11:02:00Z", revokedAt: null,                   method: "in-app", ip: "192.168.1.55" },
  { id: "c11", user: "Karan Singh",     email: "karan@facetrack.io",    department: "Engineering",   consentType: "biometric_collection", status: "granted",  grantedAt: "2025-12-10T09:45:00Z", revokedAt: null,                   method: "api",    ip: "10.10.10.10" },
  { id: "c12", user: "Karan Singh",     email: "karan@facetrack.io",    department: "Engineering",   consentType: "data_sharing",         status: "granted",  grantedAt: "2025-12-10T09:46:00Z", revokedAt: null,                   method: "api",    ip: "10.10.10.10" },
  { id: "c13", user: "Deepika Nair",    email: "deepika@facetrack.io",  department: "Design",        consentType: "biometric_collection", status: "revoked",  grantedAt: "2025-10-20T14:00:00Z", revokedAt: "2026-03-01T08:00:00Z", method: "in-app", ip: "172.16.5.8",   notes: "Maternity leave — opted out" },
  { id: "c14", user: "Deepika Nair",    email: "deepika@facetrack.io",  department: "Design",        consentType: "notifications",        status: "granted",  grantedAt: "2025-10-20T14:01:00Z", revokedAt: null,                   method: "in-app", ip: "172.16.5.8" },
  { id: "c15", user: "Vikram Rao",      email: "vikram@facetrack.io",   department: "Legal",         consentType: "biometric_collection", status: "pending",  grantedAt: null,                   revokedAt: null,                   method: "email",  ip: "192.168.3.99", notes: "Legal review pending" },
  { id: "c16", user: "Priya Verma",     email: "priya@facetrack.io",    department: "HR",            consentType: "biometric_collection", status: "granted",  grantedAt: "2026-01-10T10:00:00Z", revokedAt: null,                   method: "in-app", ip: "192.168.4.11" },
  { id: "c17", user: "Priya Verma",     email: "priya@facetrack.io",    department: "HR",            consentType: "data_retention",       status: "granted",  grantedAt: "2026-01-10T10:02:00Z", revokedAt: null,                   method: "in-app", ip: "192.168.4.11" },
];

// ─── Helpers ──────────────────────────────────────────────────────────────────

const fmtTs = (iso: string | null) => {
  if (!iso) return "—";
  return new Date(iso).toLocaleString("en-IN", {
    day: "2-digit", month: "short", year: "numeric",
    hour: "2-digit", minute: "2-digit", hour12: false,
  });
};

const STATUS_META: Record<ConsentStatus, { label: string; color: "success" | "error" | "warning"; icon: React.ReactNode }> = {
  granted: { label: "Granted", color: "success", icon: <CheckCircleOutlineIcon sx={{ fontSize: 13 }} /> },
  revoked: { label: "Revoked", color: "error",   icon: <CancelOutlinedIcon    sx={{ fontSize: 13 }} /> },
  pending: { label: "Pending", color: "warning", icon: <HourglassEmptyOutlinedIcon sx={{ fontSize: 13 }} /> },
};

const TYPE_META: Record<ConsentType, { label: string; description: string }> = {
  biometric_collection: { label: "Biometric Collection", description: "Face data capture & encoding" },
  attendance_tracking:  { label: "Attendance Tracking",  description: "Automated presence detection" },
  data_sharing:         { label: "Data Sharing",         description: "Third-party integrations" },
  notifications:        { label: "Notifications",        description: "Email & push alerts" },
  data_retention:       { label: "Data Retention",       description: "Long-term storage policy" },
};

// ─── Sub-components ───────────────────────────────────────────────────────────

interface SectionCardProps {
  icon: React.ReactNode;
  title: string;
  subtitle: string;
  children: React.ReactNode;
}

const SectionCard = ({ icon, title, subtitle, children }: SectionCardProps) => (
  <Paper variant="outlined" sx={{ borderRadius: 2, borderColor: "divider", overflow: "hidden" }}>
    <Stack
      direction="row" alignItems="center" spacing={1.5}
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
        <Typography variant="subtitle1" fontWeight={700} color="text.primary" lineHeight={1.2}>{title}</Typography>
        <Typography variant="caption" color="text.secondary">{subtitle}</Typography>
      </Box>
    </Stack>
    <Box p={2.5}>{children}</Box>
  </Paper>
);

const SummaryCard = ({
  label, value, icon, color,
}: {
  label: string;
  value: number;
  icon: React.ReactNode;
  color: "primary" | "success" | "error" | "warning" | "info";
}) => (
  <Paper
    variant="outlined"
    sx={{ px: 2.5, py: 2, borderRadius: 2, borderColor: "divider", display: "flex", alignItems: "center", gap: 2, minWidth: 160, flex: 1 }}
  >
    <Box
      sx={{
        width: 36, height: 36, borderRadius: 1.5, bgcolor: `${color}.main`,
        display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0,
      }}
    >
      {icon}
    </Box>
    <Box>
      <Typography variant="h6" fontWeight={700} color="text.primary" lineHeight={1}>{value}</Typography>
      <Typography variant="caption" color="text.secondary">{label}</Typography>
    </Box>
  </Paper>
);

// ─── Main component ───────────────────────────────────────────────────────────

const ConsentManagement = () => {
  const [search, setSearch]               = useState("");
  const [statusFilter, setStatus]         = useState<ConsentStatus | "all">("all");
  const [typeFilter, setType]             = useState<ConsentType | "all">("all");
  const [page, setPage]                   = useState(0);
  const [rowsPerPage, setRows]            = useState(10);
  const [refreshKey, setRefreshKey]       = useState(0);
  const [revokeTarget, setRevokeTarget]   = useState<ConsentRecord | null>(null);
  const [records, setRecords]             = useState<ConsentRecord[]>(MOCK_CONSENTS);

  void refreshKey;

  const filtered = useMemo(() => {
    const q = search.toLowerCase();
    return records.filter((r) => {
      const matchSearch =
        !q ||
        r.user.toLowerCase().includes(q) ||
        r.email.toLowerCase().includes(q) ||
        r.department.toLowerCase().includes(q) ||
        TYPE_META[r.consentType].label.toLowerCase().includes(q);
      const matchStatus = statusFilter === "all" || r.status === statusFilter;
      const matchType   = typeFilter   === "all" || r.consentType === typeFilter;
      return matchSearch && matchStatus && matchType;
    });
  }, [records, search, statusFilter, typeFilter]);

  const paginated = filtered.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage);

  const counts = useMemo(() => ({
    total:   records.length,
    granted: records.filter((r) => r.status === "granted").length,
    revoked: records.filter((r) => r.status === "revoked").length,
    pending: records.filter((r) => r.status === "pending").length,
  }), [records]);

  const handleRevoke = (rec: ConsentRecord) => setRevokeTarget(rec);

  const confirmRevoke = () => {
    if (!revokeTarget) return;
    setRecords((prev) =>
      prev.map((r) =>
        r.id === revokeTarget.id
          ? { ...r, status: "revoked", revokedAt: new Date().toISOString() }
          : r
      )
    );
    setRevokeTarget(null);
  };

  const handleExport = () => {
    const headers = ["ID", "User", "Email", "Department", "Consent Type", "Status", "Granted At", "Revoked At", "Method", "IP", "Notes"];
    const rows = records.map((r) => [
      r.id, r.user, r.email, r.department,
      TYPE_META[r.consentType].label, r.status,
      fmtTs(r.grantedAt), fmtTs(r.revokedAt),
      r.method, r.ip, r.notes ?? "",
    ]);
    const csv = [headers, ...rows].map((row) => row.map((v) => `"${v}"`).join(",")).join("\n");
    const blob = new Blob([csv], { type: "text/csv" });
    const url  = URL.createObjectURL(blob);
    const a    = document.createElement("a");
    a.href = url; a.download = "consent_records.csv"; a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <Stack spacing={3}>
      {/* ── Section heading ─────────────────────────────── */}
      <Stack direction="row" justifyContent="space-between" alignItems="flex-start">
        <Box sx={{ borderLeft: "4px solid", borderColor: "primary.main", pl: 1.5 }}>
          <Typography variant="h6" fontWeight={700} color="text.primary" lineHeight={1.3}>
            Consent Management
          </Typography>
          <Typography variant="body2" color="text.secondary" mt={0.25}>
            Track and manage user consent for biometric collection, data sharing, and platform features.
          </Typography>
        </Box>
        <Stack direction="row" spacing={1}>
          <Tooltip title="Refresh">
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
      </Stack>

      {/* ── Summary cards ───────────────────────────────── */}
      <Stack direction="row" spacing={2} flexWrap="wrap" useFlexGap>
        <SummaryCard
          label="Total Records"
          value={counts.total}
          icon={<VerifiedUserOutlinedIcon sx={{ fontSize: 18, color: "#fff" }} />}
          color="primary"
        />
        <SummaryCard
          label="Granted"
          value={counts.granted}
          icon={<CheckCircleOutlineIcon sx={{ fontSize: 18, color: "#fff" }} />}
          color="success"
        />
        <SummaryCard
          label="Revoked"
          value={counts.revoked}
          icon={<CancelOutlinedIcon sx={{ fontSize: 18, color: "#fff" }} />}
          color="error"
        />
        <SummaryCard
          label="Pending"
          value={counts.pending}
          icon={<HourglassEmptyOutlinedIcon sx={{ fontSize: 18, color: "#fff" }} />}
          color="warning"
        />
      </Stack>

      {/* ── Pending notice ──────────────────────────────── */}
      {counts.pending > 0 && (
        <Alert severity="warning" icon={<WarningAmberOutlinedIcon />} sx={{ borderRadius: 2 }}>
          <strong>{counts.pending} consent request{counts.pending > 1 ? "s" : ""}</strong> awaiting user
          response. Follow up to ensure compliance before enabling biometric features for these users.
        </Alert>
      )}

      {/* ── Consent types reference ─────────────────────── */}
      <SectionCard
        icon={<InfoOutlinedIcon sx={{ fontSize: 18, color: "#fff" }} />}
        title="Consent Types"
        subtitle="Overview of consent categories collected from users"
      >
        <Stack direction="row" spacing={2} flexWrap="wrap" useFlexGap>
          {(Object.keys(TYPE_META) as ConsentType[]).map((type) => (
            <Paper
              key={type}
              variant="outlined"
              sx={{ px: 2, py: 1.5, borderRadius: 2, borderColor: "divider", minWidth: 200, flex: 1 }}
            >
              <Stack direction="row" alignItems="center" spacing={1} mb={0.5}>
                <Switch
                  size="small"
                  checked={records.some((r) => r.consentType === type && r.status === "granted")}
                  readOnly
                  sx={{ pointerEvents: "none" }}
                />
                <Typography variant="caption" fontWeight={700} color="text.primary">
                  {TYPE_META[type].label}
                </Typography>
              </Stack>
              <Typography variant="caption" color="text.secondary" display="block">
                {TYPE_META[type].description}
              </Typography>
              <Stack direction="row" spacing={0.5} mt={1} flexWrap="wrap" useFlexGap>
                {(["granted", "revoked", "pending"] as ConsentStatus[]).map((s) => {
                  const n = records.filter((r) => r.consentType === type && r.status === s).length;
                  if (n === 0) return null;
                  const { color, label } = STATUS_META[s];
                  return (
                    <Chip
                      key={s}
                      label={`${n} ${label}`}
                      size="small"
                      color={color}
                      variant="outlined"
                      sx={{ fontSize: "0.65rem", height: 20 }}
                    />
                  );
                })}
              </Stack>
            </Paper>
          ))}
        </Stack>
      </SectionCard>

      {/* ── Records table ───────────────────────────────── */}
      <SectionCard
        icon={<VerifiedUserOutlinedIcon sx={{ fontSize: 18, color: "#fff" }} />}
        title="Consent Records"
        subtitle="Individual user consent entries with full audit trail"
      >
        {/* Filters */}
        <Stack direction="row" spacing={2} mb={2} flexWrap="wrap" useFlexGap alignItems="center">
          <TextField
            size="small"
            placeholder="Search user, email, department…"
            value={search}
            onChange={(e) => { setSearch(e.target.value); setPage(0); }}
            sx={{ minWidth: 240 }}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <SearchOutlinedIcon fontSize="small" sx={{ color: "text.secondary" }} />
                </InputAdornment>
              ),
            }}
          />

          <FormControl size="small" sx={{ minWidth: 145 }}>
            <InputLabel>Status</InputLabel>
            <Select
              label="Status"
              value={statusFilter}
              onChange={(e) => { setStatus(e.target.value as typeof statusFilter); setPage(0); }}
              startAdornment={<FilterListOutlinedIcon fontSize="small" sx={{ mr: 0.5, color: "text.secondary" }} />}
            >
              <MenuItem value="all">All Statuses</MenuItem>
              <MenuItem value="granted">Granted</MenuItem>
              <MenuItem value="revoked">Revoked</MenuItem>
              <MenuItem value="pending">Pending</MenuItem>
            </Select>
          </FormControl>

          <FormControl size="small" sx={{ minWidth: 185 }}>
            <InputLabel>Consent Type</InputLabel>
            <Select
              label="Consent Type"
              value={typeFilter}
              onChange={(e) => { setType(e.target.value as typeof typeFilter); setPage(0); }}
            >
              <MenuItem value="all">All Types</MenuItem>
              {(Object.keys(TYPE_META) as ConsentType[]).map((t) => (
                <MenuItem key={t} value={t}>{TYPE_META[t].label}</MenuItem>
              ))}
            </Select>
          </FormControl>

          <Typography variant="caption" color="text.secondary" sx={{ ml: "auto !important" }}>
            {filtered.length} result{filtered.length !== 1 ? "s" : ""}
          </Typography>
        </Stack>

        <Divider sx={{ mb: 1.5 }} />

        <TableContainer sx={{ borderRadius: 1.5, border: "1px solid", borderColor: "divider" }}>
          <Table size="small">
            <TableHead>
              <TableRow sx={{ bgcolor: "action.hover" }}>
                <TableCell sx={{ fontWeight: 700, fontSize: "0.75rem" }}>
                  <Stack direction="row" alignItems="center" spacing={0.5}>
                    <PersonOutlineOutlinedIcon sx={{ fontSize: 14 }} />
                    <span>User</span>
                  </Stack>
                </TableCell>
                <TableCell sx={{ fontWeight: 700, fontSize: "0.75rem" }}>Department</TableCell>
                <TableCell sx={{ fontWeight: 700, fontSize: "0.75rem" }}>Consent Type</TableCell>
                <TableCell sx={{ fontWeight: 700, fontSize: "0.75rem" }}>Status</TableCell>
                <TableCell sx={{ fontWeight: 700, fontSize: "0.75rem" }}>Granted At</TableCell>
                <TableCell sx={{ fontWeight: 700, fontSize: "0.75rem" }}>Revoked At</TableCell>
                <TableCell sx={{ fontWeight: 700, fontSize: "0.75rem" }}>Method</TableCell>
                <TableCell sx={{ fontWeight: 700, fontSize: "0.75rem" }}>IP Address</TableCell>
                <TableCell sx={{ fontWeight: 700, fontSize: "0.75rem" }}>Action</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {paginated.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={9} align="center" sx={{ py: 4 }}>
                    <Typography variant="body2" color="text.secondary">
                      No consent records match the current filters.
                    </Typography>
                  </TableCell>
                </TableRow>
              ) : (
                paginated.map((rec) => {
                  const { label: sLabel, color: sColor, icon: sIcon } = STATUS_META[rec.status];
                  return (
                    <TableRow
                      key={rec.id}
                      hover
                      sx={{ "&:last-child td": { borderBottom: 0 } }}
                    >
                      {/* User */}
                      <TableCell>
                        <Typography variant="subtitle2" fontSize="0.8rem" fontWeight={600} lineHeight={1.2}>
                          {rec.user}
                        </Typography>
                        <Typography variant="caption" color="text.secondary">{rec.email}</Typography>
                      </TableCell>

                      {/* Department */}
                      <TableCell>
                        <Typography variant="caption">{rec.department}</Typography>
                      </TableCell>

                      {/* Consent Type */}
                      <TableCell>
                        <Typography variant="caption" fontWeight={600} color="text.primary">
                          {TYPE_META[rec.consentType].label}
                        </Typography>
                        <Typography variant="caption" color="text.secondary" display="block">
                          {TYPE_META[rec.consentType].description}
                        </Typography>
                      </TableCell>

                      {/* Status */}
                      <TableCell>
                        <Chip
                          icon={sIcon as React.ReactElement}
                          label={sLabel}
                          size="small"
                          color={sColor}
                          variant="outlined"
                          sx={{ fontSize: "0.7rem", height: 22 }}
                        />
                      </TableCell>

                      {/* Granted At */}
                      <TableCell>
                        <Typography variant="caption" sx={{ fontFamily: "monospace" }}>
                          {fmtTs(rec.grantedAt)}
                        </Typography>
                      </TableCell>

                      {/* Revoked At */}
                      <TableCell>
                        <Typography variant="caption" sx={{ fontFamily: "monospace" }} color={rec.revokedAt ? "error.main" : "text.secondary"}>
                          {fmtTs(rec.revokedAt)}
                        </Typography>
                      </TableCell>

                      {/* Method */}
                      <TableCell>
                        <Chip
                          label={rec.method}
                          size="small"
                          variant="outlined"
                          sx={{ fontSize: "0.68rem", height: 20, textTransform: "capitalize" }}
                        />
                      </TableCell>

                      {/* IP */}
                      <TableCell>
                        <Typography variant="caption" sx={{ fontFamily: "monospace" }}>{rec.ip}</Typography>
                      </TableCell>

                      {/* Action */}
                      <TableCell>
                        {rec.status === "granted" ? (
                          <Tooltip title="Revoke consent">
                            <Button
                              size="small"
                              color="error"
                              variant="outlined"
                              onClick={() => handleRevoke(rec)}
                              sx={{ fontSize: "0.68rem", py: 0.25, minWidth: 70 }}
                            >
                              Revoke
                            </Button>
                          </Tooltip>
                        ) : (
                          <Typography variant="caption" color="text.secondary">—</Typography>
                        )}
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

      {/* ── Revoke confirmation dialog ───────────────────── */}
      <Dialog open={!!revokeTarget} onClose={() => setRevokeTarget(null)} maxWidth="xs" fullWidth>
        <DialogTitle sx={{ fontWeight: 700 }}>Revoke Consent</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Revoke <strong>{revokeTarget ? TYPE_META[revokeTarget.consentType].label : ""}</strong> consent
            for <strong>{revokeTarget?.user}</strong>? This action will be logged and cannot be undone
            without the user re-granting consent.
          </DialogContentText>
        </DialogContent>
        <DialogActions sx={{ px: 3, pb: 2 }}>
          <Button onClick={() => setRevokeTarget(null)} size="small">Cancel</Button>
          <Button onClick={confirmRevoke} size="small" color="error" variant="contained">
            Revoke
          </Button>
        </DialogActions>
      </Dialog>
    </Stack>
  );
};

export default ConsentManagement;