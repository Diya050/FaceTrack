import {
  Dialog,
  DialogTitle,
  DialogContent,
  Typography,
  Stack,
  Avatar,
} from "@mui/material";

export default function UnknownFaceDetailsDialog({ open, face, onClose }: any) {
  if (!face) return null;

  return (
    <Dialog open={open} onClose={onClose} maxWidth="xs" fullWidth>
      <DialogTitle>Unknown Face Details</DialogTitle>

      <DialogContent>
        <Stack spacing={2} alignItems="center">
          <Avatar src={face.image} sx={{ width: 120, height: 120 }} />

          <Typography>Camera: {face.camera}</Typography>
          <Typography>Location: {face.location}</Typography>
          <Typography>Confidence: {face.confidence}%</Typography>
          <Typography>Detected: {face.timestamp}</Typography>
        </Stack>
      </DialogContent>
    </Dialog>
  );
}