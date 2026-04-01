import { useState, useMemo, useEffect, useCallback } from "react";
import {
  Box, Typography, Stack, Paper, Chip, Divider,
  Table, TableBody, TableCell, TableContainer, TableHead,
  TableRow, TablePagination, Tooltip, IconButton, Button,
  Alert, Slider, Switch, Dialog, DialogTitle,
  DialogContent, DialogContentText, DialogActions,
  LinearProgress, FormControlLabel, CircularProgress, Snackbar,
} from "@mui/material";
// Import with type-only imports to satisfy TypeScript config
import { 
  dataRetentionApi, 
  type RetentionPolicyResponse as PolicyResponse, 
  type PurgeJobResponse as JobResponse 
} from "../../../../api/security.api";
import StorageOutlinedIcon          from "@mui/icons-material/StorageOutlined";
import DeleteOutlineOutlinedIcon    from "@mui/icons-material/DeleteOutlineOutlined";
import ScheduleOutlinedIcon         from "@mui/icons-material/ScheduleOutlined";
import CheckCircleOutlineIcon       from "@mui/icons-material/CheckCircleOutline";
import WarningAmberOutlinedIcon     from "@mui/icons-material/WarningAmberOutlined";
import DownloadOutlinedIcon         from "@mui/icons-material/DownloadOutlined";
import RefreshOutlined             from "@mui/icons-material/RefreshOutlined";
import FingerprintOutlinedIcon      from "@mui/icons-material/FingerprintOutlined";
import EventNoteOutlinedIcon        from "@mui/icons-material/EventNoteOutlined";
import ManageSearchOutlinedIcon     from "@mui/icons-material/ManageSearchOutlined";
import VerifiedUserOutlinedIcon     from "@mui/icons-material/VerifiedUserOutlined";
import VideoLibraryOutlinedIcon     from "@mui/icons-material/VideoLibraryOutlined";
import InfoOutlinedIcon             from "@mui/icons-material/InfoOutlined";

// ─── Types ────────────────────────────────────────────────────────────────────

type DataCategory =
  | "biometric_embeddings"
  | "attendance_records"
  | "audit_logs"
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
  nextRunAt: string | null;
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
  errorMessage: string | null;
}

// ─── Transform functions ──────────────────────────────────────────────────────

const transformPolicy = (p: PolicyResponse): RetentionPolicy => ({
  id: p.id,
  category: p.category as DataCategory,
  retentionDays: p.retention_days,
  autoDelete: p.auto_delete,
  archiveBeforeDelete: p.archive_before_delete,
  lastRunAt: p.last_run_at,
  nextRunAt: p.next_run_at,
  recordsAffected: p.records_affected,
  sizeMB: p.size_mb,
});

const transformJob = (j: JobResponse): PurgeJob => ({
  id: j.id,
  category: j.category as DataCategory,
  status: j.status as JobStatus,
  startedAt: j.started_at,
  completedAt: j.completed_at,
  recordsDeleted: j.records_deleted,
  sizeMB: j.size_mb,
  triggeredBy: j.triggered_by,
  errorMessage: j.error_message,
});

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

const CATEGORY_META: Record<string, { label: string; description: string; icon: React.ReactNode; color: string }> = {
  biometric_embeddings: { label: "Biometric Embeddings", description: "Face encoding vectors per user",       icon: <FingerprintOutlinedIcon   sx={{ fontSize: 16 }} />, color: "#7C5CBF" },
  attendance_records:   { label: "Attendance Records",   description: "Daily check-in/check-out logs",        icon: <EventNoteOutlinedIcon     sx={{ fontSize: 16 }} />, color: "#2196F3" },
  audit_logs:           { label: "Audit Logs",           description: "Admin action event trail",             icon: <ManageSearchOutlinedIcon  sx={{ fontSize: 16 }} />, color: "#FF9800" },
  consent_records:      { label: "Consent Records",      description: "User privacy consent history",         icon: <VerifiedUserOutlinedIcon  sx={{ fontSize: 16 }} />, color: "#4CAF50" },
  camera_snapshots:     { label: "Camera Snapshots",     description: "Recognition event frame captures",     icon: <VideoLibraryOutlinedIcon  sx={{ fontSize: 16 }} />, color: "#00BCD4" },
};

