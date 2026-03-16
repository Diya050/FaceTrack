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

import { Rule, Delete, Add } from "@mui/icons-material";
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
  const [rules, setRules] = useState<AttendanceRule[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(""); // State for success feedback

  /* -------------------- Fetch Rules -------------------- */

  const fetchRules = async () => {
    try {
      setLoading(true);
      setError("");

      const res = await api.get("/attendance/rules");

      const formatted = res.data.map((r: any) => ({
        ...r,
        start_time: toUI(r.start_time),
        end_time: toUI(r.end_time),
      }));

      setRules(formatted);
    } catch (err) {
      console.error(err);
      setError("Failed to load attendance rules");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRules();
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

  /* -------------------- Deploy Rules -------------------- */

  const saveRules = async () => {
    try {
      setLoading(true);
      setError("");
      setSuccess("");

      for (const rule of rules) {
        const payload = {
          rule_name: rule.rule_name,
          start_time: toAPI(rule.start_time),
          end_time: toAPI(rule.end_time),
          status_effect: rule.status_effect,
        };

        if (!rule.rule_id) {
          console.log("Creating rule:", payload);
          await api.post("/attendance/rules", payload);
        } else {
          await api.put(`/attendance/rules/${rule.rule_id}`, payload);
        }
      }

      // Display success message instead of browser alert
      setSuccess("Rules deployed successfully!");
      
      // Auto-hide success message after 5 seconds
      setTimeout(() => setSuccess(""), 5000);
      
      fetchRules();
    } catch (err: any) {
      const backendError = err.response?.data?.detail;
      const errorMessage = typeof backendError === 'string'
        ? backendError
        : "Validation Error: Check time overlaps or formats.";

      setError(errorMessage);
      console.error("Save failed:", err.response?.data);
    } finally {
      setLoading(false);
    }
  };

  /* -------------------- UI -------------------- */

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

            {/* Error Feedback */}
            {error && (
              <Alert severity="error" onClose={() => setError("")}>
                {error}
              </Alert>
            )}

            {/* Success Feedback */}
            {success && (
              <Alert severity="success" onClose={() => setSuccess("")}>
                {success}
              </Alert>
            )}

            <Stack direction="row" justifyContent="space-between">
              <Typography fontWeight={600}>
                Time Based Rules
              </Typography>

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

            {!loading && rules.length === 0 && (
              <Alert severity="info">
                No attendance rules configured.
              </Alert>
            )}

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
                            onChange={(e) =>
                              updateRule(key, "rule_name", e.target.value)
                            }
                          />
                        </TableCell>

                        <TableCell>
                          <TextField
                            type="time"
                            size="small"
                            value={r.start_time}
                            onChange={(e) =>
                              updateRule(key, "start_time", e.target.value)
                            }
                          />
                        </TableCell>

                        <TableCell>
                          <TextField
                            type="time"
                            size="small"
                            value={r.end_time}
                            onChange={(e) =>
                              updateRule(key, "end_time", e.target.value)
                            }
                          />
                        </TableCell>

                        <TableCell>
                          <Select
                            size="small"
                            value={r.status_effect}
                            onChange={(e) =>
                              updateRule(
                                key,
                                "status_effect",
                                e.target.value as any
                              )
                            }
                          >
                            <MenuItem value="present">
                              <Chip label="Present" color="success" size="small" />
                            </MenuItem>
                            <MenuItem value="late">
                              <Chip label="Late" color="warning" size="small" />
                            </MenuItem>
                            <MenuItem value="half_day">
                              <Chip label="Half Day" color="info" size="small" />
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

            <Alert severity="info">
              Attendance status is determined from the <b>first face recognition
                event of the day</b> and matched against the configured rule time.
            </Alert>

            <Stack direction="row" justifyContent="flex-end" spacing={2}>
              <Button variant="outlined" onClick={fetchRules} disabled={loading}>
                Refresh
              </Button>

              <Button
                variant="contained"
                disabled={loading}
                onClick={saveRules}
              >
                {loading ? <CircularProgress size={24} color="inherit" /> : "Deploy Rules"}
              </Button>
            </Stack>
          </Stack>
        </CardContent>
      </Card>
    </Box>
  );
};

export default AttendanceRules;