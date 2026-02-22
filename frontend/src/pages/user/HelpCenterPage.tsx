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
} from "@mui/material";
import Grid from "@mui/material/Grid";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import HelpOutlineIcon from "@mui/icons-material/HelpOutline";
import SettingsSuggestIcon from "@mui/icons-material/SettingsSuggest";
import ContactSupportIcon from "@mui/icons-material/ContactSupport";
import EngineeringIcon from "@mui/icons-material/Engineering";
import { useNavigate } from "react-router-dom";

const HelpCenterPage: React.FC = () => {
  const NaviGate = useNavigate();

  return (
    <Box>
      {/* HERO SECTION — Same as FAQ */}
      <Box
        sx={{
          background:
            "linear-gradient(135deg, #30364F 0%, #3E4565 100%)",
          py: { xs: 8, md: 12 },
          textAlign: "center",
          color: "white",
        }}
      >
        <Container maxWidth="md">
          <Typography variant="h3" fontWeight={700} mb={2}>
            Help Center
          </Typography>

          <Typography
            variant="h6"
            sx={{ color: "rgb(172,186,196)" }}
          >
            A dashboard to get any kind of help to navigate through the website.
          </Typography>
        </Container>
      </Box>

      {/* CONTENT SECTION */}
      <Box
        sx={{
          py: 10,
          backgroundColor: "#F7F8FA",
          minHeight: "100vh",
        }}
      >
        <Container maxWidth="lg">
          {/* Troubleshooting */}
          <Box mb={10}>
            <Alert
              icon={<SettingsSuggestIcon sx={{ color: "#30364F" }} />}
              sx={{
                backgroundColor: "#ffffff",
                border: "1px solid rgba(48,54,79,0.15)",
                mb: 4,
              }}
            >
              <AlertTitle
                sx={{ fontWeight: "bold", color: "#30364F" }}
              >
                System Troubleshooting & Recovery
              </AlertTitle>
              <Typography sx={{ color: "#30364F" }}>
                For critical errors, expect system recovery within 24 hours.
              </Typography>
            </Alert>

            <Accordion
              sx={{
                backgroundColor: "#ffffff",
                border: "1px solid rgba(48,54,79,0.15)",
                mb: 2,
              }}
            >
              <AccordionSummary
                expandIcon={
                  <ExpandMoreIcon sx={{ color: "#30364F" }} />
                }
              >
                <Typography
                  fontWeight="bold"
                  sx={{ color: "#30364F" }}
                >
                  Handling Recognition Failures
                </Typography>
              </AccordionSummary>
              <AccordionDetails>
                <Typography sx={{ color: "#30364F" }}>
                  Recognition performance depends on hardware and
                  lighting. Ensure high-quality facial enrollment images.
                </Typography>
              </AccordionDetails>
            </Accordion>

            <Accordion
              sx={{
                backgroundColor: "#ffffff",
                border: "1px solid rgba(48,54,79,0.15)",
              }}
            >
              <AccordionSummary
                expandIcon={
                  <ExpandMoreIcon sx={{ color: "#30364F" }} />
                }
              >
                <Typography
                  fontWeight="bold"
                  sx={{ color: "#30364F" }}
                >
                  Network & Stream Latency
                </Typography>
              </AccordionSummary>
              <AccordionDetails>
                <Typography sx={{ color: "#30364F" }}>
                  Network stability affects real-time video transmission.
                  Ensure reliable bandwidth for camera streams.
                </Typography>
              </AccordionDetails>
            </Accordion>
          </Box>

          {/* Guides Section */}
          <Box sx={{ my: 8 }}>
            <Grid container spacing={4}>
              {/* Getting Started */}
              <Grid size={{ xs: 12, md: 4 }}>
                <Card
                  sx={{
                    backgroundColor: "#ffffff",
                    border: "1px solid rgba(48,54,79,0.1)",
                    textAlign: "center",
                    height: "100%",
                    borderRadius: "14px",
                    boxShadow:
                      "0 6px 20px rgba(0,0,0,0.05)",
                    transition: "all 0.3s ease",
                    "&:hover": {
                      transform: "translateY(-4px)",
                      boxShadow:
                        "0 10px 30px rgba(0,0,0,0.08)",
                    },
                  }}
                >
                  <CardContent>
                    <HelpOutlineIcon
                      sx={{
                        fontSize: 50,
                        color: "#30364F",
                        mb: 2,
                      }}
                    />
                    <Typography
                      variant="h6"
                      fontWeight="bold"
                      sx={{ color: "#30364F", mb: 2 }}
                    >
                      Getting Started
                    </Typography>
                    <Typography
                      sx={{ color: "#30364F", mb: 3 }}
                    >
                      Quick start guide for attendance marking and
                      camera setup.
                    </Typography>
                    <Button
                      variant="outlined"
                      sx={{
                        color: "#30364F",
                        borderColor: "#30364F",
                        "&:hover": {
                          backgroundColor: "#30364F",
                          color: "#ffffff",
                        },
                      }}
                    >
                      View Guide
                    </Button>
                  </CardContent>
                </Card>
              </Grid>

              {/* Admin Guide */}
              <Grid size={{ xs: 12, md: 4 }}>
                <Card
                  sx={{
                    backgroundColor: "#ffffff",
                    border: "1px solid rgba(48,54,79,0.1)",
                    textAlign: "center",
                    height: "100%",
                    borderRadius: "14px",
                    boxShadow:
                      "0 6px 20px rgba(0,0,0,0.05)",
                    transition: "all 0.3s ease",
                    "&:hover": {
                      transform: "translateY(-4px)",
                      boxShadow:
                        "0 10px 30px rgba(0,0,0,0.08)",
                    },
                  }}
                >
                  <CardContent>
                    <EngineeringIcon
                      sx={{
                        fontSize: 50,
                        color: "#30364F",
                        mb: 2,
                      }}
                    />
                    <Typography
                      variant="h6"
                      fontWeight="bold"
                      sx={{ color: "#30364F", mb: 2 }}
                    >
                      Admin Guide
                    </Typography>
                    <Typography
                      sx={{ color: "#30364F", mb: 3 }}
                    >
                      Manage users, facial data, and role-based access
                      control.
                    </Typography>
                    <Button
                      onClick={() => NaviGate("/adminsguide")}
                      variant="outlined"
                      sx={{
                        color: "#30364F",
                        borderColor: "#30364F",
                        "&:hover": {
                          backgroundColor: "#30364F",
                          color: "#ffffff",
                        },
                      }}
                    >
                      Configure
                    </Button>
                  </CardContent>
                </Card>
              </Grid>

              {/* User Guide */}
              <Grid size={{ xs: 12, md: 4 }}>
                <Card
                  sx={{
                    backgroundColor: "#ffffff",
                    border: "1px solid rgba(48,54,79,0.1)",
                    textAlign: "center",
                    height: "100%",
                    borderRadius: "14px",
                    boxShadow:
                      "0 6px 20px rgba(0,0,0,0.05)",
                    transition: "all 0.3s ease",
                    "&:hover": {
                      transform: "translateY(-4px)",
                      boxShadow:
                        "0 10px 30px rgba(0,0,0,0.08)",
                    },
                  }}
                >
                  <CardContent>
                    <ContactSupportIcon
                      sx={{
                        fontSize: 50,
                        color: "#30364F",
                        mb: 2,
                      }}
                    />
                    <Typography
                      variant="h6"
                      fontWeight="bold"
                      sx={{ color: "#30364F", mb: 2 }}
                    >
                      User Guide
                    </Typography>
                    <Typography
                      sx={{ color: "#30364F", mb: 3 }}
                    >
                      Learn to view attendance records and request
                      corrections.
                    </Typography>
                    <Button
                      onClick={() => NaviGate("/usersguide")}
                      variant="outlined"
                      sx={{
                        color: "#30364F",
                        borderColor: "#30364F",
                        "&:hover": {
                          backgroundColor: "#30364F",
                          color: "#ffffff",
                        },
                      }}
                    >
                      Explore
                    </Button>
                  </CardContent>
                </Card>
              </Grid>
            </Grid>
          </Box>
        </Container>
      </Box>
    </Box>
  );
};

export default HelpCenterPage;