import { useState } from "react";
import {
  Box, Typography, Stack, Switch, FormControlLabel, Divider, Button,
  Alert, Paper, TextField, Chip, Tooltip, Select, MenuItem, InputLabel,
  FormControl, Grid, Collapse, Checkbox, Slider, Table, TableBody,
  TableCell, TableContainer, TableHead, TableRow, Radio, RadioGroup,
  InputAdornment,
} from "@mui/material";
import NotificationsNoneOutlinedIcon   from "@mui/icons-material/NotificationsNoneOutlined";
import SaveOutlinedIcon                 from "@mui/icons-material/SaveOutlined";
import RestartAltOutlinedIcon          from "@mui/icons-material/RestartAltOutlined";
import EmailOutlinedIcon               from "@mui/icons-material/EmailOutlined";
import SmsOutlinedIcon                 from "@mui/icons-material/SmsOutlined";
import InfoOutlinedIcon                from "@mui/icons-material/InfoOutlined";
import PauseCircleOutlineIcon          from "@mui/icons-material/PauseCircleOutline";
import DoNotDisturbOnOutlinedIcon      from "@mui/icons-material/DoNotDisturbOnOutlined";
import VolumeUpOutlinedIcon            from "@mui/icons-material/VolumeUpOutlined";
import GridViewOutlinedIcon            from "@mui/icons-material/GridViewOutlined";
import TuneOutlinedIcon                from "@mui/icons-material/TuneOutlined";
import IntegrationInstructionsOutlinedIcon from "@mui/icons-material/IntegrationInstructionsOutlined";
import AccessTimeOutlinedIcon          from "@mui/icons-material/AccessTimeOutlined";
import SmartphoneOutlinedIcon          from "@mui/icons-material/SmartphoneOutlined";
import NotificationsActiveOutlinedIcon from "@mui/icons-material/NotificationsActiveOutlined";
import AddCircleOutlineIcon            from "@mui/icons-material/AddCircleOutline";
import DeleteOutlineIcon               from "@mui/icons-material/DeleteOutline";
//  Types 
type Channel = "inApp" | "email" | "sms" | "push";
interface MatrixRow {
  key: string;
  label: string;
  group: string;
  severity: "error" | "warning" | "info";
  inApp: boolean;
  email: boolean;
  sms: boolean;
  push: boolean;
}

type FrequencyMode = "instant" | "batched";
interface AdminContact {
  id: string;
  email: string;
  phone: string;
}
interface Settings {
  pauseAll: boolean;
  dndEnabled: boolean;
  dndStart: string;
  dndEnd: string;
  alertSound: string;
  alertVolume: number;
  matrix: MatrixRow[];
  adminContacts: AdminContact[];
  frequencyMode: FrequencyMode;
  batchTime: string;
  batchEvents: string[];
}
// Static data 

const DEFAULT_MATRIX: MatrixRow[] = [
  { key: "camera_offline", group: "System Critical", label: "Camera Offline",          severity: "error",   inApp: true,  email: true,  sms: true,  push: false },
  { key: "db_down",        group: "System Critical", label: "Database Down",            severity: "error",   inApp: true,  email: true,  sms: true,  push: false },
  { key: "storage_full",   group: "System Critical", label: "Storage Full",             severity: "error",   inApp: true,  email: true,  sms: false, push: false },
  { key: "spoofing",       group: "Security Alerts", label: "Spoofing / Liveness Fail", severity: "error",   inApp: true,  email: true,  sms: false, push: true  },
  { key: "unknown_face",   group: "Security Alerts", label: "Unknown Face Detected",    severity: "error",   inApp: true,  email: true,  sms: false, push: true  },
  { key: "access_denied",  group: "Security Alerts", label: "Access Denied",            severity: "warning", inApp: true,  email: false, sms: false, push: false },
  { key: "daily_summary",  group: "Attendance",      label: "Daily Summary",            severity: "info",    inApp: false, email: true,  sms: false, push: false },
  { key: "absences",       group: "Attendance",      label: "Absence Alerts",           severity: "warning", inApp: true,  email: true,  sms: false, push: false },
  { key: "enroll_failed",  group: "Attendance",      label: "Enrollment Failed",        severity: "info",    inApp: true,  email: false, sms: false, push: false },
];

const ALL_BATCH_GROUPS = ["Attendance"];

