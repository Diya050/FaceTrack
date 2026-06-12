import {
  Paper,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  Chip,
  Typography,
  Box
} from "@mui/material";

interface Props {
  rows: any[];
}

const getStatusColor = (
  status: string
): "success" | "warning" | "error" | "info" | "default" => {

  const value = status?.toLowerCase();

  if (value === "present") return "success";

  if (value === "late") return "warning";

  if (value === "absent") return "error";

  if (value === "half_day") return "info";

  return "default";
};

const AttendanceTable = ({ rows }: Props) => {

  if (rows.length === 0) {

    return (
      <Paper sx={{ p: 4, borderRadius: 3 }}>

        <Typography align="center" color="text.secondary">
          No attendance records found
        </Typography>

      </Paper>
    );

  }

  return (
    <Paper sx={{ p: 3, borderRadius: 3 }}>

      <Typography variant="h6" fontWeight="bold" mb={2}>
        Attendance Records
      </Typography>

      <Box sx={{ overflowX: "auto" }}>

        <Table size="small">

          <TableHead>

            <TableRow>
              <TableCell>Date</TableCell>
              <TableCell>Status</TableCell>
              <TableCell>Check-In</TableCell>
              <TableCell>Check-Out</TableCell>
              <TableCell>Total Hours</TableCell>
            </TableRow>

          </TableHead>

          <TableBody>

            {rows.map(row => (

              <TableRow key={row.date}>

                <TableCell>{row.date}</TableCell>

                <TableCell>

                  <Chip
                    label={row.status}
                    color={getStatusColor(row.status)}
                  />

                </TableCell>

                <TableCell>{row.checkIn}</TableCell>

                <TableCell>{row.checkOut}</TableCell>

                <TableCell>{row.total}</TableCell>


              </TableRow>

            ))}

          </TableBody>

        </Table>

      </Box>

    </Paper>
  );
};

export default AttendanceTable;