const DEFAULT_CATEGORY_META = { label: "Unknown", description: "Unknown category", icon: <StorageOutlinedIcon sx={{ fontSize: 16 }} />, color: "#9E9E9E" };

const getCategoryMeta = (category: string) => CATEGORY_META[category] || DEFAULT_CATEGORY_META;

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
  const [policies, setPolicies]         = useState<RetentionPolicy[]>([]);
  const [jobs, setJobs]                 = useState<PurgeJob[]>([]);
  const [loading, setLoading]           = useState(true);
  const [saving, setSaving]             = useState(false);
  const [page, setPage]                 = useState(0);
  const [rowsPerPage, setRows]          = useState(10);
  const [editTarget, setEditTarget]     = useState<RetentionPolicy | null>(null);
  const [purgeTarget, setPurgeTarget]   = useState<RetentionPolicy | null>(null);
  const [draftDays, setDraftDays]       = useState(90);
  const [draftAuto, setDraftAuto]       = useState(true);
  const [draftArchive, setDraftArchive] = useState(false);
  const [snackbar, setSnackbar]         = useState<{ open: boolean; message: string; severity: "success" | "error" }>({ open: false, message: "", severity: "success" });

  const fetchData = useCallback(async (autoInit = false) => {
    try {
      setLoading(true);
      let [policiesRes, jobsRes] = await Promise.all([
        dataRetentionApi.listPolicies(),
        dataRetentionApi.listPurgeJobs(),
      ]);
      
      // If no policies exist and autoInit is enabled, initialize defaults
      if (policiesRes.length === 0 && autoInit) {
        await dataRetentionApi.initializePolicies();
        policiesRes = await dataRetentionApi.listPolicies();
      }
      
      setPolicies(policiesRes.map(transformPolicy));
      setJobs(jobsRes.map(transformJob));
    } catch (error) {
      console.error("Failed to fetch data retention data:", error);
      setSnackbar({ open: true, message: "Failed to load data retention policies", severity: "error" });
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchData(true); // Auto-initialize on first load
  }, [fetchData]);

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

  const confirmEdit = async () => {
    if (!editTarget) return;
    try {
      setSaving(true);
      const updated = await dataRetentionApi.updatePolicy(editTarget.id, {
        retention_days: draftDays,
        auto_delete: draftAuto,
        archive_before_delete: draftArchive,
      });
      setPolicies((prev) =>
        prev.map((p) => (p.id === editTarget.id ? transformPolicy(updated) : p))
      );
      setSnackbar({ open: true, message: "Policy updated successfully", severity: "success" });
      setEditTarget(null);
    } catch (error) {
      console.error("Failed to update policy:", error);
      setSnackbar({ open: true, message: "Failed to update policy", severity: "error" });
    } finally {
      setSaving(false);
    }
  };

  const confirmPurge = async () => {
    if (!purgeTarget) return;
    try {
      setSaving(true);
      await dataRetentionApi.triggerPurge(purgeTarget.id);
      setSnackbar({ open: true, message: `Purge job scheduled for ${getCategoryMeta(purgeTarget.category).label}`, severity: "success" });
      setPurgeTarget(null);
      // Refresh jobs list
      const jobsRes = await dataRetentionApi.listPurgeJobs();
      setJobs(jobsRes.map(transformJob));
    } catch (error) {
      console.error("Failed to trigger purge:", error);
      setSnackbar({ open: true, message: "Failed to trigger purge job", severity: "error" });
    } finally {
      setSaving(false);
    }
  };

  const handleExport = () => {
    const headers = ["Category", "Retention (days)", "Auto-Delete", "Archive First", "Last Run", "Next Run", "Records", "Size"];
    const rows = policies.map((p) => [
      getCategoryMeta(p.category).label,
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

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight={300}>
        <CircularProgress />
      </Box>
    );
  }

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
            <IconButton size="small" sx={{ color: "text.secondary" }} onClick={() => fetchData(false)} disabled={loading}>
              <RefreshOutlined fontSize="small" />
            </IconButton>
          </Tooltip>
          <Button
            size="small"
            variant="outlined"
            startIcon={<DownloadOutlinedIcon />}
            onClick={handleExport}
            sx={{ fontSize: "0.75rem" }}
            disabled={policies.length === 0}
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
              const meta = getCategoryMeta(p.category);
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
                const meta = getCategoryMeta(p.category);
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
                const statusMeta = JOB_STATUS_META[j.status] || { label: j.status, color: "info" as const };
                const meta = getCategoryMeta(j.category);
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
                        label={statusMeta.label}
                        size="small"
                        color={statusMeta.color}
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
          onPageChange={(_, newPage: number) => setPage(newPage)}
          rowsPerPage={rowsPerPage}
          onRowsPerPageChange={(event: React.ChangeEvent<HTMLInputElement>) => { 
            setRows(parseInt(event.target.value, 10)); 
            setPage(0); 
          }}
          rowsPerPageOptions={[5, 10, 25]}
          sx={{ mt: 1, "& .MuiTablePagination-toolbar": { minHeight: 44 } }}
        />
      </SectionCard>

      {/* ── Edit policy dialog ───────────────────────────── */}
      <Dialog open={!!editTarget} onClose={() => setEditTarget(null)} maxWidth="sm" fullWidth>
        <DialogTitle sx={{ fontWeight: 700 }}>
          Configure — {editTarget ? getCategoryMeta(editTarget.category).label : ""}
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
              control={<Switch checked={draftAuto} onChange={(event: React.ChangeEvent<HTMLInputElement>) => setDraftAuto(event.target.checked)} />}
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
              control={<Switch checked={draftArchive} onChange={(event: React.ChangeEvent<HTMLInputElement>) => setDraftArchive(event.target.checked)} />}
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
          <Button onClick={() => setEditTarget(null)} size="small" disabled={saving}>Cancel</Button>
          <Button onClick={confirmEdit} size="small" variant="contained" disabled={saving}>
            {saving ? <CircularProgress size={16} /> : "Save Policy"}
          </Button>
        </DialogActions>
      </Dialog>

      {/* ── Purge confirmation dialog ────────────────────── */}
      <Dialog open={!!purgeTarget} onClose={() => setPurgeTarget(null)} maxWidth="xs" fullWidth>
        <DialogTitle sx={{ fontWeight: 700, color: "error.main" }}>Run Purge Now</DialogTitle>
        <DialogContent>
          <DialogContentText>
            This will immediately delete all <strong>{purgeTarget ? getCategoryMeta(purgeTarget.category).label : ""}</strong> records
            older than <strong>{purgeTarget?.retentionDays} days</strong> ({purgeTarget ? fmtSize(purgeTarget.sizeMB) : ""} estimated).
            This action cannot be undone.
          </DialogContentText>
        </DialogContent>
        <DialogActions sx={{ px: 3, pb: 2 }}>
          <Button onClick={() => setPurgeTarget(null)} size="small" disabled={saving}>Cancel</Button>
          <Button onClick={confirmPurge} size="small" color="error" variant="contained" disabled={saving}>
            {saving ? <CircularProgress size={16} /> : "Purge Now"}
          </Button>
        </DialogActions>
      </Dialog>

      {/* ── Snackbar for notifications ───────────────────── */}
      <Snackbar
        open={snackbar.open}
        autoHideDuration={4000}
        onClose={() => setSnackbar({ ...snackbar, open: false })}
        anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
      >
        <Alert
          onClose={() => setSnackbar({ ...snackbar, open: false })}
          severity={snackbar.severity}
          sx={{ width: "100%" }}
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Stack>
  );
};

export default DataRetention;