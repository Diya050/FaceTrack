import { useState } from "react";
import {
  Box, Typography, Stack, Paper, Button, Divider, Switch,
  FormControlLabel, Select, MenuItem, InputLabel, FormControl,
  Chip, Alert, Tooltip, TextField, Slider, IconButton,
  Table, TableBody, TableCell, TableHead, TableRow,
} from "@mui/material";
import VideocamOutlinedIcon         from "@mui/icons-material/VideocamOutlined";
import SaveOutlinedIcon             from "@mui/icons-material/SaveOutlined";
import RestartAltOutlinedIcon       from "@mui/icons-material/RestartAltOutlined";
import AddCircleOutlineIcon         from "@mui/icons-material/AddCircleOutline";
import DeleteOutlineIcon            from "@mui/icons-material/DeleteOutline";
import InfoOutlinedIcon             from "@mui/icons-material/InfoOutlined";
import FiberManualRecordIcon        from "@mui/icons-material/FiberManualRecord";
import TuneOutlinedIcon             from "@mui/icons-material/TuneOutlined";
import GridViewOutlinedIcon         from "@mui/icons-material/GridViewOutlined";
import PhotoCameraOutlinedIcon      from "@mui/icons-material/PhotoCameraOutlined";

//  Types

type StreamStatus = "active" | "inactive" | "error";

interface CameraEntry {
  id: string;
  name: string;
  streamUrl: string;
  enabled: boolean;
  status: StreamStatus;
}

interface StreamQuality {
  resolution: string;
  fps: number;
  codec: string;
}

interface DetectionSettings {
  captureIntervalMs: number;
  minFaceSizePx: number;
  maxFacesPerFrame: number;
  gridLayout: string;
  autoReconnect: boolean;
  reconnectDelaySec: number;
}

// Defaults 

const DEFAULT_CAMERAS: CameraEntry[] = [
  { id: "cam-1", name: "Entrance – Main Gate",   streamUrl: "rtsp://192.168.1.101:554/stream1", enabled: true,  status: "active"   },
  { id: "cam-2", name: "Lobby – Main Building", streamUrl: "rtsp://192.168.1.102:554/stream1", enabled: true,  status: "active"   },
  { id: "cam-3", name: "Server Room - Block B - Floor 2",     streamUrl: "rtsp://192.168.1.103:554/stream1", enabled: false, status: "inactive" },
];

const DEFAULT_QUALITY: StreamQuality = {
  resolution: "1280x720",
  fps: 15,
  codec: "H.264",
};

const DEFAULT_DETECTION: DetectionSettings = {
  captureIntervalMs: 500,
  minFaceSizePx: 60,
  maxFacesPerFrame: 10,
  gridLayout: "2x2",
  autoReconnect: true,
  reconnectDelaySec: 5,
};

//  Helpers 

const statusMeta: Record<StreamStatus, { label: string; color: "success" | "error" | "default" }> = {
  active:   { label: "Active",   color: "success" },
  inactive: { label: "Inactive", color: "default" },
  error:    { label: "Error",    color: "error"   },
};

const activeCamCount = (cams: CameraEntry[]) =>
  cams.filter((c) => c.enabled && c.status === "active").length;

let nextId = 4;
const newCamera = (): CameraEntry => ({
  id: `cam-${nextId++}`,
  name: "",
  streamUrl: "",
  enabled: true,
  status: "inactive",
});

//  Sub-components 

interface SectionCardProps {
  icon: React.ReactNode;
  title: string;
  subtitle: string;
  children: React.ReactNode;
}

