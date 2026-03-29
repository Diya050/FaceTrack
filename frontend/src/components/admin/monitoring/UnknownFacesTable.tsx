import { useState, useEffect } from "react";
import {
  Table, TableBody, TableCell, TableContainer, TableHead,
  TableRow, Paper, Typography, Box, Chip,
  IconButton, Tooltip, CircularProgress, Stack
} from "@mui/material";

import {
  DeleteOutline,
  PersonAddOutlined,
  RefreshOutlined,
  WarningAmberOutlined
} from "@mui/icons-material";

import { unknownFacesService } from "../../../services/unknownFaces";
import type { UnknownFace } from "../../../services/unknownFaces";
import FaceDetectionCard from "./FaceDetectionCard";
import AssignEmployeeDialog from "./AssignEmployeeDialog";

import { format } from "date-fns";

const THEME_NAVY = "#30364F";

export default function UnknownFacesTable() {
  const [faces, setFaces] = useState<UnknownFace[]>([]);
  const [loading, setLoading] = useState(true);

  // Dialog state
  const [dialogOpen, setDialogOpen] = useState(false);
  const [selectedFace, setSelectedFace] = useState<UnknownFace | null>(null);

  // Fetch faces
  const fetchFaces = async () => {
    setLoading(true);
    try {
      const data = await unknownFacesService.getUnknownFaces();
      setFaces(data.filter(f => !f.resolved));
    } catch (err) {
      console.error("Failed to load unknown faces", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchFaces();
  }, []);

  // Open assign dialog
  const handleAssignClick = (face: UnknownFace) => {
    setSelectedFace(face);
    setDialogOpen(true);
  };

  // Submit assign
  const handleAssignSubmit = async (employeeId: string) => {
    if (!selectedFace) return;

    try {
      await unknownFacesService.resolveFace({
        unknown_id: selectedFace.unknown_id,
        employee_id: employeeId,
        action: "MAP_EMPLOYEE"
      });

      fetchFaces();
    } catch (err) {
      console.error("Mapping failed", err);
    }
  };

  // Security alert
  const handleSecurityAlert = async (face: UnknownFace) => {
    try {
      await unknownFacesService.resolveFace({
        unknown_id: face.unknown_id,
        action: "SECURITY_ALERT"
      });

      fetchFaces();
    } catch (err) {
      console.error("Security alert failed", err);
    }
  };

  // Delete
  const handleDelete = async (face: UnknownFace) => {
    const confirmDelete = window.confirm("Delete this detection permanently?");
    if (!confirmDelete) return;

    try {
      await unknownFacesService.deleteFace(face.unknown_id);
      fetchFaces();
    } catch (err) {
      console.error("Delete failed", err);
    }
  };

  // Loader
  if (loading) {
    return (
      <Box sx={{ display: "flex", justifyContent: "center", py: 10 }}>
        <CircularProgress sx={{ color: THEME_NAVY }} />
      </Box>
    );
  }

  return (
    <>
      <TableContainer
        component={Paper}
        elevation={0}
        sx={{
          borderRadius: "16px",
          border: "1px solid #E0E4EC"
        }}
      >
        {/* HEADER */}
        <Box
          sx={{
            px: 4,
            py: 3,
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center"
          }}
        >
          <Box>
            <Typography variant="h5" fontWeight={800} color={THEME_NAVY}>
              Unknown Face Detections
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Review unidentified personnel detected by the system.
            </Typography>
          </Box>

          <Stack direction="row" spacing={2}>
            <Chip
              label={`${faces.length} Unresolved`}
              sx={{
                bgcolor: "rgba(48,54,79,0.1)",
                color: THEME_NAVY,
                fontWeight: 700
              }}
            />
            <IconButton onClick={fetchFaces}>
              <RefreshOutlined />
            </IconButton>
          </Stack>
        </Box>

        <Table>
          <TableHead sx={{ bgcolor: "#F8F9FB" }}>
            <TableRow>
              <TableCell sx={{ fontWeight: 700 }}>Snapshot</TableCell>
              <TableCell sx={{ fontWeight: 700 }}>Detected At</TableCell>
              <TableCell sx={{ fontWeight: 700 }}>Camera</TableCell>
              <TableCell sx={{ fontWeight: 700 }}>Confidence</TableCell>
              <TableCell sx={{ fontWeight: 700 }} align="right">
                Actions
              </TableCell>
            </TableRow>
          </TableHead>

          <TableBody>
            {faces.map((face) => (
              <TableRow key={face.unknown_id} hover>
                {/* IMAGE */}
                <TableCell>
                  <Box sx={{ width: 160 }}>
                    <FaceDetectionCard imagePath={face.image_path} />
                  </Box>
                </TableCell>

                {/* DATE */}
                <TableCell>
                  {face.detected_time
                    ? format(new Date(face.detected_time), "MMM dd yyyy, hh:mm a")
                    : "N/A"}
                </TableCell>

                {/* CAMERA */}
                <TableCell>{face.camera_name || "Unknown Camera"}</TableCell>

                {/* CONFIDENCE */}
                <TableCell>
                  <Chip
                    label={
                      face.confidence_score
                        ? `${(face.confidence_score * 100).toFixed(1)}%`
                        : "N/A"
                    }
                    sx={{ fontWeight: 600 }}
                  />
                </TableCell>

                {/* ACTIONS */}
                <TableCell align="right">
                  <Stack direction="row" spacing={1} justifyContent="flex-end">

                    {/* Assign */}
                    <Tooltip title="Assign to Employee">
                      <IconButton onClick={() => handleAssignClick(face)}>
                        <PersonAddOutlined />
                      </IconButton>
                    </Tooltip>

                    {/* Security Alert */}
                    <Tooltip title="Mark as Security Risk">
                      <IconButton
                        color="warning"
                        onClick={() => handleSecurityAlert(face)}
                      >
                        <WarningAmberOutlined />
                      </IconButton>
                    </Tooltip>

                    {/* Delete */}
                    <Tooltip title="Delete Permanently">
                      <IconButton
                        color="error"
                        onClick={() => handleDelete(face)}
                      >
                        <DeleteOutline />
                      </IconButton>
                    </Tooltip>

                  </Stack>
                </TableCell>
              </TableRow>
            ))}

            {/* EMPTY STATE */}
            {faces.length === 0 && (
              <TableRow>
                <TableCell colSpan={5} align="center" sx={{ py: 10 }}>
                  <Box sx={{ opacity: 0.6 }}>
                    <Typography variant="h6">All clear!</Typography>
                    <Typography variant="body2">
                      No unknown faces require your attention.
                    </Typography>
                  </Box>
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </TableContainer>

      {/* ASSIGN DIALOG */}
      <AssignEmployeeDialog
        open={dialogOpen}
        onClose={() => setDialogOpen(false)}
        onSubmit={handleAssignSubmit}
      />
    </>
  );
}