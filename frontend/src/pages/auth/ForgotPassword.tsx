import {
  TextField,
  Button,
  Typography,
  Box,
  CircularProgress,
  Alert,
} from "@mui/material";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import AuthLayout from "../../layouts/AuthLayout";

export default function ForgotPassword() {
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const handleSubmit = async () => {
    if (!email) {
      setError("Email is required.");
      return;
    }

    try {
      setLoading(true);
      setError("");
      setSuccess("");

      // TODO: Replace with axios call
      console.log("Forgot password request:", email);

      await new Promise((resolve) => setTimeout(resolve, 1000));

      setSuccess(
        "If an account exists with this email, a reset link has been sent."
      );
    } catch (err) {
      setError("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthLayout>
      <Typography variant="h4" gutterBottom>
        Forgot Password
      </Typography>

      <Typography variant="body2" color="text.secondary" mb={3}>
        Enter your email to receive a password reset link.
      </Typography>

      <Box display="flex" flexDirection="column" gap={2}>
        {error && <Alert severity="error">{error}</Alert>}
        {success && <Alert severity="success">{success}</Alert>}

        <TextField
          label="Email"
          type="email"
          fullWidth
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />

        <Button
          variant="contained"
          size="large"
          onClick={handleSubmit}
          disabled={loading}
        >
          {loading ? <CircularProgress size={22} /> : "Send Reset Link"}
        </Button>

        <Button
          variant="text"
          onClick={() => navigate("/login")}
        >
          Back to Login
        </Button>
      </Box>
    </AuthLayout>
  );
}
