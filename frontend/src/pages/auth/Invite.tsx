import {
  TextField,
  Button,
  Container,
  Stack,
  Typography,
  Box,
  CircularProgress,
  Alert,
} from "@mui/material";
import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import AuthLayout from "../../layout/AuthLayout";
import instance from "../../services/api";

export default function Invite() {
  const { token } = useParams();
  const navigate = useNavigate();

  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  const [inviteData, setInviteData] = useState<{
    email: string;
    role: string;
  } | null>(null);

  const [form, setForm] = useState({
    fullName: "",
    password: "",
    confirmPassword: "",
  });

  const [error, setError] = useState("");

  /* ---------------- FETCH INVITE ---------------- */

  useEffect(() => {
    const fetchInvite = async () => {
      try {
        const res = await instance.get(`/auth/invite/${token}`);
        setInviteData(res.data);
      } catch (err) {
        setError("Invalid or expired invite link.");
      } finally {
        setLoading(false);
      }
    };

    if (token) fetchInvite();
  }, [token]);

  /* ---------------- HANDLERS ---------------- */

  const handleChange = (field: string, value: string) => {
    setForm((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleSubmit = async () => {
    setError("");

    if (!form.fullName || !form.password) {
      setError("All fields are required.");
      return;
    }

    if (form.password.length < 6) {
      setError("Password must be at least 6 characters.");
      return;
    }

    if (form.password !== form.confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    try {
      setSubmitting(true);

      await instance.post(`/auth/invite/register?token_id=${token}`, {
        full_name: form.fullName,
        password: form.password,
        });

    navigate("/login");
    } catch (err: any) {
      setError(err.response?.data?.detail || "Registration failed.");
    } finally {
      setSubmitting(false);
    }
  };

  /* ---------------- LOADING ---------------- */

  if (loading) {
    return (
      <AuthLayout>
        <Box sx={{ display: "flex", justifyContent: "center", mt: 10 }}>
          <CircularProgress />
        </Box>
      </AuthLayout>
    );
  }

  /* ---------------- ERROR ---------------- */

  if (!inviteData) {
    return (
      <AuthLayout>
        <Container maxWidth="sm">
          <Alert severity="error">{error || "Invite not found."}</Alert>
        </Container>
      </AuthLayout>
    );
  }

  /* ---------------- UI ---------------- */

  return (
    <AuthLayout>
      <Container maxWidth="sm" sx={{ px: { xs: 2, sm: 3 } }}>
        <Stack spacing={3}>

          {/* Header */}
          <Box>
            <Typography variant="h4" fontWeight={600}>
              Accept Invitation
            </Typography>

            <Typography variant="body2" color="text.secondary">
              Complete your account setup
            </Typography>
          </Box>

          {/* Info */}
          <Box
            sx={{
              p: 2,
              borderRadius: 2,
              bgcolor: "grey.50",
              border: "1px solid #eee",
            }}
          >
            <Typography variant="body2">
              <strong>Email:</strong> {inviteData.email}
            </Typography>

            <Typography variant="body2">
              <strong>Role:</strong> {inviteData.role}
            </Typography>
          </Box>

          {error && <Alert severity="error">{error}</Alert>}

          {/* Form */}
          <TextField
            label="Full Name"
            fullWidth
            value={form.fullName}
            onChange={(e) => handleChange("fullName", e.target.value)}
          />

          <TextField
            label="Password"
            type="password"
            fullWidth
            value={form.password}
            onChange={(e) => handleChange("password", e.target.value)}
          />

          <TextField
            label="Confirm Password"
            type="password"
            fullWidth
            value={form.confirmPassword}
            onChange={(e) =>
              handleChange("confirmPassword", e.target.value)
            }
          />

          {/* Submit */}
          <Button
            variant="contained"
            size="large"
            fullWidth
            onClick={handleSubmit}
            disabled={submitting}
          >
            {submitting ? <CircularProgress size={22} /> : "Accept Invite"}
          </Button>

        </Stack>
      </Container>
    </AuthLayout>
  );
}