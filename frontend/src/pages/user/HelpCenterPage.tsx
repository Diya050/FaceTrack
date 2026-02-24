import React from "react";
import {
  Typography,
  Container,
  Card,
  CardContent,
  Button,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Alert,
  AlertTitle,
  Box,
  Divider,
  Grid, // Reverted to standard Grid
} from "@mui/material";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import HelpOutlineIcon from "@mui/icons-material/HelpOutline";
import SettingsSuggestIcon from "@mui/icons-material/SettingsSuggest";
import ContactSupportIcon from "@mui/icons-material/ContactSupport";
import EngineeringIcon from "@mui/icons-material/Engineering";
import { useNavigate } from "react-router-dom";

const HelpCenterPage: React.FC = () => {
  const NaviGate = useNavigate();

  return (
    <Box sx={{ width: "100%", minHeight: "100vh" }}>
      
      {/* HERO SECTION */}
      <Box
        sx={{
          background: "linear-gradient(90deg, #343B55 0%, #3C435C 100%)",
          py: { xs: 8, md: 14 },
          px: 4,
          textAlign: "center",
          color: "white",
        }}
      >
        <Container maxWidth="md">
          <Typography 
            variant="h3" 
            sx={{ 
              fontSize: { xs: "2.25rem", sm: "3rem", md: "3.5rem" }, 
              fontWeight: 700, 
              mb: 2 
            }}
          >
            Help Center
          </Typography>
          <Typography
            variant="h6"
            sx={{ 
              color: "#f3f2ee", 
              opacity: 0.9,
              fontWeight: 400,
              maxWidth: "700px",
              mx: "auto"
            }}
          >
            Technical support and system guides to help you navigate the FaceTrack ecosystem.
          </Typography>
        </Container>
      </Box>

      {/* CONTENT SECTION */}
      <Box
        sx={{
          py: { xs: 8, md: 10 },
          background: "linear-gradient(to bottom, #F0F0DB 0%, #E1D9BC 100%)",
          minHeight: "60vh",
        }}
      >
        <Container maxWidth="lg">
          
          {/* Troubleshooting Section */}
          <Box sx={{ mb: 8 }}>
            <Alert
              icon={<SettingsSuggestIcon sx={{ color: "#30364F" }} />}
              sx={{
                backgroundColor: "white",
                border: "1px solid #CFC7A8",
                borderRadius: "16px",
                p: 2,
                mb: 4,
                boxShadow: "0 4px 12px rgba(0,0,0,0.03)",
              }}
            >
              <AlertTitle sx={{ fontWeight: 700, color: "#2F374F" }}>
                System Status & Recovery
              </AlertTitle>
              <Typography variant="body2" sx={{ color: "#5F6674" }}>
                AI models are operational. Technical support ensures critical recovery within 24 hours.
              </Typography>
            </Alert>

            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
              <Accordion
                elevation={0}
                sx={{
                  backgroundColor: "white",
                  border: "1px solid #CFC7A8",
                  borderRadius: "16px !important",
                  "&:before": { display: "none" },
                }}
              >
                <AccordionSummary expandIcon={<ExpandMoreIcon sx={{ color: "#30364F" }} />}>
                  <Typography fontWeight={700} sx={{ color: "#2F374F" }}>
                    Handling Recognition Failures
                  </Typography>
                </AccordionSummary>
                <AccordionDetails>
                  <Divider sx={{ mb: 2 }} />
                  <Typography sx={{ color: "#5F6674" }}>
                    Ensure users enroll with high-resolution images in neutral lighting for best results.
                  </Typography>
                </AccordionDetails>
              </Accordion>

              <Accordion
                elevation={0}
                sx={{
                  backgroundColor: "white",
                  border: "1px solid #CFC7A8",
                  borderRadius: "16px !important",
                  "&:before": { display: "none" },
                }}
              >
                <AccordionSummary expandIcon={<ExpandMoreIcon sx={{ color: "#30364F" }} />}>
                  <Typography fontWeight={700} sx={{ color: "#2F374F" }}>
                    Network & Stream Latency
                  </Typography>
                </AccordionSummary>
                <AccordionDetails>
                  <Divider sx={{ mb: 2 }} />
                  <Typography sx={{ color: "#5F6674" }}>
                    Check your IP camera's bandwidth allocation and ensure a wired connection where possible.
                  </Typography>
                </AccordionDetails>
              </Accordion>
            </Box>
          </Box>

          {/* Navigation Guides - Updated to standard Grid v1 */}
          <Grid container spacing={4}>
  {[
    { title: "Getting Started", icon: <HelpOutlineIcon />, path: "/how-it-works" },
    { title: "Admin Guide", icon: <EngineeringIcon />, path: "/admin-guide" },
    { title: "User Guide", icon: <ContactSupportIcon />, path: "/user-guide" }
            ].map((item, index) => (
              <Grid key={index} size={{ xs: 12, md: 4 }}>
                <Card
                  sx={{
                    backgroundColor: "white",
                    border: "1px solid #CFC7A8",
                    textAlign: "center",
                    borderRadius: "20px",
                    p: 2,
                    transition: "all 0.4s ease",
                    "&:hover": {
                      transform: "translateY(-8px)",
                      boxShadow: "0 20px 40px rgba(48, 54, 79, 0.12)",
                      borderColor: "#30364F",
                    },
                  }}
                >
                  <CardContent sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 2 }}>
                    <Box
                      sx={{
                        width: 70, height: 70, borderRadius: "50%",
                        display: "flex", alignItems: "center", justifyContent: "center",
                        background: "linear-gradient(135deg, #3C435C 0%, #8F9AA6 100%)",
                        color: "white",
                      }}
                    >
                      {item.icon}
                    </Box>
                    <Typography variant="h6" fontWeight={700} sx={{ color: "#2F374F" }}>
                      {item.title}
                    </Typography>
                    <Button
                      fullWidth
                      onClick={() => NaviGate(item.path)}
                      variant="contained"
                      sx={{
                        mt: 2, backgroundColor: "#30364F", textTransform: "none", borderRadius: "10px",
                        "&:hover": { backgroundColor: "#3C435C" },
                      }}
                    >
                      Explore
                    </Button>
                  </CardContent>
                </Card>
              </Grid>
            ))}
          </Grid>
        </Container>
      </Box>
    </Box>
  );
};

export default HelpCenterPage;