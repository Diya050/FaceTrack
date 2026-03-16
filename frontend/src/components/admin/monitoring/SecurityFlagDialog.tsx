import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  Stack,
} from "@mui/material";
import { useState } from "react";

export default function SecurityFlagDialog({ open, face, onClose }: any) {
  const [reason, setReason] = useState("");

  const handleFlag = () => {
    alert(`Security alert raised for ${face.id}: ${reason}`);
    onClose();
  };

  if (!face) return null;

  return (
    <Dialog open={open} onClose={onClose}>
      <DialogTitle>Raise Security Concern</DialogTitle>

      <DialogContent>
        <Stack spacing={2} mt={1}>
          <TextField
            label="Reason"
            multiline
            rows={3}
            value={reason}
            onChange={(e) => setReason(e.target.value)}
          />
        </Stack>
      </DialogContent>

      <DialogActions>
        <Button onClick={onClose}>Cancel</Button>
        <Button color="error" variant="contained" onClick={handleFlag}>
          Raise Alert
        </Button>
      </DialogActions>
    </Dialog>
  );
}