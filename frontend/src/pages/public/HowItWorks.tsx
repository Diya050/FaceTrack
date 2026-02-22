"use client";

type Step = {
    number: string;
    title: string;
    image: string;
    description: string;
};

const steps: Step[] = [
    {
        number: "01",
        title: "User Registration",
        image: "/HowItWorks/userRegister.png",
        description:
            "Users register on the FaceTrack platform by submitting their personal details such as name, ID, role, and department. This creates a secure digital identity within the system.",
    },
    {
        number: "02",
        title: "Admin Verification & Approval",
        image: "/HowItWorks/adminApproval.png",
        description:
            "Administrators verify user information and approve registrations to ensure secure access control. Only verified users can proceed for facial enrollment and attendance services.",
    },
    {
        number: "03",
        title: "Facial Enrollment & Data Processing",
        image: "/HowItWorks/enrollment.png",
        description:
            "Approved users enroll their face using live camera capture. The AI model extracts facial features and generates a secure 512-dimensional embedding vector, uniquely representing the user.",
    },
    {
        number: "04",
        title: "Real-Time Face Detection & Matching",
        image: "/HowItWorks/recognition.png",
        description:
            "Live cameras continuously scan video streams to detect faces. Detected embeddings are compared against stored embeddings using cosine similarity for high-accuracy recognition.",
    },
    {
        number: "05",
        title: "Automated Attendance Logging",
        image: "/HowItWorks/attendance.png",
        description:
            "Upon successful identity verification, attendance is automatically marked with precise timestamps, camera source details, and confidence scores, eliminating manual effort and proxy attendance.",
    },
    {
        number: "06",
        title: "Smart Notifications & Alerts",
        image: "/HowItWorks/alerts.png",
        description:
            "The system instantly notifies administrators about unauthorized access, unknown faces, late arrivals, and absentee patterns, ensuring proactive security and monitoring.",
    },
    {
        number: "07",
        title: "Analytics, Reports & Insights",
        image: "/HowItWorks/analytics.png",
        description:
            "Comprehensive attendance reports are generated with intelligent filters for weekly, monthly, and quarterly analysis, providing deep insights into workforce efficiency and trends.",
    },
];

export default function HowItWorks() {
    return (
        <section className="w-full">

            {/* HERO */}
            <div className="bg-gradient-to-r from-[#343B55] to-[#3C435C] py-14 sm:py-16 md:py-20 px-4 sm:px-6 text-center">
                <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-[#ffffff]">
                    How FaceTrack Works
                </h2>
                <p className="mt-4 sm:mt-6 text-base sm:text-lg text-[#f3f2ee] max-w-2xl md:max-w-3xl mx-auto">
                    A seamless AI-powered experience that transforms how organizations track presence, ensure security, and understand their workforce.
                </p>
            </div>

            {/* CONTENT */}
            <div className="py-10 sm:py-12 px-4 sm:px-6 md:px-10 bg-gradient-to-b from-[#F0F0DB] to-[#E1D9BC]">
                <div className="max-w-5xl mx-auto relative">

                    {/* timeline */}
                    <div className="absolute left-6 sm:left-7 top-0 bottom-0 w-px bg-gradient-to-b from-[#9AA6B0] via-[#6F7B87] to-transparent" />

                    <div className="space-y-8 sm:space-y-10">
                        {steps.map((step) => (
                            <div key={step.number} className="relative flex gap-4 sm:gap-6">

                                {/* badge */}
                                <div className="relative z-10 flex items-center justify-center w-11 h-11 sm:w-14 sm:h-14 rounded-full bg-gradient-to-br from-[#3C435C] to-[#8F9AA6] text-white text-sm sm:text-base font-semibold shadow-md">
                                    {step.number}
                                </div>

                                {/* card */}
                                <div className="flex-1 rounded-2xl bg-white border border-[#CFC7A8] shadow-sm hover:shadow-lg transition-all p-8 sm:p-6">

                                    <div className="flex flex-col md:grid md:grid-cols-3 gap-5 sm:gap-6 items-center">

                                        {/* image */}
                                        <div className="w-full flex justify-center">
                                            <img
                                                src={step.image}
                                                alt={step.title}
                                                className="h-28 sm:h-32 md:h-36 w-auto object-contain p-2"
                                                loading="lazy"
                                            />
                                        </div>

                                        {/* text */}
                                        <div className="md:col-span-2 text-center md:text-left mb-2">
                                            <h3 className="text-lg sm:text-xl md:text-2xl font-semibold text-[#2F374F]">
                                                {step.title}
                                            </h3>
                                            <p className="mt-2 text-sm sm:text-base text-[#5F6674] leading-relaxed">
                                                {step.description}
                                            </p>
                                        </div>

                                    </div>
                                </div>

                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </section>
    );
}