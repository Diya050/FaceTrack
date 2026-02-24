import type { SxProps, Theme } from "@mui/material/styles";

export const sidebarContainer = (theme: Theme): SxProps => ({
  position: "fixed",
  top: 64,
  left: 0,
  height: "calc(100vh - 64px)",
  background: `linear-gradient(130deg,
    ${theme.palette.primary.main} 100%,
    ${theme.palette.primary.dark} 0%)`,
  borderRight: "2px solid rgba(255,255,255,0.08)",
  overflowY: "auto",
  px: 1.5,
  py: 2,
});

export const sidebarPanelTitle: SxProps = {
  fontSize: "0.9rem",
  fontWeight: 700,
  letterSpacing: "0.12em",
  color: "#AAB4C8",
  px: 2,
  mb: 1.5,
};

export const sidebarItemBase: SxProps = {
  borderRadius: "12px",
  mb: 0.5,
  fontSize: "0.9rem",
  color: "#E6EAF2",
  transition: "0.25s",
  "&:hover": {
    background: "rgba(255,255,255,0.08)",
    color: "#FFFFFF",
  },
  "&.active": {
    background: "rgba(255,255,255,0.20)",
    color: "#FFFFFF",
    fontWeight: 600,
  },
};