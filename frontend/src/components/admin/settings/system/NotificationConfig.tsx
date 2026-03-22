import { useEffect, useState } from "react";
import {
  Box, Typography, Stack, Switch, FormControlLabel, Divider, Button,
  Alert, Paper, TextField, Chip, Tooltip, Select, MenuItem, InputLabel,
  FormControl, Grid, Collapse, Checkbox, Slider, Radio, RadioGroup,
  InputAdornment,
} from "@mui/material";
import NotificationsNoneOutlinedIcon from "@mui/icons-material/NotificationsNoneOutlined";
import SaveOutlinedIcon from "@mui/icons-material/SaveOutlined";
import RestartAltOutlinedIcon from "@mui/icons-material/RestartAltOutlined";
import EmailOutlinedIcon from "@mui/icons-material/EmailOutlined";
import SmsOutlinedIcon from "@mui/icons-material/SmsOutlined";
import InfoOutlinedIcon from "@mui/icons-material/InfoOutlined";
import PauseCircleOutlineIcon from "@mui/icons-material/PauseCircleOutline";
import DoNotDisturbOnOutlinedIcon from "@mui/icons-material/DoNotDisturbOnOutlined";
import VolumeUpOutlinedIcon from "@mui/icons-material/VolumeUpOutlined";
import TuneOutlinedIcon from "@mui/icons-material/TuneOutlined";
import IntegrationInstructionsOutlinedIcon from "@mui/icons-material/IntegrationInstructionsOutlined";
import AccessTimeOutlinedIcon from "@mui/icons-material/AccessTimeOutlined";
import SmartphoneOutlinedIcon from "@mui/icons-material/SmartphoneOutlined";
import NotificationsActiveOutlinedIcon from "@mui/icons-material/NotificationsActiveOutlined";
import AddCircleOutlineIcon from "@mui/icons-material/AddCircleOutline";
import DeleteOutlineIcon from "@mui/icons-material/DeleteOutline";
import api from "../../../../services/api";

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
  adminContacts: AdminContact[];
  frequencyMode: FrequencyMode;
  batchTime: string;
  batchEvents: string[];
}

const ALL_BATCH_GROUPS = ["Attendance"];

const DEFAULTS: Settings = {
  pauseAll: false,
  dndEnabled: false,
  dndStart: "22:00",
  dndEnd: "06:00",
  alertSound: "chime",
  alertVolume: 60,
  adminContacts: [{ id: "1", email: "", phone: "" }],
  frequencyMode: "instant",
  batchTime: "17:00",
  batchEvents: ["Attendance"],
};

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
          width: 34,
          height: 34,
          borderRadius: 1.5,
          bgcolor: "primary.main",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          flexShrink: 0,
        }}
      >
        {icon}
      </Box>
      <Box flex={1}>
        <Typography variant="subtitle1" fontWeight={700} color="text.primary" lineHeight={1.2}>
          {title}
        </Typography>
        <Typography variant="caption" color="text.secondary">
          {subtitle}
        </Typography>
      </Box>
      {badge}
    </Stack>
    <Box p={2.5}>{children}</Box>
  </Paper>
);

