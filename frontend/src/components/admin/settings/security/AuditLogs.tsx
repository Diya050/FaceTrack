import { useState, useMemo, useEffect } from "react";
import {
  Box, Typography, Stack, Paper, Chip, Divider,
  TextField, Select, MenuItem, FormControl, InputLabel,
  Table, TableBody, TableCell, TableContainer, TableHead,
  TableRow, TablePagination, Tooltip, IconButton, Button,
  InputAdornment, Alert, Collapse, CircularProgress,
} from "@mui/material";
import AssignmentOutlinedIcon      from "@mui/icons-material/AssignmentOutlined";
import SearchOutlinedIcon           from "@mui/icons-material/SearchOutlined";
import FilterListOutlinedIcon       from "@mui/icons-material/FilterListOutlined";
import DownloadOutlinedIcon         from "@mui/icons-material/DownloadOutlined";
import RefreshOutlinedIcon          from "@mui/icons-material/RefreshOutlined";
import PersonOutlineOutlinedIcon    from "@mui/icons-material/PersonOutlineOutlined";
import EditOutlinedIcon             from "@mui/icons-material/EditOutlined";
import DeleteOutlinedIcon           from "@mui/icons-material/DeleteOutlined";
import AddCircleOutlineOutlinedIcon from "@mui/icons-material/AddCircleOutlineOutlined";
import SettingsOutlinedIcon         from "@mui/icons-material/SettingsOutlined";
import LoginOutlinedIcon            from "@mui/icons-material/LoginOutlined";
import VisibilityOutlinedIcon       from "@mui/icons-material/VisibilityOutlined";
import ExpandMoreOutlinedIcon       from "@mui/icons-material/ExpandMoreOutlined";
import ExpandLessOutlinedIcon       from "@mui/icons-material/ExpandLessOutlined";
import InfoOutlinedIcon             from "@mui/icons-material/InfoOutlined";
import ShieldOutlinedIcon           from "@mui/icons-material/ShieldOutlined";

import { auditLogService, type AuditLog } from "../../../../services/auditLogService";

// ─── Types ────────────────────────────────────────────────────────────────────

type AuditCategory = "auth" | "user" | "config" | "data" | "system";
type AuditSeverity = "info" | "warning" | "critical";

interface AuditLogEntry extends AuditLog {
  changes?: { field: string; from: string; to: string }[];
}

// ─── Mock Data ────────────────────────────────────────────────────────────────

const fmtTs = (iso: string) => {
  const d = new Date(iso);
  return d.toLocaleString("en-IN", {
    day: "2-digit", month: "short", year: "numeric",
    hour: "2-digit", minute: "2-digit", second: "2-digit", hour12: false,
  });
};

const SEVERITY_META: Record<AuditSeverity, { label: string; color: "info" | "warning" | "error" }> = {
  info:     { label: "Info",     color: "info" },
  warning:  { label: "Warning",  color: "warning" },
  critical: { label: "Critical", color: "error" },
};

const CATEGORY_META: Record<AuditCategory, { label: string; icon: React.ReactNode }> = {
  auth:   { label: "Auth",   icon: <LoginOutlinedIcon sx={{ fontSize: 13 }} /> },
  user:   { label: "User",   icon: <PersonOutlineOutlinedIcon sx={{ fontSize: 13 }} /> },
  config: { label: "Config", icon: <SettingsOutlinedIcon sx={{ fontSize: 13 }} /> },
  data:   { label: "Data",   icon: <VisibilityOutlinedIcon sx={{ fontSize: 13 }} /> },
  system: { label: "System", icon: <ShieldOutlinedIcon sx={{ fontSize: 13 }} /> },
};

