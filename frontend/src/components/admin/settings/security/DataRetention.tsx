import { useState, useMemo } from "react";
import {
  Box, Typography, Stack, Paper, Chip, Divider,
  Table, TableBody, TableCell, TableContainer, TableHead,
  TableRow, TablePagination, Tooltip, IconButton, Button,
  Alert, Slider, Switch, Dialog, DialogTitle,
  DialogContent, DialogContentText, DialogActions,
  LinearProgress, FormControlLabel,
} from "@mui/material";
import StorageOutlinedIcon          from "@mui/icons-material/StorageOutlined";
import DeleteOutlineOutlinedIcon    from "@mui/icons-material/DeleteOutlineOutlined";
import ScheduleOutlinedIcon         from "@mui/icons-material/ScheduleOutlined";
import CheckCircleOutlineIcon       from "@mui/icons-material/CheckCircleOutline";
import WarningAmberOutlinedIcon     from "@mui/icons-material/WarningAmberOutlined";
import DownloadOutlinedIcon         from "@mui/icons-material/DownloadOutlined";
import RefreshOutlinedIcon          from "@mui/icons-material/RefreshOutlined";
import FingerprintOutlinedIcon      from "@mui/icons-material/FingerprintOutlined";
import EventNoteOutlinedIcon        from "@mui/icons-material/EventNoteOutlined";
import LockOutlinedIcon             from "@mui/icons-material/LockOutlined";
import ManageSearchOutlinedIcon     from "@mui/icons-material/ManageSearchOutlined";
import VerifiedUserOutlinedIcon     from "@mui/icons-material/VerifiedUserOutlined";
import VideoLibraryOutlinedIcon     from "@mui/icons-material/VideoLibraryOutlined";
import InfoOutlinedIcon             from "@mui/icons-material/InfoOutlined";

// ─── Types ────────────────────────────────────────────────────────────────────

type DataCategory =
  | "biometric_embeddings"
  | "attendance_records"
  | "audit_logs"
  | "access_logs"
  | "consent_records"
  | "camera_snapshots";

type JobStatus = "completed" | "scheduled" | "failed" | "running";

interface RetentionPolicy {
  id: string;
  category: DataCategory;
  retentionDays: number;
  autoDelete: boolean;
  archiveBeforeDelete: boolean;
  lastRunAt: string | null;
  nextRunAt: string;
  recordsAffected: number;
  sizeMB: number;
}

interface PurgeJob {
  id: string;
  category: DataCategory;
  status: JobStatus;
  startedAt: string;
  completedAt: string | null;
  recordsDeleted: number;
  sizeMB: number;
  triggeredBy: string;
}

// ─── Mock Data ────────────────────────────────────────────────────────────────

const INITIAL_POLICIES: RetentionPolicy[] = [
  { id: "rp1", category: "biometric_embeddings", retentionDays: 365, autoDelete: true,  archiveBeforeDelete: true,  lastRunAt: "2026-03-01T02:00:00Z", nextRunAt: "2026-04-01T02:00:00Z", recordsAffected: 142,  sizeMB: 320  },
  { id: "rp2", category: "attendance_records",   retentionDays: 730, autoDelete: true,  archiveBeforeDelete: true,  lastRunAt: "2026-03-01T02:10:00Z", nextRunAt: "2026-04-01T02:10:00Z", recordsAffected: 8640, sizeMB: 185  },
  { id: "rp3", category: "audit_logs",           retentionDays: 180, autoDelete: true,  archiveBeforeDelete: false, lastRunAt: "2026-03-01T02:20:00Z", nextRunAt: "2026-04-01T02:20:00Z", recordsAffected: 3200, sizeMB: 92   },
  { id: "rp4", category: "access_logs",          retentionDays: 90,  autoDelete: true,  archiveBeforeDelete: false, lastRunAt: "2026-03-01T02:30:00Z", nextRunAt: "2026-04-01T02:30:00Z", recordsAffected: 5800, sizeMB: 74   },
  { id: "rp5", category: "consent_records",      retentionDays: 1095,autoDelete: false, archiveBeforeDelete: true,  lastRunAt: null,                   nextRunAt: "2026-04-01T02:40:00Z", recordsAffected: 210,  sizeMB: 4    },
  { id: "rp6", category: "camera_snapshots",     retentionDays: 30,  autoDelete: true,  archiveBeforeDelete: false, lastRunAt: "2026-03-01T03:00:00Z", nextRunAt: "2026-04-01T03:00:00Z", recordsAffected: 9800, sizeMB: 1240 },
];

