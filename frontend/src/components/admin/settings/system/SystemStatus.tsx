import { useState } from "react";
import {
  Box, Typography, Stack, Paper, Button, Divider, Chip,
  LinearProgress, Table, TableBody, TableCell, TableHead, TableRow,
  Tooltip, Alert, ToggleButton, ToggleButtonGroup,
} from "@mui/material";
import MonitorHeartOutlinedIcon    from "@mui/icons-material/MonitorHeartOutlined";
import MemoryOutlinedIcon          from "@mui/icons-material/MemoryOutlined";
import StorageOutlinedIcon         from "@mui/icons-material/StorageOutlined";
import FaceRetouchingNaturalIcon   from "@mui/icons-material/FaceRetouchingNatural";
import SpeedOutlinedIcon           from "@mui/icons-material/SpeedOutlined";
import TableChartOutlinedIcon      from "@mui/icons-material/TableChartOutlined";
import WarningAmberOutlinedIcon    from "@mui/icons-material/WarningAmberOutlined";
import RefreshOutlinedIcon         from "@mui/icons-material/RefreshOutlined";
import CheckCircleOutlineIcon      from "@mui/icons-material/CheckCircleOutline";
import type { ReactNode, MouseEvent } from "react";

import healthData from "../../../../data/healthData.json";

//  Types

interface Incident {
  id: string;
  severity: string;
  message: string;
}

interface CameraFeed {
  id: string;
  name: string;
  status: string;
  fps: number;
}

interface HealthState {
  lastUpdated: string;
  overview: { status: string; uptimePercent: number; activeIncidents: Incident[] };
  infrastructure: {
    cpu: { usagePercent: number };
    memory: { totalGB: number; usedGB: number };
    disk: { totalTB: number; usedTB: number };
    network: { inboundMbps: number; outboundMbps: number };
  };
  faceTrackEngine: {
    averageFps: number;
    matchingLatencyMs: number;
    livenessFailuresToday: number;
    cameras: CameraFeed[];
  };
  apm: {
    averageResponseTimeMs: number;
    p95ResponseTimeMs: number;
    errorRatePercent: number;
    requestsPerMinute: number;
    activeUsers: number;
  };
  database: {
    status: string;
    activeConnections: number;
    idleConnections: number;
    averageQueryTimeMs: number;
    storagePercentFull: number;
  };
  queues: {
    videoProcessingBacklog: number;
    failedJobsToday: number;
    processingRatePerMinute: number;
  };
}

// SectionCard

