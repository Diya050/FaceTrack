import {
  TextField,
  Button,
  Stack,
  Typography,
  Paper,
  Alert,
} from "@mui/material";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { createOrganization } from "../../services/orgService";

export default function CreateOrganizationPage() {
    const navigate = useNavigate();
    const [form, setForm] = useState({
        name: "",
        email: "",
        contact_number: "",
        address: "",
    });
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");

    const handleChange = (key: string, value: string) => {
        setForm((prev) => ({ ...prev, [key]: value }));
    };
    const handleSubmit = async () => {
        try {
        setLoading(true);
        setError("");

        await createOrganization(form);

        navigate("/super-admin/organizations");
        } catch (err: any) {
        setError(err?.response?.data?.detail || "Failed to create organization");
        } finally {
        setLoading(false);
        }
    }
  return (
    <Paper sx={{ p: 4, borderRadius: 3 }}>
      <Stack spacing={3}>
        <Typography variant="h5" fontWeight={700}>
          Create Organization
        </Typography>

        {error && <Alert severity="error">{error}</Alert>}

        <TextField
          label="Organization Name"
          fullWidth
          value={form.name}
          onChange={(e) => handleChange("name", e.target.value)}
        />
        <TextField
          label="Email"
          fullWidth
          value={form.email}
          onChange={(e) => handleChange("email", e.target.value)}
        />
        <TextField
          label="Contact Number"
          fullWidth
          value={form.contact_number}
          onChange={(e) => handleChange("contact_number", e.target.value)}
        />
        <TextField
          label="Address"
          fullWidth
          value={form.address}
          onChange={(e) => handleChange("address", e.target.value)}
        />
        <Button variant="contained" onClick={handleSubmit} disabled={loading}>
            {loading ? "Creating..." : "Create Organization"}
        </Button>
      </Stack>
    </Paper>
  );
};
