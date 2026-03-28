import React, { useEffect, useState } from "react";
import { jwtDecode } from "jwt-decode";
import {
  Box, Card, CardContent, Typography, Stack, Divider, Chip, Table,
  TableBody, TableCell, TableContainer, TableHead, TableRow, Paper,
  Alert, TextField, Button, Select, MenuItem, IconButton, CircularProgress,
} from "@mui/material";

import { Rule, Delete, Add, Timer, Lock } from "@mui/icons-material";
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

interface TokenPayload {
  role?: string;
}

/* -------------------- Helpers -------------------- */

const toUI = (t: string) => t && t.length >= 5 ? t.slice(0, 5) : t;
const toAPI = (t: string) => (t.length === 5 ? `${t}:00` : t);

/* -------------------- Component -------------------- */

const AttendanceRules: React.FC = () => {
  const [role, setRole] = useState<string | null>(null);
  const [minHours, setMinHours] = useState<number>(4);
  const [rules, setRules] = useState<AttendanceRule[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const isReadOnly = role === "ADMIN";

  const fetchData = async () => {
    try {
      setLoading(true);
      setError("");

      const token = localStorage.getItem("token");
      if (token) {
        try {
          const decoded = jwtDecode<TokenPayload>(token);
          setRole(decoded.role || null);
        } catch (e) {
          console.error("Token decode error", e);
        }
      }

      const [rulesRes, orgRes] = await Promise.allSettled([
        api.get("/attendance/rules"),
        api.get("/organizations/me")
      ]);

      if (rulesRes.status === "fulfilled") {
        const formatted = rulesRes.value.data.map((r: any) => ({
          ...r,
          start_time: toUI(r.start_time),
          end_time: toUI(r.end_time),
        }));
        setRules(formatted);
      } else {
        setError("Failed to load attendance rules");
      }

      if (orgRes.status === "fulfilled") {
        const storedMinHours = orgRes.value.data.min_hours_for_present;
        if (storedMinHours !== undefined && storedMinHours !== null) {
          setMinHours(storedMinHours);
        }
      }
    } catch (err) {
      setError("An unexpected error occurred while fetching data");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const updateRule = (key: string, field: keyof AttendanceRule, value: string) => {
    if (isReadOnly) return;
    setRules((prev) =>
      prev.map((r) =>
        (r.rule_id || r.temp_id) === key ? { ...r, [field]: value } : r
      )
    );
  };

  const addRule = () => {
    if (isReadOnly) return;
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

  const deleteRule = async (rule: AttendanceRule) => {
    if (isReadOnly) return;
    try {
      if (!rule.rule_id) {
        setRules((prev) => prev.filter((r) => r.temp_id !== rule.temp_id));
        return;
      }
      await api.delete(`/attendance/rules/${rule.rule_id}`);
      setRules((prev) => prev.filter((r) => r.rule_id !== rule.rule_id));
      setSuccess("Rule deleted successfully");
      setTimeout(() => setSuccess(""), 5000);
    } catch (err) {
      setError("Failed to delete rule");
    }
  };

  const saveAllSettings = async () => {
    if (isReadOnly) return;
    try {
      setLoading(true);
      setError("");
      await api.put("/organizations/me", { min_hours_for_present: Number(minHours) });

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
      await fetchData();
      setTimeout(() => setSuccess(""), 5000);
    } catch (err: any) {
      setError(err.response?.data?.detail || "Failed to deploy settings.");
    } finally {
      setLoading(false);
    }
  };

  // Helper for light chip colors with dark text for readability
  const getChipStyles = (type: string) => {
    switch (type) {
      case 'present': return { bgcolor: '#E8F5E9', color: '#1B5E20', fontWeight: 700 };
      case 'late': return { bgcolor: '#FFF3E0', color: '#E65100', fontWeight: 700 };
      case 'half_day': return { bgcolor: '#E3F2FD', color: '#0D47A1', fontWeight: 700 };
      case 'absent': return { bgcolor: '#FFEBEE', color: '#B71C1C', fontWeight: 700 };
      default: return {};
    }
  };

  return (
    <Box mt={2}>
      <Card elevation={0}>
        <CardContent>
          <Stack spacing={3}>
            {/* Header */}
            <Stack direction="row" justifyContent="space-between" alignItems="center">
              <Stack direction="row" spacing={2} alignItems="center">
                <Rule />
                <Typography variant="h5" fontWeight={600}>Attendance Rules Engine</Typography>
                {isReadOnly && (
                  <Chip 
                    icon={<Lock sx={{ fontSize: '14px !important' }} />} 
                    label="View Only" 
                    size="small" 
                    variant="outlined" 
                    color="warning" 
                  />
                )}
              </Stack>
            </Stack>

            <Divider />

            {error && <Alert severity="error" onClose={() => setError("")}>{error}</Alert>}
            {success && <Alert severity="success" onClose={() => setSuccess("")}>{success}</Alert>}

            {/* Time Based Rules Table Header */}
            <Stack direction="row" justifyContent="space-between">
              <Typography fontWeight={600}>Time Based Rules (Arrival)</Typography>
              {!isReadOnly && (
                <Button startIcon={<Add />} variant="outlined" onClick={addRule}>Add Rule</Button>
              )}
            </Stack>

            {/* Minimum Hours Duration Setting */}
            <Box sx={{ p: 2, bgcolor: 'background.default', borderRadius: 1, border: '1px solid #e0e0e0' }}>
              <Stack direction="row" spacing={2} alignItems="center">
                <Timer color="primary" />
                <Typography variant="body2" fontWeight={600}>Minimum hours required for Full Day:</Typography>
                <TextField
                  type="number"
                  size="small"
                  value={minHours}
                  disabled={isReadOnly}
                  onChange={(e) => setMinHours(Number(e.target.value))}
                  sx={{ width: 80 }}
                />
                <Typography variant="caption" color="text.secondary">
                  (Worked less than {minHours} hrs results in Half Day)
                </Typography>
              </Stack>
            </Box>

            {/* Main Table */}
            <TableContainer component={Paper} elevation={0}>
              <Table size="small">
                <TableHead>
                  <TableRow sx={{ bgcolor: "#F9FAFB" }}>
                    <TableCell sx={{ fontWeight: 600 }}>Rule Name</TableCell>
                    <TableCell sx={{ fontWeight: 600 }}>Start Time</TableCell>
                    <TableCell sx={{ fontWeight: 600 }}>End Time</TableCell>
                    <TableCell sx={{ fontWeight: 600 }}>Status Effect</TableCell>
                    {!isReadOnly && <TableCell />}
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
                            disabled={isReadOnly}
                            onChange={(e) => updateRule(key, "rule_name", e.target.value)}
                          />
                        </TableCell>
                        <TableCell>
                          <TextField
                            type="time"
                            size="small"
                            value={r.start_time}
                            disabled={isReadOnly}
                            onChange={(e) => updateRule(key, "start_time", e.target.value)}
                          />
                        </TableCell>
                        <TableCell>
                          <TextField
                            type="time"
                            size="small"
                            value={r.end_time}
                            disabled={isReadOnly}
                            onChange={(e) => updateRule(key, "end_time", e.target.value)}
                          />
                        </TableCell>
                        <TableCell>
                          <Select
                            size="small"
                            value={r.status_effect}
                            disabled={isReadOnly}
                            onChange={(e) => updateRule(key, "status_effect", e.target.value as any)}
                            sx={{ minWidth: 150 }}
                          >
                            <MenuItem value="present"><Chip label="Present" size="small" sx={getChipStyles('present')} /></MenuItem>
                            <MenuItem value="late"><Chip label="Late" size="small" sx={getChipStyles('late')} /></MenuItem>
                            <MenuItem value="half_day"><Chip label="Half Day (Arrival)" size="small" sx={getChipStyles('half_day')} /></MenuItem>
                            <MenuItem value="absent"><Chip label="Absent" size="small" sx={getChipStyles('absent')} /></MenuItem>
                          </Select>
                        </TableCell>
                        {!isReadOnly && (
                          <TableCell>
                            <IconButton onClick={() => deleteRule(r)} color="error">
                              <Delete fontSize="small" />
                            </IconButton>
                          </TableCell>
                        )}
                      </TableRow>
                    );
                  })}
                </TableBody>
              </Table>
            </TableContainer>

            {/* Restore Information Alert (Logic explanation) */}
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

            {/* Action Bar */}
            <Stack direction="row" justifyContent="flex-end" spacing={2}>
              <Button variant="outlined" onClick={fetchData} disabled={loading}>Refresh</Button>
              {!isReadOnly && (
                <Button variant="contained" disabled={loading} onClick={saveAllSettings}>
                  {loading ? <CircularProgress size={24} color="inherit" /> : "Deploy All Settings"}
                </Button>
              )}
            </Stack>
          </Stack>
        </CardContent>
      </Card>
    </Box>
  );
};

export default AttendanceRules;