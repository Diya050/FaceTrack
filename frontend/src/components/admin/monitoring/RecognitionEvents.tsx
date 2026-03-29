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
  CircularProgress,
  Alert,
} from "@mui/material";
import { useTheme } from "@mui/material/styles";
import { getRecognitionEvents, type RecognitionEvent } from "../../../services/attendanceService";

const PAGE_SIZE = 5;

const STATUS_COLORS: Record<RecognitionEvent["status"], "success" | "warning" | "error"> =
{
  recognized: "success",
  unknown: "warning",
  blacklisted: "error",
};

export default function RecognitionEvents() {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));

  const [events, setEvents] = useState<RecognitionEvent[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<
    "all" | RecognitionEvent["status"]
  >("all");
  const [page, setPage] = useState(1);
  const [focusedIndex, setFocusedIndex] = useState(0);

  // Fetch recognition events on mount
  useEffect(() => {
    const fetchEvents = async () => {
      try {
        setLoading(true);
        setError(null);
        const data = await getRecognitionEvents(100, 0);
        setEvents(data);
      } catch (err) {
        setError("Failed to fetch recognition events");
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchEvents();
  }, []);

  const filtered = useMemo(() => {
    return events
      .filter((e) =>
        e.person_name.toLowerCase().includes(search.toLowerCase())
      )
      .filter((e) =>
        statusFilter === "all" ? true : e.status === statusFilter
      );
  }, [events, search, statusFilter]);

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
      {error && (
        <Alert severity="error" sx={{ mb: 2 }}>
          {error}
        </Alert>
      )}

      {loading ? (
        <Box display="flex" justifyContent="center" alignItems="center" minHeight={400}>
          <CircularProgress />
        </Box>
      ) : (
      <>      {/* Filters */}
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
            key={e.event_id}
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
                      {e.person_name}
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
                    {e.camera_name} • {e.location}
                  </Typography>


                  <Typography fontSize={11} color="text.secondary">
                    {new Date(e.timestamp).toLocaleString()}
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
                    {e.person_name}
                  </Typography>
                  <Typography>{e.confidence}%</Typography>
                  <Typography>{e.camera_name}</Typography>
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
      </>
      )}
    </Box>
  );
}