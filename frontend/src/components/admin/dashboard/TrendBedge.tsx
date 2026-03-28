import { Stack, Typography, alpha } from "@mui/material";
import { TrendingUp, TrendingDown, Remove } from "@mui/icons-material";
import { COLORS } from "../../../theme/dashboardTheme";

interface TrendBadgeProps {
  trend?: "up" | "down" | "flat";
  value?: string;
}

export default function TrendBadge({ trend, value }: TrendBadgeProps) {
  if (!trend || !value) return null;

  const color = 
    trend === "up" ? COLORS.present : 
    trend === "down" ? COLORS.absent : 
    COLORS.slate;

  const Icon = 
    trend === "up" ? TrendingUp : 
    trend === "down" ? TrendingDown : 
    Remove;

  return (
    <Stack 
      direction="row" 
      spacing={0.5} 
      alignItems="center"
      sx={{ 
        bgcolor: alpha(color, 0.1), 
        border: `1px solid ${alpha(color, 0.15)}`, 
        borderRadius: '6px', 
        px: 1, 
        py: 0.4 
      }}
    >
      <Icon sx={{ fontSize: 14, color }} />
      <Typography 
        variant="caption" 
        sx={{ color, fontSize: 11, fontWeight: 800, letterSpacing: 0.5 }}
      >
        {value}
      </Typography>
    </Stack>
  );
}