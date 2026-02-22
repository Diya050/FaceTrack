import React from "react";
import { Container, Typography, Box, Paper, Divider } from "@mui/material";

const sections = [
  {
    title: "1. Organizational Use Only",
    content:
      "FaceTrack is intended strictly for internal use within the organization for which it is deployed. The system may only be used for attendance management and related administrative operations authorized by the organization.",
  },
  {
    title: "2. No Commercial Usage",
    content:
      "The FaceTrack system, including its software, biometric processing capabilities, and reporting tools, may not be resold, redistributed, licensed, or used for independent commercial purposes without explicit written authorization from the organization or system owner.",
  },
  {
    title: "3. Account Responsibility & Security",
    content:
      "Users are solely responsible for maintaining the confidentiality of their login credentials. Sharing passwords, forwarding authentication emails, or distributing secure access links is strictly prohibited. Any activity performed under a registered account will be considered the responsibility of the account holder.",
  },
  {
    title: "4. Biometric Data & Attendance Control",
    content:
      "The system processes facial data (and optional voice data) solely for attendance verification purposes. All attendance records are automatically generated upon successful recognition. Administrators retain full authority to review, modify, approve, or reject attendance records in accordance with organizational policies.",
  },
  {
    title: "5. Proper Conduct During Attendance Capture",
    content:
      "Users must ensure their face is clearly visible during recognition. Any attempt to manipulate the system, including hiding behind another individual or allowing another person to bypass recognition, may result in disciplinary action. Users are liable for misconduct occurring under their presence if intentional concealment or facilitation is proven.",
  },
  {
    title: "6. Compliance & Consent",
    content:
      "By using FaceTrack, users acknowledge and consent to the collection and processing of biometric data for attendance management. The system operates in accordance with defined data retention, privacy, and security policies established by the organization.",
  },
  {
    title: "7. System Monitoring & Audit",
    content:
      "All system activities may be logged for security, audit, and compliance purposes. Administrators may review access logs, recognition events, and attendance modifications to ensure system integrity.",
  },
];

const TermsOfUsePage: React.FC = () => {
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
        Terms of Use
      </Typography>

      <Typography
        variant="body1"
        sx={{
          color: "#30364F",
          opacity: 0.8,
          mb: 6,
          maxWidth: "850px",
        }}
      >
        These Terms of Use govern access to and usage of the FaceTrack Video
        Stream Attendance Management System. By accessing or using this
        system, you agree to comply with the following conditions.
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

            <Typography
              variant="body2"
              sx={{
                color: "#30364F",
                opacity: 0.9,
                lineHeight: 1.8,
              }}
            >
              {section.content}
            </Typography>
          </Paper>
        ))}
      </Box>
    </Container>
  );
};

export default TermsOfUsePage;