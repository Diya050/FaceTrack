import {
  Card,
  CardContent,
  Typography,
  CircularProgress,
  Box,
} from "@mui/material";
import {
  CheckCircle,
  AccessTime,
  HourglassBottom,
  Cancel,
  Groups,
} from "@mui/icons-material";
import { useEffect, useState } from "react";
import type { KPIOverview } from "../../../types/adminAnalytics.types";
import { fetchKPIOverview } from "../../../services/adminAnalyticsService";

const KPI_CONFIG = {
  Present: { color: "#4caf50", icon: <CheckCircle /> },
  Late: { color: "#ff9800", icon: <AccessTime /> },
  "Half Day": { color: "#9c27b0", icon: <HourglassBottom /> },
  Absent: { color: "#f44336", icon: <Cancel /> },
  "Total Employees": { color: "#2196f3", icon: <Groups /> },
};

const KPIItem = ({
  label,
  value,
}: {
  label: string;
  value: number;
}) => {
  const config = KPI_CONFIG[label as keyof typeof KPI_CONFIG];

  return (
    <Card
      elevation={0}
      sx={{
        borderRadius: 3,
        height: "100%",
        display: "flex",
        alignItems: "center",
        background: "linear-gradient(135deg, #ffffff, #f9fafc)",
        border: "1px solid rgba(0,0,0,0.05)",
        transition: "all 0.25s ease",
        "&:hover": {
          transform: "translateY(-4px)",
          boxShadow: "0 12px 24px rgba(0,0,0,0.06)",
        },
      }}
    >
      <CardContent sx={{ width: "100%", py: 3, px: 3 }}> {/* Increased Padding */}
        <Box
          sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          <Box>
            <Typography
              variant="caption"
              sx={{
                color: "text.secondary",
                fontWeight: 600,
                letterSpacing: 1,
              }}
            >
              {label.toUpperCase()}
            </Typography>

            <Typography
              variant="h3" // Bumped from h4 to h3 for bigger text
              fontWeight={800}
              sx={{
                mt: 1,
                color: "text.primary",
              }}
            >
              {value}
            </Typography>
          </Box>

          <Box
            sx={{
              width: 52, // Bumped icon size
              height: 52,
              borderRadius: "50%",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              backgroundColor: `${config.color}15`,
              color: config.color,
            }}
          >
            {config.icon}
          </Box>
        </Box>

        <Box
          sx={{
            mt: 2.5,
            height: 4,
            borderRadius: 2,
            backgroundColor: config.color,
            opacity: 0.8,
          }}
        />
      </CardContent>
    </Card>
  );
};

const KPISummary = () => {
  const [data, setData] = useState<KPIOverview | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const loadData = async () => {
    try {
      setLoading(true);
      const res = await fetchKPIOverview();
      setData(res);
    } catch (err: any) {
      console.error("KPI fetch error:", err);
      setError("Failed to load KPI data");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  if (loading) {
    return (
      <Box sx={{ display: "flex", justifyContent: "center", py: 5 }}>
        <CircularProgress />
      </Box>
    );
  }

  if (error || !data) {
    return (
      <Typography color="error" textAlign="center" sx={{ py: 3 }}>
        {error || "No data available"}
      </Typography>
    );
  }

  return (
    <Box
      sx={{
        width: "100%",
        display: "grid",
        // Automatically makes 5 equal columns on desktop, 2 on tablet, 1 on mobile
        gridTemplateColumns: {
          xs: "1fr",
          sm: "repeat(2, 1fr)",
          md: "repeat(5, 1fr)",
        },
        gap: 3, // Matches standard Grid spacing(3) which is 24px
      }}
    >
      <KPIItem label="Present" value={data.present} />
      <KPIItem label="Late" value={data.late} />
      <KPIItem label="Half Day" value={data.half_day} />
      <KPIItem label="Absent" value={data.absent} />
      <KPIItem label="Total Employees" value={data.total} />
    </Box>
  );
};

export default KPISummary;