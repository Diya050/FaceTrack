import {
  Alert,
  Box,
  Button,
  Card,
  MenuItem,
  Stack,
  TextField,
  Typography,
} from "@mui/material";
import { useEffect, useState } from "react";
import { Add } from "@mui/icons-material";
import api from "../../../services/api";
import { COLORS } from "../../../theme/dashboardTheme";

interface Department {
  department_id: string;
  name: string;
}

const InviteUsers = () => {
  const [email, setEmail] = useState("");
  const [role, setRole] = useState("USER");
  const [department, setDepartment] = useState("");
  const [departments, setDepartments] = useState<Department[]>([]);

  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  useEffect(() => {
    fetchDepartments();
  }, []);

  const fetchDepartments = async () => {
    try {
      const res = await api.get("/departments");
      setDepartments(res.data);
    } catch {
      setError("Failed to load departments");
    }
  };

  const handleInvite = async () => {
    setError(null);
    setSuccess(null);

    if (!email || !role || !department) {
      setError("All fields are required");
      return;
    }

    try {
      await api.post("/invite", {
        email,
        role,
        department_id: department,
      });

      setSuccess("Invite sent successfully");

      // Reset form
      setEmail("");
      setRole("USER");
      setDepartment("");
    } catch (err: any) {
      setError(err.response?.data?.detail || "Failed to send invite");
    }
  };

  return (
    <Box sx={{ p: { xs: 2, md: 4 }, mt: 8, bgcolor: "#F4F7FA", minHeight: "60vh" }}>
      
      {/* Header (Same pattern as Departments) */}
      <Stack
        direction="row"
        justifyContent="space-between"
        alignItems="center"
        mb={4}
      >
        <Box>
          <Typography variant="h4" sx={{ fontWeight: 800, color: COLORS.navy }}>
            Invite Users
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Invite users to your organization and assign roles
          </Typography>
        </Box>

        {/* Optional CTA (kept for consistency) */}
        <Button
          startIcon={<Add />}
          variant="contained"
          onClick={handleInvite}
          sx={{
            bgcolor: COLORS.navy,
            borderRadius: 2,
            textTransform: "none",
            px: 3,
          }}
        >
          Send Invite
        </Button>
      </Stack>

      {/* Alerts */}
      {error && (
        <Alert severity="error" sx={{ mb: 3 }} onClose={() => setError(null)}>
          {error}
        </Alert>
      )}
      {success && (
        <Alert severity="success" sx={{ mb: 3 }} onClose={() => setSuccess(null)}>
          {success}
        </Alert>
      )}

      {/* Form Card */}
      <Card
        elevation={0}
        sx={{
          borderRadius: 3,
          border: "1px solid #E0E4E8",
          p: 3,
          maxWidth: 1200,
        }}
      >
        <Stack spacing={2.5}>

          <TextField
            label="User Email"
            fullWidth
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />

          <TextField
            select
            label="Role"
            value={role}
            onChange={(e) => setRole(e.target.value)}
          >
            <MenuItem value="USER">User</MenuItem>
            <MenuItem value="ADMIN">Admin</MenuItem>
            <MenuItem value="HR_ADMIN">HR Admin</MenuItem>
          </TextField>

          <TextField
            select
            label="Department"
            value={department}
            onChange={(e) => setDepartment(e.target.value)}
          >
            {departments.map((dep) => (
              <MenuItem key={dep.department_id} value={dep.department_id}>
                {dep.name}
              </MenuItem>
            ))}
          </TextField>

          <Button
            variant="contained"
            onClick={handleInvite}
            sx={{
              bgcolor: COLORS.navy,
              textTransform: "none",
              borderRadius: 2,
              mt: 1,
            }}
          >
            Send Invite
          </Button>

        </Stack>
      </Card>
    </Box>
  );
};

export default InviteUsers;