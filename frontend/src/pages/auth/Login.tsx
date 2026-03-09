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
  MenuItem,
  CircularProgress,
} from "@mui/material";
import LockOutlinedIcon from "@mui/icons-material/LockOutlined";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import AuthLayout from "../../layout/AuthLayout";
import { useAuth } from "../../context/AuthContext";
import { orgLogin, platformLogin } from "../../services/authService";
import type { Organization } from "../../services/orgService";
import { getOrganizations} from "../../services/orgService";

type LoginMode = "user" | "admin";

export default function Login() {
  const navigate = useNavigate();
  const { login } = useAuth();

  const [loginMode, setLoginMode] = useState<LoginMode>("user");

  const [form, setForm] = useState({
    identifier: "",
    password: "",
    organizationId: "",
  });

  const [organizations, setOrganizations] = useState<Organization[]>([]);
  const [loadingOrgs, setLoadingOrgs] = useState(true);

  const [error, setError] = useState("");

  /* ---------------- FETCH ORGANIZATIONS ---------------- */

  useEffect(() => {
    const fetchOrganizations = async () => {
      try {
        const data = await getOrganizations();
        setOrganizations(data);
      } catch (err) {
        console.error(err);
        setError("Failed to load organizations");
      } finally {
        setLoadingOrgs(false);
      }
    };

    fetchOrganizations();
  }, []);

  /* ---------------- FORM HANDLER ---------------- */

  const handleChange = (field: string, value: string) => {
    setForm((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  /* ---------------- LOGIN ---------------- */

  const handleSubmit = async () => {
    setError("");

    if (!form.identifier || !form.password) {
      setError("All fields are required.");
      return;
    }

    if (loginMode === "user" && !form.organizationId) {
      setError("Please select an organization.");
      return;
    }

    try {
      let response;

      if (loginMode === "admin") {
        response = await platformLogin(form.identifier, form.password);
      } else {
        const organization = organizations.find(
          (org) => org.organization_id === form.organizationId
        );

        if (!organization) {
          setError("Invalid organization selected.");
          return;
        }

        response = await orgLogin({
          email: form.identifier,
          password: form.password,
          organization_name: organization.name,
        });
      }

      const token = response.access_token;

      localStorage.setItem("token", token);

      login(loginMode, {
        firstName: loginMode === "admin" ? "Admin" : "User",
      });

      if (loginMode === "admin") {
        navigate("/admin");
      } else {
        navigate("/user/dashboard");
      }

    } catch (err: any) {
      setError(err.response?.data?.detail || "Login failed");
    }
  };

  return (
    <AuthLayout>
      <Container maxWidth="sm" sx={{ px: { xs: 2, sm: 3 } }}>
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
                fontSize: { xs: "1.4rem", sm: "1.6rem" },
              }}
            >
              Secure Access
            </Typography>

            <Typography variant="body2" color="text.secondary">
              Sign in to your FaceTrack account
            </Typography>
          </Box>

          {/* Toggle Login Mode */}
          <ToggleButtonGroup
            value={loginMode}
            exclusive
            fullWidth
            onChange={(_, value) => {
              if (value) {
                setLoginMode(value);
                setError("");
                handleChange("organizationId", "");
              }
            }}
          >
            <ToggleButton value="user">User</ToggleButton>
            <ToggleButton value="admin">Admin</ToggleButton>
          </ToggleButtonGroup>

          {/* Organization */}
          {loginMode === "user" && (
            <TextField
              select
              label="Organization"
              fullWidth
              value={form.organizationId}
              onChange={(e) => handleChange("organizationId", e.target.value)}
              disabled={loadingOrgs}
            >
              {loadingOrgs ? (
                <MenuItem disabled>
                  <CircularProgress size={20} />
                </MenuItem>
              ) : (
                organizations.map((org) => (
                  <MenuItem key={org.organization_id} value={org.organization_id}>
                    {org.name}
                  </MenuItem>
                ))
              )}
            </TextField>
          )}

          {/* Identifier */}
          <TextField
            label="Email or Employee ID"
            fullWidth
            value={form.identifier}
            onChange={(e) => handleChange("identifier", e.target.value)}
          />

          {/* Password */}
          <TextField
            label="Password"
            type="password"
            fullWidth
            value={form.password}
            onChange={(e) => handleChange("password", e.target.value)}
          />

          {error && <Alert severity="error">{error}</Alert>}

          {/* Login Button */}
          <Button
            variant="contained"
            size="large"
            fullWidth
            onClick={handleSubmit}
            sx={{ py: { xs: 1.4, sm: 1.6 } }}
          >
            Sign In
          </Button>

          {/* Footer */}
          <Box
            sx={{
              display: "flex",
              flexDirection: { xs: "column", sm: "row" },
              justifyContent: { sm: "space-between" },
              gap: { xs: 1, sm: 0 },
            }}
          >
            <Button
              size="small"
              onClick={() => navigate("/forgot-password")}
              sx={{ px: 0 }}
            >
              Forgot Password?
            </Button>

            <Button
              size="small"
              onClick={() => navigate("/register")}
              sx={{ px: 0 }}
            >
              Create Account
            </Button>
          </Box>

        </Stack>
      </Container>
    </AuthLayout>
  );
}