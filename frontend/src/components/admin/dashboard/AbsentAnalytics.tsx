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
import type { AbsentAnalyticsResponse } from "../../../types/adminAnalytics.types";
import { fetchAbsentAnalytics } from "../../../services/adminAnalyticsService";

const AbsentAnalytics = () => {
  const [data, setData] = useState<AbsentAnalyticsResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const loadData = async () => {
    try {
      setLoading(true);
      const res = await fetchAbsentAnalytics();
      setData(res);
    } catch (err: any) {
      console.error("Absent analytics error:", err);
      setError("Failed to load absent analytics");
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
            Absent Insights
          </Typography>
          <Typography variant="caption" color="text.secondary">
            Daily absence trends
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
                sx={{ color: "#d32f2f" }}
              >
                {data.today_absent}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Employees Absent Today
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
                    stroke="#d32f2f"
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

export default AbsentAnalytics;