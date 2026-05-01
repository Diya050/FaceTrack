import { useEffect, useState } from "react";
import {
  Box,Typography,Stack,Paper,Button,Divider,
  Select,MenuItem,InputLabel,FormControl,
  Chip,Alert,Tooltip,TextField,Dialog,DialogTitle,DialogContent,
  DialogContentText,DialogActions,CircularProgress,
} from "@mui/material";
import StorageOutlinedIcon          from "@mui/icons-material/StorageOutlined";
import DeleteSweepOutlinedIcon       from "@mui/icons-material/DeleteSweepOutlined";
import LockOutlinedIcon              from "@mui/icons-material/LockOutlined";
import ScheduleOutlinedIcon          from "@mui/icons-material/ScheduleOutlined";
import DownloadOutlinedIcon          from "@mui/icons-material/DownloadOutlined";
import TableChartOutlinedIcon        from "@mui/icons-material/TableChartOutlined";
import BubbleChartOutlinedIcon       from "@mui/icons-material/BubbleChartOutlined";
import BackupOutlinedIcon            from "@mui/icons-material/BackupOutlined";
import WarningAmberOutlinedIcon      from "@mui/icons-material/WarningAmberOutlined";
import SaveOutlinedIcon              from "@mui/icons-material/SaveOutlined";
import RestartAltOutlinedIcon        from "@mui/icons-material/RestartAltOutlined";
import InfoOutlinedIcon              from "@mui/icons-material/InfoOutlined";
import DeleteForeverOutlinedIcon     from "@mui/icons-material/DeleteForeverOutlined";
import AutoDeleteOutlinedIcon        from "@mui/icons-material/AutoDeleteOutlined";
import api from "../../../../services/api";
import { downloadBlob } from "../../../../utils/downloadBlob";
// Types 
interface RetentionSettings {
  unrecognizedFaceDays: number;
  attendanceArchiveYears: number;
  embeddingCleanupMonths: number;
}

interface StorageBackupConfig {
  retention: RetentionSettings;
}

interface RetentionPolicyResponse {
  id: string;
  category: string;
  retention_days: number;
  auto_delete: boolean;
  archive_before_delete: boolean;
}

const CAMERA_SNAPSHOTS_CATEGORY = "camera_snapshots";
const ATTENDANCE_RECORDS_CATEGORY = "attendance_records";
const BIOMETRIC_EMBEDDINGS_CATEGORY = "biometric_embeddings";

const INITIAL_RETENTION: RetentionSettings = {
  unrecognizedFaceDays:    14,
  attendanceArchiveYears:  1,
  embeddingCleanupMonths:  6,
};

const cloneRetention = () => ({ ...INITIAL_RETENTION });

// Sub-components 

interface SectionCardProps {
  icon: React.ReactNode;
  title: string;
  subtitle: string;
  children: React.ReactNode;
  badge?: React.ReactNode;
}

const SectionCard = ({ icon, title, subtitle, children, badge }: SectionCardProps) => (
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
      {badge}
    </Stack>
    <Box p={2.5}>{children}</Box>
  </Paper>
);

//  Confirm Dialog 

interface ConfirmDialogProps {
  open: boolean;
  title: string;
  body: string;
  confirmLabel?: string;
  onConfirm: () => void;
  onCancel: () => void;
  loading?: boolean;
  severity?: "error" | "warning";
}

const ConfirmDialog = ({
  open, title, body, confirmLabel = "Confirm", onConfirm, onCancel, loading, severity = "error",
}: ConfirmDialogProps) => (
  <Dialog open={open} onClose={onCancel} maxWidth="xs" fullWidth>
    <DialogTitle sx={{ display: "flex", alignItems: "center", gap: 1 }}>
      <WarningAmberOutlinedIcon color={severity} />
      {title}
    </DialogTitle>
    <DialogContent>
      <DialogContentText>{body}</DialogContentText>
    </DialogContent>
    <DialogActions>
      <Button onClick={onCancel} disabled={loading}>Cancel</Button>
      <Button
        variant="contained"
        color={severity}
        onClick={onConfirm}
        disabled={loading}
        startIcon={loading ? <CircularProgress size={14} color="inherit" /> : undefined}
      >
        {loading ? "Processing…" : confirmLabel}
      </Button>
    </DialogActions>
  </Dialog>
);

