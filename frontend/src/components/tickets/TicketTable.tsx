import {
  Container,
  Typography,
  Box,
  Card,
  CardContent,
  Button,
  Chip,
  Tooltip,
  Avatar
} from "@mui/material";
import { DataGrid, type GridColDef } from "@mui/x-data-grid";
import { useEffect, useState, useCallback } from "react";

import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import HourglassTopIcon from "@mui/icons-material/HourglassTop";
import InfoOutlinedIcon from "@mui/icons-material/InfoOutlined";
import CancelOutlinedIcon from "@mui/icons-material/CancelOutlined";

import {
  getTickets,
  respondToTicket,
  updateTicketStatus
} from "../../services/supportTicketService";

import type { SupportTicket, TicketStatus } from "../../types/supportTicket";

import { useAuth } from "../../context/AuthContext";
import CreateTicket from "../../components/tickets/CreateTicketForm";

const COLORS = {
  dark: "#2E3A59"
};

/* ✅ Unified status config */
const statusConfig: Record<
  string,
  { label: string; color: string; bg: string; border: string; Icon: any }
> = {
  open: {
    label: "Open",
    color: "#b91c1c",
    bg: "#fff5f5",
    border: "#fecaca",
    Icon: HourglassTopIcon
  },
  in_progress: {
    label: "In Progress",
    color: "#c2410c",
    bg: "#fff7ed",
    border: "#fed7aa",
    Icon: InfoOutlinedIcon
  },
  resolved: {
    label: "Resolved",
    color: "#0f766e",
    bg: "#ecfdf5",
    border: "#bbf7d0",
    Icon: CheckCircleIcon
  },
  closed: {
    label: "Closed",
    color: "#475569",
    bg: "#f8fafc",
    border: "#e2e8f0",
    Icon: CancelOutlinedIcon
  }
};

/* Normalize status */
const normalizeStatus = (status?: string) => {
  if (!status) return "open";
  return status.toLowerCase().replace(/\s+/g, "_");
};

export default function SupportTickets() {
  const { role } = useAuth();
  const [tickets, setTickets] = useState<SupportTicket[]>([]);

  const loadTickets = useCallback(async () => {
    try {
      const data = await getTickets();
      const ticketArray = Array.isArray(data)
        ? data
        : data?.data || data?.tickets || [];
      setTickets(ticketArray);
    } catch (error) {
      console.error("Failed to load tickets:", error);
    }
  }, []);

  useEffect(() => {
    if (role === "HR_ADMIN") {
      loadTickets();
    }
  }, [role, loadTickets]);

  /* ✅ FIXED status update */
  const handleStatusChange = async (id: string, statusKey: string) => {
    try {
      const backendStatus = statusKey.replace(/_/g, " ") as TicketStatus;
      await updateTicketStatus(id, backendStatus);
      await loadTickets();
    } catch (error) {
      console.error("Failed to update ticket status:", error);
    }
  };

  const handleQuickAction = async (id: string, actionKey: string) => {
    try {
      await respondToTicket(id, actionKey);
      await loadTickets();
    } catch (error) {
      console.error("Quick action failed:", error);
    }
  };

  /* ✅ Columns */
  const columns: GridColDef[] = [
    {
      field: "subject",
      headerName: "Subject",
      flex: 1,
      minWidth: 220
    },
    {
      field: "description",
      headerName: "Description",
      flex: 1.5,
      minWidth: 320
    },
    {
      field: "status",
      headerName: "Status",
      flex: 1.3,
      renderCell: (params) => {
        const current = normalizeStatus(params.row.status);

        return (
          <Box sx={{ display: "flex", gap: 1, flexWrap: "wrap" }}>
            {Object.entries(statusConfig).map(([key, cfg]) => {
              const isActive = current === key;
              const Icon = cfg.Icon;

              return (
                <Tooltip key={key} title={cfg.label}>
                  <Chip
                    size="small"
                    clickable
                    onClick={() =>
                      handleStatusChange(params.row.ticket_id, key)
                    }
                    avatar={
                      <Avatar
                        sx={{
                          bgcolor: isActive ? cfg.color : "transparent",
                          color: isActive ? "#fff" : cfg.color
                        }}
                      >
                        <Icon fontSize="small" />
                      </Avatar>
                    }
                    label={cfg.label}
                    sx={{
                      bgcolor: isActive ? cfg.bg : "#fff",
                      border: `1px solid ${
                        isActive ? cfg.border : "#e5e7eb"
                      }`
                    }}
                  />
                </Tooltip>
              );
            })}
          </Box>
        );
      }
    },
    {
      field: "actions",
      headerName: "Quick Actions",
      flex: 1.2,
      sortable: false,
      renderCell: (params) => (
        <Box sx={{ display: "flex", gap: 1 }}>
          <Button
            size="small"
            variant="contained"
            color="success"
            onClick={() =>
              handleQuickAction(params.row.ticket_id, "resolved")
            }
          >
            Resolve
          </Button>

          <Button
            size="small"
            variant="outlined"
            color="warning"
            onClick={() =>
              handleQuickAction(params.row.ticket_id, "wait")
            }
          >
            Wait
          </Button>

          <Button
            size="small"
            variant="outlined"
            color="info"
            onClick={() =>
              handleQuickAction(params.row.ticket_id, "info_needed")
            }
          >
            Info
          </Button>
        </Box>
      )
    }
  ];

  /* User View */
  if (role !== "HR_ADMIN") {
    return (
      <Box sx={{ pt: 10 }}>
        <Container maxWidth="md">
          <CreateTicket />
        </Container>
      </Box>
    );
  }

  /* Admin View */
  return (
    <Box sx={{ pt: 10 }}>
      <Container maxWidth="xl">
        <Typography variant="h4" fontWeight={700} mb={3}>
          Support Tickets
        </Typography>

        <Card>
          <CardContent>
            <Box sx={{ height: 600 }}>
              <DataGrid
                rows={tickets}
                columns={columns}
                getRowId={(row) =>
                  row.ticket_id || row.id || row._id
                }
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