const SectionCard = ({ icon, title, subtitle, children }: SectionCardProps) => (
  <Paper variant="outlined" sx={{ borderRadius: 2, borderColor: "divider", overflow: "hidden" }}>
    <Box sx={{ px: 2.5, pt: 2.5, pb: 1.5 }}>
      <Stack direction="row" alignItems="center" spacing={1.5} mb={2}>
        <Box
          sx={{
            width: 36, height: 36, borderRadius: 1.5,
            bgcolor: "primary.main", display: "flex",
            alignItems: "center", justifyContent: "center", flexShrink: 0,
          }}
        >
          {icon}
        </Box>
        <Box>
          <Typography variant="subtitle1" fontWeight={700} color="text.primary">{title}</Typography>
          <Typography variant="caption" color="text.secondary">{subtitle}</Typography>
        </Box>
      </Stack>
      <Divider sx={{ mb: 2 }} />
      {children}
    </Box>
  </Paper>
);

//  Main Component

const CameraSetup = () => {
  const [cameras, setCameras]         = useState<CameraEntry[]>(DEFAULT_CAMERAS);
  const [quality, setQuality]         = useState<StreamQuality>(DEFAULT_QUALITY);
  const [detection, setDetection]     = useState<DetectionSettings>(DEFAULT_DETECTION);
  const [saved, setSaved]             = useState(false);

  // Camera list handlers
  const toggleCamera = (id: string) =>
    setCameras((prev) => prev.map((c) => c.id === id ? { ...c, enabled: !c.enabled } : c));

  const updateCamera = (id: string, field: keyof CameraEntry, value: string) =>
    setCameras((prev) => prev.map((c) => c.id === id ? { ...c, [field]: value } : c));

  const addCamera = () => setCameras((prev) => [...prev, newCamera()]);

  const removeCamera = (id: string) => setCameras((prev) => prev.filter((c) => c.id !== id));

  // Save / Reset
  const handleSave = () => {
    setSaved(true);
    setTimeout(() => setSaved(false), 3000);
  };

  const handleReset = () => {
    setCameras(DEFAULT_CAMERAS);
    setQuality(DEFAULT_QUALITY);
    setDetection(DEFAULT_DETECTION);
    setSaved(false);
  };

  const setQ = (field: keyof StreamQuality) => (value: string | number) =>
    setQuality((prev) => ({ ...prev, [field]: value }));

  const setD = (field: keyof DetectionSettings) => (value: string | number | boolean) =>
    setDetection((prev) => ({ ...prev, [field]: value }));

  const active = activeCamCount(cameras);

  return (
    <Box>
      {/* ── Section Header ── */}
      <Stack direction="row" alignItems="center" spacing={1.5} mb={3}>
        <Box
          sx={{
            width: 40, height: 40, borderRadius: 2,
            bgcolor: "primary.main", display: "flex",
            alignItems: "center", justifyContent: "center",
          }}
        >
          <VideocamOutlinedIcon sx={{ color: "white", fontSize: 20 }} />
        </Box>
        <Box>
          <Typography variant="h6" fontWeight={700} color="text.primary">
            Camera Setup
          </Typography>
          <Typography variant="caption" color="text.secondary">
            Manage camera streams, quality, and detection parameters
          </Typography>
        </Box>
        <Box flex={1} />
        <Chip
          label={`${active} / ${cameras.length} Active`}
          color={active === cameras.length ? "success" : active > 0 ? "warning" : "error"}
          size="small"
          variant="outlined"
          sx={{ fontWeight: 600 }}
        />
      </Stack>

      <Divider sx={{ mb: 3 }} />

      {saved && (
        <Alert severity="success" sx={{ mb: 3, borderRadius: 2 }}>
          Camera settings saved successfully.
        </Alert>
      )}

      <Stack spacing={3}>

        {/* ── 1. Camera Streams ── */}
        <SectionCard
          icon={<VideocamOutlinedIcon sx={{ color: "white", fontSize: 18 }} />}
          title="Camera Streams"
          subtitle="Add, remove, and configure individual camera feeds"
        >
          <Table size="small">
            <TableHead>
              <TableRow sx={{ "& th": { fontWeight: 600, color: "text.secondary", fontSize: "0.75rem", py: 1, border: "none" } }}>
                <TableCell>Camera Name</TableCell>
                <TableCell>Stream URL</TableCell>
                <TableCell align="center">Status</TableCell>
                <TableCell align="center">Enabled</TableCell>
                <TableCell align="center">Remove</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {cameras.map((cam) => (
                <TableRow key={cam.id} sx={{ "& td": { py: 1, border: "none" } }}>
                  <TableCell sx={{ minWidth: 160 }}>
                    <TextField
                      size="small"
                      value={cam.name}
                      placeholder="e.g. Entrance – Main Gate"
                      onChange={(e) => updateCamera(cam.id, "name", e.target.value)}
                      sx={{ width: "100%" }}
                    />
                  </TableCell>
                  <TableCell sx={{ minWidth: 220 }}>
                    <TextField
                      size="small"
                      value={cam.streamUrl}
                      placeholder="rtsp://..."
                      onChange={(e) => updateCamera(cam.id, "streamUrl", e.target.value)}
                      sx={{ width: "100%" }}
                    />
                  </TableCell>
                  <TableCell align="center">
                    <Chip
                      icon={<FiberManualRecordIcon sx={{ fontSize: "10px !important" }} />}
                      label={statusMeta[cam.status].label}
                      color={statusMeta[cam.status].color}
                      size="small"
                      variant="outlined"
                      sx={{ fontWeight: 600, fontSize: "0.7rem" }}
                    />
                  </TableCell>
                  <TableCell align="center">
                    <Switch
                      checked={cam.enabled}
                      onChange={() => toggleCamera(cam.id)}
                      size="small"
                      color="primary"
                    />
                  </TableCell>
                  <TableCell align="center">
                    <Tooltip title="Remove camera">
                      <IconButton
                        size="small"
                        color="error"
                        onClick={() => removeCamera(cam.id)}
                        disabled={cameras.length <= 1}
                      >
                        <DeleteOutlineIcon fontSize="small" />
                      </IconButton>
                    </Tooltip>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>

          <Button
            startIcon={<AddCircleOutlineIcon />}
            size="small"
            variant="outlined"
            sx={{ mt: 2, textTransform: "none", borderRadius: 2 }}
            onClick={addCamera}
          >
            Add Camera
          </Button>
        </SectionCard>

        {/* ── 2. Stream Quality ── */}
        <SectionCard
          icon={<GridViewOutlinedIcon sx={{ color: "white", fontSize: 18 }} />}
          title="Stream Quality"
          subtitle="Set resolution, frame rate, and encoding codec for all streams"
        >
          <Stack spacing={2.5}>
            <Stack direction={{ xs: "column", sm: "row" }} spacing={2}>
              <FormControl size="small" sx={{ minWidth: 160 }}>
                <InputLabel>Resolution</InputLabel>
                <Select
                  value={quality.resolution}
                  label="Resolution"
                  onChange={(e) => setQ("resolution")(e.target.value)}
                >
                  {["640x480", "1280x720", "1920x1080", "2560x1440"].map((r) => (
                    <MenuItem key={r} value={r}>{r}</MenuItem>
                  ))}
                </Select>
              </FormControl>

              <FormControl size="small" sx={{ minWidth: 140 }}>
                <InputLabel>Codec</InputLabel>
                <Select
                  value={quality.codec}
                  label="Codec"
                  onChange={(e) => setQ("codec")(e.target.value)}
                >
                  {["H.264", "H.265", "MJPEG", "VP8"].map((c) => (
                    <MenuItem key={c} value={c}>{c}</MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Stack>

            <Box>
              <Stack direction="row" alignItems="center" spacing={1} mb={0.5}>
                <Typography variant="subtitle2" fontWeight={600}>Frame Rate</Typography>
                <Tooltip title="Higher FPS increases CPU load for face detection workers" arrow placement="right">
                  <InfoOutlinedIcon sx={{ fontSize: 16, color: "text.secondary", cursor: "pointer" }} />
                </Tooltip>
                <Box flex={1} />
                <Typography variant="body2" fontWeight={700} color="primary.main">
                  {quality.fps} FPS
                </Typography>
              </Stack>
              <Typography variant="caption" color="text.secondary" display="block" mb={1.5}>
                Frames per second captured from each camera stream (5 – 30 FPS).
              </Typography>
              <Slider
                value={quality.fps}
                min={5}
                max={30}
                step={5}
                marks={[5, 10, 15, 20, 25, 30].map((v) => ({ value: v, label: `${v}` }))}
                valueLabelDisplay="auto"
                valueLabelFormat={(v) => `${v} fps`}
                onChange={(_, v) => setQ("fps")(v as number)}
                sx={{
                  color: "primary.main",
                  "& .MuiSlider-thumb": { width: 18, height: 18 },
                  "& .MuiSlider-markLabel": { fontSize: "0.7rem" },
                }}
              />
            </Box>
          </Stack>
        </SectionCard>

        {/* ── 3. Detection Settings ── */}
        <SectionCard
          icon={<TuneOutlinedIcon sx={{ color: "white", fontSize: 18 }} />}
          title="Detection Parameters"
          subtitle="Control how frames are sampled and how faces are detected per frame"
        >
          <Stack spacing={2.5}>
            {/* Capture interval */}
            <Box>
              <Stack direction="row" alignItems="center" spacing={1} mb={0.5}>
                <Typography variant="subtitle2" fontWeight={600}>Frame Capture Interval</Typography>
                <Tooltip title="How often a frame is extracted from the stream for face detection. Lower values increase accuracy but raise CPU usage." arrow placement="right">
                  <InfoOutlinedIcon sx={{ fontSize: 16, color: "text.secondary", cursor: "pointer" }} />
                </Tooltip>
                <Box flex={1} />
                <Typography variant="body2" fontWeight={700} color="primary.main">
                  {detection.captureIntervalMs} ms
                </Typography>
              </Stack>
              <Typography variant="caption" color="text.secondary" display="block" mb={1.5}>
                Interval between consecutive frames sent to RetinaFace for detection (100 – 2000 ms).
              </Typography>
              <Slider
                value={detection.captureIntervalMs}
                min={100}
                max={2000}
                step={100}
                marks={[100, 500, 1000, 1500, 2000].map((v) => ({ value: v, label: `${v}` }))}
                valueLabelDisplay="auto"
                valueLabelFormat={(v) => `${v} ms`}
                onChange={(_, v) => setD("captureIntervalMs")(v as number)}
                sx={{
                  color: "primary.main",
                  "& .MuiSlider-thumb": { width: 18, height: 18 },
                  "& .MuiSlider-markLabel": { fontSize: "0.7rem" },
                }}
              />
            </Box>

            {/* Min face size */}
            <Box>
              <Stack direction="row" alignItems="center" spacing={1} mb={0.5}>
                <Typography variant="subtitle2" fontWeight={600}>Minimum Face Size</Typography>
                <Tooltip title="Faces smaller than this pixel dimension are ignored. Increase to reduce false positives from distant subjects." arrow placement="right">
                  <InfoOutlinedIcon sx={{ fontSize: 16, color: "text.secondary", cursor: "pointer" }} />
                </Tooltip>
                <Box flex={1} />
                <Typography variant="body2" fontWeight={700} color="primary.main">
                  {detection.minFaceSizePx} px
                </Typography>
              </Stack>
              <Typography variant="caption" color="text.secondary" display="block" mb={1.5}>
                Minimum bounding-box side length (in pixels) for a face to be processed (20 – 200 px).
              </Typography>
              <Slider
                value={detection.minFaceSizePx}
                min={20}
                max={200}
                step={10}
                marks={[20, 60, 100, 150, 200].map((v) => ({ value: v, label: `${v}` }))}
                valueLabelDisplay="auto"
                valueLabelFormat={(v) => `${v} px`}
                onChange={(_, v) => setD("minFaceSizePx")(v as number)}
                sx={{
                  color: "primary.main",
                  "& .MuiSlider-thumb": { width: 18, height: 18 },
                  "& .MuiSlider-markLabel": { fontSize: "0.7rem" },
                }}
              />
            </Box>

            {/* Max faces per frame */}
            <Box>
              <Stack direction="row" alignItems="center" spacing={1} mb={0.5}>
                <Typography variant="subtitle2" fontWeight={600}>Max Faces per Frame</Typography>
                <Box flex={1} />
                <Typography variant="body2" fontWeight={700} color="primary.main">
                  {detection.maxFacesPerFrame}
                </Typography>
              </Stack>
              <Typography variant="caption" color="text.secondary" display="block" mb={1.5}>
                Upper limit on simultaneous face recognitions per captured frame (1 – 20).
              </Typography>
              <Slider
                value={detection.maxFacesPerFrame}
                min={1}
                max={20}
                step={1}
                marks={[1, 5, 10, 15, 20].map((v) => ({ value: v, label: `${v}` }))}
                valueLabelDisplay="auto"
                onChange={(_, v) => setD("maxFacesPerFrame")(v as number)}
                sx={{
                  color: "primary.main",
                  "& .MuiSlider-thumb": { width: 18, height: 18 },
                  "& .MuiSlider-markLabel": { fontSize: "0.7rem" },
                }}
              />
            </Box>
          </Stack>
        </SectionCard>

        {/* ── 4. Display & Reconnect ── */}
        <SectionCard
          icon={<PhotoCameraOutlinedIcon sx={{ color: "white", fontSize: 18 }} />}
          title="Display & Reconnect"
          subtitle="Configure the monitoring grid layout and automatic stream reconnection"
        >
          <Stack spacing={2.5}>
            <Stack direction={{ xs: "column", sm: "row" }} spacing={2} alignItems="flex-start">
              <FormControl size="small" sx={{ minWidth: 160 }}>
                <InputLabel>Grid Layout</InputLabel>
                <Select
                  value={detection.gridLayout}
                  label="Grid Layout"
                  onChange={(e) => setD("gridLayout")(e.target.value)}
                >
                  {["1x1", "1x2", "2x2", "2x3", "3x3"].map((g) => (
                    <MenuItem key={g} value={g}>{g}</MenuItem>
                  ))}
                </Select>
              </FormControl>

              <TextField
                size="small"
                label="Reconnect Delay (s)"
                type="number"
                disabled={!detection.autoReconnect}
                value={detection.reconnectDelaySec}
                onChange={(e) => setD("reconnectDelaySec")(Number(e.target.value))}
                inputProps={{ min: 1, max: 60 }}
                sx={{ width: 180 }}
              />
            </Stack>

            <FormControlLabel
              control={
                <Switch
                  checked={detection.autoReconnect}
                  onChange={(e) => setD("autoReconnect")(e.target.checked)}
                  color="primary"
                />
              }
              label={
                <Box>
                  <Typography variant="body2" fontWeight={600}>Auto-Reconnect</Typography>
                  <Typography variant="caption" color="text.secondary">
                    Automatically attempt to reconnect dropped camera streams
                  </Typography>
                </Box>
              }
            />
          </Stack>
        </SectionCard>

      </Stack>

      {/* ── Action Buttons ── */}
      <Stack direction="row" spacing={2} justifyContent="flex-end" mt={4}>
        <Button
          variant="outlined"
          startIcon={<RestartAltOutlinedIcon />}
          onClick={handleReset}
          sx={{ textTransform: "none", borderRadius: 2 }}
        >
          Reset to Defaults
        </Button>
        <Button
          variant="contained"
          startIcon={<SaveOutlinedIcon />}
          onClick={handleSave}
          sx={{ textTransform: "none", borderRadius: 2 }}
        >
          Save Changes
        </Button>
      </Stack>
    </Box>
  );
};

export default CameraSetup;