import { Box, Container, Paper } from "@mui/material";
import { useTheme } from "@mui/material/styles";
import type { ReactNode } from "react";

interface Props {
  children: ReactNode;
}

export default function AuthLayout({ children }: Props) {
  const theme = useTheme();

  return (
    <Box
      sx={{
        minHeight: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",

        // Theme-based gradient
        background: `linear-gradient(
          135deg,
          ${theme.palette.primary.main} 0%,
          ${theme.palette.secondary.main} 100%
        )`,
      }}
    >
      <Container maxWidth="sm">
        <Paper
          elevation={8}
          sx={{
            p: 4,
            borderRadius: 3,
            backgroundColor: theme.palette.background.paper,
          }}
        >
          {children}
        </Paper>
      </Container>
    </Box>
  );
}
