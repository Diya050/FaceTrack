import React from "react";
import { Box, Container, Typography, Divider } from "@mui/material";
// Icons for Terms & Compliance
import CorporateFareIcon from '@mui/icons-material/CorporateFare';
import BlockIcon from '@mui/icons-material/Block';
import GppGoodIcon from '@mui/icons-material/GppGood';
import FingerprintIcon from '@mui/icons-material/Fingerprint';
import VisibilityIcon from '@mui/icons-material/Visibility';
import AssignmentTurnedInIcon from '@mui/icons-material/AssignmentTurnedIn';
import HistoryEduIcon from '@mui/icons-material/HistoryEdu';

const sections = [
  {
    number: "01",
    title: "Organizational Use Only",
    icon: <CorporateFareIcon sx={{ fontSize: { xs: 24, sm: 28 } }} />,
    content:
      "FaceTrack is intended strictly for internal use within the organization for which it is deployed. The system may only be used for attendance management and related administrative operations authorized by the organization.",
  },
  {
    number: "02",
    title: "No Commercial Usage",
    icon: <BlockIcon sx={{ fontSize: { xs: 24, sm: 28 } }} />,
    content:
      "The FaceTrack system may not be resold, redistributed, licensed, or used for independent commercial purposes without explicit written authorization.",
  },
  {
    number: "03",
    title: "Account Responsibility & Security",
    icon: <GppGoodIcon sx={{ fontSize: { xs: 24, sm: 28 } }} />,
    content:
      "Users are responsible for maintaining the confidentiality of login credentials. Sharing passwords or forwarding authentication emails is strictly prohibited.",
  },
  {
    number: "04",
    title: "Biometric Data & Attendance Control",
    icon: <FingerprintIcon sx={{ fontSize: { xs: 24, sm: 28 } }} />,
    content:
      "The system processes facial data solely for attendance verification. Administrators retain authority to review and modify attendance records as per organizational policies.",
  },
  {
    number: "05",
    title: "Proper Conduct During Capture",
    icon: <VisibilityIcon sx={{ fontSize: { xs: 24, sm: 28 } }} />,
    content:
      "Users must ensure proper visibility during recognition. Any attempt to manipulate attendance or bypass the AI recognition process may result in disciplinary action.",
  },
  {
    number: "06",
    title: "Compliance & Consent",
    icon: <AssignmentTurnedInIcon sx={{ fontSize: { xs: 24, sm: 28 } }} />,
    content:
      "By using FaceTrack, users consent to the collection and processing of biometric data for attendance management purposes in line with local privacy laws.",
  },
  {
    number: "07",
    title: "System Monitoring & Audit",
    icon: <HistoryEduIcon sx={{ fontSize: { xs: 24, sm: 28 } }} />,
    content:
      "All system activities may be logged and reviewed for security, audit, and compliance purposes to ensure the integrity of the organization's records.",
  },
];

const TermsOfUsePage: React.FC = () => {
  return (
    <Box sx={{ width: "100%", minHeight: "100vh" }}>
      
      {/* HERO SECTION - FaceTrack Brand Gradient */}
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
            Terms of Use
          </Typography>
          <Typography
            variant="body1"
            sx={{ 
                color: "#f3f2ee", 
                fontSize: { xs: "1rem", sm: "1.25rem" },
                maxWidth: "650px",
                mx: "auto",
                opacity: 0.9
            }}
          >
            Please read these terms carefully before using FaceTrack. These guidelines ensure a secure and fair environment for all users.
          </Typography>
        </Container>
      </Box>

      {/* CONTENT SECTION - Cream Timeline Background */}
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
                      mb: 2,
                      fontSize: { xs: "1.2rem", sm: "1.4rem" },
                    }}
                  >
                    {section.title}
                  </Typography>

                  <Divider sx={{ mb: 2, borderColor: "rgba(0,0,0,0.06)" }} />

                  <Typography
                    variant="body1"
                    sx={{
                      color: "#5F6674",
                      lineHeight: 1.8,
                      fontSize: { xs: "0.95rem", sm: "1rem" },
                    }}
                  >
                    {section.content}
                  </Typography>
                </Box>
              </Box>
            ))}
          </Box>
        </Container>
      </Box>
    </Box>
  );
};

export default TermsOfUsePage;