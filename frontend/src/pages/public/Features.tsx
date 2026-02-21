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
    gradient: string;
    hoverGradient: string;
    corner: string;
};

const features: Feature[] = [
    {
        title: "Face Recognition Attendance",
        desc: "AI-powered real-time facial recognition to automatically detect and mark attendance with high accuracy and zero manual effort.",
        icon: <ScanFace size={37} />,
        gradient: "from-blue-500 to-cyan-500",
        hoverGradient: "from-blue-50 to-cyan-50",
        corner: "border-blue-200",
    },
    {
        title: "Live Camera Monitoring",
        desc: "Monitor multiple live camera feeds in real time with intelligent face detection overlays and instant alerts.",
        icon: <Monitor size={32} />,
        gradient: "from-emerald-500 to-teal-500",
        hoverGradient: "from-emerald-50 to-teal-50",
        corner: "border-emerald-200",
    },
    {
        title: "Multi-Camera Support",
        desc: "Seamlessly connect and manage CCTV, IP cameras, webcams, and RTSP video streams from a single dashboard.",
        icon: <Camera size={32} />,
        gradient: "from-fuchsia-500 to-pink-500",
        hoverGradient: "from-fuchsia-50 to-pink-50",
        corner: "border-pink-200",
    },
    {
        title: "User & Admin Roles",
        desc: "Role-based access system with separate dashboards for admins, managers, and users to ensure secure control.",
        icon: <Users size={32} />,
        gradient: "from-orange-500 to-red-500",
        hoverGradient: "from-orange-50 to-red-50",
        corner: "border-orange-200",
    },
    {
        title: "Face Enrollment System",
        desc: "Easy and secure face registration using image uploads or live camera capture for accurate identification.",
        icon: <UserPlus size={32} />,
        gradient: "from-indigo-500 to-violet-500",
        hoverGradient: "from-indigo-50 to-violet-50",
        corner: "border-indigo-200",
    },
    {
        title: "Attendance Reports & Analytics",
        desc: "Generate detailed daily, weekly, and monthly attendance reports with visual charts and export options.",
        icon: <BarChart3 size={32} />,
        gradient: "from-violet-800 to-purple-500",
        hoverGradient: "from-violet-100 to-purple-50",
        corner: "border-violet-200",
    },
    {
        title: "Real-Time Alerts & Notifications",
        desc: "Instant alerts for unauthorized access, unknown faces, late arrivals, and absentee tracking.",
        icon: <Bell size={32} />,
        gradient: "from-rose-500 to-pink-500",
        hoverGradient: "from-rose-50 to-pink-50",
        corner: "border-rose-200",
    },
    {
        title: "Shift & Schedule Management",
        desc: "Flexible shift scheduling system to handle multiple shifts, working hours, and attendance rules.",
        icon: <Calendar size={32} />,
        gradient: "from-purple-500 to-indigo-500",
        hoverGradient: "from-purple-50 to-indigo-50",
        corner: "border-purple-200",
    },
    {
        title: "Data Security & Privacy",
        desc: "End-to-end encryption, secure storage, and compliance with data privacy and protection standards.",
        icon: <Shield size={32} />,
        gradient: "from-teal-500 to-cyan-500",
        hoverGradient: "from-teal-50 to-cyan-50",
        corner: "border-teal-200",
    },
    {
        title: "Smart Dashboard",
        desc: "Modern real-time dashboard providing attendance insights, system health monitoring, and analytics overview.",
        icon: <LayoutDashboard size={32} />,
        gradient: "from-sky-500 to-blue-500",
        hoverGradient: "from-sky-50 to-blue-50",
        corner: "border-sky-200",
    },
    {
        title: "Scalable Cloud Architecture",
        desc: "Highly scalable backend architecture with cloud deployment support and GPU acceleration.",
        icon: <Cloud size={32} />,
        gradient: "from-cyan-500 to-blue-500",
        hoverGradient: "from-cyan-50 to-blue-50",
        corner: "border-cyan-200",
    },
    {
        title: "API & System Integration",
        desc: "Easy integration with ERP, HR, payroll, and third-party systems using secure APIs.",
        icon: <Plug size={32} />,
        gradient: "from-indigo-500 to-blue-500",
        hoverGradient: "from-indigo-50 to-blue-50",
        corner: "border-indigo-200",
    },
];

const container: Variants = {
    hidden: {},
    show: {
        transition: {
            staggerChildren: 0.08,
        },
    },
};

const item: Variants = {
    hidden: { opacity: 0, y: 30 },
    show: {
        opacity: 1,
        y: 0,
        transition: {
            duration: 0.45,
            ease: [0.25, 0.1, 0.25, 1],
        },
    },
};

export default function Features() {
    return (
        <section className="relative py-16 px-6 bg-[#f4f6f8]">
            <div className="max-w-6xl mx-auto">
                {/* Header */}
                <div className="max-w-3xl mx-auto text-center mb-16">
                    <h2 className="text-4xl md:text-4xl font-bold text-slate-900">
                        FaceTrack Features
                    </h2>
                    <p className="mt-4 text-lg text-slate-600">
                        Designed for simplicity. Engineered for performance.
                    </p>
                </div>

                {/* Grid */}
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
        </section>
    );
}

function FeatureCard({
    title,
    desc,
    icon,
    gradient,
    hoverGradient,
    corner,
}: Feature) {
    return (
        <motion.div variants={item} whileHover={{ y: -10 }} className="group relative">
            <div
                className={`
          relative h-full rounded-2xl p-7 border border-slate-200 bg-white
          transition-all duration-300
          group-hover:bg-gradient-to-br ${hoverGradient}
          group-hover:shadow-xl
        `}
            >
                {/* Corner accents */}
                <span
                    className={`
    pointer-events-none absolute top-4 right-4 w-6 h-6 border-t-2 border-r-2
    ${corner}
    opacity-0 group-hover:opacity-100
    transition-opacity duration-300
  `}
                />

                <span
                    className={`
    pointer-events-none absolute bottom-4 left-4 w-6 h-6 border-b-2 border-l-2
    ${corner}
    opacity-0 group-hover:opacity-100
    transition-opacity duration-300
  `}
                />

                {/* Icon */}
                <div
                    className={`
            w-14 h-14 mb-5 rounded-xl flex items-center justify-center text-white
            bg-gradient-to-br ${gradient}
            transition-all duration-300
            group-hover:scale-104
          `}
                >
                    {icon}
                </div>

                <h3 className="text-xl font-semibold text-slate-900">{title}</h3>
                <p className="mt-2 text-slate-600 leading-relaxed text-sm">{desc}</p>
            </div>
        </motion.div>
    );
}