const MOCK_JOBS: PurgeJob[] = [
  { id: "j1", category: "camera_snapshots",     status: "completed", startedAt: "2026-03-01T03:00:00Z", completedAt: "2026-03-01T03:04:12Z", recordsDeleted: 9800,  sizeMB: 1240, triggeredBy: "Scheduler"   },
  { id: "j2", category: "access_logs",          status: "completed", startedAt: "2026-03-01T02:30:00Z", completedAt: "2026-03-01T02:31:05Z", recordsDeleted: 5800,  sizeMB: 74,   triggeredBy: "Scheduler"   },
  { id: "j3", category: "audit_logs",           status: "completed", startedAt: "2026-03-01T02:20:00Z", completedAt: "2026-03-01T02:21:38Z", recordsDeleted: 3200,  sizeMB: 92,   triggeredBy: "Scheduler"   },
  { id: "j4", category: "attendance_records",   status: "completed", startedAt: "2026-03-01T02:10:00Z", completedAt: "2026-03-01T02:13:20Z", recordsDeleted: 8640,  sizeMB: 185,  triggeredBy: "Scheduler"   },
  { id: "j5", category: "biometric_embeddings", status: "failed",    startedAt: "2026-02-15T02:00:00Z", completedAt: "2026-02-15T02:00:42Z", recordsDeleted: 0,     sizeMB: 0,    triggeredBy: "Scheduler"   },
  { id: "j6", category: "access_logs",          status: "completed", startedAt: "2026-02-01T02:30:00Z", completedAt: "2026-02-01T02:31:55Z", recordsDeleted: 4100,  sizeMB: 58,   triggeredBy: "admin@facetrack.io" },
  { id: "j7", category: "camera_snapshots",     status: "scheduled", startedAt: "2026-04-01T03:00:00Z", completedAt: null,                   recordsDeleted: 0,     sizeMB: 0,    triggeredBy: "Scheduler"   },
  { id: "j8", category: "audit_logs",           status: "scheduled", startedAt: "2026-04-01T02:20:00Z", completedAt: null,                   recordsDeleted: 0,     sizeMB: 0,    triggeredBy: "Scheduler"   },
];

// ─── Helpers ──────────────────────────────────────────────────────────────────

const fmtTs = (iso: string | null) => {
  if (!iso) return "—";
  return new Date(iso).toLocaleString("en-IN", {
    day: "2-digit", month: "short", year: "numeric",
    hour: "2-digit", minute: "2-digit", hour12: false,
  });
};

const fmtSize = (mb: number) =>
  mb >= 1024 ? `${(mb / 1024).toFixed(1)} GB` : `${mb} MB`;

