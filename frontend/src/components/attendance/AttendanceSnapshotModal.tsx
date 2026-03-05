import {
  Dialog,
  DialogTitle,
  DialogContent,
  Typography,
  Box
} from "@mui/material";

interface Props{
  open:boolean
  onClose:()=>void
}

const AttendanceSnapshotModal = ({open,onClose}:Props) => {

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>

      <DialogTitle>
        Attendance Event Details
      </DialogTitle>

      <DialogContent>

        <Box mb={2}>
          <img
            src="https://randomuser.me/api/portraits/men/32.jpg"
            style={{width:"100%",borderRadius:"8px"}}
          />
        </Box>

        <Typography>
          <b>Recognition Confidence:</b> 97%
        </Typography>

        <Typography>
          <b>Camera ID:</b> Gate-2
        </Typography>

        <Typography>
          <b>Timestamp:</b> 09:12 AM
        </Typography>

        <Typography>
          <b>Recognition Method:</b> Live Detection
        </Typography>

      </DialogContent>

    </Dialog>
  );
};

export default AttendanceSnapshotModal;