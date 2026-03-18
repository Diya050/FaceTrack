import {
  TextField,
  Button,
  Container,
  Stack,
  Typography,
  Box,
  Link,
  CircularProgress,
  Alert,
  MenuItem,
} from "@mui/material";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import AuthLayout from "../../layout/AuthLayout";
import { registerUser } from "../../services/authService";
import {
  getOrganizations,
  getDepartmentsByOrgName,
} from "../../services/orgService";
import type { Organization, Department } from "../../services/orgService";

export default function Register() {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    fullName: "",
    email: "",
    organizationName: "",
    departmentName: "",
    password: "",
    confirmPassword: "",
  });

  const [organizations, setOrganizations] = useState<Organization[]>([]);
  const [departments, setDepartments] = useState<Department[]>([]);

  const [loading, setLoading] = useState(false);
  const [dataLoading, setDataLoading] = useState(true);
  const [error, setError] = useState("");

  /* ---------------- FETCH ORGANIZATIONS ---------------- */

  useEffect(() => {
    const fetchOrganizations = async () => {
      try {
        const data = await getOrganizations();
        setOrganizations(data);
      } catch (err) {
        setError("Failed to load organizations.");
      } finally {
        setDataLoading(false);
      }
    };

    fetchOrganizations();
  }, []);

  /* ---------------- FETCH DEPARTMENTS ---------------- */

  const fetchDepartments = async (organizationName: string) => {
    try {
      const data = await getDepartmentsByOrgName(organizationName);
      setDepartments(data);
    } catch {
      setError("Failed to load departments.");
    }
  };

  /* ---------------- HANDLE CHANGE ---------------- */

  const handleChange = (field: string, value: string) => {
    setForm((prev) => ({
      ...prev,
      [field]: value,
    }));

    if (field === "organizationName") {
      setDepartments([]);
      setForm((prev) => ({
        ...prev,
        organizationName: value,
        departmentName: "",
      }));

      if (value) {
        fetchDepartments(value);
      }
    }
  };

  /* ---------------- VALIDATION ---------------- */

  const validateForm = () => {
    if (
      !form.fullName ||
      !form.email ||
      !form.organizationName ||
      !form.departmentName ||
      !form.password
    ) {
      return "All fields are required.";
    }

    if (form.password.length < 6) {
      return "Password must be at least 6 characters.";
    }

    if (form.password !== form.confirmPassword) {
      return "Passwords do not match.";
    }

    return null;
  };

  /* ---------------- SUBMIT ---------------- */

  const handleSubmit = async () => {
    const validationError = validateForm();
    if (validationError) {
      setError(validationError);
      return;
    }

    try {
      setLoading(true);
      setError("");

      await registerUser({
        full_name: form.fullName,
        email: form.email,
        organization_name: form.organizationName,
        department_name: form.departmentName,
        password: form.password,
      });

      navigate("/pending-approval");
    } catch (err) {
      setError("Registration failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  /* ---------------- UI ---------------- */

  if (dataLoading) {
    return (
      <AuthLayout>
        <Box
          sx={{
            height: "60vh",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <CircularProgress />
        </Box>
      </AuthLayout>
    );
  }

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
              Create Account
            </Typography>

            <Typography variant="body2" color="text.secondary">
              Register to access FaceTrack
            </Typography>
          </Box>

          {error && <Alert severity="error">{error}</Alert>}

          {/* Name */}

          <TextField
            label="Full Name"
            fullWidth
            value={form.fullName}
            onChange={(e) =>
              handleChange("fullName", e.target.value)
            }
          />

          {/* Email */}

          <TextField
            label="Email"
            type="email"
            fullWidth
            value={form.email}
            onChange={(e) =>
              handleChange("email", e.target.value)
            }
          />

          {/* Organization */}

          <TextField
            select
            label="Organization"
            fullWidth
            value={form.organizationName}
            onChange={(e) =>
              handleChange("organizationName", e.target.value)
            }
          >
            {organizations.map((org) => (
              <MenuItem
              key={org.organization_id}
              value={org.name}
              >
              {org.name}
              </MenuItem>
            ))}
          </TextField>

          {/* Department */}

          <TextField
            select
            label="Department"
            fullWidth
            value={form.departmentName}
            onChange={(e) =>
              handleChange("departmentName", e.target.value)
            }
            disabled={!form.organizationName}
          >
            {departments.map((dept) => (
              <MenuItem key={dept.department_id} value={dept.name}>
                {dept.name}
              </MenuItem>
            ))}
          </TextField>

          {/* Password */}

          <TextField
            label="Password"
            type="password"
            fullWidth
            value={form.password}
            onChange={(e) =>
              handleChange("password", e.target.value)
            }
          />

          {/* Confirm Password */}

          <TextField
            label="Confirm Password"
            type="password"
            fullWidth
            value={form.confirmPassword}
            onChange={(e) =>
              handleChange(
                "confirmPassword",
                e.target.value
              )
            }
          />

          {/* Register Button */}

          <Button
            variant="contained"
            size="large"
            fullWidth
            onClick={handleSubmit}
            disabled={loading}
            sx={{
              py: { xs: 1.4, sm: 1.6 },
              mt: 1,
            }}
          >
            {loading ? (
              <CircularProgress size={22} />
            ) : (
              "Register"
            )}
          </Button>

          {/* Footer */}

          <Box textAlign="center">
            <Link
              component="button"
              onClick={() => navigate("/login")}
            >
              Already have an account? Login
            </Link>
          </Box>
        </Stack>
      </Container>
    </AuthLayout>
  );
}
