import {
  TextField,
  Button,
  Container,
  Stack,
  Typography,
  Box,
  CircularProgress,
  Alert,
  MenuItem,
} from "@mui/material";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import AuthLayout from "../../layout/AuthLayout";
import { forgotPassword } from "../../services/authService";
import { getOrganizations } from "../../services/orgService";
import type { Organization } from "../../services/orgService";

export default function ForgotPassword() {
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [organization, setOrganization] = useState("");

  const [orgs, setOrgs] = useState<Organization[]>([]);
  const [loading, setLoading] = useState(false);
  const [loadingOrgs, setLoadingOrgs] = useState(true);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  useEffect(() => {
    const fetchOrgs = async () => {
      try {
        const data = await getOrganizations();
        setOrgs(data);
      } catch {
        setError("Failed to load organizations.");
      } finally {
        setLoadingOrgs(false);
      }
    };

    fetchOrgs();
  }, []);

 const handleSubmit = async () => {
  if (!email || !organization) {
    setError("Email and organization are required.");
    return;
  }

  try {
    setLoading(true);
    setError("");
    setSuccess("");

    await forgotPassword({
      email,
      organization_name: organization,
    });

    setSuccess(
      "If an account exists with this email, a reset link has been sent."
    );
  } catch (err: any) {
    setError(
      err?.response?.data?.detail ||
      "Something went wrong. Please try again."
    );
  } finally {
    setLoading(false);
  }
};

  return (
  <AuthLayout>
    <Container
      maxWidth="sm"
      sx={{
        px: { xs: 2, sm: 3 },
      }}
    >
      <Stack spacing={{ xs: 2.5, sm: 3 }}>
        
        {/* Header */}
        <Box>
          <Typography
            variant="h4"
            sx={{
              fontSize: {
                xs: "1.6rem",
                sm: "1.9rem",
              },
              fontWeight: 600,
            }}
            gutterBottom
          >
            Forgot Password
          </Typography>

          <Typography
            variant="body2"
            color="text.secondary"
          >
            Enter your email to receive a password reset link.
          </Typography>
        </Box>

        {/* Alerts */}
        {error && <Alert severity="error">{error}</Alert>}
        {success && <Alert severity="success">{success}</Alert>}

        {/* Organization Dropdown */}
          <TextField
            select
            label="Organization"
            value={organization}
            onChange={(e) => setOrganization(e.target.value)}
            fullWidth
            disabled={loadingOrgs}
          >
            {orgs.map((org) => (
              <MenuItem key={org.organization_id} value={org.name}>
                {org.name}
              </MenuItem>
            ))}
          </TextField>

        {/* Email Field */}
        <TextField
          label="Email"
          type="email"
          fullWidth
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />

        {/* Submit Button */}
        <Button
          variant="contained"
          size="large"
          fullWidth
          onClick={handleSubmit}
          disabled={loading}
          sx={{
            py: { xs: 1.4, sm: 1.6 },
          }}
        >
          {loading ? (
            <CircularProgress size={22} />
          ) : (
            "Send Reset Link"
          )}
        </Button>

        {/* Back Button */}
        <Box textAlign="center">
          <Button
            variant="text"
            onClick={() => navigate("/login")}
          >
            Back to Login
          </Button>
        </Box>

      </Stack>
    </Container>
  </AuthLayout>
);
}
