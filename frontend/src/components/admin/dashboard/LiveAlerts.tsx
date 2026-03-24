import { useEffect, useState, useMemo } from "react";
import { 
  Box, 
  Stack, 
  CircularProgress, 
  Typography, 
  TextField,
  Button,
  Pagination,
  Chip,
  Alert,
  AlertTitle
} from "@mui/material";
import { Delete as DeleteIcon } from "@mui/icons-material";
import SectionLabel from "./Kpisummery/shared/SectionLabel";
import LiveAlertRow from "./livealerts/LiveAlertRow";
import { 
  fetchLiveAlerts, 
  deleteLiveAlert, 
  deletePreviousLiveAlerts 
} from "../../../services/liveAlertsService";
import type { LiveAlert } from "../../../types/liveAlerts";

const ALERTS_PER_PAGE = 7;

export default function LiveAlerts() {
  const [alerts, setAlerts] = useState<LiveAlert[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [deleteConfirm, setDeleteConfirm] = useState(false);

  // Get today's date at start of day
  const getTodayStart = () => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    return today;
  };

  // Separate alerts into today and previous
  const { todayAlerts, previousAlerts } = useMemo(() => {
    const today = getTodayStart();
    const today_alerts = alerts.filter((alert) => {
      const alertDate = new Date(alert.timestamp);
      alertDate.setHours(0, 0, 0, 0);
      return alertDate.getTime() === today.getTime();
    }).slice(0, ALERTS_PER_PAGE);

    const previous_alerts = alerts.filter((alert) => {
      const alertDate = new Date(alert.timestamp);
      alertDate.setHours(0, 0, 0, 0);
      return alertDate.getTime() < today.getTime();
    });

    return { todayAlerts: today_alerts, previousAlerts: previous_alerts };
  }, [alerts]);

  // Filter previous alerts by search term
  const filteredPreviousAlerts = useMemo(() => {
    return previousAlerts.filter((alert) =>
      alert.source.toLowerCase().includes(searchTerm.toLowerCase()) ||
      alert.message.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [previousAlerts, searchTerm]);

  // Paginate previous alerts
  const paginatedPreviousAlerts = useMemo(() => {
    const startIndex = (currentPage - 1) * ALERTS_PER_PAGE;
    return filteredPreviousAlerts.slice(startIndex, startIndex + ALERTS_PER_PAGE);
  }, [filteredPreviousAlerts, currentPage]);

  const totalPages = Math.ceil(filteredPreviousAlerts.length / ALERTS_PER_PAGE);

  useEffect(() => {
    fetchLiveAlerts()
      .then((data) => {
        setAlerts(data);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Alerts error:", err);
        setLoading(false);
      });
  }, []);

  const handleDeletePrevious = () => {
    deletePreviousLiveAlerts()
      .then(() => {
        setAlerts((prevAlerts) =>
          prevAlerts.filter((alert) => {
            const alertDate = new Date(alert.timestamp);
            alertDate.setHours(0, 0, 0, 0);
            const today = getTodayStart();
            return alertDate.getTime() === today.getTime();
          })
        );
        setDeleteConfirm(false);
        setCurrentPage(1);
        setSearchTerm("");
      })
      .catch((err) => {
        console.error("Failed to delete previous alerts:", err);
      });
  };

  const handleDeleteAlert = (alertId: string) => {
    deleteLiveAlert(alertId)
      .then(() => {
        setAlerts((prevAlerts) =>
          prevAlerts.filter((alert) => alert.id !== alertId)
        );
      })
      .catch((err) => {
        console.error("Failed to delete alert:", err);
      });
  };

  if (loading) {
    return (
      <Box sx={{ p: 4, bgcolor: "#F8F9FA", minHeight: "100vh" }}>
        <Box sx={{ display: 'flex', justifyContent: 'center', p: 4 }}>
          <CircularProgress size={24} />
        </Box>
      </Box>
    );
  }

  return (
    <Box sx={{ p: 4, bgcolor: "#F8F9FA", minHeight: "100vh" }}>
      <SectionLabel>System Events</SectionLabel>

      {/* Today's Alerts Section */}
      <Box sx={{ mb: 4 }}>
        <Typography variant="h6" sx={{ mb: 2, fontWeight: 600 }}>
          Today's Alerts
          {todayAlerts.length > 0 && (
            <Chip 
              label={todayAlerts.length} 
              size="small" 
              sx={{ ml: 1 }}
            />
          )}
        </Typography>
        
        {todayAlerts.length > 0 ? (
          <Stack spacing={2}>
            {todayAlerts.map((alert) => (
              <LiveAlertRow 
                key={alert.id} 
                alert={alert}
                onDelete={() => handleDeleteAlert(alert.id)}
              />
            ))}
          </Stack>
        ) : (
          <Typography sx={{ color: "text.secondary", textAlign: "center", py: 3 }}>
            No alerts today.
          </Typography>
        )}
      </Box>

      {/* Previous Alerts Section */}
      {previousAlerts.length > 0 && (
        <Box sx={{ mt: 4, pt: 3, borderTop: "1px solid #e0e0e0" }}>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
            <Typography variant="h6" sx={{ fontWeight: 600 }}>
              Previous Alerts
              <Chip 
                label={previousAlerts.length} 
                size="small" 
                sx={{ ml: 1 }}
              />
            </Typography>
            
            {!deleteConfirm && (
              <Button
                variant="outlined"
                color="error"
                size="small"
                startIcon={<DeleteIcon />}
                onClick={() => setDeleteConfirm(true)}
              >
                Delete All Previous
              </Button>
            )}
          </Box>

          {deleteConfirm && (
            <Alert severity="warning" sx={{ mb: 2 }}>
              <AlertTitle>Confirm Delete</AlertTitle>
              Are you sure you want to delete all {previousAlerts.length} previous alerts? This action cannot be undone.
              <Box sx={{ mt: 1 }}>
                <Button
                  variant="contained"
                  color="error"
                  size="small"
                  onClick={handleDeletePrevious}
                  sx={{ mr: 1 }}
                >
                  Delete All
                </Button>
                <Button
                  variant="outlined"
                  size="small"
                  onClick={() => setDeleteConfirm(false)}
                >
                  Cancel
                </Button>
              </Box>
            </Alert>
          )}

          {/* Search Box */}
          <TextField
            placeholder="Search alerts by source or message..."
            value={searchTerm}
            onChange={(e) => {
              setSearchTerm(e.target.value);
              setCurrentPage(1);
            }}
            size="small"
            fullWidth
            sx={{ mb: 2 }}
          />

          {/* Alerts List */}
          {filteredPreviousAlerts.length > 0 ? (
            <>
              <Stack spacing={2}>
                {paginatedPreviousAlerts.map((alert) => (
                  <LiveAlertRow
                    key={alert.id}
                    alert={alert}
                    onDelete={() => handleDeleteAlert(alert.id)}
                  />
                ))}
              </Stack>

              {/* Pagination */}
              {totalPages > 1 && (
                <Box sx={{ display: 'flex', justifyContent: 'center', mt: 3 }}>
                  <Pagination
                    count={totalPages}
                    page={currentPage}
                    onChange={(_, page) => setCurrentPage(page)}
                  />
                </Box>
              )}
            </>
          ) : (
            <Typography sx={{ color: "text.secondary", textAlign: "center", py: 3 }}>
              {searchTerm ? "No alerts match your search." : "No previous alerts."}
            </Typography>
          )}
        </Box>
      )}

      {/* No Alerts Message */}
      {todayAlerts.length === 0 && previousAlerts.length === 0 && (
        <Typography sx={{ color: "text.secondary", textAlign: "center", mt: 4 }}>
          No active alerts found.
        </Typography>
      )}
    </Box>
  );
}