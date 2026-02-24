import {
  Box,
  Typography,
  Container,
  Grid,
  Card,
  CardContent,
} from "@mui/material";
import FaceIcon from "@mui/icons-material/Face";
import SecurityIcon from "@mui/icons-material/Security";
import AnalyticsIcon from "@mui/icons-material/Analytics";

const features = [
  {
    title: "AI-Powered Face Recognition",
    description:
      "Advanced facial recognition ensures accurate and real-time attendance tracking.",
    icon: <FaceIcon fontSize="large" />,
  },
  {
    title: "Enterprise-Grade Security",
    description:
      "Secure authentication and encrypted data storage to protect sensitive information.",
    icon: <SecurityIcon fontSize="large" />,
  },
  {
    title: "Detailed Analytics & Reports",
    description:
      "Gain insights into attendance patterns with comprehensive reporting tools.",
    icon: <AnalyticsIcon fontSize="large" />,
  },
];

export default function FeaturesSection() {
  return (
    <Box
      sx={{
        py: { xs: 8, md: 12 },
      }}
    >
      <Container maxWidth="lg">
        {/* Section Heading */}
        <Box textAlign="center" mb={6}>
          <Typography variant="h4" fontWeight={700} gutterBottom>
            Powerful Features Designed for Modern Organizations
          </Typography>

          <Typography variant="body1" color="text.secondary">
            Streamline workforce management with intelligent automation.
          </Typography>
        </Box>

        {/* Feature Cards */}
        <Grid container spacing={4}>
          {features.map((feature, index) => (
            <Grid size={{ xs:12, md:4 }} key={index}>
              <Card
                    sx={(theme) => ({
                        height: "100%",
                        borderRadius: 3,
                        backgroundColor: theme.palette.background.default,
                        border: `1px solid ${theme.palette.divider}`,
                        transition: "all 0.3s ease",
                        "&:hover": {
                          transform: "translateY(-6px)",
                          boxShadow: theme.shadows[4],
                          borderColor: theme.palette.primary.main,
                        },
                    })}
                    >
                    <CardContent sx={{ textAlign: "center", p: 4 }}>
                        <Box
                          mb={2}
                          sx={(theme) => ({
                            color: theme.palette.primary.main,
                          })}
                        >
                          {feature.icon}
                        </Box>

                        <Typography variant="h6" fontWeight={600} gutterBottom>
                          {feature.title}
                        </Typography>

                        <Typography variant="body2" color="text.secondary">
                          {feature.description}
                        </Typography>
                    </CardContent>
               </Card>
            </Grid>
          ))}
        </Grid>
      </Container>
    </Box>
  );
}