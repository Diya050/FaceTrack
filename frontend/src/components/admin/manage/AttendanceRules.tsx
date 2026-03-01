import React, { useState } from "react";
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
} from "@mui/material";
import {
  Rule,
} from "@mui/icons-material";


/*  Types  */

type TimeRule = {
  id: number;
  rule: string;
  start: string;
  end: string;
  effect: string;
};

type AuditLog = {
  id: number;
  admin: string;
  action: string;
  target: string;
  time: string;
};

/*  Mock Data  */

const TIME_RULES: TimeRule[] = [
  {
    id: 1,
    rule: "Attendance Window",
    start: "08:30",
    end: "10:30",
    effect: "Present",
  },
  {
    id: 2,
    rule: "Late Threshold",
    start: "10:31",
    end: "12:00",
    effect: "Late",
  },
  {
    id: 3,
    rule: "Absent Threshold",
    start: "12:01",
    end: "23:59",
    effect: "Absent",
  },
];

const AUDIT_LOGS: AuditLog[] = [
  {
    id: 1,
    admin: "HR-Admin-01",
    action: "Attendance Override",
    target: "EMP-1043",
    time: "2026-03-01 11:42",
  },
  {
    id: 2,
    admin: "Manager-02",
    action: "Face Enrollment Approved",
    target: "EMP-1098",
    time: "2026-03-01 09:21",
  },
];

/*  Component  */

const AttendanceRules: React.FC = () => {
  const [rules, setRules] = useState<TimeRule[]>(TIME_RULES);

  const updateRule = (id: number, field: keyof TimeRule, value: string) => {
    setRules((prev) =>
      prev.map((r) => (r.id === id ? { ...r, [field]: value } : r))
    );
  };

  return (
    <Box mt={8}>
      <Card elevation={0}>
        <CardContent>
          <Stack spacing={3}>
            {/* Header */}
            <Stack direction="row" spacing={1} alignItems="center">
              <Rule />
              <Typography variant="h5" fontWeight={600}>
                Attendance Rules
              </Typography>
            </Stack>

            <Divider />

            

            {/* Time Rules */}
            <Typography variant="subtitle1" fontWeight={600}>
              Attendance Time Rules Engine
            </Typography>

            <TableContainer component={Paper} elevation={0}>
              <Table size="small">
                <TableHead>
                  <TableRow>
                    <TableCell>Rule</TableCell>
                    <TableCell>Start</TableCell>
                    <TableCell>End</TableCell>
                    <TableCell>Effect</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {rules.map((r) => (
                    <TableRow key={r.id}>
                      <TableCell>{r.rule}</TableCell>
                      <TableCell>
                        <TextField
                          size="small"
                          type="time"
                          value={r.start}
                          onChange={(e) =>
                            updateRule(r.id, "start", e.target.value)
                          }
                        />
                      </TableCell>
                      <TableCell>
                        <TextField
                          size="small"
                          type="time"
                          value={r.end}
                          onChange={(e) =>
                            updateRule(r.id, "end", e.target.value)
                          }
                        />
                      </TableCell>
                      <TableCell>
                        <Chip size="small" label={r.effect} />
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>

            {/* Rules Explanation */}
            <Alert severity="info">
              <b>Rules Engine:</b> If recognition occurs between 08:30–10:30 → Present. After 10:30 → Late. After 12:00 → Absent.
            </Alert>

            {/* Audit Logs */}
            <Typography variant="subtitle1" fontWeight={600}>
              Admin Audit Logs
            </Typography>

            <TableContainer component={Paper} elevation={0}>
              <Table size="small">
                <TableHead>
                  <TableRow>
                    <TableCell>Admin</TableCell>
                    <TableCell>Action</TableCell>
                    <TableCell>Target</TableCell>
                    <TableCell>Timestamp</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {AUDIT_LOGS.map((l) => (
                    <TableRow key={l.id}>
                      <TableCell>{l.admin}</TableCell>
                      <TableCell>{l.action}</TableCell>
                      <TableCell>{l.target}</TableCell>
                      <TableCell>{l.time}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>

            <Stack direction="row" justifyContent="flex-end" spacing={2}>
              <Button variant="outlined">Simulate Rules</Button>
              <Button variant="contained">Deploy Rules</Button>
            </Stack>
          </Stack>
        </CardContent>
      </Card>
    </Box>
  );
};

export default AttendanceRules;