const NotificationConfig = () => {
  const [s, setS] = useState<Settings>(() => ({
    ...DEFAULTS,
    adminContacts: [{ id: "1", email: "", phone: "" }],
    batchEvents: [...DEFAULTS.batchEvents],
  }));
  const [saved, setSaved] = useState(false);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [notificationConfigRoot, setNotificationConfigRoot] = useState<Record<string, unknown>>({});

  useEffect(() => {
    const loadNotificationConfig = () => {
      setLoading(true);
      setError("");

      api
        .get("/organizations/me")
        .then(({ data }) => {
          const rootConfig =
            data.notification_config && typeof data.notification_config === "object"
              ? (data.notification_config as Record<string, unknown>)
              : {};
          setNotificationConfigRoot(rootConfig);

          const scopedSettings = rootConfig.notification_settings;
          if (scopedSettings && typeof scopedSettings === "object") {
            setS(scopedSettings as Settings);
          } else if (data.notification_config) {
            // Backward compatibility: accept legacy flat notification_config shape.
            setS(data.notification_config);
          } else {
            setS({
              ...DEFAULTS,
              adminContacts: [{ id: "1", email: "", phone: "" }],
              batchEvents: [...DEFAULTS.batchEvents],
            });
          }
        })
        .catch(() => {
          setError("Failed to load notification settings from backend.");
        })
        .finally(() => {
          setLoading(false);
        });
    };

    loadNotificationConfig();
  }, []);

  const update = <K extends keyof Settings>(key: K, val: Settings[K]) => {
    setSaved(false);
    setError("");
    setS((prev) => ({ ...prev, [key]: val }));
  };

  const updateContact = (id: string, field: keyof Omit<AdminContact, "id">, val: string) => {
    setSaved(false);
    setError("");
    setS((prev) => ({
      ...prev,
      adminContacts: prev.adminContacts.map((c) => (c.id === id ? { ...c, [field]: val } : c)),
    }));
  };

  const addContact = () => {
    setSaved(false);
    setError("");
    setS((prev) => ({
      ...prev,
      adminContacts: [...prev.adminContacts, { id: Date.now().toString(), email: "", phone: "" }],
    }));
  };

  const removeContact = (id: string) => {
    setSaved(false);
    setError("");
    setS((prev) => ({ ...prev, adminContacts: prev.adminContacts.filter((c) => c.id !== id) }));
  };

  const toggleBatchGroup = (grp: string) => {
    setSaved(false);
    setError("");
    setS((prev) => ({
      ...prev,
      batchEvents: prev.batchEvents.includes(grp)
        ? prev.batchEvents.filter((g) => g !== grp)
        : [...prev.batchEvents, grp],
    }));
  };

  const handleSave = () => {
    setSaving(true);
    setSaved(false);
    setError("");

    api
      .put("/organizations/me", {
        notification_config: {
          ...notificationConfigRoot,
          notification_settings: s,
        },
      })
      .then(() => {
        setNotificationConfigRoot((prev) => ({
          ...prev,
          notification_settings: s,
        }));
        setSaved(true);
      })
      .catch(() => {
        setError("Failed to save notification settings.");
      })
      .finally(() => {
        setSaving(false);
      });
  };

  const handleReset = () => {
    setS({
      ...DEFAULTS,
      adminContacts: [{ id: "1", email: "", phone: "" }],
      batchEvents: [...DEFAULTS.batchEvents],
    });
    setSaved(false);
    setError("");
  };

  return (
    <Box sx={{ maxWidth: 1200, mx: "auto" }}>
      <Stack direction="row" alignItems="center" spacing={1.5} mb={4}>
        <Box
          sx={{
            width: 44,
            height: 44,
            borderRadius: 2,
            bgcolor: "primary.main",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <NotificationsNoneOutlinedIcon sx={{ color: "white", fontSize: 22 }} />
        </Box>
        <Box>
          <Typography variant="h5" fontWeight={700} color="text.primary">
            Notification Configuration
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Global preferences · alert matrix · delivery channels · frequency
          </Typography>
        </Box>
        <Box flex={1} />
        {s.pauseAll && (
          <Chip
            icon={<PauseCircleOutlineIcon />}
            label="Notifications Paused"
            color="warning"
            size="small"
            variant="outlined"
            sx={{ fontWeight: 600 }}
          />
        )}
      </Stack>

      <Stack spacing={4}>
        <SectionCard
          icon={<TuneOutlinedIcon sx={{ color: "white", fontSize: 18 }} />}
          title="Global Notification Preferences"
          subtitle="Master controls that apply to all channels and events"
        >
          <Stack spacing={2.5}>
            <Paper
              variant="outlined"
              sx={{
                p: 2,
                borderRadius: 2,
                borderColor: s.pauseAll ? "warning.main" : "divider",
                bgcolor: s.pauseAll ? "warning.light" : "transparent",
                transition: "all 0.2s",
              }}
            >
              <Stack direction="row" alignItems="center" spacing={2}>
                <PauseCircleOutlineIcon
                  sx={{ fontSize: 28, color: s.pauseAll ? "warning.dark" : "text.secondary" }}
                />
                <Box flex={1}>
                  <Typography
                    variant="subtitle2"
                    fontWeight={700}
                    color={s.pauseAll ? "warning.dark" : "text.primary"}
                  >
                    Pause All Notifications
                  </Typography>
                  <Typography variant="caption" color="text.secondary">
                    Temporarily silence every alert — ideal for maintenance windows. Remember to re-enable when done.
                  </Typography>
                </Box>
                <Switch
                  checked={s.pauseAll}
                  onChange={() => update("pauseAll", !s.pauseAll)}
                  color="warning"
                />
              </Stack>
            </Paper>

            <Grid container spacing={2}>
              <Grid size={{ xs: 12, md: 6 }}>
                <Paper
                  variant="outlined"
                  sx={{
                    p: 2,
                    borderRadius: 2,
                    height: "100%",
                    borderColor: s.dndEnabled ? "primary.main" : "divider",
                  }}
                >
                  <Stack spacing={1.5}>
                    <Stack direction="row" alignItems="center" spacing={1}>
                      <DoNotDisturbOnOutlinedIcon sx={{ fontSize: 20, color: "primary.main" }} />
                      <Typography variant="subtitle2" fontWeight={700}>
                        Do Not Disturb (DND)
                      </Typography>
                      <Box flex={1} />
                      <Switch
                        size="small"
                        checked={s.dndEnabled}
                        onChange={() => update("dndEnabled", !s.dndEnabled)}
                      />
                    </Stack>
                    <Typography variant="caption" color="text.secondary">
                      Suppress SMS &amp; push alerts between these hours. In-app and system-critical alerts still get through.
                    </Typography>
                    <Collapse in={s.dndEnabled}>
                      <Stack direction="row" spacing={2} pt={0.5}>
                        <TextField
                          label="Start"
                          type="time"
                          size="small"
                          value={s.dndStart}
                          onChange={(e) => update("dndStart", e.target.value)}
                          slotProps={{ inputLabel: { shrink: true } }}
                          fullWidth
                        />
                        <TextField
                          label="End"
                          type="time"
                          size="small"
                          value={s.dndEnd}
                          onChange={(e) => update("dndEnd", e.target.value)}
                          slotProps={{ inputLabel: { shrink: true } }}
                          fullWidth
                        />
                      </Stack>
                    </Collapse>
                  </Stack>
                </Paper>
              </Grid>

              <Grid size={{ xs: 12, md: 6 }}>
                <Paper variant="outlined" sx={{ p: 2, borderRadius: 2, height: "100%", borderColor: "divider" }}>
                  <Stack spacing={1.5}>
                    <Stack direction="row" alignItems="center" spacing={1}>
                      <VolumeUpOutlinedIcon sx={{ fontSize: 20, color: "primary.main" }} />
                      <Typography variant="subtitle2" fontWeight={700}>
                        In-App Alert Sound
                      </Typography>
                    </Stack>
                    <Typography variant="caption" color="text.secondary">
                      Sound played when a new in-app browser notification arrives.
                    </Typography>
                    <FormControl size="small" fullWidth>
                      <InputLabel>Alert Sound</InputLabel>
                      <Select
                        label="Alert Sound"
                        value={s.alertSound}
                        onChange={(e) => update("alertSound", e.target.value)}
                      >
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
                        size="small"
                        value={s.alertVolume}
                        min={0}
                        max={100}
                        step={5}
                        valueLabelDisplay="auto"
                        valueLabelFormat={(v) => `${v}%`}
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

        <SectionCard
          icon={<IntegrationInstructionsOutlinedIcon sx={{ color: "white", fontSize: 18 }} />}
          title="Delivery Channels & Integrations"
          subtitle="Admin contact info for alert delivery"
        >
          <Stack spacing={2.5}>
            <Box>
              <Stack direction="row" alignItems="center" spacing={1} mb={2}>
                <SmartphoneOutlinedIcon sx={{ fontSize: 18, color: "primary.main" }} />
                <Typography variant="subtitle2" fontWeight={700}>
                  Admin Contact Info
                </Typography>
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
                  <Paper key={contact.id} variant="outlined" sx={{ p: 1.5, borderRadius: 2, borderColor: "divider" }}>
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
                              variant="text"
                              color="error"
                              startIcon={<DeleteOutlineIcon />}
                              onClick={() => removeContact(contact.id)}
                              sx={{ textTransform: "none" }}
                            >
                              Remove
                            </Button>
                          </span>
                        </Tooltip>
                      )}
                    </Stack>
                    <Stack direction="row" spacing={1.5}>
                      <TextField
                        label="Email"
                        type="email"
                        size="small"
                        value={contact.email}
                        onChange={(e) => updateContact(contact.id, "email", e.target.value)}
                        placeholder="admin@company.com"
                        slotProps={{ input: { startAdornment: <InputAdornment position="start"><EmailOutlinedIcon /></InputAdornment> } }}
                        fullWidth
                      />
                      <TextField
                        label="Phone"
                        type="tel"
                        size="small"
                        value={contact.phone}
                        onChange={(e) => updateContact(contact.id, "phone", e.target.value)}
                        placeholder="+1 (555) 000-0000"
                        slotProps={{ input: { startAdornment: <InputAdornment position="start"><SmsOutlinedIcon /></InputAdornment> } }}
                        fullWidth
                      />
                    </Stack>
                  </Paper>
                ))}
              </Stack>
            </Box>
          </Stack>
        </SectionCard>

        <SectionCard
          icon={<AccessTimeOutlinedIcon sx={{ color: "white", fontSize: 18 }} />}
          title="Alert Frequency"
          subtitle="Control how often notifications are dispatched — instant or batched digest"
        >
          <Stack spacing={2}>
            <RadioGroup value={s.frequencyMode} onChange={(e) => update("frequencyMode", e.target.value as FrequencyMode)}>
              <Grid container spacing={2}>
                <Grid size={{ xs: 12, sm: 6 }}>
                  <Paper
                    variant="outlined"
                    onClick={() => update("frequencyMode", "instant")}
                    sx={{
                      p: 2,
                      borderRadius: 2,
                      cursor: "pointer",
                      height: "100%",
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
                          <Typography variant="subtitle2" fontWeight={700}>
                            Instant
                          </Typography>
                          <Chip label="Best for security" size="small" color="error" sx={{ fontSize: "0.6rem", height: 16 }} />
                        </Stack>
                        <Typography variant="caption" color="text.secondary" display="block" mt={0.5}>
                          Every alert is sent immediately as it occurs — ideal for camera failures, spoofing attempts, and breaches where reaction time matters.
                        </Typography>
                      </Box>
                    </Stack>
                  </Paper>
                </Grid>

                <Grid size={{ xs: 12, sm: 6 }}>
                  <Paper
                    variant="outlined"
                    onClick={() => update("frequencyMode", "batched")}
                    sx={{
                      p: 2,
                      borderRadius: 2,
                      cursor: "pointer",
                      height: "100%",
                      borderColor: s.frequencyMode === "batched" ? "primary.main" : "divider",
                      borderWidth: s.frequencyMode === "batched" ? 2 : 1,
                      transition: "all 0.2s",
                    }}
                  >
                    <Stack direction="row" alignItems="flex-start" spacing={1}>
                      <Radio value="batched" size="small" sx={{ p: 0, mt: 0.25 }} />
                      <Box>
                        <Stack direction="row" alignItems="center" spacing={1} flexWrap="wrap" gap={0.5}>
                          <AccessTimeOutlinedIcon sx={{ fontSize: 18, color: "warning.main" }} />
                          <Typography variant="subtitle2" fontWeight={700}>
                            Batched Digest
                          </Typography>
                          <Chip
                            label="Less noisy"
                            size="small"
                            color="warning"
                            sx={{ fontSize: "0.6rem", height: 16 }}
                          />
                        </Stack>
                        <Typography variant="caption" color="text.secondary" display="block" mt={0.5}>
                          Consolidate alerts into a single daily digest at your preferred time. Useful for non-critical events and reducing notification fatigue.
                        </Typography>
                      </Box>
                    </Stack>
                  </Paper>
                </Grid>
              </Grid>
            </RadioGroup>

            <Collapse in={s.frequencyMode === "batched"}>
              <Paper variant="outlined" sx={{ p: 2, borderRadius: 2, borderColor: "divider" }}>
                <Stack spacing={2}>
                  <TextField
                    label="Batch Delivery Time"
                    type="time"
                    size="small"
                    value={s.batchTime}
                    onChange={(e) => update("batchTime", e.target.value)}
                    slotProps={{ inputLabel: { shrink: true } }}
                    fullWidth
                  />
                  <Box>
                    <Typography variant="subtitle2" fontWeight={700} mb={1}>
                      Include in Batch
                    </Typography>
                    <Stack spacing={1}>
                      {ALL_BATCH_GROUPS.map((grp) => (
                        <FormControlLabel
                          key={grp}
                          control={
                            <Checkbox
                              checked={s.batchEvents.includes(grp)}
                              onChange={() => toggleBatchGroup(grp)}
                              color="primary"
                            />
                          }
                          label={grp}
                        />
                      ))}
                    </Stack>
                  </Box>
                </Stack>
              </Paper>
            </Collapse>
          </Stack>
        </SectionCard>
      </Stack>

      <Divider sx={{ my: 4 }} />

      {error && (
        <Alert severity="error" sx={{ mb: 2.5, borderRadius: 2 }}>
          {error}
        </Alert>
      )}

      {saved && (
        <Alert severity="success" sx={{ mb: 2.5, borderRadius: 2 }}>
          Notification settings saved successfully.
        </Alert>
      )}

      <Stack direction="row" spacing={2} justifyContent="flex-end">
        <Button
          variant="outlined"
          startIcon={<RestartAltOutlinedIcon />}
          onClick={handleReset}
          disabled={loading || saving}
          sx={{ borderRadius: 2, textTransform: "none", px: 3 }}
        >
          Reset to Defaults
        </Button>
        <Button
          variant="contained"
          startIcon={<SaveOutlinedIcon />}
          onClick={handleSave}
          disabled={loading || saving}
          sx={{ borderRadius: 2, textTransform: "none", px: 3 }}
        >
          {loading ? "Loading..." : saving ? "Saving..." : "Save Changes"}
        </Button>
      </Stack>
    </Box>
  );
};

export default NotificationConfig;
