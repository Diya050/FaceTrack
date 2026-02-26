// src/theme/dashboardTheme.ts
import { createTheme, alpha } from "@mui/material";

export const dashboardTheme = createTheme({
  palette: {
    mode: "light",
    primary: {
      main: "#343B55", // Navy
    },
    secondary: {
      main: "#F0F0DB", // Cream
    },
    background: {
      default: "#F8F9FA", // Light grey-white for the body
      paper: "#FFFFFF",   // Pure white for cards
    },
    text: {
      primary: "#343B55",   // Navy for high contrast
      secondary: "#8F9AA6", // Slate for subtle info
    },
    divider: "#F0F2F5",
  },
  shape: { borderRadius: 12 },
  components: {
    MuiCard: {
      styleOverrides: {
        root: {
          backgroundImage: "none",
          backgroundColor: "#FFFFFF",
    border: "1px solid #F0F2F5", 
    boxShadow: "0px 4px 20px rgba(52, 59, 85, 0.05)",
          transition: "all 0.25s ease-in-out",
          "&:hover": {
            transform: "translateY(-4px)",
            boxShadow: "0px 12px 24px rgba(52, 59, 85, 0.08)",
            borderColor: alpha("#343B55", 0.1),
          },
        },
      },
    },
    MuiLinearProgress: {
      styleOverrides: {
        root: {
          height: 8,
          borderRadius: 8,
          backgroundColor: "#F0F2F5",
        },
      },
    },
  },
});

export const COLORS = {
  present: "#6ECA97",
  absent: "#E07070",
  late: "#D4A85A",
  early: "#7A9FC2",
  unknown: "#A78BFA", // <--- ADD THIS LINE
  navy: "#343B55",
  slate: "#8F9AA6",
  cream: "#F0F0DB",
  border: "#EEF0F2",
};