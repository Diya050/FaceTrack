import { useEffect, useState } from "react";
import {
  Box, Typography, Stack, Switch, Divider, Button,
  Alert, Paper, TextField, Chip, Select, MenuItem, InputLabel,
  FormControl, Grid, Collapse, Slider,
} from "@mui/material";
import NotificationsNoneOutlinedIcon from "@mui/icons-material/NotificationsNoneOutlined";
import SaveOutlinedIcon from "@mui/icons-material/SaveOutlined";
import RestartAltOutlinedIcon from "@mui/icons-material/RestartAltOutlined";
import PauseCircleOutlineIcon from "@mui/icons-material/PauseCircleOutline";
import DoNotDisturbOnOutlinedIcon from "@mui/icons-material/DoNotDisturbOnOutlined";
import VolumeUpOutlinedIcon from "@mui/icons-material/VolumeUpOutlined";
import TuneOutlinedIcon from "@mui/icons-material/TuneOutlined";
import api from "../../../../services/api";
import { playNotificationSound, type NotificationSound } from "../../../../utils/notificationSounds";

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

const SOUND_OPTIONS: Array<{ value: NotificationSound; label: string; description: string }> = [
  { value: "chime", label: "Chime", description: "A layered tone for general alerts" },
  { value: "ping", label: "Ping", description: "Sharper and more noticeable" },
  { value: "ding", label: "Ding", description: "Short and balanced" },
  { value: "beep", label: "Beep", description: "Minimal single-tone alert" },
  { value: "none", label: "Silent", description: "No sound playback" },
];

const createDefaultSettings = (): Settings => ({
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
});

const normalizeSettings = (value: unknown): Settings => {
  const defaults = createDefaultSettings();

  if (typeof value === "string") {
    try {
      return normalizeSettings(JSON.parse(value));
    } catch {
      return defaults;
    }
  }

  if (!value || typeof value !== "object") {
    return defaults;
  }

  const raw = value as Partial<Settings>;

  return {
    pauseAll: Boolean(raw.pauseAll),
    dndEnabled: Boolean(raw.dndEnabled),
    dndStart: typeof raw.dndStart === "string" ? raw.dndStart : defaults.dndStart,
    dndEnd: typeof raw.dndEnd === "string" ? raw.dndEnd : defaults.dndEnd,
    alertSound:
      raw.alertSound === "ping" ||
      raw.alertSound === "ding" ||
      raw.alertSound === "beep" ||
      raw.alertSound === "none"
        ? raw.alertSound
        : defaults.alertSound,
    alertVolume: typeof raw.alertVolume === "number" ? raw.alertVolume : defaults.alertVolume,
    adminContacts:
      Array.isArray(raw.adminContacts) && raw.adminContacts.length > 0
        ? raw.adminContacts
        : defaults.adminContacts,
    frequencyMode: raw.frequencyMode === "batched" ? "batched" : "instant",
    batchTime: typeof raw.batchTime === "string" ? raw.batchTime : defaults.batchTime,
    batchEvents:
      Array.isArray(raw.batchEvents) && raw.batchEvents.length > 0
        ? raw.batchEvents
        : defaults.batchEvents,
  };
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
  const [s, setS] = useState<Settings>(() => createDefaultSettings());
  const [saved, setSaved] = useState(false);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [savingSound, setSavingSound] = useState(false);
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
            setS(normalizeSettings(scopedSettings));
          } else if (data.notification_config) {
            // Backward compatibility: accept legacy flat notification_config shape.
            setS(normalizeSettings(data.notification_config));
          } else {
            setS(createDefaultSettings());
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

  const handleSave = () => {
    setSaving(true);
    setSavingSound(false);
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
        window.dispatchEvent(
          new CustomEvent("notification-settings-updated", {
            detail: {
              pauseAll: s.pauseAll,
              dndEnabled: s.dndEnabled,
              dndStart: s.dndStart,
              dndEnd: s.dndEnd,
              alertSound: s.alertSound,
              alertVolume: s.alertVolume,
            },
          })
        );
        setSaved(true);
      })
      .catch(() => {
        setError("Failed to save notification settings.");
      })
      .finally(() => {
        setSaving(false);
      });
  };

  const handleSaveSound = () => {
    setSavingSound(true);
    setSaved(false);
    setError("");

    const rootScopedSettings =
      notificationConfigRoot.notification_settings &&
      typeof notificationConfigRoot.notification_settings === "object"
        ? normalizeSettings(notificationConfigRoot.notification_settings)
        : normalizeSettings(notificationConfigRoot);

    const nextSettings: Settings = {
      ...rootScopedSettings,
      alertSound: s.alertSound,
      alertVolume: s.alertVolume,
    };

    api
      .put("/organizations/me", {
        notification_config: {
          ...notificationConfigRoot,
          notification_settings: nextSettings,
        },
      })
      .then(() => {
        setNotificationConfigRoot((prev) => ({
          ...prev,
          notification_settings: nextSettings,
        }));
        setS((prev) => ({
          ...prev,
          alertSound: nextSettings.alertSound,
          alertVolume: nextSettings.alertVolume,
        }));
        window.dispatchEvent(
          new CustomEvent("notification-settings-updated", {
            detail: {
              pauseAll: nextSettings.pauseAll,
              dndEnabled: nextSettings.dndEnabled,
              dndStart: nextSettings.dndStart,
              dndEnd: nextSettings.dndEnd,
              alertSound: nextSettings.alertSound,
              alertVolume: nextSettings.alertVolume,
            },
          })
        );
        setSaved(true);
      })
      .catch(() => {
        setError("Failed to save sound settings.");
      })
      .finally(() => {
        setSavingSound(false);
      });
  };

  const handleReset = () => {
    setS(createDefaultSettings());
    setSaved(false);
    setError("");
  };

  const handlePreviewSound = () => {
    void playNotificationSound(s.alertSound as NotificationSound, s.alertVolume);
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
                        {SOUND_OPTIONS.map((option) => (
                          <MenuItem key={option.value} value={option.value}>
                            <Box sx={{ display: "flex", flexDirection: "column", alignItems: "flex-start" }}>
                              <Typography variant="body2" fontWeight={600}>
                                {option.label}
                              </Typography>
                              <Typography variant="caption" color="text.secondary">
                                {option.description}
                              </Typography>
                            </Box>
                          </MenuItem>
                        ))}
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
                    <Stack direction="row" justifyContent="space-between" alignItems="center" spacing={1}>
                      <Typography variant="caption" color="text.secondary">
                        Preview the currently selected sound before saving.
                      </Typography>
                      <Button
                        size="small"
                        variant="text"
                        onClick={handlePreviewSound}
                        disabled={s.alertSound === "none"}
                        sx={{ textTransform: "none", fontWeight: 600 }}
                      >
                        Preview Sound
                      </Button>
                    </Stack>
                    <Stack direction="row" justifyContent="flex-end">
                      <Button
                        size="small"
                        variant="contained"
                        startIcon={<SaveOutlinedIcon />}
                        onClick={handleSaveSound}
                        disabled={loading || saving || savingSound}
                        sx={{ textTransform: "none", borderRadius: 1.5 }}
                      >
                        {savingSound ? "Saving Sound..." : "Save Sound"}
                      </Button>
                    </Stack>
                  </Stack>
                </Paper>
              </Grid>
            </Grid>
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
