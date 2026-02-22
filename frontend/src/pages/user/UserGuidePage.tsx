import React from "react";
import { Box, Container, Typography, Paper, Divider } from "@mui/material";

const sections = [
  {
    title: "1. Dashboard Overview",
    points: [
      "View your attendance summary and statistics.",
      "Check total present, absent, and late records.",
      "Monitor recent activity and notifications.",
    ],
  },
  {
    title: "2. Viewing Attendance Records",
    points: [
      "Access detailed attendance history.",
      "Filter records by date range (daily, weekly, monthly).",
      "View recognition method used (Face / Face + Voice).",
    ],
  },
  {
    title: "3. Attendance Correction Requests",
    points: [
      "Submit correction requests for incorrect entries.",
      "Provide reason and supporting details.",
      "Track request status (Pending / Approved / Rejected).",
    ],
  },
  {
    title: "4. Reports & Insights",
    points: [
      "Generate personal attendance reports.",
      "Download reports when permitted.",
      "Review summarized attendance patterns.",
    ],
  },
  {
    title: "5. Live Alerts & Notifications",
    points: [
      "Receive real-time attendance confirmation alerts.",
      "View system notifications related to attendance.",
      "Mark notifications as read.",
    ],
  },
];

const UserGuidePage: React.FC = () => {
  return (
    <Box>
      {/* HERO SECTION */}
      <Box
        sx={{
          background:
            "linear-gradient(135deg, #30364F 0%, #3E4565 100%)",
          py: 12,
          textAlign: "center",
          color: "white",
        }}
      >
        <Container maxWidth="md">
          <Typography variant="h3" fontWeight={700} mb={2}>
            Authorized User Guide
          </Typography>

          <Typography
            variant="h6"
            sx={{ color: "rgb(172,186,196)" }}
          >
            Everything you need to manage and monitor your attendance.
          </Typography>
        </Container>
      </Box>

      {/* CONTENT SECTION */}
      <Box
        sx={{
          py: 10,
          backgroundColor: "#F7F8FA",
        }}
      >
        <Container maxWidth="md">
          {sections.map((section, index) => (
            <Paper
              key={index}
              elevation={0}
              sx={{
                p: 5,
                mb: 4,
                borderRadius: "14px",
                backgroundColor: "white",
                border: "1px solid rgba(48,54,79,0.08)",
                boxShadow: "0 6px 20px rgba(0,0,0,0.05)",
                transition: "all 0.3s ease",
                "&:hover": {
                  transform: "translateY(-3px)",
                  boxShadow: "0 10px 30px rgba(0,0,0,0.08)",
                },
              }}
            >
              <Typography
                variant="h6"
                sx={{
                  fontWeight: 600,
                  color: "#30364F",
                  mb: 2,
                }}
              >
                {section.title}
              </Typography>

              <Divider
                sx={{
                  mb: 3,
                  borderColor: "rgb(172,186,196)",
                }}
              />

              <Box component="ul" sx={{ pl: 3, m: 0 }}>
                {section.points.map((point, i) => (
                  <Typography
                    component="li"
                    key={i}
                    variant="body1"
                    sx={{
                      color: "#30364F",
                      lineHeight: 1.8,
                      mb: 1,
                    }}
                  >
                    {point}
                  </Typography>
                ))}
              </Box>
            </Paper>
          ))}
        </Container>
      </Box>
    </Box>
  );
};

export default UserGuidePage;