import React, { useState } from "react";
import {
  Box,
  Card,
  CardContent,
  Typography,
  Grid,
  Button,
  Avatar,
  Chip,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Stack,
  Divider,
  Table,
  TableBody,
  TableCell,
  TableRow,
} from "@mui/material";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import CancelIcon from "@mui/icons-material/Cancel";
import VisibilityIcon from "@mui/icons-material/Visibility";

type RequestStatus = "Pending" | "Approved" | "Rejected";

interface RegistrationRequest {
  id: string;
  fullName: string;
  email: string;
  organization: string;
  department: string;
  role: string;
  employeeId: string;
  submittedAt: string;
  device: string;
  ipAddress: string;
  images: string[];
  status: RequestStatus;
}

const mockRequests: RegistrationRequest[] = [
  {
    id: "1",
    fullName: "Amit Kumar",
    email: "amit.kumar@techcorp.com",
    organization: "TechCorp Pvt Ltd",
    department: "Engineering",
    role: "Staff",
    employeeId: "EMP1021",
    submittedAt: "2026-03-01 09:42",
    device: "Chrome / Windows",
    ipAddress: "192.168.1.21",
    images: [
      "https://randomuser.me/api/portraits/men/75.jpg",
      "https://randomuser.me/api/portraits/men/76.jpg",
      "https://randomuser.me/api/portraits/men/77.jpg",
    ],
    status: "Pending",
  },
  {
    id: "2",
    fullName: "Neha Sharma",
    email: "neha.sharma@techcorp.com",
    organization: "TechCorp Pvt Ltd",
    department: "HR",
    role: "Manager",
    employeeId: "EMP0842",
    submittedAt: "2026-03-01 08:30",
    device: "Safari / iPhone",
    ipAddress: "10.0.0.14",
    images: [
      "https://randomuser.me/api/portraits/women/65.jpg",
      "https://randomuser.me/api/portraits/women/66.jpg",
      "https://randomuser.me/api/portraits/women/67.jpg",
    ],
    status: "Pending",
  },
];

const RegistrationRequests: React.FC = () => {
  const [requests, setRequests] = useState<RegistrationRequest[]>(mockRequests);
  const [selected, setSelected] = useState<RegistrationRequest | null>(null);
  const [remark, setRemark] = useState("");

  const updateStatus = (id: string, status: RequestStatus) => {
    setRequests((prev) =>
      prev.map((r) => (r.id === id ? { ...r, status } : r))
    );
    setSelected(null);
    setRemark("");
  };

  return (
    <Box p={3} mt={8}>
      <Typography variant="h5" fontWeight={600}>
        Face Registration Approval Queue
      </Typography>

      <Typography variant="body2" color="text.secondary" mb={3}>
        Review identity, organization, and biometric samples before enrollment.
      </Typography>

      <Grid container spacing={2}>
        {requests
          .filter((r) => r.status === "Pending")
          .map((req) => (
            <Grid size={{ xs: 12, md: 6 }} key={req.id}>
              <Card variant="outlined">
                <CardContent>
                  <Stack direction="row" spacing={2} alignItems="center">
                    <Avatar src={req.images[0]} sx={{ width: 56, height: 56 }} />

                    <Box flex={1}>
                      <Typography fontWeight={600}>{req.fullName}</Typography>
                      <Typography variant="caption" color="text.secondary">
                        {req.email}
                      </Typography>
                      <Typography variant="caption" display="block">
                        {req.organization} • {req.department}
                      </Typography>
                    </Box>

                    <Chip label={req.role} size="small" />
                  </Stack>

                  <Divider sx={{ my: 2 }} />

                  <Stack direction="row" spacing={1} justifyContent="flex-end">
                    <Button
                      size="small"
                      startIcon={<VisibilityIcon />}
                      onClick={() => setSelected(req)}
                    >
                      Review
                    </Button>

                    <Button
                      size="small"
                      color="success"
                      variant="contained"
                      startIcon={<CheckCircleIcon />}
                      onClick={() => updateStatus(req.id, "Approved")}
                    >
                      Approve
                    </Button>

                    <Button
                      size="small"
                      color="error"
                      variant="outlined"
                      startIcon={<CancelIcon />}
                      onClick={() => setSelected(req)}
                    >
                      Reject
                    </Button>
                  </Stack>
                </CardContent>
              </Card>
            </Grid>
          ))}
      </Grid>

      {/* Review Modal */}
      <Dialog
        open={Boolean(selected)}
        onClose={() => setSelected(null)}
        maxWidth="md"
        fullWidth
      >
        <DialogTitle>Identity & Biometric Review</DialogTitle>

        <DialogContent dividers>
          {selected && (
            <Stack spacing={3}>
              {/* Identity Details */}
              <Box>
                <Typography fontWeight={600} gutterBottom>
                  Identity Information
                </Typography>

                <Table size="small">
                  <TableBody>
                    <TableRow>
                      <TableCell>Full Name</TableCell>
                      <TableCell>{selected.fullName}</TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell>Email</TableCell>
                      <TableCell>{selected.email}</TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell>Organization</TableCell>
                      <TableCell>{selected.organization}</TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell>Department</TableCell>
                      <TableCell>{selected.department}</TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell>Role</TableCell>
                      <TableCell>{selected.role}</TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell>Employee ID</TableCell>
                      <TableCell>{selected.employeeId}</TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell>Submitted</TableCell>
                      <TableCell>{selected.submittedAt}</TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell>Device</TableCell>
                      <TableCell>{selected.device}</TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell>IP Address</TableCell>
                      <TableCell>{selected.ipAddress}</TableCell>
                    </TableRow>
                  </TableBody>
                </Table>
              </Box>

              {/* Face Samples */}
              <Box>
                <Typography fontWeight={600} gutterBottom>
                  Biometric Samples
                </Typography>

                <Stack direction="row" spacing={2}>
                  {selected.images.map((img, i) => (
                    <Avatar
                      key={i}
                      src={img}
                      variant="rounded"
                      sx={{ width: 120, height: 120 }}
                    />
                  ))}
                </Stack>
              </Box>

              {/* Admin Remarks */}
              <TextField
                label="Admin Verification Notes"
                fullWidth
                multiline
                minRows={3}
                placeholder="Verification remarks / compliance notes"
                value={remark}
                onChange={(e) => setRemark(e.target.value)}
              />
            </Stack>
          )}
        </DialogContent>

        <DialogActions>
          <Button onClick={() => setSelected(null)}>Cancel</Button>
          <Button
            color="error"
            variant="outlined"
            onClick={() => updateStatus(selected!.id, "Rejected")}
          >
            Reject
          </Button>
          <Button
            color="success"
            variant="contained"
            onClick={() => updateStatus(selected!.id, "Approved")}
          >
            Approve & Enroll
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default RegistrationRequests;