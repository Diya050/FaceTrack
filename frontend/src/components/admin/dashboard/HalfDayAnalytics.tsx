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
  LineChart,
  Line,
  XAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
} from "recharts";
import type { HalfDayAnalyticsResponse } from "../../../types/adminAnalytics.types";
import { fetchHalfDayAnalytics } from "../../../services/adminAnalyticsService";

const HalfDayAnalytics = () => {
  const [data, setData] = useState<HalfDayAnalyticsResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const loadData = async () => {
    try {
      setLoading(true);
      const res = await fetchHalfDayAnalytics();
      setData(res);
    } catch (err: any) {
      console.error("Half-day analytics error:", err);
      setError("Failed to load half-day analytics");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  return (
    <Card
      elevation={0}
      sx={{
        borderRadius: 3,
        border: "1px solid rgba(0,0,0,0.05)",
        background: "linear-gradient(135deg, #ffffff, #fafbfc)",
        height: "100%",
      }}
    >
      <CardContent sx={{ p: 3 }}>
        {/* Header */}
        <Box mb={2}>
          <Typography variant="h6" fontWeight={600}>
            Half-Day Insights
          </Typography>
          <Typography variant="caption" color="text.secondary">
            Daily half-day attendance overview
          </Typography>
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

        {/* Content */}
        {!loading && !error && data && (
          <>
            {/* KPI Highlight */}
            <Box mb={3}>
              <Typography
                variant="h3"
                fontWeight={700}
                sx={{ color: "#9c27b0" }}
              >
                {data.today_half_day}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Half-Day Employees Today
              </Typography>
            </Box>

            {/* Chart */}
            {data.trend.length > 0 ? (
              <ResponsiveContainer width="100%" height={220}>
                <LineChart data={data.trend}>
                  <CartesianGrid strokeDasharray="3 3" opacity={0.2} />

                  <XAxis
                    dataKey="date"
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

                  <Line
                    type="monotone"
                    dataKey="count"
                    stroke="#9c27b0"
                    strokeWidth={2.5}
                    dot={{ r: 3 }}
                    activeDot={{ r: 6 }}
                  />
                </LineChart>
              </ResponsiveContainer>
            ) : (
              <Box textAlign="center" py={4}>
                <Typography variant="body2" color="text.secondary">
                  No trend data available
                </Typography>
              </Box>
            )}
          </>
        )}
      </CardContent>
    </Card>
  );
};

export default HalfDayAnalytics;