const CATEGORY_META: Record<DataCategory, { label: string; description: string; icon: React.ReactNode; color: string }> = {
  biometric_embeddings: { label: "Biometric Embeddings", description: "Face encoding vectors per user",       icon: <FingerprintOutlinedIcon   sx={{ fontSize: 16 }} />, color: "#7C5CBF" },
  attendance_records:   { label: "Attendance Records",   description: "Daily check-in/check-out logs",        icon: <EventNoteOutlinedIcon     sx={{ fontSize: 16 }} />, color: "#2196F3" },
  audit_logs:           { label: "Audit Logs",           description: "Admin action event trail",             icon: <ManageSearchOutlinedIcon  sx={{ fontSize: 16 }} />, color: "#FF9800" },
  access_logs:          { label: "Access Logs",          description: "Authentication and access events",     icon: <LockOutlinedIcon          sx={{ fontSize: 16 }} />, color: "#F44336" },
  consent_records:      { label: "Consent Records",      description: "User privacy consent history",         icon: <VerifiedUserOutlinedIcon  sx={{ fontSize: 16 }} />, color: "#4CAF50" },
  camera_snapshots:     { label: "Camera Snapshots",     description: "Recognition event frame captures",     icon: <VideoLibraryOutlinedIcon  sx={{ fontSize: 16 }} />, color: "#00BCD4" },
};

const JOB_STATUS_META: Record<JobStatus, { label: string; color: "success" | "error" | "warning" | "info" }> = {
  completed: { label: "Completed", color: "success" },
  failed:    { label: "Failed",    color: "error"   },
  scheduled: { label: "Scheduled", color: "info"    },
  running:   { label: "Running",   color: "warning" },
};

const TOTAL_STORAGE_MB = 4096; // 4 GB quota for display

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
        <Typography variant="subtitle1" fontWeight={700} color="text.primary" lineHeight={1.2}>{title}</Typography>
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
  label: string;
  value: string | number;
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

