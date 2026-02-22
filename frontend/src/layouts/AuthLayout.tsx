import { Box, Container, Paper } from "@mui/material";
import { useTheme } from "@mui/material/styles";
import type { ReactNode } from "react";
import Header from "../components/PublicHeader";
import Footer from "../components/Footer";

interface Props {
  children: ReactNode;
}

export default function AuthLayout({ children }: Props) {
  const theme = useTheme();

  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        minHeight: "100vh",
      }}
    >
      {/* Header */}
      <Header />

      {/* Main Content */}
      <Box
        sx={{
          flex: 1,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          px: { xs: 2, sm: 3 },
          py: { xs: 4, sm: 6 },
          background: `linear-gradient(
            135deg,
            ${theme.palette.primary.main} 20%,
            ${theme.palette.secondary.main} 80%
          )`,
        }}
      >
        <Container maxWidth="sm" disableGutters>
          <Paper
            elevation={8}
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

      {/* Footer */}
      <Footer />
    </Box>
  );
}