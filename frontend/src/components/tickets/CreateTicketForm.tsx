import { useState } from "react";
import {
  Button,
  TextField,
  Paper,
  Typography,
  Box
} from "@mui/material";
import { createTicket } from "../../services/supportTicketService";

export default function CreateTicketForm() {
  const [subject, setSubject] = useState("");
  const [description, setDescription] = useState("");

  const handleSubmit = async () => {
    try {
      await createTicket({ subject, description });

      alert("Ticket created successfully");

      setSubject("");
      setDescription("");
    } catch (error) {
      console.error(error);
      alert("Failed to create ticket");
    }
  };

  return (
    <Box
      sx={{
        minHeight: "70vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center"
      }}
    >
      <Paper
        elevation={0}
        sx={{
          p: 4,
          width: "100%",
          maxWidth: 520,
          borderRadius: 4,
          border: "1px solid #eaecef",
          boxShadow: "0 10px 30px rgba(0,0,0,0.05)"
        }}
      >
        {/* Header */}
        <Box mb={3}>
          <Typography variant="h5" fontWeight={700}>
            Create Support Ticket
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Describe your issue and our team will get back to you.
          </Typography>
        </Box>

        {/* Subject */}
        <Box mb={2.5}>
          <TextField
            fullWidth
            label="Subject"
            value={subject}
            onChange={(e) => setSubject(e.target.value)}
            variant="outlined"
            sx={{
              "& .MuiOutlinedInput-root": {
                borderRadius: 2
              }
            }}
          />
        </Box>

        {/* Description */}
        <Box mb={3}>
          <TextField
            fullWidth
            multiline
            rows={5}
            label="Description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            variant="outlined"
            sx={{
              "& .MuiOutlinedInput-root": {
                borderRadius: 2
              }
            }}
          />
        </Box>

        {/* Submit */}
        <Button
          fullWidth
          variant="contained"
          onClick={handleSubmit}
          sx={{
            py: 1.2,
            fontSize: "0.9rem",
            fontWeight: 600,
            textTransform: "none",
            borderRadius: 2,
            background: "linear-gradient(135deg, #4F46E5, #6366F1)",
            boxShadow: "0 6px 20px rgba(99,102,241,0.3)",
            "&:hover": {
              background: "linear-gradient(135deg, #4338CA, #4F46E5)"
            }
          }}
        >
          Submit Ticket
        </Button>
      </Paper>
    </Box>
  );
}