import {
  Container,
  Typography,
  Box,
  Card,
  CardContent,
  Button,
  Chip,
  Avatar
} from "@mui/material";
import { DataGrid, type GridColDef } from "@mui/x-data-grid";
import { useEffect, useState, useCallback } from "react";

import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import HourglassTopIcon from "@mui/icons-material/HourglassTop";
import InfoOutlinedIcon from "@mui/icons-material/InfoOutlined";

import {
  getTickets,
  respondToTicket,
} from "../../services/supportTicketService";

import type { SupportTicket } from "../../types/supportTicket";

import { useAuth } from "../../context/AuthContext";
import CreateTicket from "../../components/tickets/CreateTicketForm";


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
      const ticketArray = await getTickets();

      setTickets(ticketArray);
    } catch (error) {
      console.error("Failed to load tickets:", error);
      setTickets([]);
    }
  }, []);

  useEffect(() => {
  if (
    role === "HR_ADMIN" ||
    role === "ORG_ADMIN"
  ) {
    loadTickets();
  }
}, [role, loadTickets]);

  const handleQuickAction = async (id: string, actionKey: string) => {
    try {
      await respondToTicket(id, actionKey);
      await loadTickets();
    } catch (error) {
      console.error("Quick action failed:", error);
    }
  };


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

  /* STATUS → ONLY ACTIVE STATUS */
  {
    field: "status",
    headerName: "Status",
    flex: 1,

    renderCell: (params) => {
      const current = normalizeStatus(
        params.row.status
      );

      const cfg =
        statusConfig[current] ??
        statusConfig.open;

      const Icon = cfg.Icon;

      return (
        <Chip
          avatar={
            <Avatar
              sx={{
                bgcolor: cfg.color,
                color: "#fff"
              }}
            >
              <Icon fontSize="small" />
            </Avatar>
          }
          label={cfg.label}
          sx={{
            bgcolor: cfg.bg,
            color: cfg.color,
            border: `0px solid ${cfg.border}`,
            fontWeight: 700,
            minWidth: 130
          }}
        />
      );
    }
  },

  /* QUICK ACTIONS */
  {
    field: "quickActions",
    headerName: "Quick Actions",
    flex: 1.6,
    sortable: false,

    renderCell: (params) => {
      const current = normalizeStatus(
        params.row.status
      );

      return (
        <Box
          sx={{
            display: "flex",
            gap: 1,
            flexWrap: "wrap"
          }}
        >
          {/* OPEN */}
          {current === "open" && (
            <>
              <Button
                size="small"
                variant="contained"
                color="success"
                onClick={() =>
                  handleQuickAction(
                    params.row.ticket_id,
                    "resolved"
                  )
                }
              >
                Resolve
              </Button>

              <Button
                size="small"
                variant="outlined"
                color="warning"
                onClick={() =>
                  handleQuickAction(
                    params.row.ticket_id,
                    "wait"
                  )
                }
              >
                Wait
              </Button>

              <Button
                size="small"
                variant="outlined"
                color="info"
                onClick={() =>
                  handleQuickAction(
                    params.row.ticket_id,
                    "info_needed"
                  )
                }
              >
                Info
              </Button>
            </>
          )}

          {/* IN PROGRESS */}
          {current === "in_progress" && (
            <>
              <Button
                size="small"
                variant="contained"
                color="success"
                onClick={() =>
                  handleQuickAction(
                    params.row.ticket_id,
                    "resolved"
                  )
                }
              >
                Resolve
              </Button>

              <Button
                size="small"
                variant="outlined"
                color="info"
                onClick={() =>
                  handleQuickAction(
                    params.row.ticket_id,
                    "info_needed"
                  )
                }
              >
                Info
              </Button>
            </>
          )}

          {/* RESOLVED */}
          {current === "resolved" && (
            <Typography
              color="success.main"
              fontWeight={700}
            >
              Completed
            </Typography>
          )}
        </Box>
      );
    }
  }
];

  /* User View */
  if ( role !== "HR_ADMIN" && role !== "ORG_ADMIN") {
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