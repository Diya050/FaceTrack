import {
  Card,
  CardContent,
  Typography,
  Box,
  CircularProgress,
  LinearProgress,
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
import type { RecognitionAnalyticsResponse } from "../../../types/adminAnalytics.types";
import { fetchRecognitionAnalytics } from "../../../services/adminAnalyticsService";

const RecognitionAnalytics = () => {
  const [data, setData] = useState<RecognitionAnalyticsResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const loadData = async () => {
    try {
      setLoading(true);
      const res = await fetchRecognitionAnalytics();
      setData(res);
    } catch (err: any) {
      console.error("Recognition analytics error:", err);
      setError("Failed to load recognition analytics");
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
            Recognition Quality
          </Typography>
          <Typography variant="caption" color="text.secondary">
            Face recognition performance overview
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
            {/* Accuracy Section */}
            <Box mb={3}>
              <Typography variant="body2" color="text.secondary">
                Recognition Accuracy
              </Typography>

              <Typography
                variant="h3"
                fontWeight={700}
                sx={{ color: "#2e7d32" }}
              >
                {data.recognition_rate}%
              </Typography>

              <LinearProgress
                variant="determinate"
                value={data.recognition_rate}
                sx={{
                  height: 10,
                  borderRadius: 5,
                  mt: 1.5,
                  backgroundColor: "#e8f5e9",
                  "& .MuiLinearProgress-bar": {
                    backgroundColor: "#4caf50",
                  },
                }}
              />
            </Box>

            {/* Unknown Faces KPI */}
            <Box mb={3}>
              <Typography
                variant="h4"
                fontWeight={700}
                sx={{ color: "#6d4c41" }}
              >
                {data.today_unknown_faces}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Unknown Faces Today
              </Typography>
            </Box>

            {/* Trend Chart */}
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
                    dataKey="unknown_count"
                    stroke="#6d4c41"
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

export default RecognitionAnalytics;