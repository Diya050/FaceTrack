import { alpha } from "@mui/material";
import { COLORS } from "../../../../../theme/dashboardTheme";

export const DEPT_COLORS = [
  COLORS.present, 
  COLORS.early, 
  COLORS.navy, 
  COLORS.late, 
  COLORS.absent
];

export const getChartTooltip = () => ({
  backgroundColor: '#FFFFFF', 
  borderColor: alpha(COLORS.navy, 0.1),
  borderWidth: 1,
  titleColor: COLORS.navy,
  bodyColor: COLORS.slate,
  padding: 12,
  cornerRadius: 8,
  displayColors: true,
  boxPadding: 6,
});

export const getChartScales = () => ({
  x: {
    ticks: { 
      color: COLORS.slate, 
      font: { size: 11, weight: 600 as const } 
    },
    grid: { 
      display: false 
    },
  },
  y: {
    ticks: { 
      color: COLORS.slate, 
      font: { size: 11 } 
    },
    grid: { 
      color: alpha(COLORS.slate, 0.05),
      drawBorder: false 
    },
  },
});