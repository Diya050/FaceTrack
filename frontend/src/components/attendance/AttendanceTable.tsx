import {
  Paper,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  Chip,
  Typography,
  Button,
  Box
} from "@mui/material";

interface Props {
  rows: any[];
}

const getStatusColor = (status: string) => {
  if (status === "Present") return "success";
  if (status === "Late") return "warning";
  if (status === "Absent") return "error";
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
              <TableCell>Confidence</TableCell>
              <TableCell>Camera</TableCell>
              <TableCell>Method</TableCell>
              <TableCell>Actions</TableCell>
            </TableRow>

          </TableHead>

          <TableBody>

            {rows.map(row => (

              <TableRow key={row.date}>

                <TableCell>{row.date}</TableCell>

                <TableCell>

                  <Chip
                    label={row.status}
                    color={getStatusColor(row.status) as any}
                  />

                </TableCell>

                <TableCell>{row.checkIn}</TableCell>

                <TableCell>{row.checkOut}</TableCell>

                <TableCell>{row.hours}</TableCell>

                <TableCell>{row.confidence}</TableCell>

                <TableCell>{row.camera}</TableCell>

                <TableCell>{row.method}</TableCell>

                <TableCell>

                  <Button size="small">
                    View
                  </Button>

                  <Button
                    size="small"
                    color="error"
                    onClick={() =>
                      alert("Dispute request submitted")
                    }
                  >
                    Dispute
                  </Button>

                </TableCell>

              </TableRow>

            ))}

          </TableBody>

        </Table>

      </Box>

    </Paper>
  );
};

export default AttendanceTable;