import { useEffect, useState } from "react";
import {
  Card,
  CardContent,
  Typography,
  Box,
  Divider,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Chip,
  CircularProgress,
  Stack,
} from "@mui/material";
import api from "../../services/api";

interface Detection {
  event_id: string;
  full_name: string;
  department_name: string;
  camera_name: string;
  time_ist: string;
  confidence_score: number;
}

const RecentDetectionsTable = () => {
  const [detections, setDetections] = useState<Detection[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api
      .get("/analytics/recent-detections")
      .then((res) => setDetections(res.data.detections))
      .catch((err) => console.error(err))
      .finally(() => setLoading(false));
  }, []);

  const getConfidenceColor = (score: number) => {
    if (score >= 0.85) return "success";
    if (score >= 0.7) return "warning";
    return "error";
  };

  return (
    <Card
      elevation={0}
      sx={{
        borderRadius: 4,
        border: "1px solid rgba(0,0,0,0.06)",
        background:
          "linear-gradient(135deg, rgba(255,255,255,0.9), rgba(245,247,250,0.9))",
        backdropFilter: "blur(6px)",
        transition: "all 0.25s ease",
        "&:hover": {
          boxShadow: "0 8px 24px rgba(0,0,0,0.06)",
        },
      }}
    >
      <CardContent sx={{ p: 3 }}>
        {/* Header */}
        <Stack direction="row" justifyContent="space-between" alignItems="center">
          <Box>
            <Typography variant="h6" fontWeight={700}>
              Today's Live Detections
            </Typography>
            <Typography variant="caption" sx={{ opacity: 0.7 }}>
              Real-time facial recognition events from edge cameras
            </Typography>
          </Box>

          {/* Live Badge */}
          <Chip
            label="LIVE"
            size="small"
            color="error"
            sx={{ fontWeight: 700, letterSpacing: 1 }}
          />
        </Stack>

        <Divider sx={{ my: 2, opacity: 0.6 }} />

        {/* Loading */}
        {loading ? (
          <Box
            display="flex"
            flexDirection="column"
            alignItems="center"
            justifyContent="center"
            py={5}
          >
            <CircularProgress size={30} />
            <Typography variant="caption" mt={1} sx={{ opacity: 0.6 }}>
              Fetching live detections...
            </Typography>
          </Box>
        ) : detections.length === 0 ? (
          <Box textAlign="center" py={5}>
            <Typography variant="body2" sx={{ opacity: 0.6 }}>
              No events recorded today
            </Typography>
          </Box>
        ) : (
          <TableContainer>
            <Table
              size="small"
              sx={{
                borderCollapse: "separate",
                borderSpacing: "0 6px",
              }}
            >
              <TableHead>
                <TableRow>
                  <TableCell sx={{ fontWeight: 700, fontSize: 12, opacity: 0.7 }}>
                    Employee
                  </TableCell>
                  <TableCell sx={{ fontWeight: 700, fontSize: 12, opacity: 0.7 }}>
                    Department
                  </TableCell>
                  <TableCell sx={{ fontWeight: 700, fontSize: 12, opacity: 0.7 }}>
                    Camera Node
                  </TableCell>
                  <TableCell sx={{ fontWeight: 700, fontSize: 12, opacity: 0.7 }}>
                    Time (IST)
                  </TableCell>
                  <TableCell
                    sx={{ fontWeight: 700, fontSize: 12, opacity: 0.7 }}
                    align="right"
                  >
                    Confidence
                  </TableCell>
                </TableRow>
              </TableHead>

              <TableBody>
                {detections.map((row) => (
                  <TableRow
                    key={row.event_id}
                    hover
                    sx={{
                      background: "#fff",
                      boxShadow: "0 2px 6px rgba(0,0,0,0.04)",
                      borderRadius: 2,
                      "& td": { borderBottom: "none" },
                      transition: "all 0.2s ease",
                      "&:hover": {
                        transform: "translateY(-1px)",
                        boxShadow: "0 4px 10px rgba(0,0,0,0.06)",
                      },
                    }}
                  >
                    <TableCell sx={{ fontWeight: 600 }}>
                      {row.full_name}
                    </TableCell>

                    <TableCell>
                      <Chip
                        label={row.department_name}
                        size="small"
                        variant="outlined"
                        sx={{ fontSize: 11 }}
                      />
                    </TableCell>

                    <TableCell sx={{ opacity: 0.7 }}>
                      {row.camera_name}
                    </TableCell>

                    <TableCell sx={{ opacity: 0.7 }}>
                      {row.time_ist}
                    </TableCell>

                    <TableCell align="right">
                      <Chip
                        size="small"
                        label={`${(row.confidence_score * 100).toFixed(0)}%`}
                        color={getConfidenceColor(row.confidence_score)}
                        sx={{
                          fontWeight: 700,
                          minWidth: 60,
                        }}
                      />
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        )}
      </CardContent>
    </Card>
  );
};

export default RecentDetectionsTable;