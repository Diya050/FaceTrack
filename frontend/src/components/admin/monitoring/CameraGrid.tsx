import React, { useState } from "react";
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
} from "@mui/material";
import {
  Pause,
  PlayArrow,
  CameraAlt,
  Fullscreen,
} from "@mui/icons-material";


//  Types
type CameraStatus = "live" | "lag" | "offline";

type RecognizedFace = {
  id: string;
  name: string;
  confidence: number;
  department: string;
};

type CameraFeed = {
  id: string;
  name: string;
  location: string;
  status: CameraStatus;
  fps: number;
  latency: number;
  faces: RecognizedFace[];
};


//  Mock Data

const MOCK_CAMERAS: CameraFeed[] = [
  {
    id: "cam-1",
    name: "Entrance Gate",
    location: "Block A - Floor 1",
    status: "live",
    fps: 27,
    latency: 98,
    faces: [
      { id: "1", name: "Rahul Sharma", confidence: 97, department: "IT" },
      { id: "2", name: "Unknown", confidence: 51, department: "—" },
    ],
  },
  {
    id: "cam-2",
    name: "Lobby",
    location: "Main Building",
    status: "lag",
    fps: 18,
    latency: 240,
    faces: [
      { id: "3", name: "Anjali Verma", confidence: 94, department: "HR" },
    ],
  },
  {
    id: "cam-3",
    name: "Server Room",
    location: "Block B - Floor 2",
    status: "live",
    fps: 30,
    latency: 72,
    faces: [],
  },
  {
    id: "cam-4",
    name: "Parking Exit",
    location: "Basement",
    status: "offline",
    fps: 0,
    latency: 0,
    faces: [],
  },
];


//  Helpers

const statusColor = (
  status: CameraStatus
): "success" | "warning" | "error" => {
  if (status === "live") return "success";
  if (status === "lag") return "warning";
  return "error";
};


//  Component

const CameraGrid: React.FC = () => {
  const [paused, setPaused] = useState<
    Record<CameraFeed["id"], boolean>
  >({});

  const toggleStream = (id: CameraFeed["id"]) => {
    setPaused((prev) => ({ ...prev, [id]: !prev[id] }));

    /*
      Backend Integration Placeholder:
      POST /api/cameras/{id}/pause
      POST /api/cameras/{id}/resume
    */
  };

  const openFullscreen = (id: CameraFeed["id"]) => {
    /*
      Backend + Routing Placeholder:
      Navigate to:
      /admin/live-monitoring/fullscreen/{id}
    */
    console.log("Open fullscreen view for:", id);
  };

  return (
    <Box sx={{ mt: 8, p: 4, bgcolor: "#F8F9FA", minHeight: "100vh" }}>
      <Typography variant="h5" fontWeight={700} mb={3}>
        Live Camera Grid
      </Typography>

      <Grid container spacing={3}>
        {MOCK_CAMERAS.map((cam) => {
          const statusLabel = cam.status.toUpperCase();

          return (
            <Grid key={cam.id} size={{ xs: 12, sm: 6, md: 4, lg: 6 }}>
              <Card elevation={0} sx={{ borderRadius: 3 }}>
                <CardContent sx={{ p: 1.5 }}>
                  {/* Video Feed */}
                  <Box
                    sx={{
                      height: 190,
                      borderRadius: 2,
                      bgcolor: "#0E1320",
                      position: "relative",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      color: "#8F9AA6",
                      fontSize: 13,
                    }}
                  >
                    {cam.status === "offline"
                      ? "Camera Offline"
                      : paused[cam.id]
                        ? "Stream Paused"
                        : "Live Video Stream"}

                    {/* Status Overlay */}
                    <Stack
                      direction="row"
                      spacing={1}
                      sx={{ position: "absolute", top: 8, left: 8 }}
                    >
                      <Chip
                        size="small"
                        color={statusColor(cam.status)}
                        label={statusLabel}
                      />

                      <Chip
                        size="small"
                        label={`${cam.fps} FPS`}
                        sx={{
                          color: "#8F9AA6",
                          bgcolor: "rgba(255,255,255,0.06)",
                          fontWeight: 500,
                        }}
                      />

                      <Chip
                        size="small"
                        label={`${cam.latency} ms`}
                        sx={{
                          color: "#8F9AA6",
                          bgcolor: "rgba(255,255,255,0.06)",
                          fontWeight: 500,
                        }}
                      />
                    </Stack>

                    {/* Controls */}
                    <Stack
                      direction="row"
                      spacing={1}
                      sx={{ position: "absolute", top: 8, right: 8 }}
                    >
                      <Tooltip title="Pause / Resume">
                        <IconButton
                          size="small"
                          onClick={() => toggleStream(cam.id)}
                          sx={{ color: "#FFF" }}
                        >
                          {paused[cam.id] ? (
                            <PlayArrow />
                          ) : (
                            <Pause />
                          )}
                        </IconButton>
                      </Tooltip>

                      <Tooltip title="Take Snapshot">
                        <IconButton size="small" sx={{ color: "#FFF" }}>
                          <CameraAlt />
                        </IconButton>
                      </Tooltip>

                      <Tooltip title="Fullscreen View">
                        <IconButton
                          size="small"
                          sx={{ color: "#FFF" }}
                          onClick={() => openFullscreen(cam.id)}
                        >
                          <Fullscreen />
                        </IconButton>
                      </Tooltip>
                    </Stack>
                  </Box>

                  {/* Metadata */}
                  <Stack spacing={0.4} mt={1.5}>
                    <Typography fontWeight={600}>{cam.name}</Typography>
                    <Typography fontSize={12} color="text.secondary">
                      {cam.location}
                    </Typography>
                  </Stack>

                  {/* Recognition Overlay */}
                  {cam.faces.length > 0 && (
                    <Stack spacing={0.8} mt={1.5}>
                      {cam.faces.map((face) => (
                        <Box
                          key={face.id}
                          sx={{
                            bgcolor: "rgba(15,20,40,0.04)",
                            p: 1,
                            borderRadius: 1.5,
                          }}
                        >
                          <Stack
                            direction="row"
                            justifyContent="space-between"
                            alignItems="center"
                          >
                            <Typography fontSize={13} fontWeight={600}>
                              {face.name}
                            </Typography>
                            <Chip
                              size="small"
                              label={`${face.confidence}%`}
                              color={
                                face.confidence >= 85
                                  ? "success"
                                  : "warning"
                              }
                            />
                          </Stack>

                          <Typography
                            fontSize={11}
                            color="text.secondary"
                          >
                            {face.department}
                          </Typography>
                        </Box>
                      ))}
                    </Stack>
                  )}
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

/*
Backend Integration:

POST /api/cameras/{id}/pause
POST /api/cameras/{id}/resume
GET  /api/cameras/live-stream
GET  /api/cameras/health
WS   /ws/live-recognition-events
*/