const ACTION_ICON: Record<string, React.ReactNode> = {
  CREATE_USER:         <AddCircleOutlineOutlinedIcon sx={{ fontSize: 14, color: "success.main" }} />,
  DELETE_PROFILE:      <DeleteOutlinedIcon sx={{ fontSize: 14, color: "error.main" }} />,
  DELETE_CAMERA:       <DeleteOutlinedIcon sx={{ fontSize: 14, color: "error.main" }} />,
  UPDATE_SETTINGS:     <EditOutlinedIcon sx={{ fontSize: 14, color: "warning.main" }} />,
  UPDATE_PERMISSIONS:  <EditOutlinedIcon sx={{ fontSize: 14, color: "warning.main" }} />,
  UPDATE_RETENTION:    <EditOutlinedIcon sx={{ fontSize: 14, color: "warning.main" }} />,
  EXPORT_REPORT:       <DownloadOutlinedIcon sx={{ fontSize: 14, color: "info.main" }} />,
  VIEW_BIOMETRICS:     <VisibilityOutlinedIcon sx={{ fontSize: 14, color: "info.main" }} />,
  LOGIN:               <LoginOutlinedIcon sx={{ fontSize: 14, color: "primary.main" }} />,
  BACKUP_CREATED:      <AssignmentOutlinedIcon sx={{ fontSize: 14, color: "success.main" }} />,
  PURGE_LOGS:          <DeleteOutlinedIcon sx={{ fontSize: 14, color: "warning.main" }} />,
  CREATE_CAMERA:       <AddCircleOutlineOutlinedIcon sx={{ fontSize: 14, color: "success.main" }} />,
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

const SummaryCard = ({
  label, value, icon, color,
}: {
  label: string; value: number; icon: React.ReactNode; color: string;
}) => (
  <Paper variant="outlined" sx={{ flex: 1, minWidth: 130, p: 2, borderRadius: 2, borderColor: "divider" }}>
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
        <Typography variant="h6" fontWeight={700} color="text.primary" lineHeight={1}>{value}</Typography>
        <Typography variant="caption" color="text.secondary">{label}</Typography>
      </Box>
    </Stack>
  </Paper>
);

// Expandable row for changes
const ChangeRow = ({ entry }: { entry: AuditLogEntry }) => {
  const [open, setOpen] = useState(false);
  const hasChanges = entry.changes && entry.changes.length > 0;

  return (
    <>
      <TableRow hover>
        <TableCell sx={{ fontSize: "0.74rem", whiteSpace: "nowrap", color: "text.secondary" }}>
          {fmtTs(entry.timestamp)}
        </TableCell>
        <TableCell>
          <Typography variant="subtitle2" fontSize="0.8rem" fontWeight={600} lineHeight={1.2}>
            {entry.actor}
          </Typography>
          <Typography variant="caption" color="text.secondary">{entry.actor_role}</Typography>
        </TableCell>
        <TableCell>
          <Stack direction="row" alignItems="center" spacing={0.5}>
            {ACTION_ICON[entry.action] ?? <AssignmentOutlinedIcon sx={{ fontSize: 14 }} />}
            <Typography variant="caption" fontWeight={500}>
              {entry.action.replace(/_/g, " ")}
            </Typography>
          </Stack>
        </TableCell>
        <TableCell>
          <Chip
            icon={CATEGORY_META[entry.category].icon as React.ReactElement}
            label={CATEGORY_META[entry.category].label}
            size="small"
            variant="outlined"
            sx={{ fontSize: "0.7rem", height: 20 }}
          />
        </TableCell>
        <TableCell>
          <Chip
            label={SEVERITY_META[entry.severity].label}
            size="small"
            color={SEVERITY_META[entry.severity].color}
            sx={{ fontSize: "0.7rem", height: 20, fontWeight: 600 }}
          />
        </TableCell>
        <TableCell sx={{ fontSize: "0.75rem" }}>
          <Typography variant="caption" noWrap sx={{ maxWidth: 160, display: "block" }}>
            {entry.resource}
          </Typography>
          <Typography variant="caption" color="text.secondary" sx={{ fontFamily: "monospace" }}>
            {entry.resource_id}
          </Typography>
        </TableCell>
        <TableCell sx={{ fontSize: "0.74rem", fontFamily: "monospace" }}>{entry.ip}</TableCell>
        <TableCell>
          {hasChanges ? (
            <Tooltip title={open ? "Hide changes" : "View changes"} arrow>
              <IconButton size="small" onClick={() => setOpen((v) => !v)} sx={{ color: "text.secondary" }}>
                {open ? <ExpandLessOutlinedIcon fontSize="small" /> : <ExpandMoreOutlinedIcon fontSize="small" />}
              </IconButton>
            </Tooltip>
          ) : (
            <Tooltip title={entry.details} arrow>
              <InfoOutlinedIcon sx={{ fontSize: 16, color: "text.disabled", mt: 0.5 }} />
            </Tooltip>
          )}
        </TableCell>
      </TableRow>

      {hasChanges && (
        <TableRow>
          <TableCell colSpan={8} sx={{ p: 0, border: 0 }}>
            <Collapse in={open} unmountOnExit>
              <Box sx={{ bgcolor: "action.hover", px: 3, py: 1.5, borderBottom: "1px solid", borderColor: "divider" }}>
                <Typography variant="caption" color="text.secondary" display="block" mb={1}>
                  {entry.details}
                </Typography>
                <Stack spacing={0.5}>
                  {entry.changes!.map((c, i) => (
                    <Stack key={i} direction="row" alignItems="center" spacing={1}>
                      <Typography variant="caption" sx={{ fontFamily: "monospace", color: "text.primary", minWidth: 160 }}>
                        {c.field}
                      </Typography>
                      <Chip label={c.from} size="small" variant="outlined" color="error" sx={{ fontSize: "0.68rem", height: 18 }} />
                      <Typography variant="caption" color="text.secondary">→</Typography>
                      <Chip label={c.to} size="small" variant="outlined" color="success" sx={{ fontSize: "0.68rem", height: 18 }} />
                    </Stack>
                  ))}
                </Stack>
              </Box>
            </Collapse>
          </TableCell>
        </TableRow>
      )}
    </>
  );
};

// ─── Main Component ───────────────────────────────────────────────────────────

const AuditLogs = () => {
  const [logs, setLogs]               = useState<AuditLogEntry[]>([]);
  const [loading, setLoading]         = useState(true);
  const [error, setError]             = useState<string | null>(null);
  const [search, setSearch]           = useState("");
  const [severityFilter, setSeverity] = useState<"all" | AuditSeverity>("all");
  const [categoryFilter, setCategory] = useState<"all" | AuditCategory>("all");
  const [page, setPage]               = useState(0);
  const [rowsPerPage, setRows]        = useState(10);
  const [refreshKey, setRefreshKey]   = useState(0);

  // Fetch audit logs on component mount and when refreshed
  useEffect(() => {
    const fetchLogs = async () => {
      try {
        setLoading(true);
        setError(null);
        const data = await auditLogService.getAuditLogs(100, 0);
        setLogs(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Failed to fetch audit logs");
        console.error("Error fetching audit logs:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchLogs();
  }, [refreshKey]);

  const filtered = useMemo(() => {
    const q = search.toLowerCase();
    return logs.filter((log) => {
      if (severityFilter !== "all" && log.severity !== severityFilter) return false;
      if (categoryFilter !== "all" && log.category !== categoryFilter) return false;
      if (
        q &&
        !log.actor.toLowerCase().includes(q) &&
        !log.action.toLowerCase().includes(q) &&
        !log.resource.toLowerCase().includes(q) &&
        !log.ip.includes(q)
      ) return false;
      return true;
    });
  }, [logs, search, severityFilter, categoryFilter]);

  const paginated = filtered.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage);

  const counts = useMemo(() => ({
    total:    logs.length,
    critical: logs.filter((l) => l.severity === "critical").length,
    warning:  logs.filter((l) => l.severity === "warning").length,
    info:     logs.filter((l) => l.severity === "info").length,
  }), [logs]);

  const handleExport = () => {
    const header = ["Timestamp", "Actor", "Role", "Action", "Category", "Severity", "Resource", "Resource ID", "IP", "Details"].join(",");
    const rows = filtered.map((l) =>
      [fmtTs(l.timestamp), l.actor, l.actor_role, l.action, l.category, l.severity, l.resource, l.resource_id, l.ip, l.details]
        .map((v) => `"${v}"`)
        .join(",")
    );
    const csv = [header, ...rows].join("\n");
    const blob = new Blob([csv], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "audit-logs.csv";
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <Stack spacing={3}>
      {/* ── Section heading ─────────────────────────────── */}
      <Stack direction="row" justifyContent="space-between" alignItems="flex-start">
        <Box sx={{ borderLeft: "4px solid", borderColor: "primary.main", pl: 1.5 }}>
          <Typography variant="h6" fontWeight={700} color="text.primary" lineHeight={1.3}>
            Audit Logs
          </Typography>
          <Typography variant="body2" color="text.secondary" mt={0.25}>
            Track all administrative actions, configuration changes, and data access events.
          </Typography>
        </Box>
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
      </Stack>

      {/* ── Summary cards ───────────────────────────────── */}
      <Stack direction="row" spacing={2} flexWrap="wrap" useFlexGap>
        <SummaryCard
          label="Total Events"
          value={counts.total}
          icon={<AssignmentOutlinedIcon sx={{ fontSize: 18, color: "#fff" }} />}
          color="primary"
        />
        <SummaryCard
          label="Critical"
          value={counts.critical}
          icon={<ShieldOutlinedIcon sx={{ fontSize: 18, color: "#fff" }} />}
          color="error"
        />
        <SummaryCard
          label="Warnings"
          value={counts.warning}
          icon={<EditOutlinedIcon sx={{ fontSize: 18, color: "#fff" }} />}
          color="warning"
        />
        <SummaryCard
          label="Info"
          value={counts.info}
          icon={<InfoOutlinedIcon sx={{ fontSize: 18, color: "#fff" }} />}
          color="info"
        />
      </Stack>

      {/* ── Critical notice ─────────────────────────────── */}
      {error && (
        <Alert severity="error" sx={{ borderRadius: 2 }}>
          {error}
        </Alert>
      )}

      {loading && (
        <Paper sx={{ display: "flex", justifyContent: "center", alignItems: "center", py: 4, borderRadius: 2 }}>
          <CircularProgress />
        </Paper>
      )}
      {counts.critical > 0 && (
        <Alert severity="error" icon={<ShieldOutlinedIcon />} sx={{ borderRadius: 2 }}>
          <strong>{counts.critical} critical audit event{counts.critical > 1 ? "s" : ""}</strong> recorded.
          Review permanent deletions and permission changes immediately.
        </Alert>
      )}

      {/* ── Log table ───────────────────────────────────── */}
      {!loading && (
      <SectionCard
        icon={<AssignmentOutlinedIcon sx={{ fontSize: 18, color: "#fff" }} />}
        title="Event Log"
        subtitle="Full history of admin actions and system events"
      >
        {/* Filters */}
        <Stack direction="row" spacing={2} mb={2} flexWrap="wrap" useFlexGap alignItems="center">
          <TextField
            size="small"
            placeholder="Search actor, action, resource, IP…"
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

          <FormControl size="small" sx={{ minWidth: 150 }}>
            <InputLabel>Severity</InputLabel>
            <Select
              label="Severity"
              value={severityFilter}
              onChange={(e) => { setSeverity(e.target.value as typeof severityFilter); setPage(0); }}
              startAdornment={<FilterListOutlinedIcon fontSize="small" sx={{ mr: 0.5, color: "text.secondary" }} />}
            >
              <MenuItem value="all">All Severities</MenuItem>
              <MenuItem value="info">Info</MenuItem>
              <MenuItem value="warning">Warning</MenuItem>
              <MenuItem value="critical">Critical</MenuItem>
            </Select>
          </FormControl>

          <FormControl size="small" sx={{ minWidth: 150 }}>
            <InputLabel>Category</InputLabel>
            <Select
              label="Category"
              value={categoryFilter}
              onChange={(e) => { setCategory(e.target.value as typeof categoryFilter); setPage(0); }}
            >
              <MenuItem value="all">All Categories</MenuItem>
              {(Object.keys(CATEGORY_META) as AuditCategory[]).map((c) => (
                <MenuItem key={c} value={c}>{CATEGORY_META[c].label}</MenuItem>
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
                    <span>Actor</span>
                  </Stack>
                </TableCell>
                <TableCell sx={{ fontWeight: 700, fontSize: "0.75rem" }}>Action</TableCell>
                <TableCell sx={{ fontWeight: 700, fontSize: "0.75rem" }}>Category</TableCell>
                <TableCell sx={{ fontWeight: 700, fontSize: "0.75rem" }}>Severity</TableCell>
                <TableCell sx={{ fontWeight: 700, fontSize: "0.75rem" }}>Resource</TableCell>
                <TableCell sx={{ fontWeight: 700, fontSize: "0.75rem" }}>IP Address</TableCell>
                <TableCell sx={{ fontWeight: 700, fontSize: "0.75rem" }}>Details</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {paginated.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={8} align="center" sx={{ py: 4 }}>
                    <Typography variant="body2" color="text.secondary">
                      No audit logs match the current filters.
                    </Typography>
                  </TableCell>
                </TableRow>
              ) : (
                paginated.map((log) => <ChangeRow key={log.id} entry={log} />)
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
      )}
    </Stack>
  );
};

export default AuditLogs;