import React from "react";
import { Container, Typography, Box, Paper, Divider } from "@mui/material";

const sections = [
  {
    title: "1. User Enrollment & Profile Management",
    points: [
      "Create, update, or delete user profiles.",
      "Upload facial images and manage facial encodings.",
      "Bulk upload profiles using CSV.",
      "Manage voice samples (if enabled).",
    ],
  },
  {
    title: "2. Live Monitoring & Camera Management",
    points: [
      "Configure CCTV, IP cameras, and webcams.",
      "Monitor full-screen camera feeds.",
      "View recognized vs unknown face indicators.",
      "Acknowledge and manage recognition events.",
    ],
  },
  {
    title: "3. Attendance Management",
    points: [
      "Automatically record attendance upon recognition.",
      "Prevent duplicate session entries.",
      "Search and filter attendance records.",
      "Approve or reject correction requests.",
      "Export reports (PDF / Excel).",
    ],
  },
  {
    title: "4. Reports & Analytics",
    points: [
      "Generate daily, weekly, and monthly reports.",
      "Department-based performance analysis.",
      "View KPIs (Present, Absent, Unknown, Cameras Online).",
      "Visual dashboards with charts and summaries.",
    ],
  },
  {
    title: "5. Security & Privacy Controls",
    points: [
      "Monitor encryption status.",
      "Access audit and system logs.",
      "Manage user consents.",
      "Configure data retention policies.",
    ],
  },
  {
    title: "6. System Settings & AI Configuration",
    points: [
      "Configure recognition sensitivity threshold.",
      "Switch or update AI models.",
      "Configure notification preferences.",
      "Manage cloud storage and run backups.",
    ],
  },
];

const AdminGuidePage: React.FC = () => {
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
        Administrator Guide
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
        The Administrator is responsible for managing system operations,
        monitoring live recognition events, configuring AI models, ensuring
        data security, and generating attendance reports within the FaceTrack
        system.
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

export default AdminGuidePage;