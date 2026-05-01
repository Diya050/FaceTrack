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

/* Premium status config with icons and refined colors */
const statusConfig: Record<
  string,
  { label: string; color: string; bg: string; border: string; Icon: any }
> = {
  open: {
    label: "Open",
    color: "#b91c1c",
    bg: "linear-gradient(180deg, rgba(255,245,245,1), rgba(255,250,250,1))",
    border: "#fecaca",
    Icon: HourglassTopIcon
  },
  "in progress": {
    label: "In Progress",
    color: "#c2410c",
    bg: "linear-gradient(180deg, rgba(255,250,240,1), rgba(255,247,236,1))",
    border: "#fed7aa",
    Icon: InfoOutlinedIcon
  },
  resolved: {
    label: "Resolved",
    color: "#0f766e",
    bg: "linear-gradient(180deg, rgba(240,253,244,1), rgba(245,255,250,1))",
    border: "#bbf7d0",
    Icon: CheckCircleIcon
  },
  closed: {
    label: "Closed",
    color: "#475569",
    bg: "linear-gradient(180deg, rgba(248,250,252,1), rgba(250,251,253,1))",
    border: "#e2e8f0",
    Icon: CancelOutlinedIcon
  }
};

export default function SupportTickets() {
  const { role } = useAuth();
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
    // ✅ Only fetch tickets if HR_ADMIN or ORG_ADMIN
    if (role !== "HR_ADMIN" && role !== "ORG_ADMIN") return;
    
    // Call the function to actually load the tickets
    loadTickets();
  }, [role, loadTickets]); // <-- Properly close the useEffect here

  const handleStatusChange = async (id: string, status: TicketStatus) => {
    try {
      await updateTicketStatus(id, status);
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

  /* Columns */
  const columns: GridColDef[] = [
    {
      field: "subject",
      headerName: "Subject",
      flex: 1,
      minWidth: 220,
      renderCell: (params) => (
        <Typography fontWeight={700} fontSize="0.95rem" noWrap>
          {params.value}
        </Typography>
      )
    },
    {
      field: "description",
      headerName: "Description",
      flex: 1.6,
      minWidth: 360,
      renderCell: (params) => (
        <Typography
          variant="body2"
          color="text.secondary"
          sx={{
            display: "-webkit-box",
            WebkitLineClamp: 2,
            WebkitBoxOrient: "vertical",
            overflow: "hidden",
            fontSize: "0.9rem"
          }}
        >
          {params.value}
        </Typography>
      )
    },

    /* Premium Status Pills */
    {
      field: "status",
      headerName: "Status",
      width: 300,
      renderCell: (params) => {
        const raw = (params.row.status || "open").toString().toLowerCase();
        const currentStatus = Object.keys(statusConfig).includes(raw)
          ? raw
          : "open";

        return (
          <Box
            sx={{
              display: "flex",
              gap: 1,
              alignItems: "center",
              width: "100%",
              flexWrap: "wrap"
            }}
          >
            {Object.entries(statusConfig).map(([key, cfg]) => {
              const isActive = currentStatus === key;
              const Icon = cfg.Icon;

              return (
                <Tooltip key={key} title={cfg.label} arrow>
                  <Chip
                    clickable
                    onClick={() =>
                      handleStatusChange(params.row.ticket_id, key as TicketStatus)
                    }
                    size="small"
                    avatar={
                      <Avatar
                        sx={{
                          bgcolor: isActive ? cfg.color : "transparent",
                          color: isActive ? "#fff" : cfg.color,
                          width: 22,
                          height: 22,
                          boxShadow: isActive ? "0 2px 6px rgba(0,0,0,0.12)" : "none"
                        }}
                      >
                        <Icon sx={{ fontSize: 14 }} />
                      </Avatar>
                    }
                    label={cfg.label}
                    sx={{
                      height: 32,
                      fontSize: "0.78rem",
                      fontWeight: 700,
                      borderRadius: 2,
                      paddingLeft: 0.6,
                      paddingRight: 0.8,
                      cursor: "pointer",
                      transition: "transform 150ms ease, box-shadow 150ms ease",
                      bgcolor: isActive ? cfg.bg : "#fff",
                      color: isActive ? cfg.color : "#475569",
                      border: `1px solid ${isActive ? cfg.border : "#e6e9ee"}`,
                      boxShadow: isActive ? "0 6px 18px rgba(16,24,40,0.06)" : "none",
                      "&:hover": {
                        transform: "translateY(-3px)",
                        boxShadow: isActive
                          ? "0 8px 22px rgba(16,24,40,0.08)"
                          : "0 6px 18px rgba(16,24,40,0.04)"
                      }
                    }}
                  />
                </Tooltip>
              );
            })}
          </Box>
        );
      }
    },

    /* Quick Response Actions */
    {
      field: "actions",
      headerName: "Quick Response",
      width: 300,
      sortable: false,
      renderCell: (params) => (
        <Box
          sx={{
            display: "flex",
            gap: 1,
            alignItems: "center",
            flexWrap: "nowrap"
          }}
        >
          <Button
            variant="contained"
            color="success"
            size="small"
            sx={{
              fontSize: "0.78rem",
              textTransform: "none",
              borderRadius: 2,
              boxShadow: "0 6px 18px rgba(16,185,129,0.12)"
            }}
            onClick={() =>
              handleQuickAction(params.row.ticket_id, "resolved")
            }
          >
            Resolve
          </Button>

          <Button
            variant="outlined"
            color="warning"
            size="small"
            sx={{
              fontSize: "0.78rem",
              textTransform: "none",
              borderRadius: 2,
              borderWidth: 1.25
            }}
            onClick={() =>
              handleQuickAction(params.row.ticket_id, "wait")
            }
          >
            Wait
          </Button>

          <Button
            variant="outlined"
            color="info"
            size="small"
            sx={{
              fontSize: "0.78rem",
              textTransform: "none",
              borderRadius: 2,
              borderWidth: 1.25
            }}
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

  // ✅ ROLE-BASED RENDERING
  if (role !== "HR_ADMIN" && role !== "ORG_ADMIN") {
    return (
      <Box sx={{ backgroundColor: "#F8F9FA", minHeight: "100vh", pt: 12 }}>
        <Container maxWidth="md">
          <CreateTicket />
        </Container>
      </Box>
    );
  }

  /* Admin view */
  return (
    <Box sx={{ background: "#F8F9FA", minHeight: "100vh", pt: 10, pb: 6 }}>
      <Container maxWidth="xl">
        <Box sx={{ mb: 4 }}>
          <Typography variant="h4" fontWeight={700} sx={{ color: COLORS.dark }}>
            Support Tickets
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Manage and respond to user queries efficiently
          </Typography>
        </Box>

        <Card
          sx={{
            borderRadius: 4,
            background: "#ffffff",
            boxShadow: "0 12px 40px rgba(16,24,40,0.06)"
          }}
        >
          <CardContent>
            <Box sx={{ height: 560 }}>
              <DataGrid
                rows={tickets}
                columns={columns}
                getRowId={(row) => row.ticket_id || row.id || row._id}
                pageSizeOptions={[5, 10, 20]}
                disableRowSelectionOnClick
                density="comfortable"
                rowHeight={72}
                // headerHeight={56}
                sx={{
                  border: "none",
                  fontSize: "0.9rem",
                  "& .MuiDataGrid-columnHeaders": {
                    backgroundColor: "#fbfdff",
                    fontWeight: 700,
                    color: "#0f172a",
                    borderBottom: "1px solid #eef2f7",
                    position: "sticky",
                    top: 0,
                    zIndex: 1
                  },
                  "& .MuiDataGrid-row": {
                    borderBottom: "1px solid #f3f6f9"
                  },
                  "& .MuiDataGrid-row:hover": {
                    backgroundColor: "#fbfcff"
                  },
                  "& .MuiDataGrid-cell": {
                    outline: "none",
                    borderBottom: "none"
                  }
                }}
              />
            </Box>
          </CardContent>
        </Card>
      </Container>
    </Box>
  );
}
