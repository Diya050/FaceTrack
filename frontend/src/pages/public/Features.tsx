"use client";
import type { Variants } from "framer-motion";
import { motion } from "framer-motion";
import {
  ScanFace,
  Monitor,
  Camera,
  Users,
  UserPlus,
  BarChart3,
  Bell,
  Calendar,
  Shield,
  LayoutDashboard,
  Cloud,
  Plug,
} from "lucide-react";
import { Box, Typography, Container, Paper } from "@mui/material";
import Grid from "@mui/material/Grid";

type Feature = {
  title: string;
  desc: string;
  icon: React.ReactNode;
};

const features: Feature[] = [
  { title: "Face Recognition Attendance", desc: "AI-powered real-time facial recognition to automatically detect and mark attendance with high accuracy and zero manual effort.", icon: <ScanFace size={34} /> },
  { title: "Live Camera Monitoring", desc: "Monitor multiple live camera feeds in real time with intelligent face detection overlays and instant alerts.", icon: <Monitor size={34} /> },
  { title: "Multi-Camera Support", desc: "Seamlessly connect and manage CCTV, IP cameras, webcams, and RTSP video streams from a single dashboard.", icon: <Camera size={34} /> },
  { title: "User & Admin Roles", desc: "Role-based access system with separate dashboards for admins, managers, and users to ensure secure control.", icon: <Users size={34} /> },
  { title: "Face Enrollment System", desc: "Easy and secure face registration using image uploads or live camera capture for accurate identification.", icon: <UserPlus size={34} /> },
  { title: "Attendance Reports & Analytics", desc: "Generate detailed daily, weekly, and monthly attendance reports with visual charts and export options.", icon: <BarChart3 size={34} /> },
  { title: "Real-Time Alerts & Notifications", desc: "Instant alerts for unauthorized access, unknown faces, late arrivals, and absentee tracking.", icon: <Bell size={34} /> },
  { title: "Shift & Schedule Management", desc: "Flexible shift scheduling system to handle multiple shifts, working hours, and attendance rules.", icon: <Calendar size={34} /> },
  { title: "Data Security & Privacy", desc: "End-to-end encryption, secure storage, and compliance with data privacy and protection standards.", icon: <Shield size={34} /> },
  { title: "Smart Dashboard", desc: "Modern real-time dashboard providing attendance insights, system health monitoring, and analytics overview.", icon: <LayoutDashboard size={34} /> },
  { title: "Scalable Cloud Architecture", desc: "Highly scalable backend architecture with cloud deployment support and GPU acceleration.", icon: <Cloud size={34} /> },
  { title: "API & System Integration", desc: "Easy integration with ERP, HR, payroll, and third-party systems using secure APIs.", icon: <Plug size={34} /> },
];

const container: Variants = {
  hidden: {},
  show: { transition: { staggerChildren: 0.08 } },
};

const item: Variants = {
  hidden: { opacity: 0, y: 30 },
  show: { opacity: 1, y: 0, transition: { duration: 0.45, ease: [0.25, 0.1, 0.25, 1] } },
};

export default function Features() {
  return (
    <Box component="section" sx={{ width: "100%" }}>
      {/* Hero Band */}
      <Box
        sx={{
          background: "linear-gradient(to right, #343B55, #3C435C)",
          py: 8,
          px: 3,
          textAlign: "center",
          boxShadow: "inset 0 2px 4px rgba(0,0,0,0.1)",
        }}
      >
        <Typography
          variant="h2"
          sx={{
            fontSize: { xs: "2.5rem", md: "3rem" },
            fontWeight: 800,
            color: "#ffffff",
          }}
        >
          FaceTrack Features
        </Typography>
        <Typography
          sx={{
            mt: 2,
            maxW: "600px",
            mx: "auto",
            fontSize: "1.125rem",
            color: "#f3f3f1",
          }}
        >
          Designed for simplicity. Engineered for performance.
        </Typography>
      </Box>

      {/* Content Area */}
      <Box
        sx={{
          py: 8,
          px: 3,
          background: "linear-gradient(to bottom, #F0F0DB, #E1D9BC)",
        }}
      >
        <Container maxWidth="lg">
          <motion.div
            variants={container}
            initial="hidden"
            whileInView="show"
            viewport={{ once: true }}
          >
            <Grid container spacing={4}>
              {features.map((feature, i) => (
                <Grid size={{ xs: 12, sm: 6, lg: 4 }} key={i}>
                  <FeatureCard {...feature} />
                </Grid>
              ))}
            </Grid>
          </motion.div>
        </Container>
      </Box>
    </Box>
  );
}

function FeatureCard({ title, desc, icon }: Feature) {
  return (
    <motion.div variants={item} whileHover={{ y: -10 }}>
      <Paper
        elevation={0}
        sx={{
          position: "relative",
          height: "100%",
          p: 4,
          textAlign: { xs: "center", sm: "left" },
          borderRadius: "16px",
          border: "1px solid #CFC7A8",
          bgcolor: "white",
          transition: "all 0.3s ease-in-out",
          cursor: "default",
          "&:hover": {
            boxShadow: "0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)",
            transform: "translateY(-4px)",
            // Trigger visibility of corner accents
            "& .corner-accent": {
              opacity: 1,
            },
            "& .icon-box": {
              transform: "scale(1.05)",
            },
          },
        }}
      >
        {/* Top-Right Corner Accent */}
        <Box
          className="corner-accent"
          sx={{
            position: "absolute",
            top: 16,
            right: 16,
            width: 24,
            height: 24,
            borderTop: "2px solid #C9C1A6",
            borderRight: "2px solid #C9C1A6",
            opacity: 0,
            transition: "opacity 0.3s ease",
            pointerEvents: "none",
          }}
        />

        {/* Bottom-Left Corner Accent */}
        <Box
          className="corner-accent"
          sx={{
            position: "absolute",
            bottom: 16,
            left: 16,
            width: 24,
            height: 24,
            borderBottom: "2px solid #C9C1A6",
            borderLeft: "2px solid #C9C1A6",
            opacity: 0,
            transition: "opacity 0.3s ease",
            pointerEvents: "none",
          }}
        />

        {/* Icon Box */}
        <Box
          className="icon-box"
          sx={{
            width: 56,
            height: 56,
            mb: 3,
            mx: { xs: "auto", sm: "0" },
            borderRadius: "12px",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            color: "white",
            background: "linear-gradient(to bottom right, #3a4572, #387098)",
            transition: "transform 0.3s ease",
          }}
        >
          {icon}
        </Box>

        <Typography
          variant="h6"
          sx={{
            fontWeight: 600,
            color: "#2F374F",
            mb: 1,
          }}
        >
          {title}
        </Typography>

        <Typography
          sx={{
            color: "#5F6674",
            lineHeight: 1.6,
            fontSize: "0.875rem",
          }}
        >
          {desc}
        </Typography>
      </Paper>
    </motion.div>
  );
}