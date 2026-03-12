import { useEffect, useState } from "react";
import {
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  Select,
  MenuItem
} from "@mui/material";

import { getTickets, updateTicketStatus } from "../../services/supportTicketService";
import type { SupportTicket, TicketStatus } from "../../types/supportTicket";

export default function TicketTable() {
  const [tickets, setTickets] = useState<SupportTicket[]>([]);

  useEffect(() => {
    let isMounted = true;

    const fetchTickets = async () => {
      try {
        const data = await getTickets();

        if (isMounted) {
          setTickets(data);
        }
      } catch (error) {
        console.error("Failed to fetch tickets", error);
      }
    };

    fetchTickets();

    return () => {
      isMounted = false;
    };
  }, []);

  const handleStatusChange = async (
    ticketId: string,
    status: TicketStatus
  ) => {
    await updateTicketStatus(ticketId, status);

    const data = await getTickets();
    setTickets(data);
  };

  return (
    <Table>
      <TableHead>
        <TableRow>
          <TableCell>Subject</TableCell>
          <TableCell>Description</TableCell>
          <TableCell>Status</TableCell>
          <TableCell>Update</TableCell>
        </TableRow>
      </TableHead>

      <TableBody>
        {tickets.map((ticket) => (
          <TableRow key={ticket.ticket_id}>
            <TableCell>{ticket.subject}</TableCell>
            <TableCell>{ticket.description}</TableCell>
            <TableCell>{ticket.status}</TableCell>

            <TableCell>
              <Select
                value={ticket.status}
                onChange={(e) =>
                  handleStatusChange(
                    ticket.ticket_id,
                    e.target.value as TicketStatus
                  )
                }
              >
                <MenuItem value="Open">Open</MenuItem>
                <MenuItem value="In Progress">In Progress</MenuItem>
                <MenuItem value="Resolved">Resolved</MenuItem>
                <MenuItem value="Closed">Closed</MenuItem>
              </Select>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}