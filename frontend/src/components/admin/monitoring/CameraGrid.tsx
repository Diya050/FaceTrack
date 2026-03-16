import React, { useState, useEffect } from "react";
import {
  Box,
  Grid,
  Card,
  CardContent,
  Typography,
  Chip,
  IconButton,
  Stack,
  Tooltip,
  CircularProgress,
} from "@mui/material";

import {
  Pause,
  PlayArrow,
  CameraAlt,
  Fullscreen,
} from "@mui/icons-material";

import CameraStream from "./CameraStream";
import { getActiveStreams } from "../../../services/cameraService";

/* ---------- Types ---------- */

type CameraStreamType = {
  camera_id: string;
  stream_url: string;
  start_time: string;
  processed_status: string;
};

/* ---------- Helpers ---------- */

const statusColor = (status: string): "success" | "warning" | "error" => {
  if (status === "processing") return "success";
  if (status === "lag") return "warning";
  return "error";
};

/* ---------- Component ---------- */

const CameraGrid: React.FC = () => {
  const [cameras, setCameras] = useState<CameraStreamType[]>([]);
  const [paused, setPaused] = useState<Record<string, boolean>>({});
  const [loading, setLoading] = useState(true);

  /* ---------- Load Cameras ---------- */

  const loadCameras = async () => {
    try {
      const data = await getActiveStreams();
      setCameras(data);
      setLoading(false);
    } catch (err) {
      console.error("Failed to load cameras:", err);
      setLoading(false);
    }
  };

  useEffect(() => {
    loadCameras();

    const interval = setInterval(loadCameras, 5000);

    return () => clearInterval(interval);
  }, []);

  /* ---------- Controls ---------- */

  const toggleStream = (cameraId: string) => {
    setPaused((prev) => ({
      ...prev,
      [cameraId]: !prev[cameraId],
    }));
  };

  const openFullscreen = (cameraId: string) => {
    window.open(`/admin/live-monitoring/fullscreen/${cameraId}`, "_blank");
  };

  /* ---------- UI ---------- */

  return (
    <Box sx={{ mt: 8, p: 4, bgcolor: "#F8F9FA", minHeight: "100vh" }}>
      <Typography variant="h5" fontWeight={700} mb={3}>
        Live Camera Grid
      </Typography>

      {/* Loading */}

      {loading && (
        <Stack alignItems="center" mt={6}>
          <CircularProgress />
        </Stack>
      )}

      {/* Empty */}

      {!loading && cameras.length === 0 && (
        <Typography color="text.secondary">
          No active camera streams
        </Typography>
      )}

      {/* Camera Grid */}

      <Grid container spacing={3}>
        {cameras.map((cam) => {
          const statusLabel =
            cam.processed_status === "processing" ? "LIVE" : "OFFLINE";

          return (
            <Grid
              key={cam.camera_id}
              size={{ xs: 12, sm: 6, md: 4, lg: 6 }}
            >
              <Card elevation={0} sx={{ borderRadius: 3 }}>
                <CardContent sx={{ p: 1.5 }}>
                  {/* Video Feed */}

                  <Box
                    sx={{
                      height: 190,
                      borderRadius: 2,
                      bgcolor: "#0E1320",
                      position: "relative",
                      overflow: "hidden",
                    }}
                  >
                    {paused[cam.camera_id] ? (
                      <Box
                        sx={{
                          height: "100%",
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          color: "#8F9AA6",
                        }}
                      >
                        Stream Paused
                      </Box>
                    ) : (
                      <CameraStream cameraId={cam.camera_id} />
                    )}

                    {/* Status Overlay */}

                    <Stack
                      direction="row"
                      spacing={1}
                      sx={{
                        position: "absolute",
                        top: 8,
                        left: 8,
                      }}
                    >
                      <Chip
                        size="small"
                        color={statusColor(cam.processed_status)}
                        label={statusLabel}
                      />
                    </Stack>

                    {/* Controls */}

                    <Stack
                      direction="row"
                      spacing={1}
                      sx={{
                        position: "absolute",
                        top: 8,
                        right: 8,
                      }}
                    >
                      <Tooltip title="Pause / Resume">
                        <IconButton
                          size="small"
                          onClick={() =>
                            toggleStream(cam.camera_id)
                          }
                          sx={{ color: "#FFF" }}
                        >
                          {paused[cam.camera_id] ? (
                            <PlayArrow />
                          ) : (
                            <Pause />
                          )}
                        </IconButton>
                      </Tooltip>

                      <Tooltip title="Take Snapshot">
                        <IconButton
                          size="small"
                          sx={{ color: "#FFF" }}
                        >
                          <CameraAlt />
                        </IconButton>
                      </Tooltip>

                      <Tooltip title="Fullscreen View">
                        <IconButton
                          size="small"
                          sx={{ color: "#FFF" }}
                          onClick={() =>
                            openFullscreen(cam.camera_id)
                          }
                        >
                          <Fullscreen />
                        </IconButton>
                      </Tooltip>
                    </Stack>
                  </Box>

                  {/* Metadata */}

                  <Stack spacing={0.4} mt={1.5}>
                    <Typography fontWeight={600}>
                      Camera {cam.camera_id.slice(0, 8)}
                    </Typography>

                    <Typography
                      fontSize={12}
                      color="text.secondary"
                    >
                      Started:{" "}
                      {new Date(
                        cam.start_time
                      ).toLocaleTimeString()}
                    </Typography>
                  </Stack>
                </CardContent>
              </Card>
            </Grid>
          );
        })}
      </Grid>
    </Box>
  );
};

export default CameraGrid;