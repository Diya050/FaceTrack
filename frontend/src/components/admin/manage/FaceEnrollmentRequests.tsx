import { useEffect, useState } from "react";
import {
  Box, Card, Typography, Button, Grid, Chip, 
  CircularProgress, Alert, Dialog, DialogTitle, 
  DialogContent, TextField, DialogActions, Stack
} from "@mui/material";
import ErrorOutlineIcon from '@mui/icons-material/ErrorOutline';

import {
  getEnrollmentRequests,
  approveEnrollmentRequest,
  rejectEnrollmentRequest
} from "../../../services/faceEnrollmentRequest";

import FaceQualityCard from "../FaceQualityCard";

const THEME_NAVY = "#30364F";

export default function AdminFaceEnrollmentRequests() {
  const [requests, setRequests] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  // Rejection State
  const [rejectDialogOpen, setRejectDialogOpen] = useState(false);
  const [selectedSessionId, setSelectedSessionId] = useState<string | null>(null);
  const [rejectionReason, setRejectionReason] = useState("");
  const [actionLoading, setActionLoading] = useState(false);

  const loadRequests = async () => {
    setLoading(true);
    try {
      const data = await getEnrollmentRequests();
      setRequests(data);
    } catch (err) {
      setError("Failed to fetch enrollment requests.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { loadRequests(); }, []);

  const handleApprove = async (sessionId: string) => {
    setActionLoading(true);
    try {
      await approveEnrollmentRequest(sessionId);
      setRequests(prev => prev.filter(r => r.session_id !== sessionId));
      setMessage("Enrollment approved successfully!");
      setError("");
    } catch (err) {
      setError("Approval failed. Please check backend logs.");
    } finally {
      setActionLoading(false);
    }
  };

  const handleRejectSubmit = async () => {
    if (!selectedSessionId || !rejectionReason.trim()) return;
    setActionLoading(true);
    try {
      await rejectEnrollmentRequest(selectedSessionId, rejectionReason);
      setRequests(prev => prev.filter(r => r.session_id !== selectedSessionId));
      setMessage("Enrollment rejected and user notified to re-enroll.");
      setRejectDialogOpen(false);
      setRejectionReason("");
    } catch (err) {
      setError("Rejection failed.");
    } finally {
      setActionLoading(false);
    }
  };

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" height="80vh">
        <CircularProgress sx={{ color: THEME_NAVY }} />
      </Box>
    );
  }

  return (
    <Box p={4} mt={2} sx={{ backgroundColor: "#F8F9FA", minHeight: "100vh" }}>
      <Typography variant="h5" mb={3} fontWeight="bold" sx={{ color: THEME_NAVY }}>
        Face Enrollment Requests
      </Typography>

      {message && <Alert severity="success" sx={{ mb: 2 }} onClose={() => setMessage("")}>{message}</Alert>}
      {error && <Alert severity="error" sx={{ mb: 2 }} onClose={() => setError("")}>{error}</Alert>}

      {requests.length === 0 ? (
        <Alert severity="info" variant="outlined">No pending enrollment requests found.</Alert>
      ) : (
        requests.map(req => (
          <Card key={req.session_id} sx={{ p: 3, mb: 3, borderRadius: "12px", border: "1px solid #E0E4EC", boxShadow: "none" }}>
            <Box display="flex" justifyContent="space-between" alignItems="flex-start">
              <Box>
                <Typography variant="h6" sx={{ color: THEME_NAVY, fontWeight: 600 }}>
                  {req.full_name || "Unknown User"}
                </Typography>
                <Typography variant="body2" color="textSecondary" mb={1}>{req.email}</Typography>
                
                {/* NEW: Display rejection history if available */}
                {req.last_rejection_reason && (
                  <Stack direction="row" spacing={1} alignItems="center" sx={{ mt: 1, p: 1, bgcolor: '#FFF5F5', borderRadius: 1, border: '1px solid #FED7D7' }}>
                    <ErrorOutlineIcon sx={{ color: '#C53030', fontSize: 18 }} />
                    <Typography variant="caption" sx={{ color: '#C53030', fontWeight: 600 }}>
                      PREVIOUS REJECTION: {req.last_rejection_reason}
                    </Typography>
                  </Stack>
                )}
              </Box>
              <Chip label="Pending Review" color="warning" variant="outlined" size="small" />
            </Box>

            <Typography mt={3} fontWeight={600} variant="body2" color="textSecondary" sx={{ textTransform: "uppercase", letterSpacing: 0.5 }}>
              Captured Samples
            </Typography>

            <Grid container spacing={2} mt={1}>
              {req.images?.map((img: any, i: number) => (
                <Grid size={{ xs:6, sm:4, md:2 }} key={i}>
                  <FaceQualityCard image={img} />
                </Grid>
              ))}
            </Grid>

            <Box mt={4} display="flex" gap={2}>
              <Button
                variant="contained"
                color="success"
                disabled={actionLoading}
                onClick={() => handleApprove(req.session_id)}
                sx={{ textTransform: 'none', px: 3 }}
              >
                Approve & Activate
              </Button>

              <Button
                variant="outlined"
                color="error"
                disabled={actionLoading}
                onClick={() => {
                  setSelectedSessionId(req.session_id);
                  setRejectDialogOpen(true);
                }}
                sx={{ textTransform: 'none', px: 3 }}
              >
                Reject
              </Button>
            </Box>
          </Card>
        ))
      )}

      {/* REJECTION DIALOG */}
      <Dialog open={rejectDialogOpen} onClose={() => !actionLoading && setRejectDialogOpen(false)} fullWidth maxWidth="xs">
        <DialogTitle sx={{ fontWeight: 700, color: THEME_NAVY }}>Reject Enrollment</DialogTitle>
        <DialogContent>
          <Typography variant="body2" mb={2} color="text.secondary">
            Explain why this request is being rejected. This reason will be shown to the user.
          </Typography>
          <TextField
            autoFocus
            fullWidth
            multiline
            rows={3}
            label="Rejection Reason"
            placeholder="e.g. Blurry images or poor lighting. Please remove sunglasses."
            value={rejectionReason}
            onChange={(e) => setRejectionReason(e.target.value)}
            disabled={actionLoading}
          />
        </DialogContent>
        <DialogActions sx={{ p: 2, bgcolor: '#F8F9FA' }}>
          <Button onClick={() => setRejectDialogOpen(false)} disabled={actionLoading}>Cancel</Button>
          <Button 
            variant="contained" 
            color="error" 
            onClick={handleRejectSubmit}
            disabled={actionLoading || !rejectionReason.trim()}
          >
            {actionLoading ? "Processing..." : "Confirm Reject"}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}