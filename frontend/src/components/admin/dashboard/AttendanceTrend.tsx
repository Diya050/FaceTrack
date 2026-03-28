import {
  Card,
  CardContent,
  Typography,
  Box,
  CircularProgress,
  ToggleButton,
  ToggleButtonGroup,
  Divider,
} from "@mui/material";
import { useEffect, useState } from "react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  Legend,
  CartesianGrid,
} from "recharts";
import type { TrendResponse } from "../../../types/adminAnalytics.types";
import { fetchAttendanceTrend } from "../../../services/adminAnalyticsService";

const AttendanceTrend = () => {
  const [data, setData] = useState<TrendResponse>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [days, setDays] = useState<number>(7);

  const loadData = async () => {
    try {
      setLoading(true);
      const res = await fetchAttendanceTrend(days);
      setData(res);
    } catch (err: any) {
      console.error("Trend fetch error:", err);
      setError("Failed to load trend data");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, [days]);

  const handleChange = (_: React.MouseEvent<HTMLElement>, value: number) => {
    if (value !== null) setDays(value);
  };

  return (
    <Card
      elevation={0}
      sx={{
        borderRadius: 3,
        border: "1px solid rgba(0,0,0,0.05)",
        background: "linear-gradient(135deg, #ffffff, #fafbfc)",
      }}
    >
      <CardContent sx={{ p: 3 }}>
        {/* Header */}
        <Box
          display="flex"
          justifyContent="space-between"
          alignItems="center"
          mb={2}
        >
          <Box>
            <Typography variant="h6" fontWeight={600}>
              Attendance Trend
            </Typography>
            <Typography variant="caption" color="text.secondary">
              Daily attendance insights
            </Typography>
          </Box>

          <ToggleButtonGroup
            size="small"
            value={days}
            exclusive
            onChange={handleChange}
            sx={{
              backgroundColor: "#f1f3f5",
              borderRadius: 2,
              p: 0.3,
            }}
          >
            <ToggleButton
              value={7}
              sx={{
                border: "none",
                px: 2,
                borderRadius: 2,
                "&.Mui-selected": {
                  backgroundColor: "#1976d2",
                  color: "#fff",
                  "&:hover": { backgroundColor: "#1565c0" },
                },
              }}
            >
              7D
            </ToggleButton>
            <ToggleButton
              value={30}
              sx={{
                border: "none",
                px: 2,
                borderRadius: 2,
                "&.Mui-selected": {
                  backgroundColor: "#1976d2",
                  color: "#fff",
                  "&:hover": { backgroundColor: "#1565c0" },
                },
              }}
            >
              30D
            </ToggleButton>
          </ToggleButtonGroup>
        </Box>

        <Divider sx={{ mb: 2 }} />

        {/* Loading */}
        {loading && (
          <Box display="flex" justifyContent="center" py={6}>
            <CircularProgress />
          </Box>
        )}

        {/* Error */}
        {error && (
          <Typography color="error" align="center" py={3}>
            {error}
          </Typography>
        )}

        {/* Chart */}
        {!loading && !error && data.length > 0 && (
          <ResponsiveContainer width="100%" height={320}>
            <LineChart data={data}>
              <CartesianGrid strokeDasharray="3 3" opacity={0.2} />

              <XAxis
                dataKey="date"
                tick={{ fontSize: 12 }}
                axisLine={false}
                tickLine={false}
              />

              <YAxis
                allowDecimals={false}
                tick={{ fontSize: 12 }}
                axisLine={false}
                tickLine={false}
              />

              <Tooltip
                contentStyle={{
                  borderRadius: "8px",
                  border: "1px solid #eee",
                }}
              />

              <Legend wrapperStyle={{ fontSize: 12 }} />

              <Line
                type="monotone"
                dataKey="present"
                stroke="#4caf50"
                strokeWidth={2.5}
                dot={{ r: 3 }}
                activeDot={{ r: 6 }}
              />

              <Line
                type="monotone"
                dataKey="absent"
                stroke="#f44336"
                strokeWidth={2.5}
                dot={{ r: 3 }}
              />

              <Line
                type="monotone"
                dataKey="late"
                stroke="#ff9800"
                strokeWidth={2.5}
                dot={{ r: 3 }}
              />

              <Line
                type="monotone"
                dataKey="half_day"
                stroke="#2196f3"
                strokeWidth={2.5}
                dot={{ r: 3 }}
              />
            </LineChart>
          </ResponsiveContainer>
        )}

        {/* Empty State */}
        {!loading && !error && data.length === 0 && (
          <Box textAlign="center" py={5}>
            <Typography variant="body2" color="text.secondary">
              No attendance data available
            </Typography>
          </Box>
        )}
      </CardContent>
    </Card>
  );
};

export default AttendanceTrend;