//  Main Component 

const StorageBackup = () => {
  //  Retention state 
  const [retention, setRetention] = useState<RetentionSettings>(cloneRetention);
  const [retentionSaved, setRetentionSaved] = useState(false);

  //  Backend sync state
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [notificationConfigRoot, setNotificationConfigRoot] = useState<Record<string, unknown>>({});
  const [retentionPolicyIds, setRetentionPolicyIds] = useState<{
    cameraSnapshots?: string;
    attendanceRecords?: string;
    biometricEmbeddings?: string;
  }>({});

  //  Export loading
  const [exporting, setExporting] = useState<string | null>(null);

  // Danger confirm dialogs
  const [confirmPurge, setConfirmPurge]   = useState(false);
  const [confirmReset, setConfirmReset]   = useState(false);
  const [dangerLoading, setDangerLoading] = useState<string | null>(null);

  // Saved alert
  const [savedAlert, setSavedAlert] = useState(false);

  const syncRetentionPolicies = (policies: RetentionPolicyResponse[]) => {
    const cameraPolicy = policies.find((p) => p.category === CAMERA_SNAPSHOTS_CATEGORY);
    const attendancePolicy = policies.find((p) => p.category === ATTENDANCE_RECORDS_CATEGORY);
    const embeddingsPolicy = policies.find((p) => p.category === BIOMETRIC_EMBEDDINGS_CATEGORY);

    setRetentionPolicyIds({
      cameraSnapshots: cameraPolicy?.id,
      attendanceRecords: attendancePolicy?.id,
      biometricEmbeddings: embeddingsPolicy?.id,
    });

    setRetention((prev) => ({
      ...prev,
      unrecognizedFaceDays:
        typeof cameraPolicy?.retention_days === "number"
          ? cameraPolicy.retention_days
          : prev.unrecognizedFaceDays,
      attendanceArchiveYears:
        typeof attendancePolicy?.retention_days === "number"
          ? Math.max(1, Math.round(attendancePolicy.retention_days / 365))
          : prev.attendanceArchiveYears,
      embeddingCleanupMonths:
        typeof embeddingsPolicy?.retention_days === "number"
          ? Math.max(1, Math.round(embeddingsPolicy.retention_days / 30))
          : prev.embeddingCleanupMonths,
    }));
  };

  const loadRetentionPolicies = async () => {
    try {
      const { data } = await api.get("/data-retention/policies");
      const policies = Array.isArray(data) ? (data as RetentionPolicyResponse[]) : [];

      if (policies.length === 0) {
        await api.post("/data-retention/policies/initialize");
        const initialized = await api.get("/data-retention/policies");
        const initializedPolicies = Array.isArray(initialized.data)
          ? (initialized.data as RetentionPolicyResponse[])
          : [];
        syncRetentionPolicies(initializedPolicies);
        return;
      }

      syncRetentionPolicies(policies);
    } catch {
      // Keep notification_config fallback settings when retention API is unavailable.
    }
  };

  useEffect(() => {
    setLoading(true);
    setError("");

    api
      .get("/organizations/me")
      .then(({ data }) => {
        let notificationConfig: Record<string, unknown> = {};
        if (data.notification_config && typeof data.notification_config === "object") {
          notificationConfig = data.notification_config as Record<string, unknown>;
        } else if (typeof data.notification_config === "string") {
          try {
            const parsed = JSON.parse(data.notification_config);
            notificationConfig =
              parsed && typeof parsed === "object"
                ? (parsed as Record<string, unknown>)
                : {};
          } catch {
            notificationConfig = {};
          }
        }

        setNotificationConfigRoot(notificationConfig);

        const storageConfig = notificationConfig.storage_backup as StorageBackupConfig | undefined;
        if (storageConfig && typeof storageConfig === "object") {
          const incomingRetention = storageConfig.retention || cloneRetention();
          setRetention({
            unrecognizedFaceDays: Number(incomingRetention.unrecognizedFaceDays) || INITIAL_RETENTION.unrecognizedFaceDays,
            attendanceArchiveYears: Number(incomingRetention.attendanceArchiveYears) || INITIAL_RETENTION.attendanceArchiveYears,
            embeddingCleanupMonths: Number(incomingRetention.embeddingCleanupMonths) || INITIAL_RETENTION.embeddingCleanupMonths,
          });
        } else {
          setRetention(cloneRetention());
        }
      })
      .catch(() => {
        setError("Failed to load storage and backup settings from backend.");
      })
      .finally(() => {
        setLoading(false);
      });

    void loadRetentionPolicies();
  }, []);

  const persistStorageBackup = (
    nextRetention: RetentionSettings,
    showSavedMessage = false,
  ) => {
    setSaving(true);
    setError("");

    const existingStorageBackup =
      notificationConfigRoot.storage_backup &&
      typeof notificationConfigRoot.storage_backup === "object"
        ? (notificationConfigRoot.storage_backup as Record<string, unknown>)
        : {};

    const nextNotificationConfig = {
      ...notificationConfigRoot,
      storage_backup: {
        ...existingStorageBackup,
        retention: nextRetention,
      },
    };

    api
      .put("/organizations/me", {
        notification_config: nextNotificationConfig,
      })
      .then(() => {
        setNotificationConfigRoot(nextNotificationConfig);
        if (showSavedMessage) {
          setSavedAlert(true);
          setTimeout(() => setSavedAlert(false), 3500);
        }
      })
      .catch(() => {
        setError("Failed to save storage and backup settings.");
      })
      .finally(() => {
        setSaving(false);
      });
  };

  //  Handlers 

  const setRet = <K extends keyof RetentionSettings>(k: K, v: RetentionSettings[K]) => {
    setRetentionSaved(false);
    setRetention((prev) => ({ ...prev, [k]: v }));
  };

  const handleSaveRetention = () => {
    const { cameraSnapshots, attendanceRecords, biometricEmbeddings } = retentionPolicyIds;

    if (!cameraSnapshots || !attendanceRecords || !biometricEmbeddings) {
      setError("Retention policies are unavailable for this account.");
      return;
    }

    setSaving(true);
    setError("");

    Promise.all([
      api.put(`/data-retention/policies/${cameraSnapshots}`, {
        retention_days: retention.unrecognizedFaceDays,
        auto_delete: true,
        archive_before_delete: false,
      }),
      api.put(`/data-retention/policies/${attendanceRecords}`, {
        retention_days: retention.attendanceArchiveYears * 365,
        auto_delete: true,
        archive_before_delete: true,
      }),
      api.put(`/data-retention/policies/${biometricEmbeddings}`, {
        retention_days: retention.embeddingCleanupMonths * 30,
        auto_delete: true,
        archive_before_delete: true,
      }),
    ])
      .then(() => {
        persistStorageBackup(retention, true);
        setRetentionSaved(true);
      })
      .catch(() => {
        setError("Failed to save retention policies to backend.");
      })
      .finally(() => {
        setSaving(false);
      });
  };

  const handleResetRetention = () => {
    setRetention(cloneRetention());
    setRetentionSaved(false);
  };

  const resolveFileName = (headerValue: string | undefined, fallback: string) => {
    if (!headerValue) {
      return fallback;
    }

    const match = /filename=\"?([^\";]+)\"?/i.exec(headerValue);
    return match?.[1] || fallback;
  };

  const handleExport = async (type: string) => {
    setExporting(type);
    setError("");

    try {
      if (type === "attendance-csv") {
        const response = await api.get("/analytics/export-logs", {
          params: { format: "csv" },
          responseType: "blob",
        });

        const fallbackName = `attendance_${new Date().toISOString().slice(0, 10)}.csv`;
        const filename = resolveFileName(response.headers["content-disposition"], fallbackName);
        downloadBlob(response.data as Blob, filename);
      } else if (type === "attendance-json") {
        const response = await api.get("/data-retention/exports/attendance", {
          params: { format: "json" },
          responseType: "blob",
        });

        const fallbackName = `attendance_${new Date().toISOString().slice(0, 10)}.json`;
        const filename = resolveFileName(response.headers["content-disposition"], fallbackName);
        downloadBlob(response.data as Blob, filename);
      } else if (type === "embeddings") {
        const response = await api.get("/data-retention/exports/embeddings", {
          responseType: "blob",
        });

        const fallbackName = `embeddings_${new Date().toISOString().slice(0, 10)}.json`;
        const filename = resolveFileName(response.headers["content-disposition"], fallbackName);
        downloadBlob(response.data as Blob, filename);
      } else if (type === "sql-dump") {
        const response = await api.get("/data-retention/exports/sql-dump", {
          responseType: "blob",
        });

        const fallbackName = `org_snapshot_${new Date().toISOString().slice(0, 10)}.sql`;
        const filename = resolveFileName(response.headers["content-disposition"], fallbackName);
        downloadBlob(response.data as Blob, filename);
      } else {
        setError("This export option is not available in backend yet.");
      }
    } catch {
      setError("Failed to export data from backend.");
    } finally {
      setExporting(null);
    }
  };

  const handlePurge = () => {
    const policyId = retentionPolicyIds.cameraSnapshots;
    if (!policyId) {
      setError("Unrecognized media purge policy is unavailable.");
      return;
    }

    setDangerLoading("purge");

    api
      .post(`/data-retention/policies/${policyId}/purge`)
      .then(() => {
        persistStorageBackup(retention);
        setConfirmPurge(false);
      })
      .catch(() => {
        setError("Failed to trigger purge job in backend.");
      })
      .finally(() => {
        setDangerLoading(null);
      });
  };

  const handleHardReset = () => {
    const policyId = retentionPolicyIds.biometricEmbeddings;
    if (!policyId) {
      setError("Embedding reset policy is unavailable.");
      return;
    }

    setDangerLoading("reset");

    api
      .post(`/data-retention/policies/${policyId}/purge`)
      .then(() => {
        setConfirmReset(false);
      })
      .catch(() => {
        setError("Failed to trigger embedding reset in backend.");
      })
      .finally(() => {
        setDangerLoading(null);
      });
  };

  //  Render 

  return (
    <Box>
      {/* Page Header  */}
      <Stack direction="row" alignItems="center" spacing={1.5} mb={3}>
        <Box
          sx={{
            width: 40, height: 40, borderRadius: 2, bgcolor: "primary.main",
            display: "flex", alignItems: "center", justifyContent: "center",
          }}
        >
          <StorageOutlinedIcon sx={{ color: "white", fontSize: 20 }} />
        </Box>
        <Box>
          <Typography variant="h6" fontWeight={700} color="text.primary">
            Storage & Backup
          </Typography>
          <Typography variant="caption" color="text.secondary">
            Manage retention policies, data exports, and emergency overrides
          </Typography>
        </Box>
      </Stack>

      {savedAlert && (
        <Alert severity="success" sx={{ mb: 2.5, borderRadius: 2 }} onClose={() => setSavedAlert(false)}>
          Retention policy saved — pg_cron will apply the updated schedule automatically.
        </Alert>
      )}

      {error && (
        <Alert severity="error" sx={{ mb: 2.5, borderRadius: 2 }}>
          {error}
        </Alert>
      )}

      <Stack spacing={3}>

        {/*  1. AUTOMATED RETENTION POLICIES */}
        <SectionCard
          icon={<ScheduleOutlinedIcon sx={{ color: "white", fontSize: 18 }} />}
          title="Automated Retention Policies"
          subtitle="Powered by pg_cron — settings are persisted to the system_settings table"
          badge={
            <Chip
              label="pg_cron"
              size="small"
              color="secondary"
              variant="outlined"
              sx={{ fontWeight: 600 }}
            />
          }
        >
          <Stack spacing={2.5}>

            {/* Unrecognized Faces Retention */}
            <Paper variant="outlined" sx={{ p: 2, borderRadius: 1.5, borderColor: "divider" }}>
              <Stack direction="row" alignItems="center" spacing={1} mb={0.5}>
                <AutoDeleteOutlinedIcon sx={{ fontSize: 17, color: "primary.main" }} />
                <Typography variant="subtitle2" fontWeight={600}>
                  Unrecognized Face Retention
                </Typography>
                <Tooltip
                  title="pg_cron will auto-delete rows older than the selected duration and remove associated bucket files from unrecognized-faces"
                  arrow
                >
                  <InfoOutlinedIcon sx={{ fontSize: 15, color: "text.secondary", cursor: "pointer" }} />
                </Tooltip>
              </Stack>
              <Typography variant="caption" color="text.secondary" display="block" mb={1.5}>
                Auto-delete captured frames of unknown persons after the selected period.
              </Typography>
              <FormControl size="small" sx={{ minWidth: 200 }}>
                <InputLabel>Retention Period</InputLabel>
                <Select
                  value={retention.unrecognizedFaceDays}
                  label="Retention Period"
                  onChange={(e) => setRet("unrecognizedFaceDays", Number(e.target.value))}
                >
                  <MenuItem value={7}>7 Days</MenuItem>
                  <MenuItem value={14}>14 Days</MenuItem>
                  <MenuItem value={30}>30 Days</MenuItem>
                  <MenuItem value={60}>60 Days</MenuItem>
                  <MenuItem value={90}>90 Days</MenuItem>
                </Select>
              </FormControl>
            </Paper>

            {/* Attendance Log Archiving */}
            <Paper variant="outlined" sx={{ p: 2, borderRadius: 1.5, borderColor: "divider" }}>
              <Stack direction="row" alignItems="center" spacing={1} mb={0.5}>
                <TableChartOutlinedIcon sx={{ fontSize: 17, color: "primary.main" }} />
                <Typography variant="subtitle2" fontWeight={600}>
                  Attendance Log Archiving
                </Typography>
                <Tooltip
                  title="Attendance records older than the configured threshold will be moved to a cold-storage archive table"
                  arrow
                >
                  <InfoOutlinedIcon sx={{ fontSize: 15, color: "text.secondary", cursor: "pointer" }} />
                </Tooltip>
              </Stack>
              <Typography variant="caption" color="text.secondary" display="block" mb={1.5}>
                Archive attendance records older than the specified number of years.
              </Typography>
              <Stack direction="row" alignItems="center" spacing={1.5}>
                <Typography variant="body2" color="text.secondary">Archive records older than</Typography>
                <TextField
                  size="small"
                  type="number"
                  value={retention.attendanceArchiveYears}
                  onChange={(e) =>
                    setRet("attendanceArchiveYears", Math.max(1, Number(e.target.value)))
                  }
                  inputProps={{ min: 1, max: 10, style: { width: 52, textAlign: "center" } }}
                  sx={{ "& .MuiOutlinedInput-root": { borderRadius: 1.5 } }}
                />
                <Typography variant="body2" color="text.secondary">
                  {retention.attendanceArchiveYears === 1 ? "year" : "years"}
                </Typography>
              </Stack>
            </Paper>

            {/* Embedding Cleanup */}
            <Paper variant="outlined" sx={{ p: 2, borderRadius: 1.5, borderColor: "divider" }}>
              <Stack direction="row" alignItems="center" spacing={1} mb={0.5}>
                <BubbleChartOutlinedIcon sx={{ fontSize: 17, color: "primary.main" }} />
                <Typography variant="subtitle2" fontWeight={600}>
                  pgvector Embedding Cleanup
                </Typography>
                <Tooltip
                  title="Removes stored face embeddings for users who have had no activity. They will be re-enrolled on next face scan."
                  arrow
                >
                  <InfoOutlinedIcon sx={{ fontSize: 15, color: "text.secondary", cursor: "pointer" }} />
                </Tooltip>
              </Stack>
              <Typography variant="caption" color="text.secondary" display="block" mb={1.5}>
                Delete pgvector embeddings for inactive users after the configured period.
              </Typography>
              <Stack direction="row" alignItems="center" spacing={1.5}>
                <Typography variant="body2" color="text.secondary">Delete embeddings after</Typography>
                <FormControl size="small" sx={{ minWidth: 160 }}>
                  <InputLabel>Inactivity Threshold</InputLabel>
                  <Select
                    value={retention.embeddingCleanupMonths}
                    label="Inactivity Threshold"
                    onChange={(e) => setRet("embeddingCleanupMonths", Number(e.target.value))}
                  >
                    <MenuItem value={3}>3 months</MenuItem>
                    <MenuItem value={6}>6 months</MenuItem>
                    <MenuItem value={12}>12 months</MenuItem>
                    <MenuItem value={24}>24 months</MenuItem>
                  </Select>
                </FormControl>
                <Typography variant="body2" color="text.secondary">of inactivity</Typography>
              </Stack>
            </Paper>

          </Stack>

          {/* Save / Reset Row */}
          <Divider sx={{ my: 2.5 }} />
          <Stack direction="row" spacing={1.5} alignItems="center">
            <Button
              variant="contained"
              startIcon={<SaveOutlinedIcon />}
              onClick={handleSaveRetention}
              disabled={loading || saving || retentionSaved}
              sx={{ fontWeight: 600 }}
            >
              {retentionSaved ? "Saved" : "Save Retention Policy"}
            </Button>
            <Button
              variant="outlined"
              startIcon={<RestartAltOutlinedIcon />}
              onClick={handleResetRetention}
              disabled={loading || saving}
              color="inherit"
            >
              Reset Defaults
            </Button>
            {retentionSaved && (
              <Chip label="Policy active" color="success" size="small" sx={{ fontWeight: 600 }} />
            )}
          </Stack>
        </SectionCard>

        {/* 3. DATABASE EXPORTS & SNAPSHOTS */}
        <SectionCard
          icon={<DownloadOutlinedIcon sx={{ color: "white", fontSize: 18 }} />}
          title="Database Exports & Snapshots"
          subtitle="Pull local copies of attendance logs, vector embeddings, and full SQL dumps"
        >
          <Stack spacing={1.5}>

            {/* Export Attendance */}
            <Paper variant="outlined" sx={{ p: 2, borderRadius: 1.5, borderColor: "divider" }}>
              <Stack direction="row" alignItems="flex-start" spacing={1.5}>
                <TableChartOutlinedIcon sx={{ fontSize: 20, color: "primary.main", mt: 0.2 }} />
                <Box flex={1}>
                  <Typography variant="subtitle2" fontWeight={600} color="text.primary">
                    Export Attendance Data
                  </Typography>
                  <Typography variant="caption" color="text.secondary">
                    Download all attendance logs for offline HR backup.
                  </Typography>
                </Box>
                <Stack direction="row" spacing={1}>
                  <Button
                    size="small"
                    variant="outlined"
                    color="primary"
                    startIcon={
                      exporting === "attendance-csv" ? (
                        <CircularProgress size={13} color="inherit" />
                      ) : (
                        <DownloadOutlinedIcon />
                      )
                    }
                    onClick={() => handleExport("attendance-csv")}
                    disabled={exporting === "attendance-csv"}
                    sx={{ fontSize: "0.75rem" }}
                  >
                    CSV
                  </Button>
                  <Button
                    size="small"
                    variant="outlined"
                    color="primary"
                    startIcon={
                      exporting === "attendance-json" ? (
                        <CircularProgress size={13} color="inherit" />
                      ) : (
                        <DownloadOutlinedIcon />
                      )
                    }
                    onClick={() => handleExport("attendance-json")}
                    disabled={exporting === "attendance-json"}
                    sx={{ fontSize: "0.75rem" }}
                  >
                    JSON
                  </Button>
                </Stack>
              </Stack>
            </Paper>

            {/* Export Vector Embeddings */}
            <Paper variant="outlined" sx={{ p: 2, borderRadius: 1.5, borderColor: "divider" }}>
              <Stack direction="row" alignItems="flex-start" spacing={1.5}>
                <BubbleChartOutlinedIcon sx={{ fontSize: 20, color: "primary.main", mt: 0.2 }} />
                <Box flex={1}>
                  <Typography variant="subtitle2" fontWeight={600} color="text.primary">
                    Export Vector Embeddings
                  </Typography>
                  <Typography variant="caption" color="text.secondary">
                    Download raw pgvector data for local model retraining or disaster recovery.
                  </Typography>
                </Box>
                <Button
                  size="small"
                  variant="outlined"
                  color="primary"
                  startIcon={
                    exporting === "embeddings" ? (
                      <CircularProgress size={13} color="inherit" />
                    ) : (
                      <DownloadOutlinedIcon />
                    )
                  }
                  onClick={() => handleExport("embeddings")}
                  disabled={exporting === "embeddings"}
                  sx={{ fontSize: "0.75rem" }}
                >
                  {exporting === "embeddings" ? "Exporting…" : "Export (.json)"}
                </Button>
              </Stack>
            </Paper>

            {/* Manual SQL Dump */}
            <Paper variant="outlined" sx={{ p: 2, borderRadius: 1.5, borderColor: "divider" }}>
              <Stack direction="row" alignItems="flex-start" spacing={1.5}>
                <BackupOutlinedIcon sx={{ fontSize: 20, color: "primary.main", mt: 0.2 }} />
                <Box flex={1}>
                  <Typography variant="subtitle2" fontWeight={600} color="text.primary">
                    Manual SQL Dump
                  </Typography>
                  <Typography variant="caption" color="text.secondary">
                    Triggers a Supabase Edge Function that calls the Management API to generate and return a
                    secure, time-limited backup link.
                  </Typography>
                </Box>
                <Button
                  size="small"
                  variant="contained"
                  color="primary"
                  startIcon={
                    exporting === "sql-dump" ? (
                      <CircularProgress size={13} color="inherit" />
                    ) : (
                      <BackupOutlinedIcon />
                    )
                  }
                  onClick={() => handleExport("sql-dump")}
                  disabled={exporting === "sql-dump"}
                  sx={{ fontSize: "0.75rem" }}
                >
                  {exporting === "sql-dump" ? "Generating…" : "Generate Dump"}
                </Button>
              </Stack>
            </Paper>

          </Stack>

          <Stack direction="row" alignItems="flex-start" spacing={1} mt={2}>
            <InfoOutlinedIcon sx={{ fontSize: 15, color: "text.secondary", mt: 0.25 }} />
            <Typography variant="caption" color="text.secondary">
              Supabase automatically performs daily backups and Point-in-Time Recovery (PITR) on paid plans.
              These exports provide additional on-demand local copies.
            </Typography>
          </Stack>
        </SectionCard>

        {/* 4. DANGER ZONE*/}
        <Paper
          variant="outlined"
          sx={{ borderRadius: 2, borderColor: "error.main", overflow: "hidden" }}
        >
          <Stack
            direction="row"
            alignItems="center"
            spacing={1.5}
            sx={{
              px: 2.5, py: 2,
              borderBottom: "1px solid",
              borderColor: "error.main",
              bgcolor: "error.main",
            }}
          >
            <Box
              sx={{
                width: 34, height: 34, borderRadius: 1.5, bgcolor: "rgba(255,255,255,0.2)",
                display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0,
              }}
            >
              <WarningAmberOutlinedIcon sx={{ color: "white", fontSize: 18 }} />
            </Box>
            <Box flex={1}>
              <Typography variant="subtitle1" fontWeight={700} color="white" lineHeight={1.2}>
                Danger Zone
              </Typography>
              <Typography variant="caption" sx={{ color: "rgba(255,255,255,0.8)" }}>
                Irreversible administrative overrides — proceed with caution
              </Typography>
            </Box>
          </Stack>

          <Box p={2.5}>
            <Alert severity="error" sx={{ mb: 2.5, borderRadius: 1.5 }}>
              Actions in this section are <strong>permanent and cannot be undone</strong>. Make sure you
              have a recent database export before proceeding.
            </Alert>

            <Stack spacing={1.5}>

              {/* Purge Unregistered Media */}
              <Paper variant="outlined" sx={{ p: 2, borderRadius: 1.5, borderColor: "error.light" }}>
                <Stack direction="row" alignItems="flex-start" spacing={1.5}>
                  <DeleteSweepOutlinedIcon sx={{ fontSize: 20, color: "error.main", mt: 0.2 }} />
                  <Box flex={1}>
                    <Typography variant="subtitle2" fontWeight={600} color="text.primary">
                      Purge All Unregistered Media
                    </Typography>
                    <Typography variant="caption" color="text.secondary">
                      Permanently delete every captured frame stored in the <code>unrecognized-faces</code> bucket
                      along with all associated database rows.
                    </Typography>
                  </Box>
                  <Button
                    size="small"
                    variant="outlined"
                    color="error"
                    startIcon={<DeleteSweepOutlinedIcon />}
                    onClick={() => setConfirmPurge(true)}
                    sx={{ fontSize: "0.75rem", flexShrink: 0 }}
                  >
                    Purge
                  </Button>
                </Stack>
              </Paper>

              {/* Hard Reset Embeddings */}
              <Paper variant="outlined" sx={{ p: 2, borderRadius: 1.5, borderColor: "error.light" }}>
                <Stack direction="row" alignItems="flex-start" spacing={1.5}>
                  <DeleteForeverOutlinedIcon sx={{ fontSize: 20, color: "error.main", mt: 0.2 }} />
                  <Box flex={1}>
                    <Typography variant="subtitle2" fontWeight={600} color="text.primary">
                      Hard Reset Embeddings
                    </Typography>
                    <Typography variant="caption" color="text.secondary">
                      Wipe <strong>all pgvector face embeddings</strong> from the database.
                      The system will re-scan and re-learn every registered user on their next verified check-in.
                      This does <strong>not</strong> delete user accounts or profile photos.
                    </Typography>
                  </Box>
                  <Button
                    size="small"
                    variant="contained"
                    color="error"
                    startIcon={<LockOutlinedIcon />}
                    onClick={() => setConfirmReset(true)}
                    sx={{ fontSize: "0.75rem", flexShrink: 0 }}
                  >
                    Hard Reset
                  </Button>
                </Stack>
              </Paper>

            </Stack>
          </Box>
        </Paper>

      </Stack>

      {/* ── Confirm Dialogs ── */}
      <ConfirmDialog
        open={confirmPurge}
        title="Purge All Unregistered Media?"
        body="This will permanently delete all captured frames in the unrecognized-faces bucket and all related database records. This action cannot be undone."
        confirmLabel="Yes, Purge"
        onConfirm={handlePurge}
        onCancel={() => setConfirmPurge(false)}
        loading={dangerLoading === "purge"}
        severity="error"
      />

      <ConfirmDialog
        open={confirmReset}
        title="Hard Reset All Face Embeddings?"
        body="This will permanently wipe every pgvector embedding stored in the database. All registered users will need to be re-enrolled on their next face scan. This cannot be undone."
        confirmLabel="Yes, Wipe Embeddings"
        onConfirm={handleHardReset}
        onCancel={() => setConfirmReset(false)}
        loading={dangerLoading === "reset"}
        severity="error"
      />
    </Box>
  );
};

export default StorageBackup;
