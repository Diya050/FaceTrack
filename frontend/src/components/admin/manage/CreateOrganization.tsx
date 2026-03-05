import { useState } from "react";
import {
  Box,
  Paper,
  TextField,
  Button,
  Typography,
  Alert,
  CircularProgress,
} from "@mui/material";

interface CreateOrganizationPayload {
  name: string;
  email: string;
  contact_number: string;
  address: string;
}

const CreateOrganization = () => {
  const [formData, setFormData] = useState<CreateOrganizationPayload>({
    name: "",
    email: "",
    contact_number: "",
    address: "",
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleSubmit = async () => {
    setLoading(true);
    setError(null);
    setSuccess(null);

    // 🔥 Simulate API delay
    setTimeout(() => {
      if (!formData.name || !formData.email) {
        setError("Name and Email are required.");
        setLoading(false);
        return;
      }

      setSuccess(`Organization "${formData.name}" created successfully.`);
      setFormData({
        name: "",
        email: "",
        contact_number: "",
        address: "",
      });
      setLoading(false);
    }, 800);
  };

  return (
    <Box display="flex" justifyContent="center" mt={12}>
      <Paper sx={{ p: 4, width: 800 }}>
        <Typography variant="h5" mb={3}>
          Create Organization
        </Typography>

        {error && (
          <Alert severity="error" sx={{ mb: 2 }}>
            {error}
          </Alert>
        )}

        {success && (
          <Alert severity="success" sx={{ mb: 2 }}>
            {success}
          </Alert>
        )}

        <TextField
          fullWidth
          label="Organization Name"
          name="name"
          value={formData.name}
          onChange={handleChange}
          margin="normal"
          required
        />

        <TextField
          fullWidth
          label="Email"
          name="email"
          type="email"
          value={formData.email}
          onChange={handleChange}
          margin="normal"
          required
        />

        <TextField
          fullWidth
          label="Contact Number"
          name="contact_number"
          value={formData.contact_number}
          onChange={handleChange}
          margin="normal"
        />

        <TextField
          fullWidth
          label="Address"
          name="address"
          multiline
          rows={3}
          value={formData.address}
          onChange={handleChange}
          margin="normal"
        />

        <Button
          fullWidth
          variant="contained"
          sx={{ mt: 3 }}
          onClick={handleSubmit}
          disabled={loading}
        >
          {loading ? <CircularProgress size={24} /> : "Create Organization"}
        </Button>
      </Paper>
    </Box>
  );
};

export default CreateOrganization;