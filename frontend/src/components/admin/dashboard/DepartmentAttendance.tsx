import {
  Card,
  CardContent,
  Typography,
  Box,
  CircularProgress,
  Divider,
} from "@mui/material";
import { useEffect, useState } from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
} from "recharts";
import type { DepartmentAttendanceResponse } from "../../../types/adminAnalytics.types";
import { fetchDepartmentAttendance } from "../../../services/adminAnalyticsService";
import { useAuth } from "../../../context/AuthContext";

const DepartmentAttendance = () => {
  const { role } = useAuth();
  const isHRAdmin = role === "HR_ADMIN";

  const [data, setData] = useState<DepartmentAttendanceResponse>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const loadData = async () => {
    try {
      setLoading(true);
      const res = await fetchDepartmentAttendance();
      setData(res);
    } catch (err: any) {
      console.error("Department analytics error:", err);
      setError("Failed to load department analytics");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const titleText = isHRAdmin ? "Department Attendance" : "Attendance Overview";
  const subtitleText = isHRAdmin
    ? "Attendance % by department"
    : "Your department's attendance performance";

  // Dept Admin -> assume single value
  const attendanceValue = data?.[0]?.attendance || 0;

  return (
    <Card sx={cardStyle}>
      <CardContent sx={{ p: 4 }}>
        {/* Header */}
        <Box mb={2}>
          <Typography variant="h5" fontWeight={700}>
            {titleText}
          </Typography>
          <Typography variant="body2" color="text.secondary">
            {subtitleText}
          </Typography>
        </Box>

        <Divider sx={{ mb: 3 }} />

        {/* Loading */}
        {loading && (
          <Box display="flex" justifyContent="center" py={8}>
            <CircularProgress />
          </Box>
        )}

        {/* Error */}
        {error && (
          <Typography color="error" align="center" py={4}>
            {error}
          </Typography>
        )}

        {/* ---------------- HR ADMIN (BAR CHART) ---------------- */}
        {!loading && !error && isHRAdmin && data.length > 0 && (
          <ResponsiveContainer width="100%" height={320}>
            <BarChart data={data} margin={{ top: 10, right: 20, left: 0, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" opacity={0.15} />

              <XAxis
                dataKey="department"
                tick={{ fontSize: 12 }}
                axisLine={false}
                tickLine={false}
              />

              <YAxis
                domain={[0, 100]}
                tick={{ fontSize: 12 }}
                axisLine={false}
                tickLine={false}
              />

              <Tooltip
                contentStyle={{
                  borderRadius: "10px",
                  border: "1px solid #eee",
                  boxShadow: "0 4px 20px rgba(0,0,0,0.08)",
                }}
                formatter={(value: number) => [`${value}%`, "Attendance"]}
              />

              <Bar
                dataKey="attendance"
                fill="url(#gradient)"
                radius={[10, 10, 0, 0]}
                barSize={32}
              />

              {/* Gradient */}
              <defs>
                <linearGradient id="gradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#6366F1" />
                  <stop offset="100%" stopColor="#3B82F6" />
                </linearGradient>
              </defs>
            </BarChart>
          </ResponsiveContainer>
        )}

        {/* ---------------- DEPT ADMIN (CIRCLE UI) ---------------- */}
        {!loading && !error && !isHRAdmin && (
          <Box
            display="flex"
            flexDirection="column"
            alignItems="center"
            justifyContent="center"
            py={4}
          >
            <Box position="relative" display="inline-flex">
              {/* Background Circle */}
              <CircularProgress
                variant="determinate"
                value={100}
                size={160}
                thickness={5}
                sx={{
                  color: "rgba(0,0,0,0.05)",
                }}
              />

              {/* Foreground Progress */}
              <CircularProgress
                variant="determinate"
                value={attendanceValue}
                size={160}
                thickness={5}
                sx={{
                  position: "absolute",
                  left: 0,
                  color: attendanceValue > 75 ? "#10B981" : "#F59E0B",
                  transition: "all 0.6s ease",
                }}
              />

              {/* Center Text */}
              <Box
                position="absolute"
                top={0}
                left={0}
                bottom={0}
                right={0}
                display="flex"
                alignItems="center"
                justifyContent="center"
                flexDirection="column"
              >
                <Typography variant="h3" fontWeight={800}>
                  {attendanceValue}%
                </Typography>
                <Typography variant="caption" color="text.secondary">
                  Attendance
                </Typography>
              </Box>
            </Box>

            {/* Optional subtle label */}
            <Typography mt={3} variant="body2" color="text.secondary">
              Overall department attendance performance
            </Typography>
          </Box>
        )}

        {/* Empty */}
        {!loading && !error && data.length === 0 && (
          <Box textAlign="center" py={6}>
            <Typography variant="body2" color="text.secondary">
              No attendance data available
            </Typography>
          </Box>
        )}
      </CardContent>
    </Card>
  );
};

/* ---------- Card Style ---------- */
const cardStyle = {
  borderRadius: 4,
  background: "rgba(255,255,255,0.9)",
  backdropFilter: "blur(10px)",
  border: "1px solid rgba(0,0,0,0.05)",
  boxShadow: "0 10px 40px rgba(0,0,0,0.05)",
};

export default DepartmentAttendance;