import {
  Container,
  Typography,
  Box,
  Card,
  CardContent,
  Select,
  MenuItem
} from "@mui/material";
import { DataGrid, type GridColDef } from "@mui/x-data-grid";
import { useEffect, useState, useCallback } from "react";

import {
  getTickets,
  updateTicketStatus
} from "../../services/supportTicketService";

import type { SupportTicket, TicketStatus } from "../../types/supportTicket";

// ✅ IMPORT AUTH
import { useAuth } from "../../context/AuthContext";

// ✅ IMPORT CREATE TICKET COMPONENT
import CreateTicket from "../../components/tickets/CreateTicketForm";

const COLORS = {
  dark: "#2E3A59",
  darker: "#1F2A44",
  beige: "#E1D9BC",
  cream: "#F0F0DB",
};

export default function SupportTickets() {
  const { role } = useAuth(); // ✅ get role

  const [tickets, setTickets] = useState<SupportTicket[]>([]);

  const loadTickets = useCallback(async () => {
    try {
      const data = await getTickets();
      const ticketArray = Array.isArray(data)
        ? data
        : (data as any)?.data || (data as any)?.tickets || [];
      setTickets(ticketArray);
    } catch (error) {
      console.error("Failed to load tickets:", error);
    }
  }, []);

  useEffect(() => {
    // ✅ Only fetch tickets if HR_ADMIN
    if (role !== "HR_ADMIN") return;

    let ignore = false;

    const fetchInitialData = async () => {
      try {
        const data = await getTickets();
        console.log("API Response Data:", data);

        if (!ignore) {
          const ticketArray = Array.isArray(data)
            ? data
            : (data as any)?.data || (data as any)?.tickets || [];
          setTickets(ticketArray);
        }
      } catch (error) {
        console.error("Failed to load initial tickets:", error);
      }
    };

    fetchInitialData();

    return () => {
      ignore = true;
    };
  }, [role]);

  const handleStatusChange = async (
    id: string,
    status: TicketStatus
  ) => {
    try {
      await updateTicketStatus(id, status);
      await loadTickets();
    } catch (error) {
      console.error("Failed to update ticket status:", error);
    }
  };

  const columns: GridColDef[] = [
    {
      field: "subject",
      headerName: "Subject",
      flex: 1
    },
    {
      field: "description",
      headerName: "Description",
      flex: 1.5
    },
    {
      field: "status",
      headerName: "Status",
      flex: 1,
      renderCell: (params) => {
        const ticket = params.row as SupportTicket;

        return (
          <Select
            size="small"
            value={ticket.status || "Open"}
            onChange={(e) =>
              handleStatusChange(
                ticket.ticket_id || (ticket as any).id,
                e.target.value as TicketStatus
              )
            }
          >
            <MenuItem value="Open">Open</MenuItem>
            <MenuItem value="In Progress">In Progress</MenuItem>
            <MenuItem value="Resolved">Resolved</MenuItem>
            <MenuItem value="Closed">Closed</MenuItem>
          </Select>
        );
      }
    }
  ];

  // ✅ ROLE-BASED RENDERING
  if (role !== "HR_ADMIN") {
    return (
      <Box sx={{ backgroundColor: "#F8F9FA", minHeight: "100vh", pt: 12 }}>
        <Container maxWidth="md">
          <CreateTicket />
        </Container>
      </Box>
    );
  }

  // ✅ HR_ADMIN VIEW (existing UI unchanged)
  return (
    <Box sx={{ backgroundColor: "#F8F9FA", minHeight: "100vh", pt: 12, pb: 6 }}>
      <Container maxWidth="lg">
        <Typography
          variant="h4"
          fontWeight="bold"
          sx={{ color: COLORS.dark, mb: 4 }}
        >
          Support Tickets
        </Typography>

        <Card
          sx={{
            borderRadius: 4,
            boxShadow: "0 10px 30px rgba(0,0,0,0.08)"
          }}
        >
          <CardContent>
            <Box sx={{ height: 500 }}>
              <DataGrid
                rows={tickets}
                columns={columns}
                getRowId={(row) => row.ticket_id || row.id || row._id}
                pageSizeOptions={[5, 10, 20]}
                disableRowSelectionOnClick
              />
            </Box>
          </CardContent>
        </Card>
      </Container>
    </Box>
  );
}