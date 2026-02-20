import {
  TextField,
  Button,
  Typography,
  Box,
  CircularProgress,
  Alert,
} from "@mui/material";
import { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import AuthLayout from "../../layouts/AuthLayout";

export default function ResetPassword() {
  const navigate = useNavigate();
  const location = useLocation();

  const token = new URLSearchParams(location.search).get("token");

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

      // TODO: Replace with axios call
      console.log("Resetting password:", { token, password });

      await new Promise((resolve) => setTimeout(resolve, 1000));

      setSuccess("Password reset successful. Redirecting to login...");

      setTimeout(() => navigate("/login"), 2000);
    } catch (err) {
      setError("Reset failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthLayout>
      <Typography variant="h4" gutterBottom>
        Reset Password
      </Typography>

      <Typography variant="body2" color="text.secondary" mb={3}>
        Enter your new password.
      </Typography>

      <Box display="flex" flexDirection="column" gap={2}>
        {error && <Alert severity="error">{error}</Alert>}
        {success && <Alert severity="success">{success}</Alert>}

        <TextField
          label="New Password"
          type="password"
          fullWidth
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />

        <TextField
          label="Confirm Password"
          type="password"
          fullWidth
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
        />

        <Button
          variant="contained"
          size="large"
          onClick={handleSubmit}
          disabled={loading}
        >
          {loading ? <CircularProgress size={22} /> : "Reset Password"}
        </Button>
      </Box>
    </AuthLayout>
  );
}
