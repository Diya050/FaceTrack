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
import { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import AuthLayout from "../../layout/AuthLayout";
import { resetPassword } from "../../services/authService";

export default function ResetPassword() {
  const navigate = useNavigate();
  const { token } = useParams();

  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const validate = () => {
    if (!password || !confirmPassword) {
      return "All fields are required.";
    }

    if (password.length < 6) {
      return "Password must be at least 6 characters.";
    }

    if (password !== confirmPassword) {
      return "Passwords do not match.";
    }

    if (!token) {
      return "Invalid or expired reset token.";
    }

    return null;
  };

  const handleSubmit = async () => {
  const validationError = validate();
  if (validationError) {
    setError(validationError);
    return;
  }

  try {
    setLoading(true);
    setError("");
    setSuccess("");

    await resetPassword({
      token_id: token!,
      new_password: password,
    });

    setSuccess("Password reset successful. Redirecting to login...");

    setTimeout(() => navigate("/login"), 2000);
  } catch (err: any) {
    setError(
      err?.response?.data?.detail ||
      "Reset failed. Please try again."
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
            Reset Password
          </Typography>

          <Typography
            variant="body2"
            color="text.secondary"
          >
            Enter your new password.
          </Typography>
        </Box>

        {/* Alerts */}
        {error && <Alert severity="error">{error}</Alert>}
        {success && <Alert severity="success">{success}</Alert>}

        {/* New Password */}
        <TextField
          label="New Password"
          type="password"
          fullWidth
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />

        {/* Confirm Password */}
        <TextField
          label="Confirm Password"
          type="password"
          fullWidth
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
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
            "Reset Password"
          )}
        </Button>

      </Stack>
    </Container>
  </AuthLayout>
);
}
