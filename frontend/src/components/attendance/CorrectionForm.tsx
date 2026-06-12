import {
  Box,
  Button,
  TextField,
  MenuItem,
  Typography,
} from "@mui/material";
import { useState } from "react";

/* ───────── TYPES ───────── */

type AttendanceRow = {
  attendance_id: string;
  date: string;
  status: string;
};

type Props = {
  attendance: AttendanceRow[];
  onSubmit: (data: {
    attendance_id: string;
    requested_time_in?: string;
    requested_time_out?: string;
    reason: string;
  }) => void;
};

/* ───────── COMPONENT ───────── */

const CorrectionForm = ({ attendance, onSubmit }: Props) => {
  const [attendanceId, setAttendanceId] = useState("");
  const [checkIn, setCheckIn] = useState("");
  const [checkOut, setCheckOut] = useState("");
  const [reason, setReason] = useState("");

  const convertISTToUTC = (time: string) => {
    if (!time) return undefined;

    const [hours, minutes] = time.split(":").map(Number);

    const date = new Date();

    // treat input as IST
    date.setHours(hours, minutes, 0, 0);

    // convert to UTC
    const utcHours = date.getUTCHours().toString().padStart(2, "0");
    const utcMinutes = date.getUTCMinutes().toString().padStart(2, "0");

    return `${utcHours}:${utcMinutes}`;
  };

  const handleSubmit = () => {
    if (!attendanceId || !reason) {
      alert("Please select record and provide reason");
      console.log("attendance:", attendance);
      return;
    }

    onSubmit({
      attendance_id: attendanceId,
      requested_time_in: checkIn ? convertISTToUTC(checkIn) : undefined,
      requested_time_out: checkOut ? convertISTToUTC(checkOut) : undefined,
      reason,
    });

    // Reset form
    setAttendanceId("");
    setCheckIn("");
    setCheckOut("");
    setReason("");
  };
  console.log("ATTENDANCE DATA:", attendance);
  return (
    <Box>
      <Typography variant="h6" fontWeight="bold" mb={2}>
        Request Attendance Correction
      </Typography>

      <Box display="flex" flexDirection="column" gap={2} maxWidth={400}>
        {/* SELECT ATTENDANCE */}
        <TextField
          select
          label="Select Date"
          value={attendanceId}
          onChange={(e) => {
            console.log("SELECTED:", e.target.value);
            setAttendanceId(String(e.target.value));
            <Typography>
              Selected ID: {attendanceId}
            </Typography>
          }}
        >
          {attendance.map((a) => (
            <MenuItem
              key={String(a.attendance_id)}
              value={String(a.attendance_id)}
            >
              {a.date} - {a.status}
            </MenuItem>
          ))}
        </TextField>

        {/* CHECK IN */}
        <TextField
          type="time"
          label="Requested Check In"
          InputLabelProps={{ shrink: true }}
          value={checkIn}
          onChange={(e) => setCheckIn(e.target.value)}
        />

        {/* CHECK OUT */}
        <TextField
          type="time"
          label="Requested Check Out"
          InputLabelProps={{ shrink: true }}
          value={checkOut}
          onChange={(e) => setCheckOut(e.target.value)}
        />

        {/* REASON */}
        <TextField
          label="Reason"
          multiline
          rows={3}
          value={reason}
          onChange={(e) => setReason(e.target.value)}
        />

        <Button variant="contained" onClick={handleSubmit}>
          Submit Request
        </Button>
      </Box>
    </Box>
  );
};

export default CorrectionForm;