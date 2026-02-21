import {
  TextField,
  Button,
  Container,
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
        <Box textAlign="center">
          <LockOutlinedIcon
            sx={{
              fontSize: { xs: 36, sm: 42 },
              color: "primary.main",
              mb: 1,
            }}
          />
          <Typography
            variant="h5"
            fontWeight={600}
            sx={{
              fontSize: {
                xs: "1.4rem",
                sm: "1.6rem",
              },
            }}
          >
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
          sx={{
            "& .MuiToggleButton-root": {
              textTransform: "none",
              fontWeight: 500,
            },
          }}
        >
          <ToggleButton value="user">User</ToggleButton>
          <ToggleButton value="admin">Admin</ToggleButton>
        </ToggleButtonGroup>

        {/* Identifier */}
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
          sx={{
            py: { xs: 1.4, sm: 1.6 },
          }}
        >
          Sign In
        </Button>

        {/* Footer Links */}
        <Box
          sx={{
            display: "flex",
            flexDirection: {
              xs: "column",
              sm: "row",
            },
            justifyContent: {
              sm: "space-between",
            },
            alignItems: {
              sm: "center",
            },
            gap: { xs: 1, sm: 0 },
          }}
        >
          <Button
            size="small"
            onClick={() => navigate("/forgot-password")}
            sx={{
              justifyContent: {
                xs: "flex-start",
                sm: "flex-start",
              },
              px: 0,
            }}
          >
            Forgot Password?
          </Button>

          <Button
            size="small"
            onClick={() => navigate("/register")}
            sx={{
              justifyContent: {
                xs: "flex-start",
                sm: "flex-end",
              },
              px: 0,
            }}
          >
            Create Account
          </Button>
        </Box>
      </Stack>
    </Container>
  </AuthLayout>
);
}

