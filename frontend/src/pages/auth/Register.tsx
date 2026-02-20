import {
  TextField,
  Button,
  Typography,
  Box,
  Link,
  CircularProgress,
  Alert,
  MenuItem,
} from "@mui/material";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import AuthLayout from "../../layouts/AuthLayout";

/* ---------------- MOCK DATA (Temporary) ---------------- */

interface Department {
  id: number;
  name: string;
}

interface Organization {
  id: number;
  name: string;
  departments: Department[];
}

const mockOrganizations: Organization[] = [
  {
    id: 1,
    name: "ABC Corporation",
    departments: [
      { id: 1, name: "HR" },
      { id: 2, name: "IT" },
      { id: 3, name: "Finance" },
    ],
  },
  {
    id: 2,
    name: "XYZ Pvt. Ltd.",
    departments: [
      { id: 4, name: "Marketing" },
      { id: 5, name: "Accounts" },
      { id: 6, name: "Legal" },
    ],
  },
];

/* -------------------------------------------------------- */

export default function Register() {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    fullName: "",
    email: "",
    organizationId: "",
    departmentId: "",
    password: "",
    confirmPassword: "",
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const selectedOrganization = mockOrganizations.find(
    (org) => org.id === Number(form.organizationId)
  );

  const handleChange = (field: string, value: string) => {
    setForm((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const validateForm = () => {
    if (
      !form.fullName ||
      !form.email ||
      !form.organizationId ||
      !form.departmentId ||
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

  const handleSubmit = async () => {
    const validationError = validateForm();
    if (validationError) {
      setError(validationError);
      return;
    }

    try {
      setLoading(true);
      setError("");

      console.log("Registering user:", form);

      await new Promise((resolve) => setTimeout(resolve, 1000));

      navigate("/pending-approval");
    } catch (err) {
      setError("Registration failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthLayout>
      <Typography variant="h4" gutterBottom>
        Create Account
      </Typography>

      <Typography variant="body2" color="text.secondary" mb={3}>
        Register to access FaceTrack
      </Typography>

      <Box display="flex" flexDirection="column" gap={2}>
        {error && <Alert severity="error">{error}</Alert>}

        <TextField
          label="Full Name"
          fullWidth
          value={form.fullName}
          onChange={(e) => handleChange("fullName", e.target.value)}
        />

        <TextField
          label="Email"
          type="email"
          fullWidth
          value={form.email}
          onChange={(e) => handleChange("email", e.target.value)}
        />

        {/* Organization Dropdown */}
        <TextField
          select
          label="Organization"
          fullWidth
          value={form.organizationId}
          onChange={(e) => {
            handleChange("organizationId", e.target.value);
            handleChange("departmentId", ""); // reset department
          }}
        >
          {mockOrganizations.map((org) => (
            <MenuItem key={org.id} value={org.id}>
              {org.name}
            </MenuItem>
          ))}
        </TextField>

        {/* Department Dropdown */}
        <TextField
          select
          label="Department"
          fullWidth
          value={form.departmentId}
          onChange={(e) =>
            handleChange("departmentId", e.target.value)
          }
          disabled={!form.organizationId}
        >
          {selectedOrganization?.departments.map((dept) => (
            <MenuItem key={dept.id} value={dept.id}>
              {dept.name}
            </MenuItem>
          ))}
        </TextField>

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

        <Button
          variant="contained"
          size="large"
          onClick={handleSubmit}
          disabled={loading}
        >
          {loading ? <CircularProgress size={22} /> : "Register"}
        </Button>

        <Link
          component="button"
          onClick={() => navigate("/login")}
          sx={{ textAlign: "center", mt: 1 }}
        >
          Already have an account? Login
        </Link>
      </Box>
    </AuthLayout>
  );
}
