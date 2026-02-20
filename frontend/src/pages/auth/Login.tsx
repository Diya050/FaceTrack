import {
  TextField,
  Button,
  Typography,
  Box,
  Stack,
  ToggleButtonGroup,
  ToggleButton,
  Alert,
} from "@mui/material";
import LockOutlinedIcon from "@mui/icons-material/LockOutlined";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import AuthLayout from "../../layouts/AuthLayout";

type LoginMode = "user" | "admin";

export default function Login() {
  const navigate = useNavigate();

  const [loginMode, setLoginMode] =
    useState<LoginMode>("user");

  const [form, setForm] = useState({
    identifier: "",
    password: "",
  });

  const [error, setError] = useState("");

  const handleSubmit = () => {
    setError("");

    if (!form.identifier || !form.password) {
      setError("All fields are required.");
      return;
    }

    // Auto detect credential type(wether email or EmpId)
    const credentialType = form.identifier.includes("@")
      ? "email"
      : "employeeId";

    const payload = {
      login_mode: loginMode,
      credential_type: credentialType,
      identifier: form.identifier,
      password: form.password,
    };

    console.log("Login Payload:", payload);

    // TODO:
    // POST /auth/login
    // Backend should:
    // - Validate credentials
    // - Check status
    // - If face_enrolled = false → return flag
    // - Frontend redirect to /enroll-face if needed
  };

  return (
    <AuthLayout>
      <Stack spacing={3}>
        {/* Header */}
        <Box textAlign="center">
          <LockOutlinedIcon
            sx={{
              fontSize: 42,
              color: "primary.main",
              mb: 1,
            }}
          />
          <Typography variant="h5" fontWeight={600}>
            Secure Access
          </Typography>
          <Typography
            variant="body2"
            color="text.secondary"
          >
            Sign in to your FaceTrack account
          </Typography>
        </Box>

        {/* Admin / User Toggle */}
        <ToggleButtonGroup
          value={loginMode}
          exclusive
          fullWidth
          onChange={(_, value) => {
            if (value) setLoginMode(value);
          }}
        >
          <ToggleButton value="user">User</ToggleButton>
          <ToggleButton value="admin">Admin</ToggleButton>
        </ToggleButtonGroup>

        {/*Identifier Field for credentials */}
        <TextField
          label="Email or Employee ID"
          placeholder="Enter email or employee ID"
          fullWidth
          value={form.identifier}
          onChange={(e) =>
            setForm({
              ...form,
              identifier: e.target.value,
            })
          }
        />

        {/* Password */}
        <TextField
          label="Password"
          type="password"
          fullWidth
          value={form.password}
          onChange={(e) =>
            setForm({
              ...form,
              password: e.target.value,
            })
          }
        />

        {error && <Alert severity="error">{error}</Alert>}

        {/* Login Button */}
        <Button
          variant="contained"
          size="large"
          fullWidth
          onClick={handleSubmit}
        >
          Sign In
        </Button>

        {/* Footer */}
        <Box
          display="flex"
          justifyContent="space-between"
        >
          <Button
            size="small"
            onClick={() =>
              navigate("/forgot-password")
            }
          >
            Forgot Password?
          </Button>

          <Button
            size="small"
            onClick={() =>
              navigate("/register")
            }
          >
            Create Account
          </Button>
        </Box>
      </Stack>
    </AuthLayout>
  );
}
