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

type Feature = {
    title: string;
    desc: string;
    icon: React.ReactNode;
};

const features: Feature[] = [
    {   title: "Face Recognition Attendance", 
        desc: "AI-powered real-time facial recognition to automatically detect and mark attendance with high accuracy and zero manual effort.", 
        icon: <ScanFace size={34} /> 
    },
    {   title: "Live Camera Monitoring", 
        desc: "Monitor multiple live camera feeds in real time with intelligent face detection overlays and instant alerts.", 
        icon: <Monitor size={34} /> 
    },
    {   title: "Multi-Camera Support", 
        desc: "Seamlessly connect and manage CCTV, IP cameras, webcams, and RTSP video streams from a single dashboard.", 
        icon: <Camera size={34} /> 
    },
    {   title: "User & Admin Roles", 
        desc: "Role-based access system with separate dashboards for admins, managers, and users to ensure secure control.", 
        icon: <Users size={34} /> 
    },
    {   title: "Face Enrollment System", 
        desc: "Easy and secure face registration using image uploads or live camera capture for accurate identification.", 
        icon: <UserPlus size={34} /> 
    },
    {   title: "Attendance Reports & Analytics", 
        desc: "Generate detailed daily, weekly, and monthly attendance reports with visual charts and export options.", 
        icon: <BarChart3 size={34} /> 
    },
    {   title: "Real-Time Alerts & Notifications", 
        desc: "Instant alerts for unauthorized access, unknown faces, late arrivals, and absentee tracking.", 
        icon: <Bell size={34} /> 
    },
    {   title: "Shift & Schedule Management", 
        desc: "Flexible shift scheduling system to handle multiple shifts, working hours, and attendance rules.", 
        icon: <Calendar size={34} /> 
    },
    {   title: "Data Security & Privacy", 
        desc: "End-to-end encryption, secure storage, and compliance with data privacy and protection standards.", 
        icon: <Shield size={34} /> 
    },
    {   title: "Smart Dashboard", 
        desc: "Modern real-time dashboard providing attendance insights, system health monitoring, and analytics overview.", 
        icon: <LayoutDashboard size={34} /> 
    },
    {   title: "Scalable Cloud Architecture", 
        desc: "Highly scalable backend architecture with cloud deployment support and GPU acceleration.", 
        icon: <Cloud size={34} /> 
    },
    {   title: "API & System Integration", 
        desc: "Easy integration with ERP, HR, payroll, and third-party systems using secure APIs.", 
        icon: <Plug size={34} /> 
    },
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
        <section className="w-full">

            {/* Hero Band */}
            <div className="bg-gradient-to-r from-[#343B55] to-[#3C435C] py-16 px-6 text-center shadow-inner">
                <h2 className="text-5xl font-extrabold text-[#ffffff]">
                    FaceTrack Features
                </h2>
                <p className="mt-4 max-w-2xl mx-auto text-lg text-[#f3f3f1]">
                    Designed for simplicity. Engineered for performance.
                </p>
            </div>

            {/* Content Area */}
            <div className="py-12 px-6 bg-gradient-to-b from-[#F0F0DB] to-[#F0F0DB]">
                <div className="max-w-6xl mx-auto">

                    <motion.div
                        variants={container}
                        initial="hidden"
                        whileInView="show"
                        viewport={{ once: true }}
                        className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3"
                    >
                        {features.map((feature, i) => (
                            <FeatureCard key={i} {...feature} />
                        ))}
                    </motion.div>

                </div>
            </div>
        </section>
    );
}

function FeatureCard({ title, desc, icon }: Feature) {
    return (
        <motion.div variants={item} whileHover={{ y: -10 }} className="group relative">
            <div
                className="
                relative h-full rounded-2xl p-7 text-center sm:text-left
                border border-[#CFC7A8]
                bg-white
                shadow-sm
                transition-all duration-300
                group-hover:shadow-2xl
                group-hover:-translate-y-1
                "
            >
                <span className="pointer-events-none absolute top-4 right-4 w-6 h-6 border-t-2 border-r-2 border-[#C9C1A6] opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                <span className="pointer-events-none absolute bottom-4 left-4 w-6 h-6 border-b-2 border-l-2 border-[#C9C1A6] opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

                <div className="w-14 h-14 mb-5 mx-auto sm:mx-0 rounded-xl flex items-center justify-center text-white bg-gradient-to-br from-[#3a4572] to-[#387098] group-hover:scale-105 transition-transform">
                    {icon}
                </div>

                <h3 className="text-xl font-semibold text-[#2F374F]">
                    {title}
                </h3>

                <p className="mt-2 text-[#5F6674] leading-relaxed text-sm">
                    {desc}
                </p>
            </div>
        </motion.div>
    );
}