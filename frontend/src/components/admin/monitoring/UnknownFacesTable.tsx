import { useState, useEffect } from "react";
import { 
  Table, TableBody, TableCell, TableContainer, TableHead, 
  TableRow, Paper, Typography, Box, Chip,
  IconButton, Tooltip, CircularProgress, Stack 
} from "@mui/material";
import { DeleteOutline, PersonAddOutlined, RefreshOutlined } from "@mui/icons-material";
import { unknownFacesService } from "../../../services/unknownFaces";
import type { UnknownFace } from "../../../services/unknownFaces";
import FaceDetectionCard from "./FaceDetectionCard"; 
import { format } from "date-fns";

const THEME_NAVY = "#30364F";

export default function UnknownFacesTable() {
  const [faces, setFaces] = useState<UnknownFace[]>([]);
  const [loading, setLoading] = useState(true);

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

  useEffect(() => { fetchFaces(); }, []);

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', py: 10 }}>
        <CircularProgress sx={{ color: THEME_NAVY }} />
      </Box>
    );
  }

  return (
    <TableContainer 
      component={Paper} 
      elevation={0} 
      sx={{ 
        borderRadius: "16px", 
        border: "1px solid #E0E4EC",
        overflow: "hidden" // Keeps the header background within rounded corners
      }}
    >
      {/* Header Section with proper horizontal padding */}
      <Box sx={{ 
        px: 4, // Left and Right padding for the header
        py: 3, 
        borderBottom: "1px solid #F0F2F5", 
        display: 'flex', 
        justifyContent: 'space-between', 
        alignItems: 'center' 
      }}>
        <Box>
          <Typography variant="h5" fontWeight={800} color={THEME_NAVY}>
            Unknown Face Detections
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Review unidentified personnel detected by the FaceTrack system.
          </Typography>
        </Box>
        <Stack direction="row" spacing={2} alignItems="center">
          <Chip 
            label={`${faces.length} Unresolved`} 
            sx={{ bgcolor: "rgba(48, 54, 79, 0.1)", color: THEME_NAVY, fontWeight: 700 }} 
          />
          <IconButton onClick={fetchFaces} size="small" sx={{ border: '1px solid #E0E4EC' }}>
            <RefreshOutlined fontSize="small" />
          </IconButton>
        </Stack>
      </Box>

      <Table >
        <TableHead sx={{ bgcolor: "#F8F9FB" }}>
          <TableRow>
            <TableCell sx={{ fontWeight: 700, pl: 6 }}>Snapshot</TableCell>
            <TableCell sx={{ fontWeight: 700 }}>Detected At</TableCell>
            <TableCell sx={{ fontWeight: 700 }}>Confidence</TableCell>
            <TableCell sx={{ fontWeight: 700, pr: 12 }} align="right">Actions</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {faces.map((face) => (
            <TableRow key={face.unknown_id} hover sx={{ '&:last-child td, &:last-child th': { border: 0 } }}>
              <TableCell sx={{ pl: 4, py: 2 }}>
                <Box sx={{ width: 180 }}>
                  <FaceDetectionCard 
                    imagePath={face.image_path} 
                    confidence={null} 
                  />
                </Box>
              </TableCell>
              
              <TableCell>
                <Stack spacing={0.5}>
                  <Typography variant="body2" fontWeight={700} color={THEME_NAVY}>
                    {face.detected_time ? format(new Date(face.detected_time), "MMM dd, yyyy") : "N/A"}
                  </Typography>
                  <Typography variant="caption" color="text.secondary">
                    {face.detected_time ? format(new Date(face.detected_time), "hh:mm:ss a") : "Time unknown"}
                  </Typography>
                </Stack>
              </TableCell>

              <TableCell>
                <Chip 
                  label={face.confidence_score ? `${(face.confidence_score * 100).toFixed(1)}%` : "N/A"} 
                  size="small"
                  variant="filled"
                  sx={{ 
                    fontWeight: 700,
                    bgcolor: face.confidence_score && face.confidence_score > 0.7 ? "#E8F5E9" : "#FFF3E0",
                    color: face.confidence_score && face.confidence_score > 0.7 ? "#2E7D32" : "#E65100",
                    border: 'None'
                  }}
                />
              </TableCell>

              <TableCell align="right" sx={{ pr: 10 }}>
                <Stack direction="row" spacing={1} justifyContent="flex-end">
                  <Tooltip title="Assign to User">
                    <IconButton 
                      size="medium" 
                      sx={{ color: THEME_NAVY, bgcolor: '#F0F2F5', '&:hover': { bgcolor: '#E0E4EC' } }}
                    >
                      <PersonAddOutlined fontSize="small" />
                    </IconButton>
                  </Tooltip>
                  <Tooltip title="Ignore/Delete">
                    <IconButton 
                      size="medium" 
                      color="error" 
                      sx={{ bgcolor: '#FFEBEE', '&:hover': { bgcolor: '#FFCDD2' } }}
                    >
                      <DeleteOutline fontSize="small" />
                    </IconButton>
                  </Tooltip>
                </Stack>
              </TableCell>
            </TableRow>
          ))}
          
          {faces.length === 0 && (
            <TableRow>
              <TableCell colSpan={4} align="center" sx={{ py: 10 }}>
                <Box sx={{ opacity: 0.5 }}>
                  <Typography variant="h6">All clear!</Typography>
                  <Typography variant="body2">No unknown faces require your attention.</Typography>
                </Box>
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </TableContainer>
  );
}