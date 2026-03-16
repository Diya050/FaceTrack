import React, { useEffect, useState } from "react";
import {
  Box,
  Card,
  CardContent,
  Typography,
  Stack,
  Divider,
  Chip,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Alert,
  TextField,
  Button,
  Select,
  MenuItem,
  IconButton,
  CircularProgress,
} from "@mui/material";

import { Rule, Delete, Add, Timer } from "@mui/icons-material";
import api from "../../../services/api";

/* -------------------- Types -------------------- */

type AttendanceRule = {
  rule_id?: string;
  temp_id?: string;
  rule_name: string;
  start_time: string;
  end_time: string;
  status_effect: "present" | "half_day" | "absent" | "late";
};

/* -------------------- Helpers -------------------- */

const toUI = (t: string) => t.slice(0, 5);      // 08:30:00 -> 08:30
const toAPI = (t: string) => (t.length === 5 ? `${t}:00` : t);

/* -------------------- Component -------------------- */

const AttendanceRules: React.FC = () => {
  const [minHours, setMinHours] = useState<number>(4);
  const [rules, setRules] = useState<AttendanceRule[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  /* -------------------- Fetch Data -------------------- */

  const fetchData = async () => {
    try {
      setLoading(true);
      setError("");

      // Attempt to fetch both, but handle them gracefully if one fails
      const rulesPromise = api.get("/attendance/rules");
      const orgPromise = api.get("/organizations/me");

      const [rulesRes, orgRes] = await Promise.allSettled([rulesPromise, orgPromise]);

      // Handle Rules Response
      if (rulesRes.status === "fulfilled") {
        const formatted = rulesRes.value.data.map((r: any) => ({
          ...r,
          start_time: toUI(r.start_time),
          end_time: toUI(r.end_time),
        }));
        setRules(formatted);
      } else {
        console.error("Rules fetch failed", rulesRes.reason);
        setError("Failed to load attendance rules");
      }

      // Handle Org Response (Duration Logic)
      if (orgRes.status === "fulfilled") {
        if (orgRes.value.data.min_hours_for_present) {
          setMinHours(orgRes.value.data.min_hours_for_present);
        }
      } else {
        console.warn("Org settings fetch failed. Ensure /organizations/me exists.");
      }

    } catch (err) {
      console.error(err);
      setError("An unexpected error occurred while fetching data");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  /* -------------------- Update Rule -------------------- */

  const updateRule = (
    key: string,
    field: keyof AttendanceRule,
    value: string
  ) => {
    setRules((prev) =>
      prev.map((r) =>
        (r.rule_id || r.temp_id) === key ? { ...r, [field]: value } : r
      )
    );
  };

  /* -------------------- Add Rule -------------------- */

  const addRule = () => {
    setRules((prev) => [
      ...prev,
      {
        temp_id: Date.now().toString(),
        rule_name: "New Rule",
        start_time: "09:00",
        end_time: "10:00",
        status_effect: "present",
      },
    ]);
  };

  /* -------------------- Delete Rule -------------------- */

  const deleteRule = async (rule: AttendanceRule) => {
    try {
      if (!rule.rule_id) {
        setRules((prev) =>
          prev.filter((r) => r.temp_id !== rule.temp_id)
        );
        return;
      }

      await api.delete(`/attendance/rules/${rule.rule_id}`);

      setRules((prev) =>
        prev.filter((r) => r.rule_id !== rule.rule_id)
      );
      setSuccess("Rule deleted successfully");
      setTimeout(() => setSuccess(""), 5000);
    } catch (err) {
      console.error(err);
      setError("Failed to delete rule");
    }
  };

  /* -------------------- Deploy All Settings -------------------- */

  const saveAllSettings = async () => {
    try {
      setLoading(true);
      setError("");
      setSuccess("");

      // 1. Save Duration Threshold to Organization
      await api.put("/organizations/me", { min_hours_for_present: minHours });

      // 2. Save Time-based Rules
      for (const rule of rules) {
        const payload = {
          rule_name: rule.rule_name,
          start_time: toAPI(rule.start_time),
          end_time: toAPI(rule.end_time),
          status_effect: rule.status_effect,
        };

        if (!rule.rule_id) {
          await api.post("/attendance/rules", payload);
        } else {
          await api.put(`/attendance/rules/${rule.rule_id}`, payload);
        }
      }

      setSuccess("All settings deployed successfully!");
      setTimeout(() => setSuccess(""), 5000);
      fetchData();
    } catch (err: any) {
      const backendError = err.response?.data?.detail;
      setError(typeof backendError === 'string' ? backendError : "Failed to deploy settings. Check backend routes.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box mt={8}>
      <Card elevation={0}>
        <CardContent>
          <Stack spacing={3}>
            <Stack direction="row" spacing={1} alignItems="center">
              <Rule />
              <Typography variant="h5" fontWeight={600}>
                Attendance Rules Engine
              </Typography>
            </Stack>

            <Divider />

            {error && (
              <Alert severity="error" onClose={() => setError("")}>
                {error}
              </Alert>
            )}

            {success && (
              <Alert severity="success" onClose={() => setSuccess("")}>
                {success}
              </Alert>
            )}

            <Stack direction="row" justifyContent="space-between">
              <Typography fontWeight={600}>Time Based Rules (Arrival)</Typography>
              <Button
                startIcon={<Add />}
                variant="outlined"
                onClick={addRule}
              >
                Add Rule
              </Button>
            </Stack>

            {loading && !rules.length && (
              <Box display="flex" justifyContent="center">
                <CircularProgress size={30} />
              </Box>
            )}

            {/* Duration Settings Section */}
            <Box sx={{ p: 2, bgcolor: 'background.default', borderRadius: 1, border: '1px solid #e0e0e0' }}>
              <Stack direction="row" spacing={2} alignItems="center">
                <Timer color="primary" />
                <Typography variant="body2" fontWeight={600}>
                  Minimum hours required for Full Day:
                </Typography>
                <TextField
                  type="number"
                  size="small"
                  value={minHours}
                  onChange={(e) => setMinHours(Number(e.target.value))}
                  sx={{ width: 80 }}
                  inputProps={{ min: 1, max: 12 }}
                />
                
                <Typography variant="caption" color="text.secondary">
                  (Status will downgrade to Half Day if worked less than {minHours} hrs)
                </Typography>
              </Stack>
            </Box>

            <TableContainer component={Paper} elevation={0}>
              <Table size="small">
                <TableHead>
                  <TableRow>
                    <TableCell>Rule Name</TableCell>
                    <TableCell>Start Time</TableCell>
                    <TableCell>End Time</TableCell>
                    <TableCell>Status Effect</TableCell>
                    <TableCell />
                  </TableRow>
                </TableHead>

                <TableBody>
                  {rules.map((r) => {
                    const key = r.rule_id || r.temp_id!;
                    return (
                      <TableRow key={key}>
                        <TableCell>
                          <TextField
                            size="small"
                            value={r.rule_name}
                            onChange={(e) => updateRule(key, "rule_name", e.target.value)}
                          />
                        </TableCell>
                        <TableCell>
                          <TextField
                            type="time"
                            size="small"
                            value={r.start_time}
                            onChange={(e) => updateRule(key, "start_time", e.target.value)}
                          />
                        </TableCell>
                        <TableCell>
                          <TextField
                            type="time"
                            size="small"
                            value={r.end_time}
                            onChange={(e) => updateRule(key, "end_time", e.target.value)}
                          />
                        </TableCell>
                        <TableCell>
                          <Select
                            size="small"
                            value={r.status_effect}
                            onChange={(e) => updateRule(key, "status_effect", e.target.value as any)}
                          >
                            <MenuItem value="present">
                              <Chip label="Present" color="success" size="small" />
                            </MenuItem>
                            <MenuItem value="late">
                              <Chip label="Late" color="warning" size="small" />
                            </MenuItem>
                            <MenuItem value="half_day">
                              <Chip label="Half Day (Arrival)" color="info" size="small" />
                            </MenuItem>
                            <MenuItem value="absent">
                              <Chip label="Absent" color="error" size="small" />
                            </MenuItem>
                          </Select>
                        </TableCell>
                        <TableCell>
                          <IconButton onClick={() => deleteRule(r)}>
                            <Delete fontSize="small" />
                          </IconButton>
                        </TableCell>
                      </TableRow>
                    );
                  })}
                </TableBody>
              </Table>
            </TableContainer>

            <Alert
              severity="info"
              variant="outlined"
              sx={{ borderWidth: '1px', '& .MuiAlert-message': { width: '100%' } }}
            >
              <Stack spacing={2}>
                <Box>
                  <Typography variant="subtitle2" fontWeight={700} color="info.main" gutterBottom>
                    1. Arrival Logic (First Half Day)
                  </Typography>
                  <Typography variant="body2">
                    Marked <b>Half Day</b> immediately if first check-in falls within a Half Day(Arrival) rule slot.
                  </Typography>
                </Box>
                <Divider sx={{ opacity: 0.6 }} />
                <Box>
                  <Typography variant="subtitle2" fontWeight={700} color="info.main" gutterBottom>
                    2. Duration Logic (Second Half Day)
                  </Typography>
                  <Typography variant="body2">
                    Downgraded to <b>Half Day</b> if total work duration is <b>less than {minHours} hours</b>.
                  </Typography>
                </Box>
              </Stack>
            </Alert>

            <Stack direction="row" justifyContent="flex-end" spacing={2}>
              <Button variant="outlined" onClick={fetchData} disabled={loading}>
                Refresh
              </Button>
              <Button
                variant="contained"
                disabled={loading}
                onClick={saveAllSettings}
              >
                {loading ? <CircularProgress size={24} color="inherit" /> : "Deploy All Settings"}
              </Button>
            </Stack>
          </Stack>
        </CardContent>
      </Card>
    </Box>
  );
};

export default AttendanceRules;