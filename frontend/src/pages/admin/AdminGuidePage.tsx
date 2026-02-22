import React from "react";
import { Box, Container, Typography, Paper, Divider } from "@mui/material";

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
            Administrator Guide
          </Typography>

          <Typography
            variant="h6"
            sx={{ color: "rgb(172,186,196)" }}
          >
            Manage system operations, security, AI models, and attendance
            workflows efficiently.
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

export default AdminGuidePage;