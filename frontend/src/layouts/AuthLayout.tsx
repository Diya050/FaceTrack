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
        px: { xs: 2, sm: 3 },
        py: { xs: 3, sm: 4 },

        background: `linear-gradient(
          135deg,
          ${theme.palette.primary.main} 0%,
          ${theme.palette.secondary.main} 100%
        )`,
      }}
    >
      <Container maxWidth="sm" disableGutters>
        <Paper
          elevation={6}
          sx={{
            width: "100%",
            p: { xs: 3, sm: 4 },
            borderRadius: { xs: 2, sm: 3 },
            backgroundColor: theme.palette.background.paper,
          }}
        >
          {children}
        </Paper>
      </Container>
    </Box>
  );
}