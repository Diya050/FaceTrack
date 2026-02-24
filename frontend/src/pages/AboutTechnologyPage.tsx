import React from "react";
import Grid from "@mui/material/Grid";
import {
  Container,
  Typography,
  Box,
  Card,
  CardContent,
  Divider,
} from "@mui/material";
import { motion } from "framer-motion";

const COLORS = {
  dark: "#2E3A59",
  darker: "#1F2A44",
  beige: "#E1D9BC",
  cream: "#F0F0DB",
};

const workflowSteps = [
  "Live Capture",
  "Face Detection",
  "Embedding",
  "Vector Matching",
  "Identity Verification",
];

const techStack = [
  {
    title: "Backend (FastAPI)",
    desc: "Handles API communication and AI model inference.",
  },
  {
    title: "Frontend (React + MUI)",
    desc: "Responsive dashboard built with modern component architecture.",
  },
  {
    title: "Database (PostgreSQL + pgVector)",
    desc: "High-speed vector similarity search for embeddings.",
  },
  {
    title: "OpenCV",
    desc: "Real-time camera feed capture and preprocessing.",
  },
];

const AboutTechnologyPage: React.FC = () => {
  return (
    <Box sx={{ backgroundColor: COLORS.cream }}>

      {/* ================= HERO SECTION ================= */}
      <Box
        sx={{
          background: `radial-gradient(circle at 20% 20%, ${COLORS.dark}, ${COLORS.darker})`,
          color: "white",
          py: { xs: 8, md: 14 },
          textAlign: "center",
        }}
      >
        <Container maxWidth="md">
          <Typography
            variant="h2"
            fontWeight="bold"
            sx={{
              color: COLORS.beige,
              mb: 3,
              fontSize: { xs: "2rem", md: "3.5rem" },
            }}
          >
            About Technology
          </Typography>

          <Typography
            variant="h6"
            sx={{
              opacity: 0.8,
              fontSize: { xs: "1rem", md: "1.25rem" },
            }}
          >
            Discover the AI pipeline powering FaceTrack Recognition System
          </Typography>
        </Container>
      </Box>

      {/* ================= MAIN CONTENT ================= */}
      <Container maxWidth="lg" sx={{ py: { xs: 6, md: 12 } }}>

        {/* ================= SYSTEM WORKFLOW ================= */}

<Typography
  variant="h4"
  fontWeight="bold"
  sx={{
    color: COLORS.dark,
    fontSize: { xs: "1.6rem", md: "2rem" },
  }}
>
  System Workflow
</Typography>

<Divider sx={{ mb: { xs: 6, md: 8 } }} />

<motion.div
  initial="hidden"
  whileInView="visible"
  viewport={{ once: true, amount: 0.3 }}
  variants={{
    visible: {
      transition: { staggerChildren: 0.35 },
    },
  }}
>
  <Box
    sx={{
      display: "flex",
      flexDirection: { xs: "column", md: "row" },
      alignItems: "center",
      justifyContent: "center",
      gap: { xs: 1.5, md: 2 },
      mb: { xs: 8, md: 12 },
    }}
  >
    {workflowSteps.map((step, index) => (
      <React.Fragment key={index}>

        {/* TILE */}
        <motion.div
          variants={{
            hidden: { opacity: 0, y: 30, scale: 0.95 },
            visible: { opacity: 1, y: 0, scale: 1 },
          }}
          transition={{ duration: 0.5 }}
          style={{ width: "100%", display: "flex", justifyContent: "center" }}
        >
          <Box
            sx={{
              width: {
                xs: "92%",
                sm: "80%",
                md: 220,
              },

              height: {
                xs: 75,
                md: 100,
              },

              borderRadius: 3,
              backgroundColor: "#ACBAC4",
              color: COLORS.dark,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              textAlign: "center",
              fontWeight: 600,

              fontSize: {
                xs: 15,
                md: 16,
              },

              px: 2,

              boxShadow: "0 6px 18px rgba(0,0,0,0.12)",
              transition: "all 0.3s ease",

              "&:hover": {
                transform: { md: "translateY(-6px)" },
                backgroundColor: "#97A9B5",
              },
            }}
          >
            {step}
          </Box>
        </motion.div>

        {/* ARROW */}
        {index !== workflowSteps.length - 1 && (
          <motion.div
            variants={{
              hidden: { opacity: 0, scale: 0.8 },
              visible: { opacity: 1, scale: 1 },
            }}
            transition={{ duration: 0.4 }}
          >
            <Box
              sx={{
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                my: { xs: 0.5, md: 0 },
              }}
            >
              {/* Desktop Arrow */}
              <Box sx={{ display: { xs: "none", md: "block" } }}>
                <motion.span
                  animate={{ x: [0, 6, 0] }}
                  transition={{
                    repeat: Infinity,
                    duration: 1.2,
                    ease: "easeInOut",
                  }}
                >
                  <Box
                    component="span"
                    sx={{
                      fontSize: 24,
                      color: COLORS.dark,
                    }}
                  >
                    →
                  </Box>
                </motion.span>
              </Box>

              {/* Mobile Arrow */}
              <Box sx={{ display: { xs: "block", md: "none" } }}>
                <motion.span
                  animate={{ y: [0, 6, 0] }}
                  transition={{
                    repeat: Infinity,
                    duration: 1.2,
                    ease: "easeInOut",
                  }}
                >
                  <Box
                    component="span"
                    sx={{
                      fontSize: 26,
                      color: COLORS.dark,
                    }}
                  >
                    ↓
                  </Box>
                </motion.span>
              </Box>
            </Box>
          </motion.div>
        )}

      </React.Fragment>
    ))}
  </Box>
</motion.div>

        {/* ================= AI MODELS ================= */}

        <Typography
          variant="h4"
          fontWeight="bold"
          sx={{ color: COLORS.dark, fontSize: { xs: "1.6rem", md: "2rem" } }}
        >
          AI Models Used
        </Typography>
        <Divider sx={{ mb: 6 }} />

        <Grid
  container
  spacing={4}
  justifyContent="center"
  sx={{ mb: 12 }}
>
  {[
    {
      title: "RetinaFace",
      desc: "High precision real-time face detection model.",
    },
    {
      title: "ArcFace",
      desc: "Generates highly discriminative facial embeddings.",
    },
    {
      title: "Cosine Similarity",
      desc: "Secure vector comparison using threshold similarity.",
    },
  ].map((model, index) => (
    <Grid
      key={index}
      size={{ xs: 12, sm: 6, md: 4 }}   // 👈 forces 3 in one row on desktop
      sx={{ display: "flex" }}
    >
      <motion.div whileHover={{ y: -8 }} style={{ width: "100%" }}>
        <Card
          sx={{
            width: "100%",
            borderRadius: 4,
            boxShadow: "0 10px 30px rgba(0,0,0,0.08)",
            p: 3,
          }}
        >
          <CardContent>
            <Typography
              variant="h6"
              fontWeight="bold"
              gutterBottom
              sx={{ color: COLORS.dark }}
            >
              {model.title}
            </Typography>
            <Typography variant="body2">
              {model.desc}
            </Typography>
          </CardContent>
        </Card>
      </motion.div>
    </Grid>
  ))}
</Grid>

        {/* ================= TECH STACK ================= */}

        <Typography
          variant="h4"
          fontWeight="bold"
          sx={{ color: COLORS.dark, fontSize: { xs: "1.6rem", md: "2rem" } }}
        >
          Tech Stack
        </Typography>
        <Divider sx={{ mb: 6 }} />

       <Grid container spacing={5} sx={{ mt: 2 }}>
  {techStack.map((tech, index) => (
    <Grid key={index} size={{ xs: 12, md: 6 }}>
      <Box
        sx={{
          borderRadius: 3,
          backgroundColor: COLORS.dark,
          color: "white",
          height: 110,
          position: "relative",
          overflow: "hidden",
          cursor: "pointer",
          transition: "all 0.35s cubic-bezier(0.4, 0, 0.2, 1)",
          boxShadow: "0 6px 18px rgba(0,0,0,0.12)",

          "&:hover": {
            transform: "translateY(-8px)",
            boxShadow: "0 18px 35px rgba(0,0,0,0.25)",
          },

          "&:hover .title": {
            opacity: 0,
            transform: "translateY(-10px)",
          },

          "&:hover .overlay": {
            opacity: 1,
          },

          "&:hover .desc": {
            opacity: 1,
            transform: "translateY(0)",
          },
        }}
      >
        {/* TITLE */}
        <Box
          className="title"
          sx={{
            position: "absolute",
            inset: 0,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            textAlign: "center",
            px: 4,
            transition: "all 0.3s ease",
          }}
        >
          <Typography fontWeight={600} fontSize={16}>
            {tech.title}
          </Typography>
        </Box>

        {/* FULL SOLID OVERLAY */}
        <Box
          className="overlay"
          sx={{
            position: "absolute",
            inset: 0,
            backgroundColor: COLORS.darker, // fully solid
            opacity: 0,
            transition: "opacity 0.35s ease",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            px: 4,
          }}
        >
          <Typography
            className="desc"
            sx={{
              fontSize: 14,
              color: COLORS.beige,
              textAlign: "center",
              opacity: 0,
              transform: "translateY(10px)",
              transition: "all 0.35s ease",
            }}
          >
            {tech.desc}
          </Typography>
        </Box>
      </Box>
    </Grid>
  ))}
</Grid>

      </Container>
    </Box>
  );
};

export default AboutTechnologyPage;