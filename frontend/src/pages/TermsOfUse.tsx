import React from "react";
import {
  Box,
  Container,
  Typography,
  Paper,
  Divider,
} from "@mui/material";

const sections = [
  {
    title: "1. Organizational Use Only",
    content:
      "FaceTrack is intended strictly for internal use within the organization for which it is deployed. The system may only be used for attendance management and related administrative operations authorized by the organization.",
  },
  {
    title: "2. No Commercial Usage",
    content:
      "The FaceTrack system may not be resold, redistributed, licensed, or used for independent commercial purposes without explicit written authorization.",
  },
  {
    title: "3. Account Responsibility & Security",
    content:
      "Users are responsible for maintaining the confidentiality of login credentials. Sharing passwords or forwarding authentication emails is strictly prohibited.",
  },
  {
    title: "4. Biometric Data & Attendance Control",
    content:
      "The system processes facial data solely for attendance verification. Administrators retain authority to review and modify attendance records as per organizational policies.",
  },
  {
    title: "5. Proper Conduct During Attendance Capture",
    content:
      "Users must ensure proper visibility during recognition. Any attempt to manipulate attendance may result in disciplinary action.",
  },
  {
    title: "6. Compliance & Consent",
    content:
      "By using FaceTrack, users consent to the collection and processing of biometric data for attendance management purposes.",
  },
  {
    title: "7. System Monitoring & Audit",
    content:
      "All system activities may be logged and reviewed for security, audit, and compliance purposes.",
  },
];

const TermsOfUsePage: React.FC = () => {
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
            Terms of Use
          </Typography>

          <Typography
            variant="h6"
            sx={{ color: "rgb(172, 186, 196)" }}
          >
            Please read these terms carefully before using FaceTrack.
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
                border: "1px solid rgba(48, 54, 79, 0.08)",
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
                  borderColor: "rgb(172, 186, 196)",
                }}
              />

              <Typography
                variant="body1"
                sx={{
                  color: "#30364F",
                  lineHeight: 1.8,
                }}
              >
                {section.content}
              </Typography>
            </Paper>
          ))}
        </Container>
      </Box>
    </Box>
  );
};

export default TermsOfUsePage;