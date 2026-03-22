import React, { useState, useEffect } from "react";
import {
  Box, Typography, Grid, Card, CardContent, Stack, Avatar, 
  Chip, Divider, Button, CircularProgress, Alert, Dialog,
  DialogTitle, DialogContent, TextField, DialogActions,
  Table, TableBody, TableCell, TableRow
} from "@mui/material";
import VisibilityIcon from "@mui/icons-material/Visibility";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import CancelIcon from "@mui/icons-material/Cancel";
import api from "../../../services/api";
import type { RegistrationRequest } from "../../../services/registrationRequests";
import { getPendingUsers, rejectUserRequest } from "../../../services/registrationRequests";

const THEME_NAVY = "#30364F";
const SUCCESS_GREEN = "#4CAF50";

const RegistrationRequests: React.FC = () => {
  const [requests, setRequests] = useState<RegistrationRequest[]>([]);
  const [loading, setLoading] = useState(false);
  const [actionLoading, setActionLoading] = useState<string | null>(null);
  
  // Track IDs that are approved but haven't been removed from the list yet
  const [approvedIds, setApprovedIds] = useState<Set<string>>(new Set());
  
  const [selectedUser, setSelectedUser] = useState<RegistrationRequest | null>(null);
  const [rejectionReason, setRejectionReason] = useState("");

  const loadRequests = async () => {
    setLoading(true);
    try {
      const data = await getPendingUsers();
      setRequests(data);
    } catch (err) {
      console.error("Fetch error:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { 
    loadRequests(); 
  }, []);

  const handleApproveAndEnroll = async (id: string) => {
    setActionLoading(id);
    try {
      // 1. Approve Account
      await api.patch(`/users/${id}/approve`);
      
      // 2. Request Enrollment Session (Triggers Notification for User)
      await api.post(`/users/${id}/request-face-enrollment`);
      
      // Mark as approved locally for immediate UI feedback
      setApprovedIds((prev) => new Set(prev).add(id));

      // Wait 2 seconds so the Admin sees the "Approved" state before the card vanishes
      setTimeout(async () => {
        await loadRequests();
        setApprovedIds((prev) => {
          const next = new Set(prev);
          next.delete(id);
          return next;
        });
        // If the dialog was open for this user, close it after the refresh
        if (selectedUser?.id === id) setSelectedUser(null);
      }, 2000);

    } catch (err) {
      alert("Failed to complete approval process. The user might already be active.");
    } finally {
      setActionLoading(null);
    }
  };

  const handleReject = async () => {
    if (!selectedUser) return;
    setActionLoading(selectedUser.id);
    try {
      await rejectUserRequest(selectedUser.id, rejectionReason);
      await loadRequests();
      setSelectedUser(null);
      setRejectionReason("");
    } catch (err) {
      alert("Rejection failed");
    } finally {
      setActionLoading(null);
    }
  };

  return (
    <Box p={3} mt={2} sx={{ backgroundColor: "#F8F9FA", minHeight: "100vh" }}>
      <Typography variant="h5" fontWeight={700} color={THEME_NAVY} gutterBottom>
        User Registration Queue
      </Typography>

      {loading && requests.length === 0 ? (
        <CircularProgress sx={{ color: THEME_NAVY, display: "block", mx: "auto", mt: 5 }} />
      ) : requests.length === 0 ? (
        <Alert severity="info" variant="outlined">No pending registration requests.</Alert>
      ) : (
        <Grid container spacing={3}>
          {requests.map((req) => {
            const isProcessing = actionLoading === req.id;
            const isApproved = approvedIds.has(req.id);

            return (
              <Grid key={req.id} size={{ xs: 12, md: 6, lg: 4 }}>
                <Card 
                  variant="outlined" 
                  sx={{ 
                    borderRadius: "12px", 
                    border: isApproved ? `1px solid ${SUCCESS_GREEN}` : "1px solid #E0E4EC",
                    bgcolor: isApproved ? "#F1F8E9" : "white",
                    transition: "all 0.3s ease",
                    boxShadow: isApproved ? "0 4px 12px rgba(76, 175, 80, 0.1)" : "none"
                  }}
                >
                  <CardContent>
                    <Stack direction="row" spacing={2} alignItems="center">
                      <Avatar sx={{ bgcolor: isApproved ? SUCCESS_GREEN : THEME_NAVY, fontWeight: 700 }}>
                        {req.full_name.charAt(0)}
                      </Avatar>
                      <Box flex={1}>
                        <Typography fontWeight={600}>{req.full_name}</Typography>
                        <Typography variant="caption" color="text.secondary">{req.email}</Typography>
                      </Box>
                      <Chip label={req.role} size="small" variant={isApproved ? "filled" : "outlined"} />
                    </Stack>
                    
                    <Divider sx={{ my: 2 }} />
                    
                    <Stack direction="row" spacing={1} justifyContent="flex-end">
                      {!isApproved && (
                        <Button 
                          size="small" 
                          startIcon={<VisibilityIcon />} 
                          onClick={() => setSelectedUser(req)}
                          // !! converts string|null to boolean to fix TS2769
                          disabled={!!actionLoading} 
                        >
                          Review
                        </Button>
                      )}
                      
                      <Button
                        size="small"
                        variant="contained"
                        color="success"
                        startIcon={<CheckCircleIcon />}
                        disabled={!!actionLoading || isApproved}
                        onClick={() => handleApproveAndEnroll(req.id)}
                        sx={{ minWidth: "140px" }}
                      >
                        {isProcessing ? "Processing..." : isApproved ? "Approved" : "Approve & Enroll"}
                      </Button>
                    </Stack>
                  </CardContent>
                </Card>
              </Grid>
            );
          })}
        </Grid>
      )}

      {/* REVIEW DIALOG */}
      <Dialog 
        open={Boolean(selectedUser)} 
        onClose={() => !actionLoading && setSelectedUser(null)} 
        fullWidth 
        maxWidth="sm"
      >
        <DialogTitle sx={{ fontWeight: 700 }}>Registration Review</DialogTitle>
        <DialogContent dividers>
          {selectedUser && (
            <Stack spacing={3}>
              <Table size="small">
                <TableBody>
                  <TableRow><TableCell sx={{ fontWeight: 600 }}>Name</TableCell><TableCell>{selectedUser.full_name}</TableCell></TableRow>
                  <TableRow><TableCell sx={{ fontWeight: 600 }}>Email</TableCell><TableCell>{selectedUser.email}</TableCell></TableRow>
                  <TableRow><TableCell sx={{ fontWeight: 600 }}>Employee ID</TableCell><TableCell>{selectedUser.employee_id}</TableCell></TableRow>
                  <TableRow><TableCell sx={{ fontWeight: 600 }}>Organization</TableCell><TableCell>{selectedUser.organization_name}</TableCell></TableRow>
                  <TableRow><TableCell sx={{ fontWeight: 600 }}>Department</TableCell><TableCell>{selectedUser.department_name}</TableCell></TableRow>
                </TableBody>
              </Table>
              
              {/* Hide rejection field if already approved */}
              {!approvedIds.has(selectedUser.id) && (
                <TextField
                  label="Rejection Reason (Optional)"
                  fullWidth multiline rows={2}
                  value={rejectionReason}
                  onChange={(e) => setRejectionReason(e.target.value)}
                  disabled={!!actionLoading}
                />
              )}
            </Stack>
          )}
        </DialogContent>
        
        <DialogActions sx={{ p: 2, justifyContent: 'space-between' }}>
          <Button onClick={() => setSelectedUser(null)} disabled={!!actionLoading}>
            Close
          </Button>
          
          <Stack direction="row" spacing={1}>
            {selectedUser && !approvedIds.has(selectedUser.id) && (
              <Button 
                color="error" 
                variant="outlined" 
                startIcon={<CancelIcon />} 
                onClick={handleReject} 
                disabled={!!actionLoading}
              >
                Reject
              </Button>
            )}
            
            <Button 
              variant="contained" 
              sx={{ 
                bgcolor: selectedUser && approvedIds.has(selectedUser.id) ? SUCCESS_GREEN : THEME_NAVY,
                "&:hover": { bgcolor: selectedUser && approvedIds.has(selectedUser.id) ? SUCCESS_GREEN : "#3d4563" }
              }} 
              onClick={() => selectedUser && handleApproveAndEnroll(selectedUser.id)} 
              disabled={!!actionLoading || (!!selectedUser && approvedIds.has(selectedUser.id))}
            >
              {actionLoading === selectedUser?.id 
                ? "Processing..." 
                : selectedUser && approvedIds.has(selectedUser.id) 
                  ? "Approved" 
                  : "Approve & Send Request"}
            </Button>
          </Stack>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default RegistrationRequests;