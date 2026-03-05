import { TableRow, TableCell, Chip, Button } from "@mui/material";

interface Props {
  row: any;
}

const CorrectionRequestRow = ({ row }: Props) => {
  return (
    <TableRow>

      <TableCell>{row.date}</TableCell>

      <TableCell>
        <Chip label={row.status} color="success" />
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

        <Button size="small">
          Dispute
        </Button>

      </TableCell>

    </TableRow>
  );
};

export default CorrectionRequestRow;