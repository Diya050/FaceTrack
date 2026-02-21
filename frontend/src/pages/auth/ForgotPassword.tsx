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
