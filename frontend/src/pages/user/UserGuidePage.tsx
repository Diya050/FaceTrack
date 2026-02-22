import React from "react";
import { Container, Typography, Box, Paper, Divider } from "@mui/material";

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
    <Container
      maxWidth="lg"
      sx={{
        py: 8,
        minHeight: "100vh",
        backgroundColor: "#ffffff",
      }}
    >
      <Typography
        variant="h4"
        sx={{
          fontWeight: 700,
          color: "#30364F",
          mb: 2,
        }}
      >
        Authorized User Guide
      </Typography>

      <Typography
        variant="body1"
        sx={{
          color: "#30364F",
          opacity: 0.8,
          mb: 6,
          maxWidth: "800px",
        }}
      >
        The Authorized User can monitor personal attendance records, submit
        correction requests, access reports, and receive real-time system
        notifications within the FaceTrack platform.
      </Typography>

      <Box sx={{ display: "flex", flexDirection: "column", gap: 5 }}>
        {sections.map((section, index) => (
          <Paper
            key={index}
            elevation={0}
            sx={{
              p: 5,
              borderLeft: "6px solid #30364F",
              borderRadius: "14px",
              boxShadow: "0 6px 24px rgba(48, 54, 79, 0.08)",
              transition: "all 0.3s ease",
              "&:hover": {
                transform: "translateY(-4px)",
                boxShadow: "0 10px 32px rgba(48, 54, 79, 0.15)",
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

            <Divider sx={{ mb: 3, borderColor: "#30364F", opacity: 0.15 }} />

            <Box component="ul" sx={{ pl: 3, m: 0 }}>
              {section.points.map((point, i) => (
                <Typography
                  component="li"
                  key={i}
                  variant="body2"
                  sx={{
                    color: "#30364F",
                    opacity: 0.85,
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
      </Box>
    </Container>
  );
};

export default UserGuidePage;