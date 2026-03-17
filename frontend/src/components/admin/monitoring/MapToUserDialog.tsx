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

export default function MapToUserDialog({ open, face, onClose }: any) {
  const [user, setUser] = useState("");

  const handleMap = () => {
    alert(`Mapped face ${face.id} to user ${user}`);
    onClose();
  };

  if (!face) return null;

  return (
    <Dialog open={open} onClose={onClose}>
      <DialogTitle>Map Face to User</DialogTitle>

      <DialogContent>
        <Stack spacing={2} mt={1}>
          <TextField
            label="User ID or Email"
            value={user}
            onChange={(e) => setUser(e.target.value)}
          />
        </Stack>
      </DialogContent>

      <DialogActions>
        <Button onClick={onClose}>Cancel</Button>
        <Button variant="contained" onClick={handleMap}>
          Confirm
        </Button>
      </DialogActions>
    </Dialog>
  );
}