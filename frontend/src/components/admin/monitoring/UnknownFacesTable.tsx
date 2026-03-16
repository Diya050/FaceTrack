import { useState } from "react";
import {
  Box,
  Typography,
  TextField,
  MenuItem,
  Chip,
  Stack,
  IconButton,
  Tooltip,
} from "@mui/material";

import { DataGrid } from "@mui/x-data-grid";
import type { GridColDef } from "@mui/x-data-grid";

import VisibilityIcon from "@mui/icons-material/Visibility";
import PersonAddIcon from "@mui/icons-material/PersonAdd";
import ReportIcon from "@mui/icons-material/Report";

import UnknownFaceDetailsDialog from "./UnknownFaceDetailsDialog";
import MapToUserDialog from "./MapToUserDialog";
import SecurityFlagDialog from "./SecurityFlagDialog";

/* ---------- MOCK DATA ---------- */

interface UnknownFace {
  id: string;
  image: string;
  camera: string;
  location: string;
  confidence: number;
  timestamp: string;
  status: "Unresolved" | "Mapped" | "Security Flagged";
}

const MOCK_DATA: UnknownFace[] = Array.from({ length: 25 }).map((_, i) => ({
  id: `UF-${i}`,
  image: `https://randomuser.me/api/portraits/men/${i % 20}.jpg`,
  camera: `CAM-${(i % 5) + 1}`,
  location: ["Entrance", "Lobby", "Parking", "Corridor"][i % 4],
  confidence: Math.floor(50 + Math.random() * 40),
  timestamp: new Date(Date.now() - i * 600000).toLocaleString(),
  status: "Unresolved",
}));

/* ---------- COMPONENT ---------- */

export default function UnknownFacesTable() {
  const [rows, setRows] = useState(MOCK_DATA);
  const [search, setSearch] = useState("");
  const [status, setStatus] = useState("all");

  const [selected, setSelected] = useState<any>(null);
  const [detailsOpen, setDetailsOpen] = useState(false);
  const [mapOpen, setMapOpen] = useState(false);
  const [flagOpen, setFlagOpen] = useState(false);

  const filtered = rows.filter((r) => {
    const matchSearch =
      r.camera.toLowerCase().includes(search.toLowerCase()) ||
      r.location.toLowerCase().includes(search.toLowerCase());

    const matchStatus = status === "all" || r.status === status;

    return matchSearch && matchStatus;
  });

  const columns: GridColDef[] = [
    {
      field: "image",
      headerName: "Face",
      width: 90,
      renderCell: (params) => (
        <img
          src={params.value}
          alt="face"
          style={{
            width: 40,
            height: 40,
            borderRadius: "50%",
            objectFit: "cover",
          }}
        />
      ),
    },
    { field: "camera", headerName: "Camera", width: 120 },
    { field: "location", headerName: "Location", width: 140 },
    {
      field: "confidence",
      headerName: "Confidence",
      width: 120,
      renderCell: (params) => `${params.value}%`,
    },
    { field: "timestamp", headerName: "Detected Time", flex: 1.3 },
    {
      field: "status",
      headerName: "Status",
      width: 150,
      renderCell: (params) => (
        <Chip
          label={params.value}
          color={
            params.value === "Mapped"
              ? "success"
              : params.value === "Security Flagged"
              ? "error"
              : "warning"
          }
          size="small"
        />
      ),
    },
    {
      field: "actions",
      headerName: "Actions",
      width: 160,
      sortable: false,
      renderCell: (params) => (
        <Stack direction="row">
          <Tooltip title="View Details">
            <IconButton
              onClick={() => {
                setSelected(params.row);
                setDetailsOpen(true);
              }}
            >
              <VisibilityIcon />
            </IconButton>
          </Tooltip>

          <Tooltip title="Map to User">
            <IconButton
              onClick={() => {
                setSelected(params.row);
                setMapOpen(true);
              }}
            >
              <PersonAddIcon />
            </IconButton>
          </Tooltip>

          <Tooltip title="Raise Security Alert">
            <IconButton
              color="error"
              onClick={() => {
                setSelected(params.row);
                setFlagOpen(true);
              }}
            >
              <ReportIcon />
            </IconButton>
          </Tooltip>
        </Stack>
      ),
    },
  ];

  return (
    <Box sx={{ p: 4 }}>
      <Typography variant="h5" fontWeight={700} mb={3}>
        Unknown Faces
      </Typography>

      {/* Filters */}

      <Stack direction="row" spacing={2} mb={2}>
        <TextField
          size="small"
          placeholder="Search camera or location"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />

        <TextField
          select
          size="small"
          value={status}
          onChange={(e) => setStatus(e.target.value)}
          sx={{ width: 180 }}
        >
          <MenuItem value="all">All</MenuItem>
          <MenuItem value="Unresolved">Unresolved</MenuItem>
          <MenuItem value="Mapped">Mapped</MenuItem>
          <MenuItem value="Security Flagged">Security Flagged</MenuItem>
        </TextField>
      </Stack>

      <Box height={560}>
        <DataGrid
          rows={filtered}
          columns={columns}
          getRowId={(r) => r.id}
          pageSizeOptions={[10]}
          disableRowSelectionOnClick
        />
      </Box>

      <UnknownFaceDetailsDialog
        open={detailsOpen}
        face={selected}
        onClose={() => setDetailsOpen(false)}
      />

      <MapToUserDialog
        open={mapOpen}
        face={selected}
        onClose={() => setMapOpen(false)}
      />

      <SecurityFlagDialog
        open={flagOpen}
        face={selected}
        onClose={() => setFlagOpen(false)}
      />
    </Box>
  );
}