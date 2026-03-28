import { useEffect, useState, useCallback } from "react";
import {
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  Select,
  MenuItem,
  Paper,
  TableContainer,
  Typography
} from "@mui/material";

import { getTickets, updateTicketStatus } from "../../services/supportTicketService";
import type { SupportTicket, TicketStatus } from "../../types/supportTicket";

export default function TicketTable() {
  const [tickets, setTickets] = useState<SupportTicket[]>([]);

  // Memoize data fetching to pull fresh UI metrics after state changes
  const fetchTickets = useCallback(async (isMounted: boolean) => {
    try {
      const data = await getTickets();
      const ticketArray = Array.isArray(data) ? data : (data as any)?.data || [];

      if (isMounted) {
        setTickets(ticketArray);
      }
    } catch (error) {
      console.error("Failed to fetch tickets", error);
    }
  }, []);

  useEffect(() => {
    let isMounted = true;
    fetchTickets(isMounted);

    return () => {
      isMounted = false;
    };
  }, [fetchTickets]);

  const handleStatusChange = async (
    ticketId: string,
    status: TicketStatus
  ) => {
    try {
      await updateTicketStatus(ticketId, status);
      await fetchTickets(true); // Seamless hot reloading
    } catch (error) {
      console.error("Failed to update ticket status", error);
    }
  };

  return (
    <TableContainer component={Paper} elevation={0} sx={{ border: "1px solid rgba(0,0,0,0.05)", borderRadius: 3 }}>
      <Table>
        <TableHead sx={{ backgroundColor: "#F4F6F8" }}>
          <TableRow>
            <TableCell sx={{ fontWeight: 700 }}>Subject</TableCell>
            <TableCell sx={{ fontWeight: 700 }}>Description</TableCell>
            <TableCell sx={{ fontWeight: 700 }}>Status</TableCell>
            <TableCell sx={{ fontWeight: 700 }}>Update Status</TableCell>
          </TableRow>
        </TableHead>

        <TableBody>
          {tickets.length === 0 ? (
            <TableRow>
              <TableCell colSpan={4} align="center">
                <Typography variant="body2" color="text.secondary" sx={{ py: 3 }}>
                  No support tickets found.
                </Typography>
              </TableCell>
            </TableRow>
          ) : (
            tickets.map((ticket) => {
              const tId = ticket.ticket_id || (ticket as any).id;
              const currentStatus = (ticket.status || "open").toLowerCase(); // Normalize case for UI

              return (
                <TableRow key={tId} hover>
                  <TableCell sx={{ fontWeight: 600 }}>{ticket.subject}</TableCell>
                  <TableCell color="text.secondary">{ticket.description}</TableCell>
                  <TableCell>{ticket.status}</TableCell>

                  <TableCell>
                    <Select
                      size="small"
                      value={currentStatus}
                      sx={{ minWidth: 130 }}
                      onChange={(e) => handleStatusChange(tId, e.target.value as TicketStatus)}
                    >
                      <MenuItem value="open">Open</MenuItem>
                      <MenuItem value="in_progress">In Progress</MenuItem>
                      <MenuItem value="resolved">Resolved</MenuItem>
                      <MenuItem value="closed">Closed</MenuItem>
                    </Select>
                  </TableCell>
                </TableRow>
              );
            })
          )}
        </TableBody>
      </Table>
    </TableContainer>
  );
}