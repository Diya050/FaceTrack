import { useState } from "react";
import { Button, TextField, Paper, Typography, Box } from "@mui/material";
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
    <Paper sx={{ padding: 3, maxWidth: 600 }}>
      <Typography variant="h6">Create Support Ticket</Typography>

      <Box mt={2}>
        <TextField
          fullWidth
          label="Subject"
          value={subject}
          onChange={(e) => setSubject(e.target.value)}
        />
      </Box>

      <Box mt={2}>
        <TextField
          fullWidth
          multiline
          rows={4}
          label="Description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
        />
      </Box>

      <Box mt={2}>
        <Button variant="contained" onClick={handleSubmit}>
          Submit Ticket
        </Button>
      </Box>
    </Paper>
  );
}