interface SectionCardProps {
  icon: ReactNode;
  title: string;
  subtitle: string;
  children: ReactNode;
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

//  Helpers 

const MetricRow = ({
  label, value, percent, color,
}: { label: string; value: string; percent: number; color: "success" | "warning" | "error" | "primary" }) => (
  <Box mb={2}>
    <Stack direction="row" justifyContent="space-between" mb={0.5}>
      <Typography variant="body2" color="text.secondary">{label}</Typography>
      <Typography variant="body2" fontWeight={700}>{value}</Typography>
    </Stack>
    <LinearProgress
      variant="determinate"
      value={Math.min(percent, 100)}
      color={color}
      sx={{ height: 7, borderRadius: 4 }}
    />
  </Box>
);

const camStatusMeta: Record<string, { label: string; color: "success" | "warning" | "error" | "default" }> = {
  online:  { label: "Online",  color: "success" },
  warning: { label: "Warning", color: "warning" },
  offline: { label: "Offline", color: "error"   },
};

const overallChipProps = (status: string): { label: string; color: "success" | "warning" | "error" } => {
  if (status === "healthy") return { label: "All Systems Operational", color: "success" };
  if (status === "warning") return { label: "Degraded Performance",    color: "warning" };
  return                           { label: "System Outage",           color: "error"   };
};

const fmtDate = (iso: string) =>
  new Date(iso).toLocaleString(undefined, {
    month: "short", day: "numeric",
    hour: "2-digit", minute: "2-digit", second: "2-digit",
  });

//  Main Component 

const SystemStatus = () => {
  const [useWarning, setUseWarning] = useState(true);
  const [lastRefreshed, setLastRefreshed]  = useState(new Date());

  const data: HealthState = useWarning ? healthData.warningState : healthData.healthyState;

  const memPercent  = (data.infrastructure.memory.usedGB  / data.infrastructure.memory.totalGB)  * 100;
  const diskPercent = (data.infrastructure.disk.usedTB    / data.infrastructure.disk.totalTB)    * 100;
  const cpuPercent  = data.infrastructure.cpu.usagePercent;

  const memColor  = memPercent  > 85 ? "error" : memPercent  > 70 ? "warning" : "success";
  const diskColor = diskPercent > 85 ? "error" : diskPercent > 70 ? "warning" : "success";
  const cpuColor  = cpuPercent  > 85 ? "error" : cpuPercent  > 65 ? "warning" : "success";

  const chip = overallChipProps(data.overview.status);

  const handleToggle = (_: MouseEvent<HTMLElement>, val: string | null) => {
    if (val !== null) setUseWarning(val === "warning");
  };

  const handleRefresh = () => setLastRefreshed(new Date());

  return (
    <Box id="system-status">
      {/* Section Header */}
      <Stack direction="row" alignItems="flex-start" justifyContent="space-between" mb={2}>
        <Stack direction="row" alignItems="center" spacing={2}>
          <Box
            sx={{
              width: 40, height: 40, borderRadius: 1.5,
              bgcolor: "primary.main", display: "flex",
              alignItems: "center", justifyContent: "center", flexShrink: 0,
            }}
          >
            <MonitorHeartOutlinedIcon sx={{ color: "#fff", fontSize: 22 }} />
          </Box>
          <Box>
            <Typography variant="h6" fontWeight={700} color="text.primary">
              System Status
            </Typography>
            <Typography variant="caption" color="text.secondary">
              Real-time health monitoring of all platform services
            </Typography>
          </Box>
        </Stack>

        <Stack direction="row" alignItems="center" spacing={1.5}>
          <ToggleButtonGroup
            value={useWarning ? "warning" : "healthy"}
            exclusive
            onChange={handleToggle}
            size="small"
            sx={{ height: 32 }}
          >
            <ToggleButton
              value="healthy"
              sx={{
                textTransform: "none", fontWeight: 600, fontSize: "0.75rem", px: 1.5,
                "&.Mui-selected": { bgcolor: "success.light", color: "success.dark", borderColor: "success.main" },
              }}
            >
              <CheckCircleOutlineIcon sx={{ fontSize: 14, mr: 0.5 }} />
              Healthy
            </ToggleButton>
            <ToggleButton
              value="warning"
              sx={{
                textTransform: "none", fontWeight: 600, fontSize: "0.75rem", px: 1.5,
                "&.Mui-selected": { bgcolor: "warning.light", color: "warning.dark", borderColor: "warning.main" },
              }}
            >
              <WarningAmberOutlinedIcon sx={{ fontSize: 14, mr: 0.5 }} />
              Warning
            </ToggleButton>
          </ToggleButtonGroup>

          <Chip
            label={chip.label}
            color={chip.color}
            variant="outlined"
            size="small"
            sx={{ fontWeight: 600 }}
          />
        </Stack>
      </Stack>

      <Divider sx={{ mb: 3 }} />

      <Stack spacing={3}>

        {/*Active Incidents  */}
        {data.overview.activeIncidents.length > 0 && (
          <Stack spacing={1}>
            {data.overview.activeIncidents.map((inc) => (
              <Alert
                key={inc.id}
                severity={inc.severity === "warning" ? "warning" : "error"}
                icon={<WarningAmberOutlinedIcon fontSize="inherit" />}
                sx={{ borderRadius: 2 }}
              >
                <strong>{inc.id}</strong> — {inc.message}
              </Alert>
            ))}
          </Stack>
        )}

        {/* ── Infrastructure Metrics ─────────────────────────────────────── */}
        <SectionCard
          icon={<MemoryOutlinedIcon sx={{ color: "#fff", fontSize: 19 }} />}
          title="Infrastructure"
          subtitle="CPU, memory, disk and network utilisation"
        >
          <MetricRow
            label="CPU Usage"
            value={`${cpuPercent.toFixed(1)}%`}
            percent={cpuPercent}
            color={cpuColor}
          />
          <MetricRow
            label="Memory"
            value={`${data.infrastructure.memory.usedGB} / ${data.infrastructure.memory.totalGB} GB`}
            percent={memPercent}
            color={memColor}
          />
          <MetricRow
            label="Disk Storage"
            value={`${data.infrastructure.disk.usedTB} / ${data.infrastructure.disk.totalTB} TB`}
            percent={diskPercent}
            color={diskColor}
          />
          <Divider sx={{ my: 1.5 }} />
          <Stack direction="row" spacing={4}>
            <Box>
              <Typography variant="caption" color="text.secondary">Inbound</Typography>
              <Typography variant="body2" fontWeight={700}>{data.infrastructure.network.inboundMbps} Mbps</Typography>
            </Box>
            <Box>
              <Typography variant="caption" color="text.secondary">Outbound</Typography>
              <Typography variant="body2" fontWeight={700}>{data.infrastructure.network.outboundMbps} Mbps</Typography>
            </Box>
            <Box>
              <Typography variant="caption" color="text.secondary">Uptime</Typography>
              <Typography variant="body2" fontWeight={700}>{data.overview.uptimePercent}%</Typography>
            </Box>
          </Stack>
        </SectionCard>

        {/* ── FaceTrack Engine ───────────────────────────────────────────── */}
        <SectionCard
          icon={<FaceRetouchingNaturalIcon sx={{ color: "#fff", fontSize: 19 }} />}
          title="FaceTrack Engine"
          subtitle="RetinaFace detection · ArcFace recognition"
        >
          <Stack direction="row" spacing={4} mb={2.5}>
            <Box>
              <Typography variant="caption" color="text.secondary">Avg FPS</Typography>
              <Typography variant="body2" fontWeight={700}>{data.faceTrackEngine.averageFps}</Typography>
            </Box>
            <Box>
              <Typography variant="caption" color="text.secondary">Matching Latency</Typography>
              <Typography variant="body2" fontWeight={700}>{data.faceTrackEngine.matchingLatencyMs} ms</Typography>
            </Box>
            <Box>
              <Typography variant="caption" color="text.secondary">Liveness Failures Today</Typography>
              <Typography
                variant="body2"
                fontWeight={700}
                color={data.faceTrackEngine.livenessFailuresToday > 10 ? "warning.main" : "text.primary"}
              >
                {data.faceTrackEngine.livenessFailuresToday}
              </Typography>
            </Box>
          </Stack>

          <Divider sx={{ mb: 1.5 }} />

          <Typography variant="caption" color="text.secondary" display="block" mb={1}>
            Camera Feeds
          </Typography>
          <Table size="small">
            <TableHead>
              <TableRow>
                <TableCell sx={{ fontWeight: 700, color: "text.secondary", fontSize: "0.72rem" }}>ID</TableCell>
                <TableCell sx={{ fontWeight: 700, color: "text.secondary", fontSize: "0.72rem" }}>Name</TableCell>
                <TableCell sx={{ fontWeight: 700, color: "text.secondary", fontSize: "0.72rem" }}>Status</TableCell>
                <TableCell sx={{ fontWeight: 700, color: "text.secondary", fontSize: "0.72rem" }} align="right">FPS</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {data.faceTrackEngine.cameras.map((cam) => {
                const meta = camStatusMeta[cam.status] ?? { label: cam.status, color: "default" };
                return (
                  <TableRow key={cam.id} hover>
                    <TableCell sx={{ fontSize: "0.8rem", color: "text.secondary" }}>{cam.id}</TableCell>
                    <TableCell sx={{ fontSize: "0.8rem" }}>{cam.name}</TableCell>
                    <TableCell>
                      <Chip label={meta.label} color={meta.color} size="small" sx={{ fontWeight: 600, fontSize: "0.7rem" }} />
                    </TableCell>
                    <TableCell align="right" sx={{ fontSize: "0.8rem", fontWeight: 600 }}>{cam.fps}</TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </SectionCard>

        {/* ── Database ───────────────────────────────────────────────────── */}
        <SectionCard
          icon={<StorageOutlinedIcon sx={{ color: "#fff", fontSize: 19 }} />}
          title="Database"
          subtitle="PostgreSQL connection pool and query performance"
        >
          <Stack direction="row" flexWrap="wrap" gap={4} mb={1.5}>
            <Box>
              <Typography variant="caption" color="text.secondary">Status</Typography>
              <Box mt={0.3}>
                <Chip
                  label={data.database.status === "connected" ? "Connected" : "Disconnected"}
                  color={data.database.status === "connected" ? "success" : "error"}
                  size="small" sx={{ fontWeight: 600, fontSize: "0.7rem" }}
                />
              </Box>
            </Box>
            <Box>
              <Typography variant="caption" color="text.secondary">Active Connections</Typography>
              <Typography variant="body2" fontWeight={700}>{data.database.activeConnections}</Typography>
            </Box>
            <Box>
              <Typography variant="caption" color="text.secondary">Idle Connections</Typography>
              <Typography variant="body2" fontWeight={700}>{data.database.idleConnections}</Typography>
            </Box>
            <Box>
              <Typography variant="caption" color="text.secondary">Avg Query Time</Typography>
              <Typography variant="body2" fontWeight={700}>{data.database.averageQueryTimeMs} ms</Typography>
            </Box>
          </Stack>
          <MetricRow
            label="Storage Used"
            value={`${data.database.storagePercentFull}%`}
            percent={data.database.storagePercentFull}
            color={data.database.storagePercentFull > 85 ? "error" : data.database.storagePercentFull > 70 ? "warning" : "primary"}
          />
        </SectionCard>

        {/* ── APM & Queue ────────────────────────────────────────────────── */}
        <Stack direction={{ xs: "column", md: "row" }} spacing={3}>
          <Box flex={1}>
            <SectionCard
              icon={<SpeedOutlinedIcon sx={{ color: "#fff", fontSize: 19 }} />}
              title="API Performance"
              subtitle="Response times and error rate"
            >
              <Stack spacing={1.5}>
                <Stack direction="row" justifyContent="space-between">
                  <Typography variant="body2" color="text.secondary">Avg Response</Typography>
                  <Typography variant="body2" fontWeight={700}>{data.apm.averageResponseTimeMs} ms</Typography>
                </Stack>
                <Stack direction="row" justifyContent="space-between">
                  <Typography variant="body2" color="text.secondary">p95 Response</Typography>
                  <Typography variant="body2" fontWeight={700}>{data.apm.p95ResponseTimeMs} ms</Typography>
                </Stack>
                <Stack direction="row" justifyContent="space-between">
                  <Typography variant="body2" color="text.secondary">Error Rate</Typography>
                  <Typography
                    variant="body2" fontWeight={700}
                    color={data.apm.errorRatePercent > 1 ? "error.main" : data.apm.errorRatePercent > 0 ? "warning.main" : "success.main"}
                  >
                    {data.apm.errorRatePercent.toFixed(2)}%
                  </Typography>
                </Stack>
                <Stack direction="row" justifyContent="space-between">
                  <Typography variant="body2" color="text.secondary">Requests / min</Typography>
                  <Typography variant="body2" fontWeight={700}>{data.apm.requestsPerMinute.toLocaleString()}</Typography>
                </Stack>
                <Stack direction="row" justifyContent="space-between">
                  <Typography variant="body2" color="text.secondary">Active Users</Typography>
                  <Typography variant="body2" fontWeight={700}>{data.apm.activeUsers}</Typography>
                </Stack>
              </Stack>
            </SectionCard>
          </Box>

          <Box flex={1}>
            <SectionCard
              icon={<TableChartOutlinedIcon sx={{ color: "#fff", fontSize: 19 }} />}
              title="Processing Queue"
              subtitle="Video processing jobs and worker throughput"
            >
              <Stack spacing={1.5}>
                <Stack direction="row" justifyContent="space-between">
                  <Typography variant="body2" color="text.secondary">Video Backlog</Typography>
                  <Tooltip title="Jobs pending in the video processing queue">
                    <Typography
                      variant="body2" fontWeight={700}
                      color={data.queues.videoProcessingBacklog > 20 ? "warning.main" : "text.primary"}
                    >
                      {data.queues.videoProcessingBacklog}
                    </Typography>
                  </Tooltip>
                </Stack>
                <Stack direction="row" justifyContent="space-between">
                  <Typography variant="body2" color="text.secondary">Failed Jobs Today</Typography>
                  <Typography
                    variant="body2" fontWeight={700}
                    color={data.queues.failedJobsToday > 0 ? "error.main" : "success.main"}
                  >
                    {data.queues.failedJobsToday}
                  </Typography>
                </Stack>
                <Stack direction="row" justifyContent="space-between">
                  <Typography variant="body2" color="text.secondary">Processing Rate</Typography>
                  <Typography variant="body2" fontWeight={700}>
                    {data.queues.processingRatePerMinute} / min
                  </Typography>
                </Stack>
              </Stack>
            </SectionCard>
          </Box>
        </Stack>

        {/* ── Footer ─────────────────────────────────────────────────────── */}
        <Stack direction="row" justifyContent="space-between" alignItems="center" pt={1}>
          <Typography variant="caption" color="text.disabled">
            Data snapshot: {fmtDate(data.lastUpdated)} &nbsp;·&nbsp; Refreshed: {fmtDate(lastRefreshed.toISOString())}
          </Typography>
          <Button
            variant="contained"
            size="small"
            startIcon={<RefreshOutlinedIcon />}
            onClick={handleRefresh}
            disableElevation
            sx={{ borderRadius: 2, textTransform: "none", fontWeight: 600 }}
          >
            Refresh
          </Button>
        </Stack>

      </Stack>
    </Box>
  );
};

export default SystemStatus;