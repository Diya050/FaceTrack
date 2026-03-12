import React, { useCallback, useMemo, useState, useEffect } from "react";
import {
  Container,
  Typography,
  Box,
  Card,
  CardContent,
  TextField,
  Button,
  Stack,
  Alert,
  IconButton
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import { createTicket } from "../../services/supportTicketService";
import axios from "axios";

const COLORS = {
  dark: "#2E3A59",
  darker: "#1F2A44",
  beige: "#E1D9BC",
  cream: "#F0F0DB",
};

type FormState = {
  subject: string;
  description: string;
};

const CreateTicket: React.FC = () => {
  const [form, setForm] = useState<FormState>({ subject: "", description: "" });
  const [success, setSuccess] = useState<string>("");
  const [error, setError] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);

  const MAX_SUBJECT = 100;
  const MAX_DESCRIPTION = 1000;

  const styles = useMemo(
  () => ({
    page: { backgroundColor: "#F8F9FA", minHeight: "100vh", py: 6 },
    title: { color: COLORS.dark, mb: 4 },
    card: {
      borderRadius: 8,
      boxShadow: "0 12px 30px rgba(0,0,0,0.08)",
    },
    cardContent: { p: { xs: 3, sm: 4 } },
    submitBtn: {
      backgroundColor: COLORS.dark,
      px: 4,
      py: 1.2,
      fontWeight: 600,
      "&:hover": { backgroundColor: COLORS.darker },
    },
    helperText: { color: "text.secondary" as const },
  }),
  []
);

  useEffect(() => {
    let timer: number | undefined;
    if (success) {
      timer = window.setTimeout(() => setSuccess(""), 5000);
    }
    return () => {
      if (timer) window.clearTimeout(timer);
    };
  }, [success]);

  const handleChange = useCallback((field: keyof FormState, value: string) => {
    setForm((prev) => ({ ...prev, [field]: value }));
  }, []);

  const handleSubmit = useCallback(async () => {
    setError("");
    setSuccess("");

    if (!form.subject.trim() || !form.description.trim()) {
      setError("All fields are required");
      return;
    }

    setLoading(true);
    try {
      await createTicket({
        subject: form.subject,
        description: form.description,
      });

      setSuccess("Support ticket created successfully");
      setForm({ subject: "", description: "" });
    } catch (err) {
      if (axios.isAxiosError(err)) {
        setError(err.response?.data?.detail || "Failed to create ticket");
      } else {
        setError("Failed to create ticket");
      }
    } finally {
      setLoading(false);
    }
  }, [form]);

  return (
    
    <Box  sx={styles.page}>
      <Container maxWidth="md">
        <Typography variant="h4" fontWeight="bold" sx={styles.title}>
          Create Support Ticket
        </Typography>

        <Card sx={styles.card}>
          <CardContent sx={styles.cardContent}>
            <Stack spacing={3}>
              <Typography variant="h6" sx={{ color: COLORS.dark }}>
                Report an Issue
              </Typography>

              <Typography variant="body2" color="text.secondary">
                Submit a ticket for any technical problem such as camera issues,
                login problems, attendance errors, or system access.
              </Typography>

              {error && (
                <Alert
                  severity="error"
                  role="status"
                  action={
                    <IconButton
                      aria-label="close error"
                      color="inherit"
                      size="small"
                      onClick={() => setError("")}
                    >
                      <CloseIcon fontSize="small" />
                    </IconButton>
                  }
                >
                  {error}
                </Alert>
              )}

              {success && (
                <Alert
                  severity="success"
                  role="status"
                  action={
                    <IconButton
                      aria-label="close success"
                      color="inherit"
                      size="small"
                      onClick={() => setSuccess("")}
                    >
                      <CloseIcon fontSize="small" />
                    </IconButton>
                  }
                >
                  {success}
                </Alert>
              )}

              <TextField
                label="Subject"
                fullWidth
                placeholder="Example: Camera not detecting face"
                value={form.subject}
                onChange={(e) => handleChange("subject", e.target.value)}
                inputProps={{ maxLength: MAX_SUBJECT }}
                helperText={
                  <span style={{ display: "flex", justifyContent: "space-between" }}>
                    <span style={{ color: "rgba(0,0,0,0.6)" }}>Brief summary of the issue</span>
                    <span style={{ color: "rgba(0,0,0,0.6)" }}>
                      {form.subject.length}/{MAX_SUBJECT}
                    </span>
                  </span>
                }
                aria-label="ticket subject"
                autoFocus
                variant="outlined"
              />

              <TextField
                label="Description"
                multiline
                rows={6}
                fullWidth
                placeholder="Explain the issue in detail..."
                value={form.description}
                onChange={(e) => handleChange("description", e.target.value)}
                inputProps={{ maxLength: MAX_DESCRIPTION }}
                helperText={
                  <span style={{ display: "flex", justifyContent: "space-between" }}>
                    <span style={{ color: "rgba(0,0,0,0.6)" }}>Provide steps to reproduce, expected vs actual</span>
                    <span style={{ color: "rgba(0,0,0,0.6)" }}>
                      {form.description.length}/{MAX_DESCRIPTION}
                    </span>
                  </span>
                }
                aria-label="ticket description"
                variant="outlined"
              />

              <Box sx={{ display: "flex", justifyContent: "flex-start", mt: 1 }}>
                <Button
                  variant="contained"
                  onClick={handleSubmit}
                  sx={styles.submitBtn}
                  disabled={loading}
                  aria-disabled={loading}
                  aria-label="submit ticket"
                >
                  {loading ? "Submitting..." : "Submit Ticket"}
                </Button>
              </Box>
            </Stack>
          </CardContent>
        </Card>
      </Container>
    </Box>
   
  );
}
export default CreateTicket;
