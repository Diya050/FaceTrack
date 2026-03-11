import { useEffect, useState } from "react";
import {
  Box,
  Card,
  Typography,
  Button,
  Grid,
  Chip,
  CircularProgress,
  Alert
} from "@mui/material";

import {
  getEnrollmentRequests,
  approveEnrollmentRequest,
  rejectEnrollmentRequest
} from "../../services/faceEnrollmentRequest";

import FaceQualityCard from "../../components/admin/FaceQualityCard";

export default function AdminFaceEnrollmentRequests() {
  const [requests, setRequests] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  const loadRequests = async () => {
    setLoading(true);
    try {
      const data = await getEnrollmentRequests();
      setRequests(data);
    } catch (err) {
      setError("Failed to fetch enrollment requests.");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadRequests();
  }, []);

  const handleApprove = async (sessionId: string) => {
    try {
      await approveEnrollmentRequest(sessionId);
      // Remove the approved request from the UI list
      setRequests(prev => prev.filter(r => r.session_id !== sessionId));
      setMessage("Enrollment approved successfully!");
      setError("");
    } catch (err) {
      setError("Approval failed. Please check backend logs.");
      console.error(err);
    }
  };

  const handleReject = async (sessionId: string) => {
    try {
      await rejectEnrollmentRequest(sessionId);
      // Remove the rejected request from the UI list
      setRequests(prev => prev.filter(r => r.session_id !== sessionId));
      setMessage("Enrollment rejected.");
      setError("");
    } catch (err) {
      setError("Rejection failed.");
      console.error(err);
    }
  };

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" height="80vh">
        <CircularProgress sx={{ color: "#30364F" }} />
      </Box>
    );
  }

  return (
    <Box p={4} mt={8}>
      <Typography variant="h5" mb={3} fontWeight="bold" sx={{ color: "#30364F" }}>
        Face Enrollment Requests
      </Typography>

      {message && (
        <Alert severity="success" sx={{ mb: 2 }} onClose={() => setMessage("")}>
          {message}
        </Alert>
      )}

      {error && (
        <Alert severity="error" sx={{ mb: 2 }} onClose={() => setError("")}>
          {error}
        </Alert>
      )}

      {requests.length === 0 ? (
        <Typography variant="body1" color="textSecondary">
          No pending enrollment requests found.
        </Typography>
      ) : (
        requests.map(req => (
          // Using session_id as the unique key for UUID support
          <Card key={req.session_id} sx={{ p: 3, mb: 3, borderRadius: 2, boxShadow: 3 }}>
            <Box
              display="flex"
              justifyContent="space-between"
              alignItems="center"
            >
              <Box>
                <Typography variant="h6" sx={{ color: "#30364F" }}>
                  {req.full_name || "Unknown User"}
                </Typography>
                <Typography variant="body2" color="textSecondary">
                  {req.email}
                </Typography>
              </Box>
              <Chip label="Pending Approval" color="warning" variant="outlined" />
            </Box>

            <Typography mt={2} fontWeight="medium">
              Captured Samples
            </Typography>

            <Grid container spacing={2} mt={1}>
              {req.images && req.images.map((img: any, i: number) => (
                <Grid size = {{ xs:12, sm:6, md:3, lg:2 }} key={i}>
                  <FaceQualityCard image={img} />
                </Grid>
              ))}
            </Grid>

            <Box mt={3} display="flex" gap={2}>
              <Button
                variant="contained"
                color="success"
                sx={{ px: 4 }}
                onClick={() => handleApprove(req.session_id)}
              >
                Approve & Generate Embedding
              </Button>

              <Button
                variant="outlined"
                color="error"
                sx={{ px: 4 }}
                onClick={() => handleReject(req.session_id)}
              >
                Reject
              </Button>
            </Box>
          </Card>
        ))
      )}
    </Box>
  );
}