const COLS: { key: Channel; label: string }[] = [
  { key: "inApp", label: "In-App (Bell)" },
  { key: "email", label: "Email"          },
  { key: "sms",   label: "SMS"            },
  { key: "push",  label: "Push"           },
];
const DEFAULTS: Settings = {
  pauseAll: false,
  dndEnabled: false,
  dndStart: "22:00",
  dndEnd: "06:00",
  alertSound: "chime",
  alertVolume: 60,
  matrix: DEFAULT_MATRIX.map((r) => ({ ...r })),
  adminContacts: [{ id: "1", email: "", phone: "" }],
  frequencyMode: "instant",
  batchTime: "17:00",
  batchEvents: ["Attendance"],
};
// Section card 

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

//  Main component 

const NotificationConfig = () => {
  const [s, setS] = useState<Settings>(() => ({
    ...DEFAULTS,
    matrix: DEFAULT_MATRIX.map((r) => ({ ...r })),
    adminContacts: [{ id: "1", email: "", phone: "" }],
    batchEvents: [...DEFAULTS.batchEvents],
  }));
  const [saved, setSaved] = useState(false);

  const update = <K extends keyof Settings>(key: K, val: Settings[K]) => {
    setSaved(false);
    setS((prev) => ({ ...prev, [key]: val }));
  };

  // Admin contacts
  const updateContact = (id: string, field: keyof Omit<AdminContact, "id">, val: string) => {
    setSaved(false);
    setS((prev) => ({
      ...prev,
      adminContacts: prev.adminContacts.map((c) => c.id === id ? { ...c, [field]: val } : c),
    }));
  };

  const addContact = () => {
    setSaved(false);
    setS((prev) => ({
      ...prev,
      adminContacts: [...prev.adminContacts, { id: Date.now().toString(), email: "", phone: "" }],
    }));
  };

  const removeContact = (id: string) => {
    setSaved(false);
    setS((prev) => ({ ...prev, adminContacts: prev.adminContacts.filter((c) => c.id !== id) }));
  };

  const toggleCell = (rowKey: string, col: Channel) => {
    setSaved(false);
    setS((prev) => ({
      ...prev,
      matrix: prev.matrix.map((r) => r.key === rowKey ? { ...r, [col]: !r[col] } : r),
    }));
  };

  const allChecked = (col: Channel) => s.matrix.every((r) => r[col]);
  const someChecked = (col: Channel) => s.matrix.some((r) => r[col]);

  const toggleColumn = (col: Channel) => {
    const next = !allChecked(col);
    setSaved(false);
    setS((prev) => ({ ...prev, matrix: prev.matrix.map((r) => ({ ...r, [col]: next })) }));
  };

  const toggleBatchGroup = (grp: string) => {
    setSaved(false);
    setS((prev) => ({
      ...prev,
      batchEvents: prev.batchEvents.includes(grp)
        ? prev.batchEvents.filter((g) => g !== grp)
        : [...prev.batchEvents, grp],
    }));
  };

  const handleSave = () => setSaved(true);   // TODO: wire to API

  const handleReset = () => {
    setS({ ...DEFAULTS, matrix: DEFAULT_MATRIX.map((r) => ({ ...r })), adminContacts: [{ id: "1", email: "", phone: "" }], batchEvents: [...DEFAULTS.batchEvents] });
    setSaved(false);
  };

  const groups = Array.from(new Set(s.matrix.map((r) => r.group)));

  return (
    <Box>
      {/* ── Page header ── */}
      <Stack direction="row" alignItems="center" spacing={1.5} mb={3}>
        <Box sx={{ width: 40, height: 40, borderRadius: 2, bgcolor: "primary.main", display: "flex", alignItems: "center", justifyContent: "center" }}>
          <NotificationsNoneOutlinedIcon sx={{ color: "white", fontSize: 20 }} />
        </Box>
        <Box>
          <Typography variant="h6" fontWeight={700} color="text.primary">Notification Configuration</Typography>
          <Typography variant="caption" color="text.secondary">
            Global preferences · alert matrix · delivery channels · frequency
          </Typography>
        </Box>
        <Box flex={1} />
        {s.pauseAll && (
          <Chip icon={<PauseCircleOutlineIcon />} label="Notifications Paused"
            color="warning" size="small" variant="outlined" sx={{ fontWeight: 600 }} />
        )}
      </Stack>

      <Stack spacing={3}>

        {/* SECTION 1 — Global Notification Preferences*/}
        <SectionCard
          icon={<TuneOutlinedIcon sx={{ color: "white", fontSize: 18 }} />}
          title="Global Notification Preferences"
          subtitle="Master controls that apply to all channels and events"
        >
          <Stack spacing={2.5}>

            {/* Pause All */}
            <Paper
              variant="outlined"
              sx={{
                p: 2, borderRadius: 2,
                borderColor: s.pauseAll ? "warning.main" : "divider",
                bgcolor: s.pauseAll ? "warning.light" : "transparent",
                transition: "all 0.2s",
              }}
            >
              <Stack direction="row" alignItems="center" spacing={2}>
                <PauseCircleOutlineIcon sx={{ fontSize: 28, color: s.pauseAll ? "warning.dark" : "text.secondary" }} />
                <Box flex={1}>
                  <Typography variant="subtitle2" fontWeight={700} color={s.pauseAll ? "warning.dark" : "text.primary"}>
                    Pause All Notifications
                  </Typography>
                  <Typography variant="caption" color="text.secondary">
                    Temporarily silence every alert — ideal for maintenance windows. Remember to re-enable when done.
                  </Typography>
                </Box>
                <Switch checked={s.pauseAll} onChange={() => update("pauseAll", !s.pauseAll)} color="warning" />
              </Stack>
            </Paper>

            <Grid container spacing={2}>
              {/* DND */}
              <Grid size={{ xs: 12, md: 6 }}>
                <Paper variant="outlined" sx={{ p: 2, borderRadius: 2, height: "100%", borderColor: s.dndEnabled ? "primary.main" : "divider" }}>
                  <Stack spacing={1.5}>
                    <Stack direction="row" alignItems="center" spacing={1}>
                      <DoNotDisturbOnOutlinedIcon sx={{ fontSize: 20, color: "primary.main" }} />
                      <Typography variant="subtitle2" fontWeight={700}>Do Not Disturb (DND)</Typography>
                      <Box flex={1} />
                      <Switch size="small" checked={s.dndEnabled} onChange={() => update("dndEnabled", !s.dndEnabled)} />
                    </Stack>
                    <Typography variant="caption" color="text.secondary">
                      Suppress SMS &amp; push alerts between these hours. In-app and system-critical alerts still get through.
                    </Typography>
                    <Collapse in={s.dndEnabled}>
                      <Stack direction="row" spacing={2} pt={0.5}>
                        <TextField label="Start" type="time" size="small" value={s.dndStart}
                          onChange={(e) => update("dndStart", e.target.value)}
                          slotProps={{ inputLabel: { shrink: true } }} fullWidth />
                        <TextField label="End" type="time" size="small" value={s.dndEnd}
                          onChange={(e) => update("dndEnd", e.target.value)}
                          slotProps={{ inputLabel: { shrink: true } }} fullWidth />
                      </Stack>
                    </Collapse>
                  </Stack>
                </Paper>
              </Grid>

              {/* Alert Sound */}
              <Grid size={{ xs: 12, md: 6 }}>
                <Paper variant="outlined" sx={{ p: 2, borderRadius: 2, height: "100%", borderColor: "divider" }}>
                  <Stack spacing={1.5}>
                    <Stack direction="row" alignItems="center" spacing={1}>
                      <VolumeUpOutlinedIcon sx={{ fontSize: 20, color: "primary.main" }} />
                      <Typography variant="subtitle2" fontWeight={700}>In-App Alert Sound</Typography>
                    </Stack>
                    <Typography variant="caption" color="text.secondary">
                      Sound played when a new in-app browser notification arrives.
                    </Typography>
                    <FormControl size="small" fullWidth>
                      <InputLabel>Alert Sound</InputLabel>
                      <Select label="Alert Sound" value={s.alertSound} onChange={(e) => update("alertSound", e.target.value)}>
                        <MenuItem value="chime">Chime</MenuItem>
                        <MenuItem value="ping">Ping</MenuItem>
                        <MenuItem value="ding">Ding</MenuItem>
                        <MenuItem value="beep">Beep</MenuItem>
                        <MenuItem value="none">None (silent)</MenuItem>
                      </Select>
                    </FormControl>
                    <Stack direction="row" alignItems="center" spacing={1.5}>
                      <VolumeUpOutlinedIcon sx={{ fontSize: 16, color: "text.secondary" }} />
                      <Slider
                        size="small" value={s.alertVolume} min={0} max={100} step={5}
                        valueLabelDisplay="auto" valueLabelFormat={(v) => `${v}%`}
                        disabled={s.alertSound === "none"}
                        onChange={(_, v) => update("alertVolume", v as number)}
                        sx={{ flex: 1 }}
                      />
                      <Typography variant="caption" color="text.secondary" sx={{ width: 34, textAlign: "right" }}>
                        {s.alertVolume}%
                      </Typography>
                    </Stack>
                  </Stack>
                </Paper>
              </Grid>
            </Grid>

          </Stack>
        </SectionCard>

        {/* SECTION 2 — Notification Matrix*/}
        <SectionCard
          icon={<GridViewOutlinedIcon sx={{ color: "white", fontSize: 18 }} />}
          title="Notification Matrix"
          subtitle="Choose which delivery channels are triggered for each FaceTrack event"
        >
          <TableContainer component={Box} sx={{ border: "1px solid", borderColor: "divider", borderRadius: 2 }}>
            <Table size="small">
              <TableHead>
                <TableRow sx={{ bgcolor: "action.hover" }}>
                  <TableCell sx={{ fontWeight: 700, fontSize: "0.78rem", minWidth: 220 }}>
                    FaceTrack Event
                  </TableCell>
                  {COLS.map((col) => (
                    <TableCell key={col.key} align="center" sx={{ fontWeight: 700, fontSize: "0.78rem", whiteSpace: "nowrap" }}>
                      <Stack alignItems="center" spacing={0}>
                        <span>{col.label}</span>
                        <Tooltip title={`Toggle all — ${col.label}`} arrow placement="top">
                          <Checkbox
                            size="small"
                            checked={allChecked(col.key)}
                            indeterminate={someChecked(col.key) && !allChecked(col.key)}
                            onChange={() => toggleColumn(col.key)}
                            sx={{ p: 0.25 }}
                          />
                        </Tooltip>
                      </Stack>
                    </TableCell>
                  ))}
                </TableRow>
              </TableHead>
              <TableBody>
                {groups.map((grp) => (
                  <>
                    <TableRow key={`hdr-${grp}`} sx={{ bgcolor: "action.selected" }}>
                      <TableCell
                        colSpan={5}
                        sx={{ fontWeight: 700, fontSize: "0.7rem", py: 0.75, color: "text.secondary",
                             letterSpacing: 0.6, textTransform: "uppercase" }}
                      >
                        {grp}
                      </TableCell>
                    </TableRow>
                    {s.matrix.filter((r) => r.group === grp).map((row) => (
                      <TableRow key={row.key} hover>
                        <TableCell>
                          <Stack direction="row" alignItems="center" spacing={1}>
                            <Chip
                              label={row.severity === "error" ? "CRITICAL" : row.severity === "warning" ? "WARN" : "INFO"}
                              size="small"
                              color={row.severity === "error" ? "error" : row.severity === "warning" ? "warning" : "info"}
                              sx={{ fontWeight: 700, fontSize: "0.58rem", height: 16, minWidth: 52 }}
                            />
                            <Typography variant="body2" fontWeight={500}>{row.label}</Typography>
                          </Stack>
                        </TableCell>
                        {COLS.map((col) => (
                          <TableCell key={col.key} align="center" padding="checkbox">
                            <Checkbox size="small" checked={row[col.key]} onChange={() => toggleCell(row.key, col.key)} color="primary" />
                          </TableCell>
                        ))}
                      </TableRow>
                    ))}
                  </>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
          <Typography variant="caption" color="text.secondary" display="block" mt={1.5}>
            Column header checkboxes select / deselect all rows for that channel.
          </Typography>
        </SectionCard>

        {/* SECTION 3 — Delivery Channels & Integrations */}
        <SectionCard
          icon={<IntegrationInstructionsOutlinedIcon sx={{ color: "white", fontSize: 18 }} />}
          title="Delivery Channels & Integrations"
          subtitle="Admin contact info for alert delivery"
        >
          <Stack spacing={2.5}>

            {/* Admin Contact Info */}
            <Box>
              <Stack direction="row" alignItems="center" spacing={1} mb={2}>
                <SmartphoneOutlinedIcon sx={{ fontSize: 18, color: "primary.main" }} />
                <Typography variant="subtitle2" fontWeight={700}>Admin Contact Info</Typography>
                <Tooltip title="Used specifically for alert delivery — can differ from your account email." placement="right" arrow>
                  <InfoOutlinedIcon sx={{ fontSize: 14, color: "text.secondary", cursor: "pointer" }} />
                </Tooltip>
                <Box flex={1} />
                <Button
                  size="small"
                  startIcon={<AddCircleOutlineIcon />}
                  onClick={addContact}
                  sx={{ textTransform: "none", fontWeight: 600 }}
                >
                  Add Admin
                </Button>
              </Stack>

              <Stack spacing={1.5}>
                {s.adminContacts.map((contact, idx) => (
                  <Paper
                    key={contact.id}
                    variant="outlined"
                    sx={{ p: 1.5, borderRadius: 2, borderColor: "divider" }}
                  >
                    <Stack direction="row" alignItems="center" spacing={1} mb={1}>
                      <Typography variant="caption" fontWeight={700} color="text.secondary">
                        Admin {idx + 1}
                      </Typography>
                      <Box flex={1} />
                      {s.adminContacts.length > 1 && (
                        <Tooltip title="Remove this admin" arrow>
                          <span>
                            <Button
                              size="small"
                              color="error"
                              onClick={() => removeContact(contact.id)}
                              sx={{ minWidth: 0, p: 0.5 }}
                            >
                              <DeleteOutlineIcon sx={{ fontSize: 18 }} />
                            </Button>
                          </span>
                        </Tooltip>
                      )}
                    </Stack>
                    <Grid container spacing={1.5}>
                      <Grid size={{ xs: 12, sm: 6 }}>
                        <TextField
                          label="Alert Email" size="small" fullWidth
                          value={contact.email}
                          onChange={(e) => updateContact(contact.id, "email", e.target.value)}
                          placeholder="admin@facetrack.io"
                          slotProps={{
                            input: {
                              startAdornment: (
                                <InputAdornment position="start">
                                  <EmailOutlinedIcon sx={{ fontSize: 16, color: "text.secondary" }} />
                                </InputAdornment>
                              ),
                            },
                          }}
                        />
                      </Grid>
                      <Grid size={{ xs: 12, sm: 6 }}>
                        <TextField
                          label="Alert Phone" size="small" fullWidth
                          value={contact.phone}
                          onChange={(e) => updateContact(contact.id, "phone", e.target.value)}
                          placeholder="+1 555 000 0000"
                          slotProps={{
                            input: {
                              startAdornment: (
                                <InputAdornment position="start">
                                  <SmsOutlinedIcon sx={{ fontSize: 16, color: "text.secondary" }} />
                                </InputAdornment>
                              ),
                            },
                          }}
                        />
                      </Grid>
                    </Grid>
                  </Paper>
                ))}
              </Stack>
            </Box>

          </Stack>
        </SectionCard>

        {/* SECTION 4 — Alert Frequency */}
        <SectionCard
          icon={<AccessTimeOutlinedIcon sx={{ color: "white", fontSize: 18 }} />}
          title="Alert Frequency"
          subtitle="Control how often notifications are dispatched — instant or batched digest"
        >
          <RadioGroup value={s.frequencyMode} onChange={(e) => update("frequencyMode", e.target.value as FrequencyMode)}>
            <Grid container spacing={2}>
              {/* Instant */}
              <Grid size={{ xs: 12, sm: 6 }}>
                <Paper
                  variant="outlined"
                  onClick={() => update("frequencyMode", "instant")}
                  sx={{
                    p: 2, borderRadius: 2, cursor: "pointer", height: "100%",
                    borderColor: s.frequencyMode === "instant" ? "primary.main" : "divider",
                    borderWidth: s.frequencyMode === "instant" ? 2 : 1,
                    transition: "all 0.2s",
                  }}
                >
                  <Stack direction="row" alignItems="flex-start" spacing={1}>
                    <Radio value="instant" size="small" sx={{ p: 0, mt: 0.25 }} />
                    <Box>
                      <Stack direction="row" alignItems="center" spacing={1} flexWrap="wrap" gap={0.5}>
                        <NotificationsActiveOutlinedIcon sx={{ fontSize: 18, color: "primary.main" }} />
                        <Typography variant="subtitle2" fontWeight={700}>Instant</Typography>
                        <Chip label="Best for security" size="small" color="error" sx={{ fontSize: "0.6rem", height: 16 }} />
                      </Stack>
                      <Typography variant="caption" color="text.secondary" display="block" mt={0.5}>
                        Every alert is sent immediately as it occurs — ideal for camera failures, spoofing attempts, and breaches where reaction time matters.
                      </Typography>
                    </Box>
                  </Stack>
                </Paper>
              </Grid>

              {/* Batched */}
              <Grid size={{ xs: 12, sm: 6 }}>
                <Paper
                  variant="outlined"
                  onClick={() => update("frequencyMode", "batched")}
                  sx={{
                    p: 2, borderRadius: 2, cursor: "pointer", height: "100%",
                    borderColor: s.frequencyMode === "batched" ? "primary.main" : "divider",
                    borderWidth: s.frequencyMode === "batched" ? 2 : 1,
                    transition: "all 0.2s",
                  }}
                >
                  <Stack direction="row" alignItems="flex-start" spacing={1}>
                    <Radio value="batched" size="small" sx={{ p: 0, mt: 0.25 }} />
                    <Box flex={1}>
                      <Stack direction="row" alignItems="center" spacing={1} flexWrap="wrap" gap={0.5}>
                        <AccessTimeOutlinedIcon sx={{ fontSize: 18, color: "primary.main" }} />
                        <Typography variant="subtitle2" fontWeight={700}>Batched Digest</Typography>
                        <Chip label="Reduces noise" size="small" color="info" sx={{ fontSize: "0.6rem", height: 16 }} />
                      </Stack>
                      <Typography variant="caption" color="text.secondary" display="block" mt={0.5}>
                        Collects selected event types and sends one summary email at a scheduled time — great for daily attendance reports.
                      </Typography>
                    </Box>
                  </Stack>
                </Paper>
              </Grid>
            </Grid>
          </RadioGroup>

          {/* Batched options */}
          <Collapse in={s.frequencyMode === "batched"}>
            <Paper variant="outlined" sx={{ p: 2, borderRadius: 2, mt: 2, borderColor: "primary.main" }}>
              <Grid container spacing={2} alignItems="flex-start">
                <Grid size={{ xs: 12, sm: 5 }}>
                  <Typography variant="subtitle2" fontWeight={700} mb={0.5}>Send Daily Digest At</Typography>
                  <TextField
                    type="time" size="small" fullWidth value={s.batchTime}
                    onChange={(e) => update("batchTime", e.target.value)}
                    slotProps={{ inputLabel: { shrink: true } }}
                    helperText="One summary email sent per day at this time."
                  />
                </Grid>
                <Grid size={{ xs: 12, sm: 7 }}>
                  <Typography variant="subtitle2" fontWeight={700} mb={0.5}>Batch These Event Groups</Typography>
                  <Typography variant="caption" color="text.secondary" display="block" mb={1}>
                    Unchecked groups will still be sent instantly.
                  </Typography>
                  <Stack spacing={0.5}>
                    {ALL_BATCH_GROUPS.map((grp) => (
                      <FormControlLabel
                        key={grp}
                        control={
                          <Checkbox size="small" checked={s.batchEvents.includes(grp)} onChange={() => toggleBatchGroup(grp)} />
                        }
                        label={<Typography variant="body2">{grp}</Typography>}
                      />
                    ))}
                  </Stack>
                </Grid>
              </Grid>
            </Paper>
          </Collapse>
        </SectionCard>

      </Stack>

      <Divider sx={{ my: 3 }} />

      <Alert severity="info" sx={{ mb: 3, borderRadius: 2 }}>
        <strong>DND</strong> suppresses SMS &amp; push only — in-app and System Critical alerts always go through.{" "}
        <strong>Pause All</strong> is for maintenance windows; remember to re-enable it when done.
      </Alert>

      {/* ── Actions ── */}
      <Stack direction="row" spacing={2} justifyContent="flex-end">
        <Button variant="outlined" startIcon={<RestartAltOutlinedIcon />} onClick={handleReset}
          sx={{ borderRadius: 2, textTransform: "none" }}>
          Reset to Defaults
        </Button>
        <Button variant="contained" startIcon={<SaveOutlinedIcon />} onClick={handleSave}
          sx={{ borderRadius: 2, textTransform: "none" }}>
          Save Changes
        </Button>
      </Stack>

      {saved && (
        <Alert severity="success" sx={{ mt: 2, borderRadius: 2 }}>
          Notification settings saved successfully.
        </Alert>
      )}
    </Box>
  );
};

export default NotificationConfig;