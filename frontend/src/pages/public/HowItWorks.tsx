"use client";
import type { Variants } from "framer-motion";
import { motion } from "framer-motion";
import {
    Box,
    Typography,
    Container,
    Paper,
    Avatar
} from '@mui/material';
import Grid from '@mui/material/Grid';

type Step = {
    number: string;
    title: string;
    image: string;
    description: string;
};

const steps: Step[] = [
    { number: "01", title: "User Registration", image: "/HowItWorks/userRegister.png", description: "Users register on the FaceTrack platform by submitting their personal details such as name, ID, role, and department. This creates a secure digital identity within the system." },
    { number: "02", title: "Admin Verification & Approval", image: "/HowItWorks/adminApproval.png", description: "Administrators verify user information and approve registrations to ensure secure access control. Only verified users can proceed for facial enrollment and attendance services." },
    { number: "03", title: "Facial Enrollment & Data Processing", image: "/HowItWorks/enrollment.png", description: "Approved users enroll their face using live camera capture. The AI model extracts facial features and generates a secure 512-dimensional embedding vector, uniquely representing the user." },
    { number: "04", title: "Real-Time Face Detection & Matching", image: "/HowItWorks/recognition.png", description: "Live cameras continuously scan video streams to detect faces. Detected embeddings are compared against stored embeddings using cosine similarity for high-accuracy recognition." },
    { number: "05", title: "Automated Attendance Logging", image: "/HowItWorks/attendance.png", description: "Upon successful identity verification, attendance is automatically marked with precise timestamps, camera source details, and confidence scores, eliminating manual effort and proxy attendance." },
    { number: "06", title: "Smart Notifications & Alerts", image: "/HowItWorks/alerts.png", description: "The system instantly notifies administrators about unauthorized access, unknown faces, late arrivals, and absentee patterns, ensuring proactive security and monitoring." },
    { number: "07", title: "Analytics, Reports & Insights", image: "/HowItWorks/analytics.png", description: "Comprehensive attendance reports are generated with intelligent filters for weekly, monthly, and quarterly analysis, providing deep insights into workforce efficiency and trends." },
];

// Animation Variants
const containerVariants: Variants = {
    hidden: {},
    show: {
        transition: {
            staggerChildren: 0.15, // Delay between each card appearing
        },
    },
};

const itemVariants: Variants = {
    hidden: { opacity: 0, x: -20 }, // Slide in slightly from the left
    show: {
        opacity: 1,
        x: 0,
        transition: {
            duration: 0.5,
            ease: "easeOut"
        }
    },
};

export default function HowItWorks() {
    return (
        <Box component="section" sx={{ width: '100%' }}>

            {/* HERO SECTION */}
            <Box
                sx={{
                    background: 'linear-gradient(to right, #343B55, #3C435C)',
                    py: { xs: 6, sm: 8, md: 9 },
                    px: 3,
                    textAlign: 'center'
                }}
            >
                <Typography
                    variant="h2"
                    sx={{
                        fontSize: { xs: '1.875rem', sm: '2.25rem', md: '3rem' },
                        fontWeight: 700,
                        color: '#ffffff'
                    }}
                >
                    How FaceTrack Works
                </Typography>
                <Typography
                    sx={{
                        mt: { xs: 2, sm: 3 },
                        fontSize: { xs: '1rem', sm: '1.125rem' },
                        color: '#f3f2ee',
                        maxWidth: '768px',
                        mx: 'auto'
                    }}
                >
                    A seamless AI-powered experience that transforms how organizations track presence, ensure security, and understand their workforce.
                </Typography>
            </Box>

            {/* CONTENT SECTION */}
            <Box
                sx={{
                    py: { xs: 5, sm: 5 },
                    px: { xs: 2, sm: 3, md: 5 },
                    background: 'linear-gradient(to bottom, #F0F0DB, #E1D9BC)',
                    position: 'relative'
                }}
            >
                <Container maxWidth="lg" sx={{ position: 'relative' }}>


                    {/* Animated List Container */}
                    <Box
                        component={motion.div}
                        variants={containerVariants}
                        initial="hidden"
                        whileInView="show"
                        viewport={{ once: true, amount: 0.1 }} // Animates when 10% of section is visible
                        sx={{ display: 'flex', flexDirection: 'column', gap: { xs: 4, sm: 4 } }}
                    >


                        {steps.map((step) => (
                            <Box
                                key={step.number}
                                component={motion.div}
                                variants={itemVariants}
                                sx={{ display: 'flex', gap: { xs: 2, sm: 3 }, position: 'relative' }}
                            >

                                {/* TIMELINE VERTICAL LINE */}
                                <Box
                                    sx={{
                                        position: 'absolute',
                                        left: { xs: '20px', sm: '28px' },
                                        top: 0,
                                        bottom: 0,
                                        width: '2px',
                                        background: 'linear-gradient(to bottom, #9AA6B0, #6F7B87, transparent)'
                                    }}
                                />

                                {/* BADGE NUMBER */}
                                <Avatar
                                    sx={{
                                        zIndex: 10,
                                        width: { xs: 44, sm: 56 },
                                        height: { xs: 44, sm: 56 },
                                        background: 'linear-gradient(135deg, #3C435C, #8F9AA6)',
                                        fontSize: { xs: '0.875rem', sm: '1rem' },
                                        fontWeight: 600,
                                        boxShadow: 2
                                    }}
                                >
                                    {step.number}
                                </Avatar>

                                {/* CARD */}
                                <Paper
                                    elevation={1}
                                    sx={{
                                        flex: 1,
                                        borderRadius: '16px',
                                        bgcolor: 'white',
                                        border: '1px solid #CFC7A8',
                                        p: { xs: 4, sm: 4 },
                                        transition: 'all 0.3s ease',
                                        '&:hover': {
                                            boxShadow: 8,
                                            transform: 'translateY(-2px)'
                                        }
                                    }}
                                >
                                    <Grid container spacing={3} alignItems="center">
                                        <Grid size={{ xs: 12, md: 4 }} sx={{ display: 'flex', justifyContent: 'center' }}>
                                            <Box
                                                component="img"
                                                src={step.image}
                                                alt={step.title}
                                                sx={{
                                                    height: { xs: 120, sm: 136, md: 152 },
                                                    width: 'auto',
                                                    objectFit: 'contain'
                                                }}
                                            />
                                        </Grid>

                                        <Grid size={{ xs: 12, md: 8 }} sx={{ textAlign: { xs: 'center', md: 'left' } }}>
                                            <Typography
                                                variant="h3"
                                                sx={{
                                                    fontSize: { xs: '1.125rem', sm: '1.25rem', md: '1.5rem' },
                                                    fontWeight: 600,
                                                    color: '#2F374F'
                                                }}
                                            >
                                                {step.title}
                                            </Typography>
                                            <Typography
                                                sx={{
                                                    mt: 2,
                                                    fontSize: { xs: '0.875rem', sm: '1rem' },
                                                    color: '#5F6674',
                                                    lineHeight: 1.6
                                                }}
                                            >
                                                {step.description}
                                            </Typography>
                                        </Grid>
                                    </Grid>
                                </Paper>
                            </Box>
                        ))}
                    </Box>
                </Container>
            </Box>
        </Box>
    );
}