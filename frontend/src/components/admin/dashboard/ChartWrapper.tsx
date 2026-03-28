// src/pages/admin/dashboard/shared/ChartWrapper.tsx
import { Box, Divider, Stack, Typography } from "@mui/material";
import type { ReactNode } from "react";

interface Props {
  label: string;
  title: string;
  children: ReactNode;
  action?: ReactNode;
}

export default function ChartWrapper({ label, title, children, action }: Props) {
  return (
    <Box sx={{ width: "100%", height: "100%", display: "flex", flexDirection: "column" }}>
      {/* Header */}
      <Stack
        direction="row"
        justifyContent="space-between"
        alignItems="flex-end"
        sx={{ mb: 1.5 }}
      >
        <Box>
          <Typography
            sx={{ fontSize: 10, color: "#9CA3AF", fontWeight: 700, letterSpacing: 1, mb: 0.3 }}
          >
            {label}
          </Typography>
          <Typography sx={{ fontSize: 15, fontWeight: 700, color: "#111827" }}>
            {title}
          </Typography>
        </Box>
        {action}
      </Stack>

      <Divider sx={{ mb: 1.5 }} />

      {/* Chart area fills the rest */}
      <Box sx={{ flex: 1, minHeight: 0 }}>
        {children}
      </Box>
    </Box>
  );
}