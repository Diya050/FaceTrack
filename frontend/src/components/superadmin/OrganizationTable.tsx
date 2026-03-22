import {
  Card,
  CardContent,
  Typography,
  Box,
  Chip,
  IconButton,
  Stack,
  Tooltip,
  TextField,
  MenuItem,
} from "@mui/material";
import { Delete, Pause, PlayArrow } from "@mui/icons-material";
import { DataGrid, type GridColDef } from "@mui/x-data-grid";
import { useEffect, useMemo, useState } from "react";

import {
  getOrganizations,
  updateOrganizationStatus,
  deleteOrganization,
  type Organization,
} from "../../services/orgService";

export default function OrganizationTable() {
  const [rows, setRows] = useState<Organization[]>([]);
  const [loading, setLoading] = useState(true);

  // 🔍 Search + Filter State
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");

  /* ---------------- FETCH ---------------- */
  const fetchData = async () => {
    try {
      setLoading(true);
      const data = await getOrganizations();
      setRows(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  /* ---------------- FILTERING ---------------- */

  const filteredRows = useMemo(() => {
    return rows.filter((org) => {
      const matchesSearch =
        org.name.toLowerCase().includes(search.toLowerCase()) ||
        org.email.toLowerCase().includes(search.toLowerCase());

      const matchesStatus =
        statusFilter === "all" || org.status === statusFilter;

      return matchesSearch && matchesStatus;
    });
  }, [rows, search, statusFilter]);

  /* ---------------- ACTIONS ---------------- */

  const handleToggleStatus = async (org: Organization) => {
    const newStatus =
      org.status === "active" ? "suspended" : "active";

    await updateOrganizationStatus(org.organization_id, newStatus);

    setRows((prev) =>
      prev.map((o) =>
        o.organization_id === org.organization_id
          ? { ...o, status: newStatus }
          : o
      )
    );
  };

  const handleDelete = async (orgId: string) => {
    if (!confirm("Delete this organization?")) return;

    await deleteOrganization(orgId);

    setRows((prev) =>
      prev.filter((o) => o.organization_id !== orgId)
    );
  };

  /* ---------------- COLUMNS ---------------- */

  const columns: GridColDef[] = [
    {
      field: "name",
      headerName: "Organization",
      flex: 1,
      minWidth: 180,
    },
    {
      field: "email",
      headerName: "Email",
      flex: 1,
      minWidth: 220,
    },
    {
      field: "status",
      headerName: "Status",
      width: 140,
      renderCell: (params) => {
        const value = params.value as string;

        return (
          <Chip
            label={value}
            size="small"
            sx={{
              fontWeight: 600,
              textTransform: "capitalize",
              bgcolor:
                value === "active"
                  ? "#E6F4EA"
                  : value === "suspended"
                  ? "#FFF4E5"
                  : "#F3F4F6",
              color:
                value === "active"
                  ? "#1E7F4F"
                  : value === "suspended"
                  ? "#B26A00"
                  : "#6B7280",
            }}
          />
        );
      },
    },
    {
      field: "actions",
      headerName: "Actions",
      width: 150,
      sortable: false,
      renderCell: (params) => {
        const org = params.row as Organization;

        return (
          <Stack direction="row" spacing={1}>
            <Tooltip title="Toggle Status">
              <IconButton
                size="small"
                onClick={() => handleToggleStatus(org)}
                sx={{
                  bgcolor: "rgba(0,0,0,0.04)",
                  "&:hover": {
                    bgcolor: "rgba(0,0,0,0.08)",
                  },
                }}
              >
                {org.status === "active" ? (
                  <Pause fontSize="small" />
                ) : (
                  <PlayArrow fontSize="small" />
                )}
              </IconButton>
            </Tooltip>

            <Tooltip title="Delete">
              <IconButton
                size="small"
                color="error"
                onClick={() => handleDelete(org.organization_id)}
                sx={{
                  bgcolor: "rgba(255,0,0,0.05)",
                  "&:hover": {
                    bgcolor: "rgba(255,0,0,0.1)",
                  },
                }}
              >
                <Delete fontSize="small" />
              </IconButton>
            </Tooltip>
          </Stack>
        );
      },
    },
  ];

  /* ---------------- UI ---------------- */

  return (
    <Card
      elevation={0}
      sx={{
        borderRadius: 3,
        border: "1px solid #E5E7EB",
      }}
    >
      <CardContent>
        <Stack spacing={2}>
          {/* HEADER */}
          <Typography fontWeight={700}>
            Organizations
          </Typography>

          {/* 🔍 SEARCH + FILTER BAR */}
          <Stack
            direction={{ xs: "column", sm: "row" }}
            spacing={2}
          >
            <TextField
              placeholder="Search organizations..."
              size="small"
              fullWidth
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />

            <TextField
              select
              size="small"
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              sx={{ minWidth: 180 }}
            >
              <MenuItem value="all">All Status</MenuItem>
              <MenuItem value="active">Active</MenuItem>
              <MenuItem value="suspended">Suspended</MenuItem>
            </TextField>
          </Stack>

          {/* TABLE */}
          <Box sx={{ height: 450, width: "100%" }}>
            <DataGrid
              rows={filteredRows}
              columns={columns}
              getRowId={(row) => row.organization_id}
              loading={loading}
              pageSizeOptions={[5, 10]}
              disableRowSelectionOnClick
              sx={{
                border: "none",
                "& .MuiDataGrid-columnHeaders": {
                  backgroundColor: "#F9FAFB",
                  fontWeight: 600,
                },
                "& .MuiDataGrid-row:hover": {
                  backgroundColor: "#F5F7FA",
                },
              }}
            />
          </Box>
        </Stack>
      </CardContent>
    </Card>
  );
}