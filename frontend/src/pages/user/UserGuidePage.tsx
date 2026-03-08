import React from "react";
import { Box, Container, Typography, Divider } from "@mui/material";
// Icons for visual representation
import DashboardIcon from "@mui/icons-material/Dashboard";
import CalendarMonthIcon from "@mui/icons-material/CalendarMonth";
import EditNoteIcon from "@mui/icons-material/EditNote";
import AssessmentIcon from "@mui/icons-material/Assessment";
import NotificationsActiveIcon from "@mui/icons-material/NotificationsActive";

const sections = [
  {
    number: "01",
    title: "Dashboard Overview",
    icon: <DashboardIcon sx={{ fontSize: { xs: 24, sm: 28 } }} />,
    points: [
      "View your attendance summary and statistics.",
      "Check total present, absent, and late records.",
      "Monitor recent activity and notifications.",
    ],
  },
  {
    number: "02",
    title: "Viewing Attendance Records",
    icon: <CalendarMonthIcon sx={{ fontSize: { xs: 24, sm: 28 } }} />,
    points: [
      "Access detailed attendance history.",
      "Filter records by date range (daily, weekly, monthly).",
      "View recognition method used (Face / Face + Voice).",
    ],
  },
  {
    number: "03",
    title: "Attendance Correction Requests",
    icon: <EditNoteIcon sx={{ fontSize: { xs: 24, sm: 28 } }} />,
    points: [
      "Submit correction requests for incorrect entries.",
      "Provide reason and supporting details.",
      "Track request status (Pending / Approved / Rejected).",
    ],
  },
  {
    number: "04",
    title: "Reports & Insights",
    icon: <AssessmentIcon sx={{ fontSize: { xs: 24, sm: 28 } }} />,
    points: [
      "Generate personal attendance reports.",
      "Download reports when permitted.",
      "Review summarized attendance patterns.",
    ],
  },
  {
    number: "05",
    title: "Live Alerts & Notifications",
    icon: <NotificationsActiveIcon sx={{ fontSize: { xs: 24, sm: 28 } }} />,
    points: [
      "Receive real-time attendance confirmation alerts.",
      "View system notifications related to attendance.",
      "Mark notifications as read.",
    ],
  },
];

const UserGuidePage: React.FC = () => {
  return (
    <Box sx={{ width: "100%", minHeight: "100vh", mt:7 }}>
      
      {/* HERO SECTION - Deep Navy Gradient */}
      <Box
        sx={{
          background: "linear-gradient(90deg, #343B55 0%, #3C435C 100%)",
          py: { xs: 6, md: 8 },
          px: 4,
          textAlign: "center",
          color: "white",
        }}
      >
        <Container maxWidth="md">
          <Typography 
            variant="h5" 
            sx={{ 
                fontSize: { xs: "2rem", sm: "2.75rem", md: "3.5rem" }, 
                fontWeight: 700, 
                mb: 2 
            }}
          >
            Authorized User Guide
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
            A comprehensive guide to help you manage your presence, track your history, and stay updated with FaceTrack.
          </Typography>
        </Container>
      </Box>

      {/* CONTENT SECTION - Cream Background with Timeline */}
      <Box
        sx={{
          py: { xs: 8, md: 6 },
          background: "linear-gradient(to bottom, #F0F0DB 0%, #E1D9BC 100%)",
        }}
      >
        <Container maxWidth="md" sx={{ position: "relative" }}>
          
          {/* VERTICAL TIMELINE LINE */}
          <Box
            sx={{
              position: "absolute",
              left: { xs: "32px", sm: "59px" },
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
                    p: { xs: 4, sm: 4 },
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
                      mb: 2,
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

export default UserGuidePage;