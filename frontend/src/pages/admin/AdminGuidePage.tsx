import React from "react";
import { Box, Container, Typography, Divider } from "@mui/material";
// Icons for Admin Actions
import PeopleAltIcon from '@mui/icons-material/PeopleAlt';
import LinkedCameraIcon from '@mui/icons-material/LinkedCamera';
import FactCheckIcon from '@mui/icons-material/FactCheck';
import QueryStatsIcon from '@mui/icons-material/QueryStats';
import AdminPanelSettingsIcon from '@mui/icons-material/AdminPanelSettings';
import SettingsSuggestIcon from '@mui/icons-material/SettingsSuggest';

const sections = [
  {
    number: "01",
    title: "User Enrollment & Profile Management",
    icon: <PeopleAltIcon sx={{ fontSize: { xs: 24, sm: 28 } }} />,
    points: [
      "Create, update, or delete user profiles.",
      "Upload facial images and manage facial encodings.",
      "Bulk upload profiles using CSV.",
      "Manage voice samples (if enabled).",
    ],
  },
  {
    number: "02",
    title: "Live Monitoring & Camera Management",
    icon: <LinkedCameraIcon sx={{ fontSize: { xs: 24, sm: 28 } }} />,
    points: [
      "Configure CCTV, IP cameras, and webcams.",
      "Monitor full-screen camera feeds.",
      "View recognized vs unknown face indicators.",
      "Acknowledge and manage recognition events.",
    ],
  },
  {
    number: "03",
    title: "Attendance Management",
    icon: <FactCheckIcon sx={{ fontSize: { xs: 24, sm: 28 } }} />,
    points: [
      "Automatically record attendance upon recognition.",
      "Prevent duplicate session entries.",
      "Search and filter attendance records.",
      "Approve or reject correction requests.",
      "Export reports (PDF / Excel).",
    ],
  },
  {
    number: "04",
    title: "Reports & Analytics",
    icon: <QueryStatsIcon sx={{ fontSize: { xs: 24, sm: 28 } }} />,
    points: [
      "Generate daily, weekly, and monthly reports.",
      "Department-based performance analysis.",
      "View KPIs (Present, Absent, Unknown, Cameras Online).",
      "Visual dashboards with charts and summaries.",
    ],
  },
  {
    number: "05",
    title: "Security & Privacy Controls",
    icon: <AdminPanelSettingsIcon sx={{ fontSize: { xs: 24, sm: 28 } }} />,
    points: [
      "Monitor encryption status.",
      "Access audit and system logs.",
      "Manage user consents.",
      "Configure data retention policies.",
    ],
  },
  {
    number: "06",
    title: "System Settings & AI Configuration",
    icon: <SettingsSuggestIcon sx={{ fontSize: { xs: 24, sm: 28 } }} />,
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
                fontSize: { xs: "2rem", sm: "2.75rem", md: "3.5rem" }, 
                fontWeight: 700, 
                mb: 2 
            }}
          >
            Administrator Guide
          </Typography>
          <Typography
            variant="body1"
            sx={{ 
                color: "#f3f2ee", 
                fontSize: { xs: "1rem", sm: "1.25rem" },
                maxWidth: "700px",
                mx: "auto",
                opacity: 0.9
            }}
          >
            Configure system parameters, manage camera feeds, and oversee the entire FaceTrack organization ecosystem.
          </Typography>
        </Container>
      </Box>

      {/* CONTENT SECTION */}
      <Box
        sx={{
          py: { xs: 8, md: 12 },
          background: "linear-gradient(to bottom, #F0F0DB 0%, #E1D9BC 100%)",
        }}
      >
        <Container maxWidth="md" sx={{ position: "relative" }}>
          
          {/* VERTICAL TIMELINE LINE */}
          <Box
            sx={{
              position: "absolute",
              left: { xs: "28px", sm: "36px" },
              top: 0,
              bottom: 0,
              width: "2px",
              background: "linear-gradient(to bottom, #9AA6B0, #6F7B87, transparent)",
            }}
          />

          <Box sx={{ display: "flex", flexDirection: "column", gap: 6 }}>
            {sections.map((section, index) => (
              <Box 
                key={index} 
                sx={{ 
                    display: "flex", 
                    gap: { xs: 3, sm: 6 }, 
                    position: "relative",
                    alignItems: "flex-start" 
                }}
              >
                {/* ICON BADGE */}
                <Box
                  sx={{
                    flexShrink: 0,
                    zIndex: 10,
                    width: { xs: 56, sm: 72 },
                    height: { xs: 56, sm: 72 },
                    borderRadius: "50%",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    background: "linear-gradient(135deg, #3C435C 0%, #8F9AA6 100%)",
                    color: "white",
                    boxShadow: "0 6px 12px rgba(48, 54, 79, 0.2)",
                  }}
                >
                  {section.icon}
                </Box>

                {/* CONTENT CARD */}
                <Box
                  sx={{
                    flex: 1,
                    backgroundColor: "white",
                    borderRadius: "20px",
                    p: { xs: 4, sm: 5 },
                    border: "1px solid #CFC7A8",
                    boxShadow: "0 4px 6px rgba(0,0,0,0.03)",
                    transition: "all 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275)",
                    "&:hover": {
                      boxShadow: "0 15px 35px rgba(0,0,0,0.1)",
                      transform: "translateY(-5px)",
                      borderColor: "#30364F",
                    },
                  }}
                >
                  <Typography
                    variant="h5"
                    sx={{
                      fontWeight: 700,
                      color: "#2F374F",
                      mb: 1,
                      fontSize: { xs: "1.25rem", sm: "1.5rem" },
                    }}
                  >
                    {section.title}
                  </Typography>

                  <Divider sx={{ mb: 3, borderColor: "rgba(0,0,0,0.06)" }} />

                  <Box component="ul" sx={{ pl: 2, m: 0 }}>
                    {section.points.map((point, i) => (
                      <Typography
                        component="li"
                        key={i}
                        variant="body1"
                        sx={{
                          color: "#5F6674",
                          lineHeight: 1.8,
                          mb: 1.5,
                          fontSize: { xs: "0.95rem", sm: "1rem" },
                          "&::marker": { color: "#8F9AA6" }
                        }}
                      >
                        {point}
                      </Typography>
                    ))}
                  </Box>
                </Box>
              </Box>
            ))}
          </Box>
        </Container>
      </Box>
    </Box>
  );
};

export default AdminGuidePage;