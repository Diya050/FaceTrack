import { Box, Typography, Button, Grid, Container } from "@mui/material";
import { useTheme } from "@mui/material/styles";
import { useNavigate } from "react-router-dom";

export default function CTASection() {
  const theme = useTheme();
  const navigate = useNavigate();

  return (
    <Box
      sx={{
        backgroundColor: theme.palette.primary.dark,
        py: { xs: 6, md: 8},
      }}
    >
      <Container maxWidth="xl">
        <Grid
          container
          spacing={6}
          alignItems="center"
        >
          {/* LEFT SIDE */}
          <Grid size={{xs:12, md:6}}>
            <Box
              sx={{
                maxWidth: 520,
                mx: { xs: "auto", md: 0 },
                textAlign: { xs: "center", md: "center" },
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
              }}
            >
              <Typography
                sx={{
                  color: theme.palette.primary.contrastText,
                  opacity: 0.85,
                  mb: 2,
                  fontSize: {
                    xs: "0.9rem",
                    md: "1rem",
                  },
                }}
              >
                Transform Attendance Tracking
              </Typography>

              <Typography
                sx={{
                  color: theme.palette.primary.contrastText,
                  fontWeight: 700,
                  lineHeight: 1.25,
                  mb: 4,
                  fontSize: {
                    xs: "1.8rem",
                    sm: "2.2rem",
                    md: "2.8rem",
                  },
                }}
              >
                Get Started with Automated Attendance Solutions Today!
              </Typography>

              <Button
                variant="contained"
                size="medium"
                onClick={() => navigate("/register")}
                sx={{
                  px: 5,
                  py: 1.6,
                  fontWeight: 600,
                  backgroundColor: theme.palette.background.default,
                  color: theme.palette.primary.main,
                  borderRadius: 2,
                  "&:hover": {
                    backgroundColor: theme.palette.secondary.light,
                  },
                }}
              >
                Sign Up Now
              </Button>
            </Box>
          </Grid>

          {/* RIGHT SIDE IMAGE */}
          <Grid size={{xs:12, md:6}}>
            <Box
              component="img"
              src="/cta.jpg"
              alt="Face Recognition Dashboard"
              sx={{
                width: "100%",
                maxWidth: 650,
                display: "block",
                margin: { xs: "0 auto", md: "0 0 0 auto" },
              }}
            />
          </Grid>
        </Grid>
      </Container>
    </Box>
  );
}