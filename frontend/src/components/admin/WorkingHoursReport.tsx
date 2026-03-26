import {
  Card,
  CardContent,
  Typography,
  Box,
  CircularProgress,
  Divider,
  Stack,
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
import type { WorkingHoursDataPoint } from "../../types/reportsAdmin.types";
import { fetchWorkingHoursAnalytics } from "../../services/adminReportsService";
import { useAuth } from "../../context/AuthContext";

const WorkingHoursChart = () => {
  const { role } = useAuth();
  const isHRAdmin = role === "HR_ADMIN";

  const [data, setData] = useState<WorkingHoursDataPoint[]>([]);
  const [systemAvg, setSystemAvg] = useState<number | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const loadData = async () => {
    try {
      setLoading(true);
      const res = await fetchWorkingHoursAnalytics();
      setData(res.data);
      if (res.systemWideAvg) setSystemAvg(res.systemWideAvg);
    } catch (err: any) {
      console.error("Working hours analytics error:", err);
      setError("Failed to load working hours analytics");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const titleText = isHRAdmin
    ? "Departmental Working Hours"
    : "Weekly Work Hours Tracker";

  const subtitleText = isHRAdmin
    ? "Compare average hours worked across departments"
    : "Day-by-day average work hours (Last 7 days)";

  return (
    <Card
      elevation={0}
      sx={{
        borderRadius: 4,
        border: "1px solid rgba(0,0,0,0.06)",
        background:
          "linear-gradient(135deg, rgba(255,255,255,0.9), rgba(245,247,250,0.9))",
        backdropFilter: "blur(6px)",
        height: "100%",
        transition: "all 0.25s ease",
        "&:hover": {
          boxShadow: "0 8px 24px rgba(0,0,0,0.06)",
        },
      }}
    >
      <CardContent sx={{ p: 3 }}>
        {/* Header */}
        <Stack
          direction="row"
          justifyContent="space-between"
          alignItems="center"
          mb={2}
        >
          <Box>
            <Typography
              variant="h6"
              fontWeight={700}
              sx={{ letterSpacing: 0.3 }}
            >
              {titleText}
            </Typography>
            <Typography
              variant="caption"
              sx={{ opacity: 0.7, fontSize: "0.75rem" }}
            >
              {subtitleText}
            </Typography>
          </Box>

          {isHRAdmin && systemAvg !== null && (
            <Box
              sx={{
                px: 2,
                py: 1,
                borderRadius: 2,
                background: "rgba(25,118,210,0.08)",
                textAlign: "right",
              }}
            >
              <Typography variant="caption" sx={{ opacity: 0.7 }}>
                Org Avg
              </Typography>
              <Typography
                variant="h6"
                fontWeight={800}
                color="primary.main"
              >
                {systemAvg.toFixed(1)} hrs
              </Typography>
            </Box>
          )}
        </Stack>

        <Divider sx={{ mb: 2, opacity: 0.6 }} />

        {/* Loading */}
        {loading && (
          <Box
            display="flex"
            flexDirection="column"
            alignItems="center"
            justifyContent="center"
            py={6}
          >
            <CircularProgress size={32} />
            <Typography variant="caption" mt={1} sx={{ opacity: 0.6 }}>
              Loading analytics...
            </Typography>
          </Box>
        )}

        {/* Error */}
        {error && (
          <Box textAlign="center" py={4}>
            <Typography color="error" fontWeight={500}>
              {error}
            </Typography>
          </Box>
        )}

        {/* Chart */}
        {!loading && !error && data.length > 0 && (
          <ResponsiveContainer width="100%" height={300}>
            <BarChart
              data={data}
              margin={{ top: 10, right: 10, left: -20, bottom: 0 }}
            >
              <CartesianGrid strokeDasharray="3 3" opacity={0.15} />

              <XAxis
                dataKey="label"
                tick={{ fontSize: 12, fill: "#6b7280" }}
                axisLine={false}
                tickLine={false}
              />

              <YAxis
                domain={[
                  0,
                  (dataMax: number) =>
                    Math.max(12, Math.ceil(dataMax + 2)),
                ]}
                tick={{ fontSize: 12, fill: "#6b7280" }}
                axisLine={false}
                tickLine={false}
                label={{
                  value: "Hours",
                  angle: -90,
                  position: "insideLeft",
                  fontSize: 12,
                }}
              />

              <Tooltip
                cursor={{ fill: "rgba(0,0,0,0.04)" }}
                contentStyle={{
                  borderRadius: "10px",
                  border: "1px solid rgba(0,0,0,0.08)",
                  boxShadow: "0 4px 12px rgba(0,0,0,0.08)",
                }}
                formatter={(value: number) => [
                  `${value.toFixed(1)} hrs`,
                  "Avg Hours",
                ]}
              />

              <Bar
                dataKey="avgHours"
                fill="#2E7D32"
                radius={[10, 10, 0, 0]}
                barSize={isHRAdmin ? 32 : 42}
                style={{
                  transition: "all 0.25s ease",
                }}
              />
            </BarChart>
          </ResponsiveContainer>
        )}

        {/* Empty */}
        {!loading && !error && data.length === 0 && (
          <Box textAlign="center" py={5}>
            <Typography variant="body2" sx={{ opacity: 0.6 }}>
              No working hours data available
            </Typography>
          </Box>
        )}
      </CardContent>
    </Card>
  );
};

export default WorkingHoursChart;