const DataRetention = () => {
  const [policies, setPolicies]         = useState<RetentionPolicy[]>(INITIAL_POLICIES);
  const [page, setPage]                 = useState(0);
  const [rowsPerPage, setRows]          = useState(10);
  const [editTarget, setEditTarget]     = useState<RetentionPolicy | null>(null);
  const [purgeTarget, setPurgeTarget]   = useState<RetentionPolicy | null>(null);
  const [draftDays, setDraftDays]       = useState(90);
  const [draftAuto, setDraftAuto]       = useState(true);
  const [draftArchive, setDraftArchive] = useState(false);

  const jobs = MOCK_JOBS;

  const totals = useMemo(() => ({
    totalMB:    policies.reduce((s, p) => s + p.sizeMB, 0),
    activeAuto: policies.filter((p) => p.autoDelete).length,
    categories: policies.length,
    failed:     jobs.filter((j) => j.status === "failed").length,
  }), [policies, jobs]);

  const paginatedJobs = jobs.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage);

  const openEdit = (p: RetentionPolicy) => {
    setDraftDays(p.retentionDays);
    setDraftAuto(p.autoDelete);
    setDraftArchive(p.archiveBeforeDelete);
    setEditTarget(p);
  };

  const confirmEdit = () => {
    if (!editTarget) return;
    setPolicies((prev) =>
      prev.map((p) =>
        p.id === editTarget.id
          ? { ...p, retentionDays: draftDays, autoDelete: draftAuto, archiveBeforeDelete: draftArchive }
          : p
      )
    );
    setEditTarget(null);
  };

  const confirmPurge = () => {
    setPurgeTarget(null);
  };

  const handleExport = () => {
    const headers = ["Category", "Retention (days)", "Auto-Delete", "Archive First", "Last Run", "Next Run", "Records", "Size"];
    const rows = policies.map((p) => [
      CATEGORY_META[p.category].label,
      p.retentionDays,
      p.autoDelete ? "Yes" : "No",
      p.archiveBeforeDelete ? "Yes" : "No",
      fmtTs(p.lastRunAt),
      fmtTs(p.nextRunAt),
      p.recordsAffected,
      fmtSize(p.sizeMB),
    ]);
    const csv = [headers, ...rows].map((r) => r.map((v) => `"${v}"`).join(",")).join("\n");
    const blob = new Blob([csv], { type: "text/csv" });
    const a = document.createElement("a");
    a.href = URL.createObjectURL(blob);
    a.download = "data_retention_policies.csv";
    a.click();
  };

  return (
    <Stack spacing={3}>
      {/* ── Heading ─────────────────────────────────────── */}
      <Stack direction="row" justifyContent="space-between" alignItems="flex-start">
        <Box sx={{ borderLeft: "4px solid", borderColor: "primary.main", pl: 1.5 }}>
          <Typography variant="h6" fontWeight={700} color="text.primary" lineHeight={1.3}>
            Data Retention
          </Typography>
          <Typography variant="body2" color="text.secondary" mt={0.25}>
            Configure retention periods, auto-delete schedules, and archive policies for all data categories.
          </Typography>
        </Box>
        <Stack direction="row" spacing={1}>
          <Tooltip title="Refresh">
            <IconButton size="small" sx={{ color: "text.secondary" }}>
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
          label="Total Storage Used"
          value={fmtSize(totals.totalMB)}
          icon={<StorageOutlinedIcon sx={{ fontSize: 18, color: "#fff" }} />}
          color="primary"
        />
        <SummaryCard
          label="Auto-Delete Active"
          value={`${totals.activeAuto} / ${totals.categories}`}
          icon={<DeleteOutlineOutlinedIcon sx={{ fontSize: 18, color: "#fff" }} />}
          color="info"
        />
        <SummaryCard
          label="Categories Managed"
          value={totals.categories}
          icon={<CheckCircleOutlineIcon sx={{ fontSize: 18, color: "#fff" }} />}
          color="success"
        />
        <SummaryCard
          label="Failed Jobs"
          value={totals.failed}
          icon={<WarningAmberOutlinedIcon sx={{ fontSize: 18, color: "#fff" }} />}
          color={totals.failed > 0 ? "error" : "success"}
        />
      </Stack>

      {/* ── Failed job alert ─────────────────────────────── */}
      {totals.failed > 0 && (
        <Alert severity="error" icon={<WarningAmberOutlinedIcon />} sx={{ borderRadius: 2 }}>
          <strong>{totals.failed} purge job{totals.failed > 1 ? "s" : ""} failed</strong> in the last
          run cycle. Review the job history below and re-trigger manually if needed.
        </Alert>
      )}

      {/* ── Storage overview ─────────────────────────────── */}
      <SectionCard
        icon={<StorageOutlinedIcon sx={{ fontSize: 18, color: "#fff" }} />}
        title="Storage Usage by Category"
        subtitle={`${fmtSize(totals.totalMB)} used of ${fmtSize(TOTAL_STORAGE_MB)} quota`}
      >
        <Stack spacing={2}>
          {policies
            .slice()
            .sort((a, b) => b.sizeMB - a.sizeMB)
            .map((p) => {
              const pct = Math.min((p.sizeMB / TOTAL_STORAGE_MB) * 100, 100);
              const meta = CATEGORY_META[p.category];
              return (
                <Box key={p.id}>
                  <Stack direction="row" justifyContent="space-between" alignItems="center" mb={0.5}>
                    <Stack direction="row" alignItems="center" spacing={1}>
                      <Box sx={{ color: meta.color, display: "flex", alignItems: "center" }}>{meta.icon}</Box>
                      <Typography variant="caption" fontWeight={600} color="text.primary">{meta.label}</Typography>
                    </Stack>
                    <Stack direction="row" alignItems="center" spacing={1}>
                      <Typography variant="caption" color="text.secondary">{p.recordsAffected.toLocaleString()} records</Typography>
                      <Typography variant="caption" fontWeight={700} color="text.primary">{fmtSize(p.sizeMB)}</Typography>
                    </Stack>
                  </Stack>
                  <LinearProgress
                    variant="determinate"
                    value={pct}
                    sx={{
                      height: 6, borderRadius: 3,
                      bgcolor: "action.hover",
                      "& .MuiLinearProgress-bar": { bgcolor: meta.color, borderRadius: 3 },
                    }}
                  />
                </Box>
              );
            })}
        </Stack>
      </SectionCard>

      {/* ── Retention policies table ─────────────────────── */}
      <SectionCard
        icon={<ScheduleOutlinedIcon sx={{ fontSize: 18, color: "#fff" }} />}
        title="Retention Policies"
        subtitle="Per-category data lifecycle rules — click Configure to edit"
      >
        <TableContainer sx={{ borderRadius: 1.5, border: "1px solid", borderColor: "divider" }}>
          <Table size="small">
            <TableHead>
              <TableRow sx={{ bgcolor: "action.hover" }}>
                <TableCell sx={{ fontWeight: 700, fontSize: "0.75rem" }}>Category</TableCell>
                <TableCell sx={{ fontWeight: 700, fontSize: "0.75rem" }}>Retention</TableCell>
                <TableCell sx={{ fontWeight: 700, fontSize: "0.75rem" }}>Auto-Delete</TableCell>
                <TableCell sx={{ fontWeight: 700, fontSize: "0.75rem" }}>Archive First</TableCell>
                <TableCell sx={{ fontWeight: 700, fontSize: "0.75rem" }}>Last Run</TableCell>
                <TableCell sx={{ fontWeight: 700, fontSize: "0.75rem" }}>Next Run</TableCell>
                <TableCell sx={{ fontWeight: 700, fontSize: "0.75rem" }}>Size</TableCell>
                <TableCell sx={{ fontWeight: 700, fontSize: "0.75rem" }}>Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {policies.map((p) => {
                const meta = CATEGORY_META[p.category];
                return (
                  <TableRow key={p.id} hover sx={{ "&:last-child td": { borderBottom: 0 } }}>
                    {/* Category */}
                    <TableCell>
                      <Stack direction="row" alignItems="center" spacing={1}>
                        <Box sx={{ color: meta.color, display: "flex" }}>{meta.icon}</Box>
                        <Box>
                          <Typography variant="caption" fontWeight={600} color="text.primary" display="block">
                            {meta.label}
                          </Typography>
                          <Typography variant="caption" color="text.secondary">{meta.description}</Typography>
                        </Box>
                      </Stack>
                    </TableCell>

                    {/* Retention period */}
                    <TableCell>
                      <Chip
                        label={`${p.retentionDays}d`}
                        size="small"
                        variant="outlined"
                        sx={{ fontSize: "0.7rem", height: 22, fontFamily: "monospace" }}
                      />
                    </TableCell>

                    {/* Auto-delete */}
                    <TableCell>
                      <Chip
                        label={p.autoDelete ? "On" : "Off"}
                        size="small"
                        color={p.autoDelete ? "success" : "default"}
                        variant={p.autoDelete ? "filled" : "outlined"}
                        sx={{ fontSize: "0.7rem", height: 22 }}
                      />
                    </TableCell>

                    {/* Archive first */}
                    <TableCell>
                      <Chip
                        label={p.archiveBeforeDelete ? "Yes" : "No"}
                        size="small"
                        color={p.archiveBeforeDelete ? "info" : "default"}
                        variant={p.archiveBeforeDelete ? "filled" : "outlined"}
                        sx={{ fontSize: "0.7rem", height: 22 }}
                      />
                    </TableCell>

                    {/* Last run */}
                    <TableCell>
                      <Typography variant="caption" sx={{ fontFamily: "monospace" }} color="text.secondary">
                        {fmtTs(p.lastRunAt)}
                      </Typography>
                    </TableCell>

                    {/* Next run */}
                    <TableCell>
                      <Typography variant="caption" sx={{ fontFamily: "monospace" }} color="primary.main">
                        {fmtTs(p.nextRunAt)}
                      </Typography>
                    </TableCell>

                    {/* Size */}
                    <TableCell>
                      <Typography variant="caption" fontWeight={600}>{fmtSize(p.sizeMB)}</Typography>
                    </TableCell>

                    {/* Actions */}
                    <TableCell>
                      <Stack direction="row" spacing={0.5}>
                        <Button
                          size="small"
                          variant="outlined"
                          onClick={() => openEdit(p)}
                          sx={{ fontSize: "0.68rem", py: 0.25, minWidth: 72 }}
                        >
                          Configure
                        </Button>
                        <Tooltip title="Run purge now">
                          <IconButton
                            size="small"
                            color="error"
                            onClick={() => setPurgeTarget(p)}
                            disabled={!p.autoDelete}
                          >
                            <DeleteOutlineOutlinedIcon fontSize="small" />
                          </IconButton>
                        </Tooltip>
                      </Stack>
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </TableContainer>
      </SectionCard>

      {/* ── Purge job history ────────────────────────────── */}
      <SectionCard
        icon={<InfoOutlinedIcon sx={{ fontSize: 18, color: "#fff" }} />}
        title="Purge Job History"
        subtitle="Recent and upcoming scheduled data deletion runs"
      >
        <TableContainer sx={{ borderRadius: 1.5, border: "1px solid", borderColor: "divider" }}>
          <Table size="small">
            <TableHead>
              <TableRow sx={{ bgcolor: "action.hover" }}>
                <TableCell sx={{ fontWeight: 700, fontSize: "0.75rem" }}>Category</TableCell>
                <TableCell sx={{ fontWeight: 700, fontSize: "0.75rem" }}>Status</TableCell>
                <TableCell sx={{ fontWeight: 700, fontSize: "0.75rem" }}>Started At</TableCell>
                <TableCell sx={{ fontWeight: 700, fontSize: "0.75rem" }}>Completed At</TableCell>
                <TableCell sx={{ fontWeight: 700, fontSize: "0.75rem" }}>Records Deleted</TableCell>
                <TableCell sx={{ fontWeight: 700, fontSize: "0.75rem" }}>Size Freed</TableCell>
                <TableCell sx={{ fontWeight: 700, fontSize: "0.75rem" }}>Triggered By</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {paginatedJobs.map((j) => {
                const { label: sLabel, color: sColor } = JOB_STATUS_META[j.status];
                const meta = CATEGORY_META[j.category];
                return (
                  <TableRow key={j.id} hover sx={{ "&:last-child td": { borderBottom: 0 } }}>
                    <TableCell>
                      <Stack direction="row" alignItems="center" spacing={1}>
                        <Box sx={{ color: meta.color, display: "flex" }}>{meta.icon}</Box>
                        <Typography variant="caption" fontWeight={600}>{meta.label}</Typography>
                      </Stack>
                    </TableCell>
                    <TableCell>
                      <Chip
                        label={sLabel}
                        size="small"
                        color={sColor}
                        variant="outlined"
                        sx={{ fontSize: "0.7rem", height: 22 }}
                      />
                    </TableCell>
                    <TableCell>
                      <Typography variant="caption" sx={{ fontFamily: "monospace" }}>{fmtTs(j.startedAt)}</Typography>
                    </TableCell>
                    <TableCell>
                      <Typography variant="caption" sx={{ fontFamily: "monospace" }} color={j.completedAt ? "text.primary" : "text.secondary"}>
                        {fmtTs(j.completedAt)}
                      </Typography>
                    </TableCell>
                    <TableCell>
                      <Typography variant="caption">{j.recordsDeleted > 0 ? j.recordsDeleted.toLocaleString() : "—"}</Typography>
                    </TableCell>
                    <TableCell>
                      <Typography variant="caption" fontWeight={600}>{j.sizeMB > 0 ? fmtSize(j.sizeMB) : "—"}</Typography>
                    </TableCell>
                    <TableCell>
                      <Typography variant="caption" color="text.secondary">{j.triggeredBy}</Typography>
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </TableContainer>

        <TablePagination
          component="div"
          count={jobs.length}
          page={page}
          onPageChange={(_, p) => setPage(p)}
          rowsPerPage={rowsPerPage}
          onRowsPerPageChange={(e) => { setRows(parseInt(e.target.value, 10)); setPage(0); }}
          rowsPerPageOptions={[5, 10, 25]}
          sx={{ mt: 1, "& .MuiTablePagination-toolbar": { minHeight: 44 } }}
        />
      </SectionCard>

      {/* ── Edit policy dialog ───────────────────────────── */}
      <Dialog open={!!editTarget} onClose={() => setEditTarget(null)} maxWidth="sm" fullWidth>
        <DialogTitle sx={{ fontWeight: 700 }}>
          Configure — {editTarget ? CATEGORY_META[editTarget.category].label : ""}
        </DialogTitle>
        <DialogContent>
          <Stack spacing={3} mt={1}>
            {/* Retention period slider */}
            <Box>
              <Typography variant="body2" fontWeight={600} mb={1}>
                Retention Period: <strong>{draftDays} days</strong>
                {draftDays >= 365 && (
                  <Chip label={`≈ ${(draftDays / 365).toFixed(1)} yr`} size="small" sx={{ ml: 1, fontSize: "0.7rem", height: 20 }} />
                )}
              </Typography>
              <Slider
                value={draftDays}
                onChange={(_, v) => setDraftDays(v as number)}
                min={7}
                max={1825}
                step={30}
                marks={[
                  { value: 30,  label: "30d" },
                  { value: 90,  label: "90d" },
                  { value: 180, label: "6m"  },
                  { value: 365, label: "1yr" },
                  { value: 730, label: "2yr" },
                  { value: 1825,label: "5yr" },
                ]}
                valueLabelDisplay="auto"
                sx={{ mt: 1 }}
              />
            </Box>

            <Divider />

            <FormControlLabel
              control={<Switch checked={draftAuto} onChange={(e) => setDraftAuto(e.target.checked)} />}
              label={
                <Box>
                  <Typography variant="body2" fontWeight={600}>Auto-Delete</Typography>
                  <Typography variant="caption" color="text.secondary">
                    Automatically purge data older than the retention period on schedule.
                  </Typography>
                </Box>
              }
            />

            <FormControlLabel
              control={<Switch checked={draftArchive} onChange={(e) => setDraftArchive(e.target.checked)} />}
              label={
                <Box>
                  <Typography variant="body2" fontWeight={600}>Archive Before Deleting</Typography>
                  <Typography variant="caption" color="text.secondary">
                    Export data to cold storage archive before permanent deletion.
                  </Typography>
                </Box>
              }
            />
          </Stack>
        </DialogContent>
        <DialogActions sx={{ px: 3, pb: 2 }}>
          <Button onClick={() => setEditTarget(null)} size="small">Cancel</Button>
          <Button onClick={confirmEdit} size="small" variant="contained">Save Policy</Button>
        </DialogActions>
      </Dialog>

      {/* ── Purge confirmation dialog ────────────────────── */}
      <Dialog open={!!purgeTarget} onClose={() => setPurgeTarget(null)} maxWidth="xs" fullWidth>
        <DialogTitle sx={{ fontWeight: 700, color: "error.main" }}>Run Purge Now</DialogTitle>
        <DialogContent>
          <DialogContentText>
            This will immediately delete all <strong>{purgeTarget ? CATEGORY_META[purgeTarget.category].label : ""}</strong> records
            older than <strong>{purgeTarget?.retentionDays} days</strong> ({purgeTarget ? fmtSize(purgeTarget.sizeMB) : ""} estimated).
            This action cannot be undone.
          </DialogContentText>
        </DialogContent>
        <DialogActions sx={{ px: 3, pb: 2 }}>
          <Button onClick={() => setPurgeTarget(null)} size="small">Cancel</Button>
          <Button onClick={confirmPurge} size="small" color="error" variant="contained">
            Purge Now
          </Button>
        </DialogActions>
      </Dialog>
    </Stack>
  );
};

export default DataRetention;