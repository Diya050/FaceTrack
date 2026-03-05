import { Paper, Typography, Chip } from "@mui/material";

interface Props {
  data: {
    date: string;
    checkIn: string;
    checkOut: string;
    total: string;
    status: string;
  };
}

const statusColors: Record<string, string> = {
  "On Time": "#4CAF50",
  "Early Check Out": "#FF7043",
  Absent: "#F44336",
};

const UserAttendanceCard = ({ data }: Props) => {
  return (
    <Paper
      sx={{
        p: 2,
        borderRadius: 3,
        transition: "0.3s",
        "&:hover": { transform: "translateY(-5px)" },
      }}
      elevation={3}
    >
      <Typography fontWeight="bold">{data.date}</Typography>

      <Typography mt={1}>Check In: {data.checkIn}</Typography>
      <Typography>Check Out: {data.checkOut}</Typography>
      <Typography>Total: {data.total}</Typography>

      <Chip
        label={data.status}
        sx={{
          mt: 1,
          backgroundColor: statusColors[data.status] || "#1976d2",
          color: "#fff",
        }}
      />
    </Paper>
  );
};

export default UserAttendanceCard;