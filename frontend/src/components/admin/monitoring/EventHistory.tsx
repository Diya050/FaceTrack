import { useMemo, useState } from "react";
import { Box, TextField, MenuItem, Stack, Typography } from "@mui/material";
import { DataGrid } from "@mui/x-data-grid";
import type { GridColDef } from "@mui/x-data-grid";


interface HistoryEvent {
  id: number;
  person: string;
  camera: string;
  location: string;
  department: string;
  confidence: number;
  timestamp: string;
  status: string;
}

const historyData: HistoryEvent[] = Array.from({ length: 60 }).map(
  (_, i) => ({
    id: i,
    person: ["Diya", "Unknown", "John", "Alice"][i % 4],
    camera: `CAM-${(i % 6) + 1}`,
    location: ["Gate A", "Gate B", "Lobby", "Corridor"][i % 4],
    department: ["Admin", "IT", "HR", "Security"][i % 4],
    confidence: Math.floor(70 + Math.random() * 30),
    timestamp: new Date(Date.now() - i * 3600000).toLocaleString(),
    status: ["recognized", "unknown", "blacklisted"][i % 3],
  })
);

const columns: GridColDef[] = [
  { field: "person", headerName: "Person", flex: 1 },
  { field: "camera", headerName: "Camera", width: 110 },
  { field: "location", headerName: "Location", width: 140 },
  { field: "department", headerName: "Department", width: 140 },
  { field: "confidence", headerName: "Confidence %", width: 120 },
  { field: "status", headerName: "Status", width: 130 },
  { field: "timestamp", headerName: "Time", flex: 1.2 },
];

export default function EventHistory() {
  const [search, setSearch] = useState("");
  const [status, setStatus] = useState("all");

  const filtered = useMemo(() => {
    return historyData
      .filter((e) =>
        e.person.toLowerCase().includes(search.toLowerCase())
      )
      .filter((e) => (status === "all" ? true : e.status === status))
      .slice(0, 25);
  }, [search, status]);

  return (
    <Box p={2}>
      <Typography variant="h5" fontWeight={700} mb={3}>
        Event History
      </Typography>

      <Stack direction="row" spacing={2} mb={2}>
        <TextField
          size="small"
          label="Search Person"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />

        <TextField
          size="small"
          select
          label="Status"
          value={status}
          onChange={(e) => setStatus(e.target.value)}
          sx={{ width: 180 }}
        >
          <MenuItem value="all">All</MenuItem>
          <MenuItem value="recognized">Recognized</MenuItem>
          <MenuItem value="unknown">Unknown</MenuItem>
          <MenuItem value="blacklisted">Blacklisted</MenuItem>
        </TextField>
      </Stack>

      <Box height={520}>
        <DataGrid
          rows={filtered}
          columns={columns}
          pageSizeOptions={[15]}
          initialState={{
            pagination: { paginationModel: { pageSize: 15, page: 0 } },
          }}
          disableRowSelectionOnClick
          density="compact"
        />
      </Box>
    </Box >
  );
}