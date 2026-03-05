import { Box, Typography, Container, Grid, Divider } from "@mui/material";
import { useTheme } from "@mui/material/styles";

export default function AdvantagesSection() {
  const theme = useTheme();

  return (
    <Box
      sx={{
        py: { xs: 6, sm: 8, md: 12 }, // reduced padding on mobile
        backgroundColor: theme.palette.primary.dark,
        color: theme.palette.primary.contrastText,
      }}
    >
      <Container maxWidth="lg">
        {/* Heading */}
        <Typography
          sx={{
            fontWeight: 700,
            mb: { xs: 2, md: 3 },
            fontSize: {
              xs: "1.6rem",   // mobile reduced
              sm: "1.9rem",
              md: "2.4rem",   // desktop unchanged feel
            },
            lineHeight: 1.3,
          }}
        >
          Key Advantages of FaceTrack Technology
        </Typography>

        {/* Description */}
        <Typography
          sx={{
            opacity: 0.9,
            mb: { xs: 4, md: 6 },
            lineHeight: 1.7,
            fontSize: {
              xs: "0.95rem",
              sm: "1rem",
              md: "1.05rem",
            },
            maxWidth: { md: 900 }, // remove restriction on mobile
          }}
        >
          FaceTrack’s technology offers seamless attendance automation.
          Experience enhanced accuracy and efficiency, reducing manual
          errors while logging attendance in real-time. The platform’s
          advanced analytics provide valuable insights, ensuring secure
          and scalable access whenever needed.
        </Typography>

        {/* Divider */}
        <Divider
          sx={{
            borderColor: "rgba(255,255,255,0.4)",
            mb: { xs: 4, md: 6 },
          }}
        />

        {/* Two Columns */}
        <Grid container spacing={{ xs: 4, md: 6 }}>
          <Grid size={{xs:12, md:6}}>
            <Typography
              sx={{
                fontWeight: 700,
                mb: 1,
                fontSize: { xs: "1.1rem", md: "1.25rem" },
              }}
            >
              Accuracy
            </Typography>

            <Typography
              sx={{
                opacity: 0.9,
                lineHeight: 1.7,
                fontSize: { xs: "0.95rem", md: "1rem" },
              }}
            >
              Utilizing advanced face recognition, FaceTrack ensures
              precise attendance logging, eliminating common errors
              and discrepancies.
            </Typography>
          </Grid>

          <Grid size={{xs:12, md:6}}>
            <Typography
              sx={{
                fontWeight: 700,
                mb: 1,
                fontSize: { xs: "1.1rem", md: "1.25rem" },
              }}
            >
              Security
            </Typography>

            <Typography
              sx={{
                opacity: 0.9,
                lineHeight: 1.7,
                fontSize: { xs: "0.95rem", md: "1rem" },
              }}
            >
              FaceTrack prioritizes data protection, ensuring all
              information is stored securely in compliance with
              industry standards, including GDPR.
            </Typography>
          </Grid>
        </Grid>
      </Container>
    </Box>
  );
}