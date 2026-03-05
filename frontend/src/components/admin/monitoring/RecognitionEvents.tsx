import { useEffect, useMemo, useState } from "react";
import {
  Box,
  Card,
  CardContent,
  Typography,
  Chip,
  Stack,
  TextField,
  MenuItem,
  Pagination,
  useMediaQuery,
} from "@mui/material";
import { useTheme } from "@mui/material/styles";

interface RecognitionEvent {
  id: number;
  personName: string;
  confidence: number;
  camera: string;
  location: string;
  department: string;
  timestamp: string;
  status: "recognized" | "unknown" | "blacklisted";
}

const PAGE_SIZE = 5;

const STATUS_VALUES = ["recognized", "unknown", "blacklisted"] as const;

const mockEvents: RecognitionEvent[] = Array.from({ length: 80 }).map(
  (_, i) => ({
    id: i,
    personName: ["Diya", "Unknown", "John", "Alice"][i % 4],
    confidence: Math.floor(70 + Math.random() * 30),
    camera: `CAM-${(i % 6) + 1}`,
    location: ["Gate A", "Gate B", "Lobby", "Corridor"][i % 4],
    department: ["Admin", "IT", "HR", "Security"][i % 4],
    timestamp: new Date(Date.now() - i * 60000).toLocaleString(),
    status: STATUS_VALUES[i % 3],
  })
);

const STATUS_COLORS: Record<RecognitionEvent["status"], "success" | "warning" | "error"> =
{
  recognized: "success",
  unknown: "warning",
  blacklisted: "error",
};

export default function RecognitionEvents() {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));

  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<
    "all" | RecognitionEvent["status"]
  >("all");
  const [page, setPage] = useState(1);
  const [focusedIndex, setFocusedIndex] = useState(0);

  const filtered = useMemo(() => {
    return mockEvents
      .filter((e) =>
        e.personName.toLowerCase().includes(search.toLowerCase())
      )
      .filter((e) =>
        statusFilter === "all" ? true : e.status === statusFilter
      );
  }, [search, statusFilter]);

  const totalPages = Math.ceil(filtered.length / PAGE_SIZE);

  const pageData = filtered.slice(
    (page - 1) * PAGE_SIZE,
    page * PAGE_SIZE
  );

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "ArrowDown") {
        setFocusedIndex((prev) =>
          prev < pageData.length - 1 ? prev + 1 : prev
        );
      }
      if (e.key === "ArrowUp") {
        setFocusedIndex((prev) => (prev > 0 ? prev - 1 : 0));
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [pageData.length]);

  useEffect(() => {
    setFocusedIndex(0);
  }, [page]);

  return (
    <Box p={{ xs: 1.5, md: 2 }}>
      <Typography variant="h5" fontWeight={700} mb={3}>
        Live Recognition Events
      </Typography>

      {/* Filters */}
      <Stack
        direction={isMobile ? "column" : "row"}
        spacing={1.5}
        mb={2}
      >
        <TextField
          size="small"
          label="Search Person"
          fullWidth={isMobile}
          value={search}
          onChange={(e) => {
            setSearch(e.target.value);
            setPage(1);
          }}
        />

        <TextField
          size="small"
          select
          label="Status"
          fullWidth={isMobile}
          value={statusFilter}
          onChange={(e) => {
            setStatusFilter(
              e.target.value as "all" | RecognitionEvent["status"]
            );
            setPage(1);
          }}
        >
          <MenuItem value="all">All</MenuItem>
          <MenuItem value="recognized">Recognized</MenuItem>
          <MenuItem value="unknown">Unknown</MenuItem>
          <MenuItem value="blacklisted">Blacklisted</MenuItem>
        </TextField>
      </Stack>

      {/* Event Feed */}
      <Stack spacing={1}>
        {pageData.map((e, idx) => (
          <Card
            key={e.id}
            onClick={() => setFocusedIndex(idx)}
            sx={{
              cursor: "pointer",
              border:
                idx === focusedIndex
                  ? "2px solid #1976d2"
                  : "1px solid transparent",
              background:
                idx === focusedIndex
                  ? "rgba(25,118,210,0.06)"
                  : "transparent",
              transition: "0.15s",
            }}
          >
            <CardContent sx={{ py: 1.3 }}>
              {isMobile ? (
                /* -------- MOBILE -------- */
                <Stack spacing={0.6}>
                  <Stack direction="row" justifyContent="space-between">
                    <Typography fontWeight={600} fontSize={20}>
                      {e.personName}
                    </Typography>
                    <Chip
                      label={e.status.toUpperCase()}
                      color={STATUS_COLORS[e.status]}
                      size="small"
                    />
                  </Stack>

                  <Typography fontSize={15} color="text.secondary">
                    {e.department}
                  </Typography>

                  <Typography fontSize={16}>
                     {e.confidence}%
                  </Typography>

                  <Typography fontSize={15}>
                    {e.camera} • {e.location}
                  </Typography>


                  <Typography fontSize={11} color="text.secondary">
                    {e.timestamp}
                  </Typography>
                </Stack>
              ) : (
                /* -------- DESKTOP -------- */
                <Box
                  sx={{
                    display: "grid",
                    gridTemplateColumns:
                      "2fr 1fr 1fr 1fr 1fr 1fr",
                    gap: 1,
                    alignItems: "center",
                  }}
                >
                  <Typography fontWeight={600}>
                    {e.personName}
                  </Typography>
                  <Typography>{e.confidence}%</Typography>
                  <Typography>{e.camera}</Typography>
                  <Typography>{e.location}</Typography>
                  <Typography>{e.department}</Typography>
                  <Chip
                    label={e.status.toUpperCase()}
                    color={STATUS_COLORS[e.status]}
                    size="small"
                  />
                </Box>
              )}
            </CardContent>
          </Card>
        ))}
      </Stack>

      {totalPages > 1 && (
        <Stack alignItems="center" mt={3}>
          <Pagination
            count={totalPages}
            page={page}
            onChange={(_, val) => setPage(val)}
            color="primary"
            shape="rounded"
            size={isMobile ? "small" : "medium"}
          />
        </Stack>
      )}
    </Box>
  );
}