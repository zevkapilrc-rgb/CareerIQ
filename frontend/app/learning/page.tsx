"use client";
import { useState, useEffect } from "react";
import { useAppStore } from "@/src/state/useAppStore";
import { useRouter } from "next/navigation";

// ─── Stream Catalog ──────────────────────────────
const STREAMS = [
    // Engineering
    { id: "cse", name: "Computer Science Engineering", emoji: "💻", cat: "Engineering", color: "#a78bfa", yt: "https://www.youtube.com/watch?v=Oe421EPjeBE", ytTitle: "CS Engineering Roadmap" },
    { id: "it", name: "Information Technology", emoji: "🖥️", cat: "Engineering", color: "#60a5fa", yt: "https://www.youtube.com/watch?v=VfGW0Qiy2I0", ytTitle: "IT Engineering Overview" },
    { id: "ai", name: "Artificial Intelligence", emoji: "🧠", cat: "Engineering", color: "#f472b6", yt: "https://www.youtube.com/watch?v=ad79nYk2keg", ytTitle: "AI Full Course" },
    { id: "aids", name: "AI & Data Science", emoji: "📊", cat: "Engineering", color: "#34d399", yt: "https://www.youtube.com/watch?v=ua-CiDNNj30", ytTitle: "AI & DS Roadmap" },
    { id: "aiml", name: "AI & Machine Learning", emoji: "🤖", cat: "Engineering", color: "#9b59b6", yt: "https://www.youtube.com/watch?v=GwIo3gDZCVQ", ytTitle: "ML Full Course" },
    { id: "ds", name: "Data Science", emoji: "📈", cat: "Engineering", color: "#fbbf24", yt: "https://www.youtube.com/watch?v=ua-CiDNNj30", ytTitle: "Data Science Roadmap" },
    { id: "cy", name: "Cyber Security", emoji: "🔐", cat: "Engineering", color: "#f87171", yt: "https://www.youtube.com/watch?v=inWWhr5tnEA", ytTitle: "Cyber Security Full Course" },
    { id: "se", name: "Software Engineering", emoji: "⚙️", cat: "Engineering", color: "#56e3a0", yt: "https://www.youtube.com/watch?v=B3y0RsVCyrw", ytTitle: "Software Engineering" },
    { id: "iot", name: "Internet of Things", emoji: "📡", cat: "Engineering", color: "#7eb8f7", yt: "https://www.youtube.com/watch?v=4NpZedvVMeo", ytTitle: "IoT Full Course" },
    { id: "ro", name: "Robotics Engineering", emoji: "🦾", cat: "Engineering", color: "#f472b6", yt: "https://www.youtube.com/watch?v=Ye7Wg_BhzUw", ytTitle: "Robotics Engineering" },
    { id: "mec", name: "Mechatronics Engineering", emoji: "🔧", cat: "Engineering", color: "#60a5fa", yt: "https://www.youtube.com/watch?v=FaOkTuMkXe4", ytTitle: "Mechatronics Overview" },
    { id: "me", name: "Mechanical Engineering", emoji: "🏗️", cat: "Engineering", color: "#fbbf24", yt: "https://www.youtube.com/watch?v=BQSb0LYAarU", ytTitle: "Mechanical Engineering" },
    { id: "ce", name: "Civil Engineering", emoji: "🏛️", cat: "Engineering", color: "#9b59b6", yt: "https://www.youtube.com/watch?v=kqX7y9hkDqQ", ytTitle: "Civil Engineering" },
    { id: "ee", name: "Electrical Engineering", emoji: "⚡", cat: "Engineering", color: "#fbbf24", yt: "https://www.youtube.com/watch?v=mc979OhitAg", ytTitle: "Electrical Engineering" },
    { id: "eee", name: "Electrical & Electronics Engineering", emoji: "🔌", cat: "Engineering", color: "#f6c94e", yt: "https://www.youtube.com/watch?v=mc979OhitAg", ytTitle: "EEE Overview" },
    { id: "ece", name: "Electronics & Communication Engineering", emoji: "📻", cat: "Engineering", color: "#60a5fa", yt: "https://www.youtube.com/watch?v=izPRRv9B5Ms", ytTitle: "ECE Full Course" },
    { id: "eie", name: "Electronics & Instrumentation Engineering", emoji: "🔬", cat: "Engineering", color: "#34d399", yt: "https://www.youtube.com/watch?v=OhWxUcSuNss", ytTitle: "Instrumentation Engineering" },
    { id: "aero", name: "Aerospace Engineering", emoji: "🚀", cat: "Engineering", color: "#a78bfa", yt: "https://www.youtube.com/watch?v=6GVSi9e89LA", ytTitle: "Aerospace Engineering" },
    { id: "aeron", name: "Aeronautical Engineering", emoji: "✈️", cat: "Engineering", color: "#60a5fa", yt: "https://www.youtube.com/watch?v=6GVSi9e89LA", ytTitle: "Aeronautical Engineering" },
    { id: "auto", name: "Automobile Engineering", emoji: "🚗", cat: "Engineering", color: "#f87171", yt: "https://www.youtube.com/watch?v=zX3l8Gbm8kk", ytTitle: "Automobile Engineering" },
    { id: "mar", name: "Marine Engineering", emoji: "🚢", cat: "Engineering", color: "#7eb8f7", yt: "https://www.youtube.com/watch?v=MgAXVNi_D3s", ytTitle: "Marine Engineering" },
    { id: "nav", name: "Naval Architecture", emoji: "⚓", cat: "Engineering", color: "#56e3a0", yt: "https://www.youtube.com/watch?v=MgAXVNi_D3s", ytTitle: "Naval Architecture" },
    { id: "pet", name: "Petroleum Engineering", emoji: "🛢️", cat: "Engineering", color: "#fbbf24", yt: "https://www.youtube.com/watch?v=XmimXb7u0sY", ytTitle: "Petroleum Engineering" },
    { id: "min", name: "Mining Engineering", emoji: "⛏️", cat: "Engineering", color: "#9b59b6", yt: "https://www.youtube.com/watch?v=fxk3yXX-JfA", ytTitle: "Mining Engineering" },
    { id: "che", name: "Chemical Engineering", emoji: "🧪", cat: "Engineering", color: "#60a5fa", yt: "https://www.youtube.com/watch?v=Oe421EPjeBE", ytTitle: "Chemical Engineering" },
    { id: "bio", name: "Biotechnology Engineering", emoji: "🧬", cat: "Engineering", color: "#34d399", yt: "https://www.youtube.com/watch?v=2NeSP-ogJgY", ytTitle: "Biotechnology Engineering" },
    { id: "bme", name: "Biomedical Engineering", emoji: "🏥", cat: "Engineering", color: "#f472b6", yt: "https://www.youtube.com/watch?v=bJBpDMvCx2Y", ytTitle: "Biomedical Engineering" },
    { id: "env", name: "Environmental Engineering", emoji: "🌍", cat: "Engineering", color: "#56e3a0", yt: "https://www.youtube.com/watch?v=_YkiDDzuY1E", ytTitle: "Environmental Engineering" },
    { id: "gen", name: "Genetic Engineering", emoji: "🧬", cat: "Engineering", color: "#a78bfa", yt: "https://www.youtube.com/watch?v=jAhjPd4uNFY", ytTitle: "Genetic Engineering" },
    { id: "nano", name: "Nanotechnology Engineering", emoji: "🔬", cat: "Engineering", color: "#60a5fa", yt: "https://www.youtube.com/watch?v=I1apKLHqMv4", ytTitle: "Nanotechnology" },
    { id: "ind", name: "Industrial Engineering", emoji: "🏭", cat: "Engineering", color: "#fbbf24", yt: "https://www.youtube.com/watch?v=B3y0RsVCyrw", ytTitle: "Industrial Engineering" },
    { id: "prod", name: "Production Engineering", emoji: "🔩", cat: "Engineering", color: "#f87171", yt: "https://www.youtube.com/watch?v=BQSb0LYAarU", ytTitle: "Production Engineering" },
    { id: "mfg", name: "Manufacturing Engineering", emoji: "🏗️", cat: "Engineering", color: "#9b59b6", yt: "https://www.youtube.com/watch?v=BQSb0LYAarU", ytTitle: "Manufacturing Engineering" },
    { id: "met", name: "Metallurgical Engineering", emoji: "⚗️", cat: "Engineering", color: "#fbbf24", yt: "https://www.youtube.com/watch?v=mc979OhitAg", ytTitle: "Metallurgical Engineering" },
    { id: "pol", name: "Polymer Engineering", emoji: "🧴", cat: "Engineering", color: "#a78bfa", yt: "https://www.youtube.com/watch?v=Oe421EPjeBE", ytTitle: "Polymer Engineering" },
    { id: "tex", name: "Textile Engineering", emoji: "🧵", cat: "Engineering", color: "#f472b6", yt: "https://www.youtube.com/watch?v=Oe421EPjeBE", ytTitle: "Textile Engineering" },
    { id: "cer", name: "Ceramic Engineering", emoji: "🏺", cat: "Engineering", color: "#60a5fa", yt: "https://www.youtube.com/watch?v=Oe421EPjeBE", ytTitle: "Ceramic Engineering" },
    { id: "agr", name: "Agricultural Engineering", emoji: "🌾", cat: "Engineering", color: "#56e3a0", yt: "https://www.youtube.com/watch?v=Oe421EPjeBE", ytTitle: "Agricultural Engineering" },
    { id: "food", name: "Food Technology Engineering", emoji: "🍱", cat: "Engineering", color: "#fbbf24", yt: "https://www.youtube.com/watch?v=Oe421EPjeBE", ytTitle: "Food Technology" },
    { id: "dairy", name: "Dairy Technology", emoji: "🥛", cat: "Engineering", color: "#7eb8f7", yt: "https://www.youtube.com/watch?v=Oe421EPjeBE", ytTitle: "Dairy Technology" },
    // Science
    { id: "bsc-phy", name: "B.Sc Physics", emoji: "⚛️", cat: "Science", color: "#60a5fa", yt: "https://www.youtube.com/watch?v=ZM8ECpBuQYE", ytTitle: "Physics Full Course" },
    { id: "bsc-chem", name: "B.Sc Chemistry", emoji: "🧪", cat: "Science", color: "#34d399", yt: "https://www.youtube.com/watch?v=uVFCOfSuPto", ytTitle: "Chemistry Full Course" },
    { id: "bsc-math", name: "B.Sc Mathematics", emoji: "📐", cat: "Science", color: "#a78bfa", yt: "https://www.youtube.com/watch?v=WnjQeAtPrEo", ytTitle: "Mathematics Full Course" },
    { id: "bsc-stat", name: "B.Sc Statistics", emoji: "📊", cat: "Science", color: "#fbbf24", yt: "https://www.youtube.com/watch?v=xxpc-HPKN28", ytTitle: "Statistics Full Course" },
    { id: "bsc-cs", name: "B.Sc Computer Science", emoji: "💻", cat: "Science", color: "#a78bfa", yt: "https://www.youtube.com/watch?v=Oe421EPjeBE", ytTitle: "CS Fundamentals" },
    { id: "bsc-it", name: "B.Sc Information Technology", emoji: "🖥️", cat: "Science", color: "#60a5fa", yt: "https://www.youtube.com/watch?v=VfGW0Qiy2I0", ytTitle: "IT Overview" },
    { id: "bsc-ai", name: "B.Sc Artificial Intelligence", emoji: "🧠", cat: "Science", color: "#f472b6", yt: "https://www.youtube.com/watch?v=ad79nYk2keg", ytTitle: "AI Course" },
    { id: "bsc-ds", name: "B.Sc Data Science", emoji: "📈", cat: "Science", color: "#34d399", yt: "https://www.youtube.com/watch?v=ua-CiDNNj30", ytTitle: "Data Science" },
    { id: "bsc-bt", name: "B.Sc Biotechnology", emoji: "🧬", cat: "Science", color: "#56e3a0", yt: "https://www.youtube.com/watch?v=2NeSP-ogJgY", ytTitle: "Biotechnology" },
    { id: "bsc-mb", name: "B.Sc Microbiology", emoji: "🔬", cat: "Science", color: "#9b59b6", yt: "https://www.youtube.com/watch?v=URUJD5NEXC8", ytTitle: "Microbiology" },
    { id: "bsc-bc", name: "B.Sc Biochemistry", emoji: "🧫", cat: "Science", color: "#f472b6", yt: "https://www.youtube.com/watch?v=7Hk9jct2ozY", ytTitle: "Biochemistry" },
    { id: "bsc-gn", name: "B.Sc Genetics", emoji: "🧬", cat: "Science", color: "#a78bfa", yt: "https://www.youtube.com/watch?v=jAhjPd4uNFY", ytTitle: "Genetics" },
    { id: "bsc-zoo", name: "B.Sc Zoology", emoji: "🦁", cat: "Science", color: "#fbbf24", yt: "https://www.youtube.com/watch?v=Oe421EPjeBE", ytTitle: "Zoology" },
    { id: "bsc-bot", name: "B.Sc Botany", emoji: "🌿", cat: "Science", color: "#56e3a0", yt: "https://www.youtube.com/watch?v=Oe421EPjeBE", ytTitle: "Botany" },
    { id: "bsc-env", name: "B.Sc Environmental Science", emoji: "🌍", cat: "Science", color: "#34d399", yt: "https://www.youtube.com/watch?v=_YkiDDzuY1E", ytTitle: "Environmental Science" },
    { id: "bsc-fs", name: "B.Sc Forensic Science", emoji: "🔍", cat: "Science", color: "#f87171", yt: "https://www.youtube.com/watch?v=Oe421EPjeBE", ytTitle: "Forensic Science" },
    { id: "bsc-nd", name: "B.Sc Nutrition & Dietetics", emoji: "🥗", cat: "Science", color: "#fbbf24", yt: "https://www.youtube.com/watch?v=Oe421EPjeBE", ytTitle: "Nutrition & Dietetics" },
    { id: "bsc-ft", name: "B.Sc Food Technology", emoji: "🍱", cat: "Science", color: "#60a5fa", yt: "https://www.youtube.com/watch?v=Oe421EPjeBE", ytTitle: "Food Technology" },
    { id: "bsc-ag", name: "B.Sc Agriculture", emoji: "🌾", cat: "Science", color: "#56e3a0", yt: "https://www.youtube.com/watch?v=Oe421EPjeBE", ytTitle: "Agriculture" },
    { id: "bsc-nur", name: "B.Sc Nursing", emoji: "🏥", cat: "Science", color: "#f472b6", yt: "https://www.youtube.com/watch?v=bJBpDMvCx2Y", ytTitle: "Nursing" },
    // Arts
    { id: "ba-eng", name: "B.A English", emoji: "📖", cat: "Arts", color: "#fbbf24", yt: "https://www.youtube.com/watch?v=Oe421EPjeBE", ytTitle: "English Literature" },
    { id: "ba-tam", name: "B.A Tamil", emoji: "📜", cat: "Arts", color: "#a78bfa", yt: "https://www.youtube.com/watch?v=Oe421EPjeBE", ytTitle: "Tamil Literature" },
    { id: "ba-hin", name: "B.A Hindi", emoji: "📜", cat: "Arts", color: "#f472b6", yt: "https://www.youtube.com/watch?v=Oe421EPjeBE", ytTitle: "Hindi Literature" },
    { id: "ba-fre", name: "B.A French", emoji: "🇫🇷", cat: "Arts", color: "#60a5fa", yt: "https://www.youtube.com/watch?v=Oe421EPjeBE", ytTitle: "French Language" },
    { id: "ba-his", name: "B.A History", emoji: "🏛️", cat: "Arts", color: "#9b59b6", yt: "https://www.youtube.com/watch?v=Oe421EPjeBE", ytTitle: "History" },
    { id: "ba-pol", name: "B.A Political Science", emoji: "🏛️", cat: "Arts", color: "#f87171", yt: "https://www.youtube.com/watch?v=Oe421EPjeBE", ytTitle: "Political Science" },
    { id: "ba-soc", name: "B.A Sociology", emoji: "👥", cat: "Arts", color: "#34d399", yt: "https://www.youtube.com/watch?v=Oe421EPjeBE", ytTitle: "Sociology" },
    { id: "ba-psy", name: "B.A Psychology", emoji: "🧠", cat: "Arts", color: "#a78bfa", yt: "https://www.youtube.com/watch?v=vo4pMVb0R6M", ytTitle: "Psychology" },
    { id: "ba-eco", name: "B.A Economics", emoji: "📉", cat: "Arts", color: "#fbbf24", yt: "https://www.youtube.com/watch?v=3ez10ADR_gM", ytTitle: "Economics" },
    { id: "ba-jour", name: "B.A Journalism", emoji: "📰", cat: "Arts", color: "#60a5fa", yt: "https://www.youtube.com/watch?v=Oe421EPjeBE", ytTitle: "Journalism" },
    { id: "ba-mc", name: "B.A Mass Communication", emoji: "📡", cat: "Arts", color: "#f472b6", yt: "https://www.youtube.com/watch?v=Oe421EPjeBE", ytTitle: "Mass Communication" },
    { id: "ba-vc", name: "B.A Visual Communication", emoji: "📷", cat: "Arts", color: "#9b59b6", yt: "https://www.youtube.com/watch?v=Oe421EPjeBE", ytTitle: "Visual Communication" },
    { id: "ba-film", name: "B.A Film Studies", emoji: "🎬", cat: "Arts", color: "#f87171", yt: "https://www.youtube.com/watch?v=Oe421EPjeBE", ytTitle: "Film Studies" },
    { id: "ba-pa", name: "B.A Public Administration", emoji: "🏢", cat: "Arts", color: "#56e3a0", yt: "https://www.youtube.com/watch?v=Oe421EPjeBE", ytTitle: "Public Administration" },
    { id: "ba-tour", name: "B.A Tourism", emoji: "✈️", cat: "Arts", color: "#7eb8f7", yt: "https://www.youtube.com/watch?v=Oe421EPjeBE", ytTitle: "Tourism Management" },
    { id: "ba-fa", name: "B.A Fine Arts", emoji: "🎨", cat: "Arts", color: "#f472b6", yt: "https://www.youtube.com/watch?v=Oe421EPjeBE", ytTitle: "Fine Arts" },
    { id: "ba-phi", name: "B.A Philosophy", emoji: "🤔", cat: "Arts", color: "#a78bfa", yt: "https://www.youtube.com/watch?v=YtchE6xDz7g", ytTitle: "Philosophy" },
    // Commerce
    { id: "bcom", name: "B.Com General", emoji: "💼", cat: "Commerce", color: "#60a5fa", yt: "https://www.youtube.com/watch?v=7t9spv2GXGM", ytTitle: "B.Com Overview" },
    { id: "bcom-af", name: "B.Com Accounting & Finance", emoji: "💰", cat: "Commerce", color: "#56e3a0", yt: "https://www.youtube.com/watch?v=7t9spv2GXGM", ytTitle: "Accounting & Finance" },
    { id: "bcom-bi", name: "B.Com Banking & Insurance", emoji: "🏦", cat: "Commerce", color: "#fbbf24", yt: "https://www.youtube.com/watch?v=7t9spv2GXGM", ytTitle: "Banking & Insurance" },
    { id: "bcom-cs", name: "B.Com Corporate Secretaryship", emoji: "🗂️", cat: "Commerce", color: "#9b59b6", yt: "https://www.youtube.com/watch?v=7t9spv2GXGM", ytTitle: "Corporate Secretaryship" },
    { id: "bcom-ca", name: "B.Com Computer Applications", emoji: "💻", cat: "Commerce", color: "#a78bfa", yt: "https://www.youtube.com/watch?v=7t9spv2GXGM", ytTitle: "B.Com CA" },
    { id: "bba", name: "BBA (Business Administration)", emoji: "📊", cat: "Commerce", color: "#f472b6", yt: "https://www.youtube.com/watch?v=7t9spv2GXGM", ytTitle: "BBA Overview" },
    { id: "bms", name: "BMS (Management Studies)", emoji: "📋", cat: "Commerce", color: "#60a5fa", yt: "https://www.youtube.com/watch?v=7t9spv2GXGM", ytTitle: "BMS Overview" },
    { id: "bca", name: "BCA (Computer Applications)", emoji: "💻", cat: "Commerce", color: "#34d399", yt: "https://www.youtube.com/watch?v=Oe421EPjeBE", ytTitle: "BCA Overview" },
    // Professional
    { id: "barch", name: "B.Arch (Architecture)", emoji: "🏛️", cat: "Professional", color: "#fbbf24", yt: "https://www.youtube.com/watch?v=Oe421EPjeBE", ytTitle: "Architecture" },
    { id: "bpharm", name: "B.Pharm (Pharmacy)", emoji: "💊", cat: "Professional", color: "#f472b6", yt: "https://www.youtube.com/watch?v=Oe421EPjeBE", ytTitle: "Pharmacy" },
    { id: "bdes", name: "B.Des (Design)", emoji: "🎨", cat: "Professional", color: "#a78bfa", yt: "https://www.youtube.com/watch?v=Oe421EPjeBE", ytTitle: "Design Course" },
    { id: "llb", name: "LLB (Law)", emoji: "⚖️", cat: "Professional", color: "#60a5fa", yt: "https://www.youtube.com/watch?v=Oe421EPjeBE", ytTitle: "Law Basics" },
    { id: "hotel", name: "Hotel Management", emoji: "🏨", cat: "Professional", color: "#fbbf24", yt: "https://www.youtube.com/watch?v=Oe421EPjeBE", ytTitle: "Hotel Management" },
    { id: "avia", name: "Aviation Management", emoji: "✈️", cat: "Professional", color: "#7eb8f7", yt: "https://www.youtube.com/watch?v=Oe421EPjeBE", ytTitle: "Aviation Management" },
    { id: "anim", name: "Animation & Multimedia", emoji: "🎬", cat: "Professional", color: "#f87171", yt: "https://www.youtube.com/watch?v=Oe421EPjeBE", ytTitle: "Animation" },
    { id: "fashion", name: "Fashion Design", emoji: "👗", cat: "Professional", color: "#f472b6", yt: "https://www.youtube.com/watch?v=Oe421EPjeBE", ytTitle: "Fashion Design" },
    { id: "interior", name: "Interior Design", emoji: "🛋️", cat: "Professional", color: "#9b59b6", yt: "https://www.youtube.com/watch?v=Oe421EPjeBE", ytTitle: "Interior Design" },
    { id: "event", name: "Event Management", emoji: "🎪", cat: "Professional", color: "#56e3a0", yt: "https://www.youtube.com/watch?v=Oe421EPjeBE", ytTitle: "Event Management" },
    { id: "tourm", name: "Tourism Management", emoji: "🌍", cat: "Professional", color: "#60a5fa", yt: "https://www.youtube.com/watch?v=Oe421EPjeBE", ytTitle: "Tourism Management" },
    { id: "dm", name: "Digital Marketing", emoji: "📱", cat: "Professional", color: "#f87171", yt: "https://www.youtube.com/watch?v=ysEN5RaKOlA", ytTitle: "Digital Marketing" },
]
    ;

// ─── Per-stream lessons with YouTube ─────────────
type Lesson = { title: string; yt: string; ytTitle: string; duration: string };
const STREAM_LESSONS: Record<string, Lesson[]> = {
    cse: [
        { title: "Introduction to Programming", yt: "https://www.youtube.com/watch?v=zOjov-2OZ0E", ytTitle: "Programming Basics", duration: "45 min" },
        { title: "Data Structures & Algorithms", yt: "https://www.youtube.com/watch?v=8hly31xKli0", ytTitle: "DSA Full Course", duration: "4 hrs" },
        { title: "Object Oriented Programming", yt: "https://www.youtube.com/watch?v=PFmuCDHHpwk", ytTitle: "OOP Concepts", duration: "2 hrs" },
        { title: "Database Management Systems", yt: "https://www.youtube.com/watch?v=HXV3zeQKqGY", ytTitle: "DBMS Course", duration: "3 hrs" },
        { title: "Operating Systems", yt: "https://www.youtube.com/watch?v=vBURTt97EkA", ytTitle: "OS Concepts", duration: "3 hrs" },
        { title: "Computer Networks", yt: "https://www.youtube.com/watch?v=VwN91x5i25g", ytTitle: "Networking", duration: "2.5 hrs" },
        { title: "Web Development Fundamentals", yt: "https://www.youtube.com/watch?v=pQN-pnXPaVg", ytTitle: "HTML CSS JS", duration: "5 hrs" },
        { title: "Software Engineering Principles", yt: "https://www.youtube.com/watch?v=B3y0RsVCyrw", ytTitle: "SE Principles", duration: "2 hrs" },
        { title: "Compiler Design", yt: "https://www.youtube.com/watch?v=Qkwj65l_96I", ytTitle: "Compiler Design", duration: "3 hrs" },
        { title: "Discrete Mathematics", yt: "https://www.youtube.com/watch?v=2SpuBqvNjHI", ytTitle: "Discrete Maths", duration: "4 hrs" },
        { title: "Cloud Computing & DevOps", yt: "https://www.youtube.com/watch?v=M988_fsOSWo", ytTitle: "Cloud Computing", duration: "2.5 hrs" },
        { title: "Capstone Project & Portfolio", yt: "https://www.youtube.com/watch?v=Oe421EPjeBE", ytTitle: "CS Capstone", duration: "3 hrs" },
    ],
    ai: [
        { title: "Python for AI", yt: "https://www.youtube.com/watch?v=_uQrJ0TkZlc", ytTitle: "Python Tutorial", duration: "6 hrs" },
        { title: "Linear Algebra for ML", yt: "https://www.youtube.com/watch?v=fNk_zzaMoSs", ytTitle: "Linear Algebra", duration: "3 hrs" },
        { title: "Machine Learning Basics", yt: "https://www.youtube.com/watch?v=GwIo3gDZCVQ", ytTitle: "ML Course", duration: "4 hrs" },
        { title: "Deep Learning & Neural Networks", yt: "https://www.youtube.com/watch?v=aircAruvnKk", ytTitle: "Neural Networks", duration: "3 hrs" },
        { title: "Natural Language Processing", yt: "https://www.youtube.com/watch?v=X2vAabgKiuM", ytTitle: "NLP Course", duration: "2.5 hrs" },
        { title: "Computer Vision", yt: "https://www.youtube.com/watch?v=oXlwWbU8l2o", ytTitle: "CV with OpenCV", duration: "3 hrs" },
        { title: "LLMs & Prompt Engineering", yt: "https://www.youtube.com/watch?v=_ZvnD96BbJI", ytTitle: "LLM Course", duration: "2 hrs" },
    ],
    aids: [
        { title: "Statistics & Probability", yt: "https://www.youtube.com/watch?v=xxpc-HPKN28", ytTitle: "Statistics", duration: "3 hrs" },
        { title: "Python for Data Science", yt: "https://www.youtube.com/watch?v=LHBE6Q9XlzI", ytTitle: "Python DS", duration: "4 hrs" },
        { title: "Pandas & NumPy", yt: "https://www.youtube.com/watch?v=vmEHCJofslg", ytTitle: "Pandas Tutorial", duration: "3 hrs" },
        { title: "Data Visualization", yt: "https://www.youtube.com/watch?v=a9UrKTVEhZA", ytTitle: "Matplotlib", duration: "2 hrs" },
        { title: "SQL for Data Science", yt: "https://www.youtube.com/watch?v=HXV3zeQKqGY", ytTitle: "SQL Course", duration: "3 hrs" },
        { title: "Machine Learning", yt: "https://www.youtube.com/watch?v=GwIo3gDZCVQ", ytTitle: "ML Fundamentals", duration: "4 hrs" },
    ],
    cy: [
        { title: "Networking Fundamentals", yt: "https://www.youtube.com/watch?v=qiQR5rTSshw", ytTitle: "Networking", duration: "3 hrs" },
        { title: "Linux for Security", yt: "https://www.youtube.com/watch?v=sWbUDq4S6Y8", ytTitle: "Linux Basics", duration: "4 hrs" },
        { title: "Ethical Hacking", yt: "https://www.youtube.com/watch?v=3Kq1MIfTWCE", ytTitle: "Ethical Hacking", duration: "5 hrs" },
        { title: "Cryptography", yt: "https://www.youtube.com/watch?v=jhXCTbFnK8o", ytTitle: "Crypto Basics", duration: "2 hrs" },
        { title: "Web Application Security", yt: "https://www.youtube.com/watch?v=inWWhr5tnEA", ytTitle: "Web Security", duration: "3 hrs" },
    ],
    me: [
        { title: "Engineering Mechanics", yt: "https://www.youtube.com/watch?v=BQSb0LYAarU", ytTitle: "Mechanics", duration: "3 hrs" },
        { title: "Thermodynamics", yt: "https://www.youtube.com/watch?v=RgjKCGz8XfY", ytTitle: "Thermodynamics", duration: "4 hrs" },
        { title: "Fluid Mechanics", yt: "https://www.youtube.com/watch?v=VasSl5R0V9c", ytTitle: "Fluids", duration: "3 hrs" },
        { title: "Manufacturing Processes", yt: "https://www.youtube.com/watch?v=BQSb0LYAarU", ytTitle: "Manufacturing", duration: "2.5 hrs" },
        { title: "CAD & Design", yt: "https://www.youtube.com/watch?v=YAIiWcyL_Mg", ytTitle: "AutoCAD Tutorial", duration: "3 hrs" },
    ],
    ece: [
        { title: "Circuit Theory", yt: "https://www.youtube.com/watch?v=mc979OhitAg", ytTitle: "Circuit Analysis", duration: "3 hrs" },
        { title: "Digital Electronics", yt: "https://www.youtube.com/watch?v=M0mx8S05v60", ytTitle: "Digital Logic", duration: "4 hrs" },
        { title: "Signals & Systems", yt: "https://www.youtube.com/watch?v=izPRRv9B5Ms", ytTitle: "Signals", duration: "3 hrs" },
        { title: "Microprocessors", yt: "https://www.youtube.com/watch?v=Oe421EPjeBE", ytTitle: "Microprocessor", duration: "2.5 hrs" },
        { title: "Communication Systems", yt: "https://www.youtube.com/watch?v=izPRRv9B5Ms", ytTitle: "Comm Systems", duration: "3 hrs" },
    ],
    se: [
        { title: "SDLC & Agile", yt: "https://www.youtube.com/watch?v=B3y0RsVCyrw", ytTitle: "SDLC", duration: "2 hrs" },
        { title: "Version Control (Git)", yt: "https://www.youtube.com/watch?v=RGOj5yH7evk", ytTitle: "Git Tutorial", duration: "1.5 hrs" },
        { title: "Design Patterns", yt: "https://www.youtube.com/watch?v=v9ejT8FO-7I", ytTitle: "Design Patterns", duration: "3 hrs" },
        { title: "Testing & QA", yt: "https://www.youtube.com/watch?v=u6QfIXgjwGQ", ytTitle: "Testing", duration: "2 hrs" },
        { title: "CI/CD & DevOps", yt: "https://www.youtube.com/watch?v=scEDHsr3APg", ytTitle: "DevOps", duration: "3 hrs" },
    ],
    bba: [
        { title: "Business Communication", yt: "https://www.youtube.com/watch?v=7t9spv2GXGM", ytTitle: "Business Comm", duration: "2 hrs" },
        { title: "Financial Management", yt: "https://www.youtube.com/watch?v=7t9spv2GXGM", ytTitle: "Finance Basics", duration: "3 hrs" },
        { title: "Marketing Management", yt: "https://www.youtube.com/watch?v=7t9spv2GXGM", ytTitle: "Marketing", duration: "2.5 hrs" },
        { title: "Human Resource Management", yt: "https://www.youtube.com/watch?v=7t9spv2GXGM", ytTitle: "HRM", duration: "2 hrs" },
        { title: "Entrepreneurship", yt: "https://www.youtube.com/watch?v=7t9spv2GXGM", ytTitle: "Startup Basics", duration: "2 hrs" },
    ],
    dm: [
        { title: "SEO Fundamentals", yt: "https://www.youtube.com/watch?v=ysEN5RaKOlA", ytTitle: "SEO Course", duration: "3 hrs" },
        { title: "Social Media Marketing", yt: "https://www.youtube.com/watch?v=ysEN5RaKOlA", ytTitle: "Social Media", duration: "2.5 hrs" },
        { title: "Google Ads & PPC", yt: "https://www.youtube.com/watch?v=ysEN5RaKOlA", ytTitle: "Google Ads", duration: "2 hrs" },
        { title: "Content Marketing", yt: "https://www.youtube.com/watch?v=ysEN5RaKOlA", ytTitle: "Content Strategy", duration: "2 hrs" },
        { title: "Analytics & Google Analytics 4", yt: "https://www.youtube.com/watch?v=ysEN5RaKOlA", ytTitle: "Analytics", duration: "2 hrs" },
        { title: "Email Marketing", yt: "https://www.youtube.com/watch?v=ysEN5RaKOlA", ytTitle: "Email Marketing", duration: "1.5 hrs" },
        { title: "Affiliate & Influencer Marketing", yt: "https://www.youtube.com/watch?v=ysEN5RaKOlA", ytTitle: "Affiliate Mktg", duration: "1.5 hrs" },
        { title: "Digital Marketing Capstone", yt: "https://www.youtube.com/watch?v=ysEN5RaKOlA", ytTitle: "DM Capstone", duration: "2 hrs" },
    ],
    it: [
        { title: "IT Fundamentals", yt: "https://www.youtube.com/watch?v=VfGW0Qiy2I0", ytTitle: "IT Overview", duration: "2 hrs" },
        { title: "Networking & Protocols", yt: "https://www.youtube.com/watch?v=qiQR5rTSshw", ytTitle: "Networking Basics", duration: "3 hrs" },
        { title: "Web Technologies", yt: "https://www.youtube.com/watch?v=pQN-pnXPaVg", ytTitle: "Web Dev", duration: "4 hrs" },
        { title: "Database Systems", yt: "https://www.youtube.com/watch?v=HXV3zeQKqGY", ytTitle: "SQL & DBMS", duration: "3 hrs" },
        { title: "Cloud Computing", yt: "https://www.youtube.com/watch?v=M988_fsOSWo", ytTitle: "Cloud Basics", duration: "2.5 hrs" },
        { title: "Cybersecurity Basics", yt: "https://www.youtube.com/watch?v=inWWhr5tnEA", ytTitle: "Cybersecurity", duration: "2 hrs" },
        { title: "Linux & System Administration", yt: "https://www.youtube.com/watch?v=sWbUDq4S6Y8", ytTitle: "Linux Admin", duration: "3 hrs" },
        { title: "Python Scripting for IT", yt: "https://www.youtube.com/watch?v=_uQrJ0TkZlc", ytTitle: "Python Scripting", duration: "3 hrs" },
        { title: "IT Project Management", yt: "https://www.youtube.com/watch?v=B3y0RsVCyrw", ytTitle: "IT Proj Mgmt", duration: "2 hrs" },
        { title: "IT Capstone", yt: "https://www.youtube.com/watch?v=VfGW0Qiy2I0", ytTitle: "IT Capstone", duration: "2 hrs" },
    ],
    aiml: [
        { title: "Python Programming", yt: "https://www.youtube.com/watch?v=_uQrJ0TkZlc", ytTitle: "Python Full", duration: "6 hrs" },
        { title: "Math for Machine Learning", yt: "https://www.youtube.com/watch?v=fNk_zzaMoSs", ytTitle: "Math for ML", duration: "3 hrs" },
        { title: "Supervised Learning", yt: "https://www.youtube.com/watch?v=GwIo3gDZCVQ", ytTitle: "Supervised ML", duration: "3 hrs" },
        { title: "Unsupervised Learning", yt: "https://www.youtube.com/watch?v=GwIo3gDZCVQ", ytTitle: "Unsupervised ML", duration: "2 hrs" },
        { title: "Deep Neural Networks", yt: "https://www.youtube.com/watch?v=aircAruvnKk", ytTitle: "Neural Nets", duration: "4 hrs" },
        { title: "CNNs for Image Recognition", yt: "https://www.youtube.com/watch?v=oXlwWbU8l2o", ytTitle: "CNN Tutorial", duration: "3 hrs" },
        { title: "RNNs & LSTMs for Sequences", yt: "https://www.youtube.com/watch?v=AsNTP8Kwu80", ytTitle: "RNN & LSTM", duration: "2.5 hrs" },
        { title: "Natural Language Processing", yt: "https://www.youtube.com/watch?v=X2vAabgKiuM", ytTitle: "NLP", duration: "2.5 hrs" },
        { title: "Model Deployment with FastAPI", yt: "https://www.youtube.com/watch?v=7t2alSnE2-I", ytTitle: "ML Deployment", duration: "2 hrs" },
        { title: "MLOps & Pipelines", yt: "https://www.youtube.com/watch?v=NGsMNfUXTi8", ytTitle: "MLOps", duration: "2 hrs" },
    ],
    ds: [
        { title: "Introduction to Data Science", yt: "https://www.youtube.com/watch?v=ua-CiDNNj30", ytTitle: "DS Overview", duration: "2 hrs" },
        { title: "Python & Pandas", yt: "https://www.youtube.com/watch?v=vmEHCJofslg", ytTitle: "Pandas", duration: "3 hrs" },
        { title: "Exploratory Data Analysis", yt: "https://www.youtube.com/watch?v=a9UrKTVEhZA", ytTitle: "EDA", duration: "2.5 hrs" },
        { title: "SQL for Analysis", yt: "https://www.youtube.com/watch?v=HXV3zeQKqGY", ytTitle: "SQL", duration: "3 hrs" },
        { title: "Statistical Inference", yt: "https://www.youtube.com/watch?v=xxpc-HPKN28", ytTitle: "Statistics", duration: "3 hrs" },
        { title: "Machine Learning Algorithms", yt: "https://www.youtube.com/watch?v=GwIo3gDZCVQ", ytTitle: "ML Algorithms", duration: "4 hrs" },
        { title: "Data Visualization (Tableau/PBI)", yt: "https://www.youtube.com/watch?v=TPMlZxRRaBQ", ytTitle: "Tableau", duration: "2 hrs" },
        { title: "Big Data & Spark", yt: "https://www.youtube.com/watch?v=W0oBSoSMtAY", ytTitle: "Big Data", duration: "3 hrs" },
        { title: "Deep Learning for DS", yt: "https://www.youtube.com/watch?v=aircAruvnKk", ytTitle: "Deep Learning", duration: "2.5 hrs" },
        { title: "DS Capstone & Portfolio", yt: "https://www.youtube.com/watch?v=ua-CiDNNj30", ytTitle: "DS Capstone", duration: "2 hrs" },
    ],
    iot: [
        { title: "IoT Fundamentals", yt: "https://www.youtube.com/watch?v=4NpZedvVMeo", ytTitle: "IoT Overview", duration: "2 hrs" },
        { title: "Arduino Programming", yt: "https://www.youtube.com/watch?v=fJWR7dBuc18", ytTitle: "Arduino", duration: "3 hrs" },
        { title: "Raspberry Pi Projects", yt: "https://www.youtube.com/watch?v=RpseX2ylEuw", ytTitle: "Raspberry Pi", duration: "2.5 hrs" },
        { title: "Sensors & Actuators", yt: "https://www.youtube.com/watch?v=4NpZedvVMeo", ytTitle: "Sensors", duration: "2 hrs" },
        { title: "IoT Communication Protocols", yt: "https://www.youtube.com/watch?v=VwN91x5i25g", ytTitle: "IoT Protocols", duration: "2.5 hrs" },
        { title: "MQTT & Node-RED", yt: "https://www.youtube.com/watch?v=4NpZedvVMeo", ytTitle: "MQTT", duration: "2 hrs" },
        { title: "Edge Computing & AI", yt: "https://www.youtube.com/watch?v=M988_fsOSWo", ytTitle: "Edge AI", duration: "2 hrs" },
        { title: "IoT Security", yt: "https://www.youtube.com/watch?v=inWWhr5tnEA", ytTitle: "IoT Security", duration: "1.5 hrs" },
        { title: "Cloud IoT (AWS IoT / GCP)", yt: "https://www.youtube.com/watch?v=M988_fsOSWo", ytTitle: "Cloud IoT", duration: "2 hrs" },
        { title: "IoT Capstone Project", yt: "https://www.youtube.com/watch?v=4NpZedvVMeo", ytTitle: "IoT Project", duration: "3 hrs" },
    ],
    ce: [
        { title: "Engineering Mechanics", yt: "https://www.youtube.com/watch?v=BQSb0LYAarU", ytTitle: "Mechanics", duration: "2.5 hrs" },
        { title: "Structural Analysis", yt: "https://www.youtube.com/watch?v=kqX7y9hkDqQ", ytTitle: "Structural", duration: "3 hrs" },
        { title: "Geotechnical Engineering", yt: "https://www.youtube.com/watch?v=kqX7y9hkDqQ", ytTitle: "Geotechnical", duration: "2.5 hrs" },
        { title: "Fluid Mechanics & Hydraulics", yt: "https://www.youtube.com/watch?v=VasSl5R0V9c", ytTitle: "Hydraulics", duration: "3 hrs" },
        { title: "Concrete Technology", yt: "https://www.youtube.com/watch?v=kqX7y9hkDqQ", ytTitle: "Concrete Tech", duration: "2 hrs" },
        { title: "Surveying & Levelling", yt: "https://www.youtube.com/watch?v=kqX7y9hkDqQ", ytTitle: "Surveying", duration: "2 hrs" },
        { title: "Transportation Engineering", yt: "https://www.youtube.com/watch?v=kqX7y9hkDqQ", ytTitle: "Transportation", duration: "2.5 hrs" },
        { title: "AutoCAD for Civil Engineers", yt: "https://www.youtube.com/watch?v=YAIiWcyL_Mg", ytTitle: "Civil CAD", duration: "3 hrs" },
        { title: "Environmental Engineering", yt: "https://www.youtube.com/watch?v=_YkiDDzuY1E", ytTitle: "Env Engg", duration: "2 hrs" },
    ],
    ee: [
        { title: "Circuit Theory", yt: "https://www.youtube.com/watch?v=mc979OhitAg", ytTitle: "Circuit Theory", duration: "3 hrs" },
        { title: "Electrical Machines", yt: "https://www.youtube.com/watch?v=mc979OhitAg", ytTitle: "Electrical Machines", duration: "3 hrs" },
        { title: "Power Systems", yt: "https://www.youtube.com/watch?v=mc979OhitAg", ytTitle: "Power Systems", duration: "2.5 hrs" },
        { title: "Control Systems", yt: "https://www.youtube.com/watch?v=mc979OhitAg", ytTitle: "Control Systems", duration: "3 hrs" },
        { title: "Power Electronics", yt: "https://www.youtube.com/watch?v=mc979OhitAg", ytTitle: "Power Electronics", duration: "3 hrs" },
        { title: "Electrical Measurements", yt: "https://www.youtube.com/watch?v=mc979OhitAg", ytTitle: "Measurements", duration: "2 hrs" },
        { title: "Renewable Energy Systems", yt: "https://www.youtube.com/watch?v=mc979OhitAg", ytTitle: "Renewable Energy", duration: "2 hrs" },
        { title: "PLC & Industrial Automation", yt: "https://www.youtube.com/watch?v=BQSb0LYAarU", ytTitle: "PLC Automation", duration: "2.5 hrs" },
        { title: "High Voltage Engineering", yt: "https://www.youtube.com/watch?v=mc979OhitAg", ytTitle: "HV Engineering", duration: "2 hrs" },
    ],
    "bsc-cs": [
        { title: "Programming Fundamentals (C)", yt: "https://www.youtube.com/watch?v=zOjov-2OZ0E", ytTitle: "C Programming", duration: "4 hrs" },
        { title: "Data Structures", yt: "https://www.youtube.com/watch?v=8hly31xKli0", ytTitle: "DSA", duration: "4 hrs" },
        { title: "Algorithms Design & Analysis", yt: "https://www.youtube.com/watch?v=8hly31xKli0", ytTitle: "Algorithms", duration: "3 hrs" },
        { title: "Operating Systems", yt: "https://www.youtube.com/watch?v=vBURTt97EkA", ytTitle: "OS", duration: "3 hrs" },
        { title: "Database Management", yt: "https://www.youtube.com/watch?v=HXV3zeQKqGY", ytTitle: "DBMS", duration: "3 hrs" },
        { title: "Computer Networks", yt: "https://www.youtube.com/watch?v=VwN91x5i25g", ytTitle: "Networks", duration: "2.5 hrs" },
        { title: "Web Programming", yt: "https://www.youtube.com/watch?v=pQN-pnXPaVg", ytTitle: "Web Dev", duration: "4 hrs" },
        { title: "Software Engineering", yt: "https://www.youtube.com/watch?v=B3y0RsVCyrw", ytTitle: "SE", duration: "2 hrs" },
        { title: "Python & Scripting", yt: "https://www.youtube.com/watch?v=_uQrJ0TkZlc", ytTitle: "Python", duration: "3 hrs" },
    ],
    "bsc-math": [
        { title: "Calculus (Differential & Integral)", yt: "https://www.youtube.com/watch?v=WnjQeAtPrEo", ytTitle: "Calculus", duration: "5 hrs" },
        { title: "Linear Algebra", yt: "https://www.youtube.com/watch?v=fNk_zzaMoSs", ytTitle: "Linear Algebra", duration: "3 hrs" },
        { title: "Differential Equations", yt: "https://www.youtube.com/watch?v=p_di4Zn4wz4", ytTitle: "Diff Equations", duration: "4 hrs" },
        { title: "Abstract Algebra", yt: "https://www.youtube.com/watch?v=WnjQeAtPrEo", ytTitle: "Abstract Algebra", duration: "3 hrs" },
        { title: "Real Analysis", yt: "https://www.youtube.com/watch?v=WnjQeAtPrEo", ytTitle: "Real Analysis", duration: "3 hrs" },
        { title: "Numerical Methods", yt: "https://www.youtube.com/watch?v=WnjQeAtPrEo", ytTitle: "Numerical Methods", duration: "2.5 hrs" },
        { title: "Probability Theory", yt: "https://www.youtube.com/watch?v=xxpc-HPKN28", ytTitle: "Probability", duration: "3 hrs" },
        { title: "Discrete Mathematics", yt: "https://www.youtube.com/watch?v=2SpuBqvNjHI", ytTitle: "Discrete Maths", duration: "2 hrs" },
        { title: "Graph Theory", yt: "https://www.youtube.com/watch?v=2SpuBqvNjHI", ytTitle: "Graph Theory", duration: "2 hrs" },
    ],
    "bsc-phy": [
        { title: "Classical Mechanics", yt: "https://www.youtube.com/watch?v=ZM8ECpBuQYE", ytTitle: "Mechanics", duration: "4 hrs" },
        { title: "Electromagnetism", yt: "https://www.youtube.com/watch?v=ZM8ECpBuQYE", ytTitle: "Electromagnetism", duration: "3 hrs" },
        { title: "Thermodynamics & Statistical Physics", yt: "https://www.youtube.com/watch?v=RgjKCGz8XfY", ytTitle: "Thermodynamics", duration: "3 hrs" },
        { title: "Quantum Mechanics", yt: "https://www.youtube.com/watch?v=ZM8ECpBuQYE", ytTitle: "Quantum Mech", duration: "4 hrs" },
        { title: "Optics & Photonics", yt: "https://www.youtube.com/watch?v=ZM8ECpBuQYE", ytTitle: "Optics", duration: "2.5 hrs" },
        { title: "Nuclear & Particle Physics", yt: "https://www.youtube.com/watch?v=ZM8ECpBuQYE", ytTitle: "Nuclear Physics", duration: "2 hrs" },
        { title: "Solid State Physics", yt: "https://www.youtube.com/watch?v=ZM8ECpBuQYE", ytTitle: "Solid State", duration: "2 hrs" },
        { title: "Astrophysics Basics", yt: "https://www.youtube.com/watch?v=ZM8ECpBuQYE", ytTitle: "Astrophysics", duration: "2 hrs" },
    ],
    bcom: [
        { title: "Principles of Accounting", yt: "https://www.youtube.com/watch?v=7t9spv2GXGM", ytTitle: "Accounting", duration: "3 hrs" },
        { title: "Business Economics", yt: "https://www.youtube.com/watch?v=3ez10ADR_gM", ytTitle: "Business Economics", duration: "2.5 hrs" },
        { title: "Business Law & Ethics", yt: "https://www.youtube.com/watch?v=7t9spv2GXGM", ytTitle: "Business Law", duration: "2 hrs" },
        { title: "Financial Accounting", yt: "https://www.youtube.com/watch?v=7t9spv2GXGM", ytTitle: "Financial Acct", duration: "3 hrs" },
        { title: "Cost & Management Accounting", yt: "https://www.youtube.com/watch?v=7t9spv2GXGM", ytTitle: "Cost Accounting", duration: "2.5 hrs" },
        { title: "Taxation (GST & Income Tax)", yt: "https://www.youtube.com/watch?v=7t9spv2GXGM", ytTitle: "Taxation", duration: "2.5 hrs" },
        { title: "Financial Management", yt: "https://www.youtube.com/watch?v=7t9spv2GXGM", ytTitle: "Finance Mgmt", duration: "2 hrs" },
        { title: "Auditing & Assurance", yt: "https://www.youtube.com/watch?v=7t9spv2GXGM", ytTitle: "Auditing", duration: "2 hrs" },
        { title: "E-Commerce for Commerce", yt: "https://www.youtube.com/watch?v=7t9spv2GXGM", ytTitle: "E-Commerce", duration: "1.5 hrs" },
    ],
    bca: [
        { title: "Programming in C", yt: "https://www.youtube.com/watch?v=zOjov-2OZ0E", ytTitle: "C Programming", duration: "4 hrs" },
        { title: "Data Structures", yt: "https://www.youtube.com/watch?v=8hly31xKli0", ytTitle: "DSA", duration: "3 hrs" },
        { title: "Database Management", yt: "https://www.youtube.com/watch?v=HXV3zeQKqGY", ytTitle: "DBMS", duration: "3 hrs" },
        { title: "Web Development (HTML/CSS/JS)", yt: "https://www.youtube.com/watch?v=pQN-pnXPaVg", ytTitle: "Web Dev", duration: "4 hrs" },
        { title: "Java Programming", yt: "https://www.youtube.com/watch?v=eIrMbAQSU34", ytTitle: "Java Full", duration: "5 hrs" },
        { title: "Operating Systems", yt: "https://www.youtube.com/watch?v=vBURTt97EkA", ytTitle: "OS", duration: "2.5 hrs" },
        { title: "Software Engineering", yt: "https://www.youtube.com/watch?v=B3y0RsVCyrw", ytTitle: "SE", duration: "2 hrs" },
        { title: "Computer Networks", yt: "https://www.youtube.com/watch?v=VwN91x5i25g", ytTitle: "Networking", duration: "2 hrs" },
        { title: "Mobile App Development", yt: "https://www.youtube.com/watch?v=x0uinJvhNxI", ytTitle: "Android Dev", duration: "4 hrs" },
        { title: "BCA Capstone Project", yt: "https://www.youtube.com/watch?v=Oe421EPjeBE", ytTitle: "BCA Capstone", duration: "2.5 hrs" },
    ],
    "ba-psy": [
        { title: "Introduction to Psychology", yt: "https://www.youtube.com/watch?v=vo4pMVb0R6M", ytTitle: "Psychology Intro", duration: "2.5 hrs" },
        { title: "Developmental Psychology", yt: "https://www.youtube.com/watch?v=vo4pMVb0R6M", ytTitle: "Developmental Psy", duration: "2 hrs" },
        { title: "Cognitive Psychology", yt: "https://www.youtube.com/watch?v=vo4pMVb0R6M", ytTitle: "Cognition", duration: "2.5 hrs" },
        { title: "Social Psychology", yt: "https://www.youtube.com/watch?v=vo4pMVb0R6M", ytTitle: "Social Psy", duration: "2 hrs" },
        { title: "Abnormal Psychology", yt: "https://www.youtube.com/watch?v=vo4pMVb0R6M", ytTitle: "Abnormal Psy", duration: "2.5 hrs" },
        { title: "Counselling Techniques", yt: "https://www.youtube.com/watch?v=vo4pMVb0R6M", ytTitle: "Counselling", duration: "2 hrs" },
        { title: "Industrial & Organisational Psychology", yt: "https://www.youtube.com/watch?v=vo4pMVb0R6M", ytTitle: "Industrial Psy", duration: "2 hrs" },
        { title: "Research Methods in Psychology", yt: "https://www.youtube.com/watch?v=vo4pMVb0R6M", ytTitle: "Research Methods", duration: "2 hrs" },
    ],
    "ba-eco": [
        { title: "Microeconomics", yt: "https://www.youtube.com/watch?v=3ez10ADR_gM", ytTitle: "Microeconomics", duration: "3 hrs" },
        { title: "Macroeconomics", yt: "https://www.youtube.com/watch?v=3ez10ADR_gM", ytTitle: "Macroeconomics", duration: "3 hrs" },
        { title: "Indian Economy", yt: "https://www.youtube.com/watch?v=3ez10ADR_gM", ytTitle: "Indian Economy", duration: "2 hrs" },
        { title: "International Economics", yt: "https://www.youtube.com/watch?v=3ez10ADR_gM", ytTitle: "Intl Economics", duration: "2.5 hrs" },
        { title: "Development Economics", yt: "https://www.youtube.com/watch?v=3ez10ADR_gM", ytTitle: "Dev Economics", duration: "2 hrs" },
        { title: "Econometrics", yt: "https://www.youtube.com/watch?v=xxpc-HPKN28", ytTitle: "Econometrics", duration: "3 hrs" },
        { title: "Public Finance & Policy", yt: "https://www.youtube.com/watch?v=3ez10ADR_gM", ytTitle: "Public Finance", duration: "2 hrs" },
        { title: "Money, Banking & Finance", yt: "https://www.youtube.com/watch?v=3ez10ADR_gM", ytTitle: "Money & Banking", duration: "2 hrs" },
    ],
    llb: [
        { title: "Introduction to Law & Legal System", yt: "https://www.youtube.com/watch?v=Oe421EPjeBE", ytTitle: "Law Intro", duration: "2 hrs" },
        { title: "Constitutional Law", yt: "https://www.youtube.com/watch?v=Oe421EPjeBE", ytTitle: "Constitutional Law", duration: "3 hrs" },
        { title: "Law of Contracts", yt: "https://www.youtube.com/watch?v=Oe421EPjeBE", ytTitle: "Contract Law", duration: "2.5 hrs" },
        { title: "Criminal Law (IPC/BNS)", yt: "https://www.youtube.com/watch?v=Oe421EPjeBE", ytTitle: "Criminal Law", duration: "3 hrs" },
        { title: "Civil Procedure Code", yt: "https://www.youtube.com/watch?v=Oe421EPjeBE", ytTitle: "CPC", duration: "2 hrs" },
        { title: "Family Law", yt: "https://www.youtube.com/watch?v=Oe421EPjeBE", ytTitle: "Family Law", duration: "2 hrs" },
        { title: "Corporate & Commercial Law", yt: "https://www.youtube.com/watch?v=Oe421EPjeBE", ytTitle: "Corporate Law", duration: "2.5 hrs" },
        { title: "Intellectual Property Law", yt: "https://www.youtube.com/watch?v=Oe421EPjeBE", ytTitle: "IP Law", duration: "2 hrs" },
        { title: "Moot Court & Legal Drafting", yt: "https://www.youtube.com/watch?v=Oe421EPjeBE", ytTitle: "Moot Court", duration: "2 hrs" },
    ],
    hotel: [
        { title: "Introduction to Hospitality Industry", yt: "https://www.youtube.com/watch?v=Oe421EPjeBE", ytTitle: "Hospitality", duration: "1.5 hrs" },
        { title: "Front Office Management", yt: "https://www.youtube.com/watch?v=Oe421EPjeBE", ytTitle: "Front Office", duration: "2 hrs" },
        { title: "Food & Beverage Service", yt: "https://www.youtube.com/watch?v=Oe421EPjeBE", ytTitle: "F&B Service", duration: "2.5 hrs" },
        { title: "Housekeeping Operations", yt: "https://www.youtube.com/watch?v=Oe421EPjeBE", ytTitle: "Housekeeping", duration: "2 hrs" },
        { title: "Food Production & Culinary Arts", yt: "https://www.youtube.com/watch?v=Oe421EPjeBE", ytTitle: "Culinary Arts", duration: "3 hrs" },
        { title: "Hotel Revenue Management", yt: "https://www.youtube.com/watch?v=Oe421EPjeBE", ytTitle: "Revenue Mgmt", duration: "2 hrs" },
        { title: "Event & Banquet Management", yt: "https://www.youtube.com/watch?v=Oe421EPjeBE", ytTitle: "Event Mgmt", duration: "2 hrs" },
        { title: "Customer Experience & Service", yt: "https://www.youtube.com/watch?v=Oe421EPjeBE", ytTitle: "Customer Service", duration: "1.5 hrs" },
    ],
    anim: [
        { title: "Principles of Animation (12 Rules)", yt: "https://www.youtube.com/watch?v=Oe421EPjeBE", ytTitle: "Animation Principles", duration: "2.5 hrs" },
        { title: "Adobe Photoshop & Illustrator", yt: "https://www.youtube.com/watch?v=Oe421EPjeBE", ytTitle: "Adobe Suite", duration: "3 hrs" },
        { title: "2D Animation with After Effects", yt: "https://www.youtube.com/watch?v=Oe421EPjeBE", ytTitle: "After Effects", duration: "3 hrs" },
        { title: "3D Modelling with Blender", yt: "https://www.youtube.com/watch?v=Oe421EPjeBE", ytTitle: "Blender 3D", duration: "4 hrs" },
        { title: "Character Design & Rigging", yt: "https://www.youtube.com/watch?v=Oe421EPjeBE", ytTitle: "Char Rigging", duration: "3 hrs" },
        { title: "Video Editing (Premiere Pro)", yt: "https://www.youtube.com/watch?v=Oe421EPjeBE", ytTitle: "Premiere Pro", duration: "3 hrs" },
        { title: "Motion Graphics Design", yt: "https://www.youtube.com/watch?v=Oe421EPjeBE", ytTitle: "Motion Graphics", duration: "2.5 hrs" },
        { title: "VFX & Compositing", yt: "https://www.youtube.com/watch?v=Oe421EPjeBE", ytTitle: "VFX", duration: "3 hrs" },
        { title: "Game Design & Unity Basics", yt: "https://www.youtube.com/watch?v=Oe421EPjeBE", ytTitle: "Unity Game Dev", duration: "4 hrs" },
    ],
    ro: [
        { title: "Introduction to Robotics", yt: "https://www.youtube.com/watch?v=Ye7Wg_BhzUw", ytTitle: "Robotics Intro", duration: "2 hrs" },
        { title: "Electronics & Sensors", yt: "https://www.youtube.com/watch?v=4NpZedvVMeo", ytTitle: "Sensors", duration: "2.5 hrs" },
        { title: "Arduino & Microcontrollers", yt: "https://www.youtube.com/watch?v=fJWR7dBuc18", ytTitle: "Arduino", duration: "3 hrs" },
        { title: "Kinematics & Dynamics", yt: "https://www.youtube.com/watch?v=BQSb0LYAarU", ytTitle: "Kinematics", duration: "3 hrs" },
        { title: "Robot Programming (ROS)", yt: "https://www.youtube.com/watch?v=Ye7Wg_BhzUw", ytTitle: "ROS Tutorial", duration: "3 hrs" },
        { title: "Machine Vision & AI", yt: "https://www.youtube.com/watch?v=oXlwWbU8l2o", ytTitle: "Computer Vision", duration: "2.5 hrs" },
        { title: "Industrial Automation & PLCs", yt: "https://www.youtube.com/watch?v=BQSb0LYAarU", ytTitle: "PLC Automation", duration: "2.5 hrs" },
        { title: "Robotics Capstone Project", yt: "https://www.youtube.com/watch?v=Ye7Wg_BhzUw", ytTitle: "Robotics Project", duration: "3 hrs" },
    ],
    mec: [
        { title: "Engineering Mechanics", yt: "https://www.youtube.com/watch?v=BQSb0LYAarU", ytTitle: "Mechanics", duration: "3 hrs" },
        { title: "Electronics & Circuits", yt: "https://www.youtube.com/watch?v=mc979OhitAg", ytTitle: "Electronics", duration: "2.5 hrs" },
        { title: "Sensors & Transducers", yt: "https://www.youtube.com/watch?v=4NpZedvVMeo", ytTitle: "Sensors", duration: "2 hrs" },
        { title: "Control Systems", yt: "https://www.youtube.com/watch?v=mc979OhitAg", ytTitle: "Control Systems", duration: "3 hrs" },
        { title: "Microcontrollers & Embedded Systems", yt: "https://www.youtube.com/watch?v=fJWR7dBuc18", ytTitle: "Embedded Systems", duration: "3 hrs" },
        { title: "Hydraulics & Pneumatics", yt: "https://www.youtube.com/watch?v=VasSl5R0V9c", ytTitle: "Hydraulics", duration: "2.5 hrs" },
        { title: "CAD/CAM Systems", yt: "https://www.youtube.com/watch?v=YAIiWcyL_Mg", ytTitle: "CAD/CAM", duration: "3 hrs" },
        { title: "Mechatronics Capstone", yt: "https://www.youtube.com/watch?v=FaOkTuMkXe4", ytTitle: "Mechatronics Project", duration: "2 hrs" },
    ],
    aero: [
        { title: "Introduction to Aerospace", yt: "https://www.youtube.com/watch?v=6GVSi9e89LA", ytTitle: "Aerospace Intro", duration: "2 hrs" },
        { title: "Aerodynamics Fundamentals", yt: "https://www.youtube.com/watch?v=6GVSi9e89LA", ytTitle: "Aerodynamics", duration: "3 hrs" },
        { title: "Propulsion Systems", yt: "https://www.youtube.com/watch?v=6GVSi9e89LA", ytTitle: "Propulsion", duration: "2.5 hrs" },
        { title: "Flight Mechanics", yt: "https://www.youtube.com/watch?v=6GVSi9e89LA", ytTitle: "Flight Mechanics", duration: "3 hrs" },
        { title: "Structural Analysis (Aerospace)", yt: "https://www.youtube.com/watch?v=kqX7y9hkDqQ", ytTitle: "Structures", duration: "2.5 hrs" },
        { title: "Avionics & Navigation", yt: "https://www.youtube.com/watch?v=6GVSi9e89LA", ytTitle: "Avionics", duration: "2 hrs" },
        { title: "Space Technology & Satellites", yt: "https://www.youtube.com/watch?v=6GVSi9e89LA", ytTitle: "Space Tech", duration: "2.5 hrs" },
        { title: "Aerospace Capstone Project", yt: "https://www.youtube.com/watch?v=6GVSi9e89LA", ytTitle: "Aerospace Project", duration: "3 hrs" },
    ],
    auto: [
        { title: "Automotive Engineering Basics", yt: "https://www.youtube.com/watch?v=zX3l8Gbm8kk", ytTitle: "Auto Engineering", duration: "2 hrs" },
        { title: "Engine Design & Combustion", yt: "https://www.youtube.com/watch?v=RgjKCGz8XfY", ytTitle: "Combustion Engines", duration: "3 hrs" },
        { title: "Transmission & Drivetrain", yt: "https://www.youtube.com/watch?v=zX3l8Gbm8kk", ytTitle: "Transmission", duration: "2.5 hrs" },
        { title: "Vehicle Dynamics & Suspension", yt: "https://www.youtube.com/watch?v=zX3l8Gbm8kk", ytTitle: "Vehicle Dynamics", duration: "2.5 hrs" },
        { title: "Automotive Electronics (ECU)", yt: "https://www.youtube.com/watch?v=mc979OhitAg", ytTitle: "Auto Electronics", duration: "2 hrs" },
        { title: "Electric Vehicles & Hybrids", yt: "https://www.youtube.com/watch?v=mc979OhitAg", ytTitle: "EV Technology", duration: "3 hrs" },
        { title: "CAD for Automotive Design", yt: "https://www.youtube.com/watch?v=YAIiWcyL_Mg", ytTitle: "Auto CAD", duration: "2.5 hrs" },
        { title: "Automotive Capstone", yt: "https://www.youtube.com/watch?v=zX3l8Gbm8kk", ytTitle: "Auto Project", duration: "2 hrs" },
    ],

    "bsc-chem": [
        { title: "Physical Chemistry", yt: "https://www.youtube.com/watch?v=uVFCOfSuPto", ytTitle: "Physical Chemistry", duration: "3 hrs" },
        { title: "Organic Chemistry", yt: "https://www.youtube.com/watch?v=uVFCOfSuPto", ytTitle: "Organic Chemistry", duration: "4 hrs" },
        { title: "Inorganic Chemistry", yt: "https://www.youtube.com/watch?v=uVFCOfSuPto", ytTitle: "Inorganic Chemistry", duration: "3 hrs" },
        { title: "Analytical Chemistry", yt: "https://www.youtube.com/watch?v=uVFCOfSuPto", ytTitle: "Analytical Chem", duration: "2.5 hrs" },
        { title: "Spectroscopy", yt: "https://www.youtube.com/watch?v=uVFCOfSuPto", ytTitle: "Spectroscopy", duration: "2 hrs" },
        { title: "Polymer Chemistry", yt: "https://www.youtube.com/watch?v=uVFCOfSuPto", ytTitle: "Polymer Chem", duration: "2 hrs" },
        { title: "Green Chemistry", yt: "https://www.youtube.com/watch?v=uVFCOfSuPto", ytTitle: "Green Chemistry", duration: "1.5 hrs" },
        { title: "Chemistry Research Methods", yt: "https://www.youtube.com/watch?v=uVFCOfSuPto", ytTitle: "Research Methods", duration: "2 hrs" },
    ],
    "bsc-stat": [
        { title: "Descriptive Statistics", yt: "https://www.youtube.com/watch?v=xxpc-HPKN28", ytTitle: "Descriptive Stats", duration: "2.5 hrs" },
        { title: "Probability Theory", yt: "https://www.youtube.com/watch?v=xxpc-HPKN28", ytTitle: "Probability", duration: "3 hrs" },
        { title: "Sampling Theory", yt: "https://www.youtube.com/watch?v=xxpc-HPKN28", ytTitle: "Sampling", duration: "2 hrs" },
        { title: "Statistical Inference", yt: "https://www.youtube.com/watch?v=xxpc-HPKN28", ytTitle: "Inference", duration: "3 hrs" },
        { title: "Regression Analysis", yt: "https://www.youtube.com/watch?v=xxpc-HPKN28", ytTitle: "Regression", duration: "2.5 hrs" },
        { title: "Time Series Analysis", yt: "https://www.youtube.com/watch?v=xxpc-HPKN28", ytTitle: "Time Series", duration: "2 hrs" },
        { title: "R Programming for Statistics", yt: "https://www.youtube.com/watch?v=xxpc-HPKN28", ytTitle: "R Programming", duration: "3 hrs" },
        { title: "Applied Statistics Capstone", yt: "https://www.youtube.com/watch?v=xxpc-HPKN28", ytTitle: "Stats Capstone", duration: "2 hrs" },
    ],
    "bsc-it": [
        { title: "IT Fundamentals", yt: "https://www.youtube.com/watch?v=VfGW0Qiy2I0", ytTitle: "IT Basics", duration: "2 hrs" },
        { title: "Programming in Python", yt: "https://www.youtube.com/watch?v=_uQrJ0TkZlc", ytTitle: "Python", duration: "4 hrs" },
        { title: "Database Management", yt: "https://www.youtube.com/watch?v=HXV3zeQKqGY", ytTitle: "DBMS", duration: "3 hrs" },
        { title: "Networking Basics", yt: "https://www.youtube.com/watch?v=qiQR5rTSshw", ytTitle: "Networking", duration: "2.5 hrs" },
        { title: "Web Development", yt: "https://www.youtube.com/watch?v=pQN-pnXPaVg", ytTitle: "Web Dev", duration: "4 hrs" },
        { title: "Cybersecurity Essentials", yt: "https://www.youtube.com/watch?v=inWWhr5tnEA", ytTitle: "Cybersecurity", duration: "2 hrs" },
        { title: "Cloud & DevOps Basics", yt: "https://www.youtube.com/watch?v=M988_fsOSWo", ytTitle: "Cloud", duration: "2.5 hrs" },
        { title: "IT Capstone Project", yt: "https://www.youtube.com/watch?v=VfGW0Qiy2I0", ytTitle: "IT Capstone", duration: "2 hrs" },
    ],
    "bsc-ai": [
        { title: "Python for AI", yt: "https://www.youtube.com/watch?v=_uQrJ0TkZlc", ytTitle: "Python AI", duration: "4 hrs" },
        { title: "Mathematics for AI", yt: "https://www.youtube.com/watch?v=fNk_zzaMoSs", ytTitle: "Math for AI", duration: "3 hrs" },
        { title: "Machine Learning Fundamentals", yt: "https://www.youtube.com/watch?v=GwIo3gDZCVQ", ytTitle: "ML Basics", duration: "4 hrs" },
        { title: "Deep Learning", yt: "https://www.youtube.com/watch?v=aircAruvnKk", ytTitle: "Deep Learning", duration: "3 hrs" },
        { title: "NLP & Text Mining", yt: "https://www.youtube.com/watch?v=X2vAabgKiuM", ytTitle: "NLP", duration: "2.5 hrs" },
        { title: "Computer Vision", yt: "https://www.youtube.com/watch?v=oXlwWbU8l2o", ytTitle: "Computer Vision", duration: "2.5 hrs" },
        { title: "AI Ethics & Policy", yt: "https://www.youtube.com/watch?v=ad79nYk2keg", ytTitle: "AI Ethics", duration: "1.5 hrs" },
        { title: "AI Capstone Project", yt: "https://www.youtube.com/watch?v=ad79nYk2keg", ytTitle: "AI Capstone", duration: "3 hrs" },
    ],
    "bsc-ds": [
        { title: "Introduction to Data Science", yt: "https://www.youtube.com/watch?v=ua-CiDNNj30", ytTitle: "DS Intro", duration: "2 hrs" },
        { title: "Python & Pandas", yt: "https://www.youtube.com/watch?v=vmEHCJofslg", ytTitle: "Pandas", duration: "3 hrs" },
        { title: "Exploratory Data Analysis", yt: "https://www.youtube.com/watch?v=a9UrKTVEhZA", ytTitle: "EDA", duration: "2.5 hrs" },
        { title: "SQL for Data", yt: "https://www.youtube.com/watch?v=HXV3zeQKqGY", ytTitle: "SQL", duration: "2.5 hrs" },
        { title: "Statistics for DS", yt: "https://www.youtube.com/watch?v=xxpc-HPKN28", ytTitle: "Stats", duration: "2.5 hrs" },
        { title: "Machine Learning", yt: "https://www.youtube.com/watch?v=GwIo3gDZCVQ", ytTitle: "ML", duration: "4 hrs" },
        { title: "Data Visualization", yt: "https://www.youtube.com/watch?v=TPMlZxRRaBQ", ytTitle: "Visualization", duration: "2 hrs" },
        { title: "DS Capstone", yt: "https://www.youtube.com/watch?v=ua-CiDNNj30", ytTitle: "DS Capstone", duration: "2 hrs" },
    ],
    "bsc-bt": [
        { title: "Cell Biology", yt: "https://www.youtube.com/watch?v=2NeSP-ogJgY", ytTitle: "Cell Biology", duration: "3 hrs" },
        { title: "Genetics & Molecular Biology", yt: "https://www.youtube.com/watch?v=jAhjPd4uNFY", ytTitle: "Genetics", duration: "3 hrs" },
        { title: "Biochemistry", yt: "https://www.youtube.com/watch?v=7Hk9jct2ozY", ytTitle: "Biochem", duration: "2.5 hrs" },
        { title: "Microbiology", yt: "https://www.youtube.com/watch?v=URUJD5NEXC8", ytTitle: "Microbiology", duration: "2 hrs" },
        { title: "Recombinant DNA Technology", yt: "https://www.youtube.com/watch?v=2NeSP-ogJgY", ytTitle: "rDNA Tech", duration: "2.5 hrs" },
        { title: "Bioinformatics", yt: "https://www.youtube.com/watch?v=ua-CiDNNj30", ytTitle: "Bioinformatics", duration: "2 hrs" },
        { title: "Plant & Animal Biotechnology", yt: "https://www.youtube.com/watch?v=2NeSP-ogJgY", ytTitle: "Applied Biotech", duration: "2 hrs" },
        { title: "Biotech Capstone Project", yt: "https://www.youtube.com/watch?v=2NeSP-ogJgY", ytTitle: "Biotech Project", duration: "2.5 hrs" },
    ],
    "bsc-mb": [
        { title: "Introduction to Microbiology", yt: "https://www.youtube.com/watch?v=URUJD5NEXC8", ytTitle: "Microbiology Intro", duration: "2 hrs" },
        { title: "Bacteriology", yt: "https://www.youtube.com/watch?v=URUJD5NEXC8", ytTitle: "Bacteriology", duration: "2.5 hrs" },
        { title: "Virology", yt: "https://www.youtube.com/watch?v=URUJD5NEXC8", ytTitle: "Virology", duration: "2 hrs" },
        { title: "Mycology & Parasitology", yt: "https://www.youtube.com/watch?v=URUJD5NEXC8", ytTitle: "Mycology", duration: "2 hrs" },
        { title: "Immunology", yt: "https://www.youtube.com/watch?v=URUJD5NEXC8", ytTitle: "Immunology", duration: "2.5 hrs" },
        { title: "Clinical Microbiology", yt: "https://www.youtube.com/watch?v=URUJD5NEXC8", ytTitle: "Clinical Micro", duration: "2 hrs" },
        { title: "Microbial Biotechnology", yt: "https://www.youtube.com/watch?v=2NeSP-ogJgY", ytTitle: "Microbial Biotech", duration: "2 hrs" },
        { title: "Microbiology Lab Techniques", yt: "https://www.youtube.com/watch?v=URUJD5NEXC8", ytTitle: "Lab Techniques", duration: "2 hrs" },
    ],
    "ba-eng": [
        { title: "Introduction to Literature", yt: "https://www.youtube.com/watch?v=Oe421EPjeBE", ytTitle: "Lit Intro", duration: "2 hrs" },
        { title: "Poetry Analysis", yt: "https://www.youtube.com/watch?v=Oe421EPjeBE", ytTitle: "Poetry", duration: "2 hrs" },
        { title: "Fiction & Novel Studies", yt: "https://www.youtube.com/watch?v=Oe421EPjeBE", ytTitle: "Fiction", duration: "2.5 hrs" },
        { title: "Drama & Theatre", yt: "https://www.youtube.com/watch?v=Oe421EPjeBE", ytTitle: "Drama", duration: "2 hrs" },
        { title: "Literary Criticism & Theory", yt: "https://www.youtube.com/watch?v=Oe421EPjeBE", ytTitle: "Lit Theory", duration: "2.5 hrs" },
        { title: "Creative Writing", yt: "https://www.youtube.com/watch?v=Oe421EPjeBE", ytTitle: "Creative Writing", duration: "2 hrs" },
        { title: "Communication & Soft Skills", yt: "https://www.youtube.com/watch?v=Oe421EPjeBE", ytTitle: "Soft Skills", duration: "2 hrs" },
        { title: "English for Media & Journalism", yt: "https://www.youtube.com/watch?v=Oe421EPjeBE", ytTitle: "Media English", duration: "1.5 hrs" },
    ],

    "ba-jour": [
        { title: "Introduction to Journalism", yt: "https://www.youtube.com/watch?v=Oe421EPjeBE", ytTitle: "Journalism Intro", duration: "2 hrs" },
        { title: "News Writing & Reporting", yt: "https://www.youtube.com/watch?v=Oe421EPjeBE", ytTitle: "News Writing", duration: "2.5 hrs" },
        { title: "Broadcast Journalism", yt: "https://www.youtube.com/watch?v=Oe421EPjeBE", ytTitle: "Broadcast", duration: "2 hrs" },
        { title: "Digital & Online Journalism", yt: "https://www.youtube.com/watch?v=Oe421EPjeBE", ytTitle: "Digital Journalism", duration: "2 hrs" },
        { title: "Investigative Journalism", yt: "https://www.youtube.com/watch?v=Oe421EPjeBE", ytTitle: "Investigative", duration: "2 hrs" },
        { title: "Media Ethics & Law", yt: "https://www.youtube.com/watch?v=Oe421EPjeBE", ytTitle: "Media Law", duration: "1.5 hrs" },
        { title: "Photojournalism", yt: "https://www.youtube.com/watch?v=Oe421EPjeBE", ytTitle: "Photojournalism", duration: "2 hrs" },
        { title: "Journalism Portfolio Project", yt: "https://www.youtube.com/watch?v=Oe421EPjeBE", ytTitle: "Portfolio", duration: "1.5 hrs" },
    ],
    "bcom-af": [
        { title: "Financial Accounting", yt: "https://www.youtube.com/watch?v=7t9spv2GXGM", ytTitle: "Financial Acct", duration: "3 hrs" },
        { title: "Cost Accounting", yt: "https://www.youtube.com/watch?v=7t9spv2GXGM", ytTitle: "Cost Acct", duration: "2.5 hrs" },
        { title: "Corporate Finance", yt: "https://www.youtube.com/watch?v=7t9spv2GXGM", ytTitle: "Corporate Finance", duration: "3 hrs" },
        { title: "Investment Analysis", yt: "https://www.youtube.com/watch?v=7t9spv2GXGM", ytTitle: "Investments", duration: "2 hrs" },
        { title: "Taxation (GST & Income Tax)", yt: "https://www.youtube.com/watch?v=7t9spv2GXGM", ytTitle: "Taxation", duration: "2.5 hrs" },
        { title: "Auditing & Assurance", yt: "https://www.youtube.com/watch?v=7t9spv2GXGM", ytTitle: "Auditing", duration: "2 hrs" },
        { title: "Financial Markets", yt: "https://www.youtube.com/watch?v=7t9spv2GXGM", ytTitle: "Markets", duration: "2 hrs" },
        { title: "Finance Capstone", yt: "https://www.youtube.com/watch?v=7t9spv2GXGM", ytTitle: "Finance Project", duration: "2 hrs" },
    ],
    "bcom-ca": [
        { title: "Accounting Fundamentals", yt: "https://www.youtube.com/watch?v=7t9spv2GXGM", ytTitle: "Accounting", duration: "2.5 hrs" },
        { title: "Programming in C", yt: "https://www.youtube.com/watch?v=zOjov-2OZ0E", ytTitle: "C Programming", duration: "3 hrs" },
        { title: "Database Management", yt: "https://www.youtube.com/watch?v=HXV3zeQKqGY", ytTitle: "DBMS", duration: "2.5 hrs" },
        { title: "Web Development", yt: "https://www.youtube.com/watch?v=pQN-pnXPaVg", ytTitle: "Web Dev", duration: "3 hrs" },
        { title: "E-Commerce & Accounting Software", yt: "https://www.youtube.com/watch?v=7t9spv2GXGM", ytTitle: "E-Commerce", duration: "2 hrs" },
        { title: "Taxation & Tally", yt: "https://www.youtube.com/watch?v=7t9spv2GXGM", ytTitle: "Tally & Tax", duration: "2.5 hrs" },
        { title: "Business Analytics", yt: "https://www.youtube.com/watch?v=ua-CiDNNj30", ytTitle: "Business Analytics", duration: "2 hrs" },
        { title: "BCA Capstone", yt: "https://www.youtube.com/watch?v=7t9spv2GXGM", ytTitle: "Capstone", duration: "2 hrs" },
    ],
    bms: [
        { title: "Principles of Management", yt: "https://www.youtube.com/watch?v=7t9spv2GXGM", ytTitle: "Management", duration: "2.5 hrs" },
        { title: "Business Economics", yt: "https://www.youtube.com/watch?v=3ez10ADR_gM", ytTitle: "Biz Economics", duration: "2.5 hrs" },
        { title: "Marketing Management", yt: "https://www.youtube.com/watch?v=7t9spv2GXGM", ytTitle: "Marketing", duration: "2.5 hrs" },
        { title: "Financial Management", yt: "https://www.youtube.com/watch?v=7t9spv2GXGM", ytTitle: "Finance", duration: "2.5 hrs" },
        { title: "Human Resource Management", yt: "https://www.youtube.com/watch?v=7t9spv2GXGM", ytTitle: "HRM", duration: "2 hrs" },
        { title: "Operations Management", yt: "https://www.youtube.com/watch?v=7t9spv2GXGM", ytTitle: "Operations", duration: "2 hrs" },
        { title: "Strategic Management", yt: "https://www.youtube.com/watch?v=7t9spv2GXGM", ytTitle: "Strategy", duration: "2 hrs" },
        { title: "Entrepreneurship & Startups", yt: "https://www.youtube.com/watch?v=7t9spv2GXGM", ytTitle: "Entrepreneurship", duration: "2 hrs" },
    ],
    bpharm: [
        { title: "Pharmaceutical Chemistry", yt: "https://www.youtube.com/watch?v=uVFCOfSuPto", ytTitle: "Pharma Chemistry", duration: "3 hrs" },
        { title: "Pharmacology", yt: "https://www.youtube.com/watch?v=Oe421EPjeBE", ytTitle: "Pharmacology", duration: "3 hrs" },
        { title: "Pharmaceutics (Drug Formulation)", yt: "https://www.youtube.com/watch?v=Oe421EPjeBE", ytTitle: "Pharmaceutics", duration: "2.5 hrs" },
        { title: "Pharmaceutical Analysis", yt: "https://www.youtube.com/watch?v=uVFCOfSuPto", ytTitle: "Pharma Analysis", duration: "2.5 hrs" },
        { title: "Clinical Pharmacy", yt: "https://www.youtube.com/watch?v=Oe421EPjeBE", ytTitle: "Clinical Pharmacy", duration: "2 hrs" },
        { title: "Drug Regulatory Affairs", yt: "https://www.youtube.com/watch?v=Oe421EPjeBE", ytTitle: "Regulatory Affairs", duration: "2 hrs" },
        { title: "Hospital Pharmacy", yt: "https://www.youtube.com/watch?v=Oe421EPjeBE", ytTitle: "Hospital Pharmacy", duration: "2 hrs" },
        { title: "Pharmacy Capstone", yt: "https://www.youtube.com/watch?v=Oe421EPjeBE", ytTitle: "Pharmacy Project", duration: "2 hrs" },
    ],
    bdes: [
        { title: "Design Fundamentals & Principles", yt: "https://www.youtube.com/watch?v=Oe421EPjeBE", ytTitle: "Design Basics", duration: "2 hrs" },
        { title: "Typography & Colour Theory", yt: "https://www.youtube.com/watch?v=Oe421EPjeBE", ytTitle: "Typography", duration: "2 hrs" },
        { title: "UI/UX Design Fundamentals", yt: "https://www.youtube.com/watch?v=Oe421EPjeBE", ytTitle: "UI/UX", duration: "3 hrs" },
        { title: "Figma & Prototyping", yt: "https://www.youtube.com/watch?v=Oe421EPjeBE", ytTitle: "Figma", duration: "3 hrs" },
        { title: "Branding & Visual Identity", yt: "https://www.youtube.com/watch?v=Oe421EPjeBE", ytTitle: "Branding", duration: "2.5 hrs" },
        { title: "Product Design", yt: "https://www.youtube.com/watch?v=Oe421EPjeBE", ytTitle: "Product Design", duration: "2.5 hrs" },
        { title: "Design Research & User Testing", yt: "https://www.youtube.com/watch?v=Oe421EPjeBE", ytTitle: "Design Research", duration: "2 hrs" },
        { title: "Design Portfolio & Capstone", yt: "https://www.youtube.com/watch?v=Oe421EPjeBE", ytTitle: "Design Portfolio", duration: "2 hrs" },
    ],
    fashion: [
        { title: "History of Fashion", yt: "https://www.youtube.com/watch?v=Oe421EPjeBE", ytTitle: "Fashion History", duration: "2 hrs" },
        { title: "Fashion Illustration", yt: "https://www.youtube.com/watch?v=Oe421EPjeBE", ytTitle: "Fashion Drawing", duration: "2.5 hrs" },
        { title: "Textile Science & Fabric", yt: "https://www.youtube.com/watch?v=Oe421EPjeBE", ytTitle: "Textiles", duration: "2 hrs" },
        { title: "Pattern Making & Cutting", yt: "https://www.youtube.com/watch?v=Oe421EPjeBE", ytTitle: "Pattern Making", duration: "3 hrs" },
        { title: "Garment Construction", yt: "https://www.youtube.com/watch?v=Oe421EPjeBE", ytTitle: "Garments", duration: "2.5 hrs" },
        { title: "Fashion Merchandising", yt: "https://www.youtube.com/watch?v=Oe421EPjeBE", ytTitle: "Merchandising", duration: "2 hrs" },
        { title: "Digital Fashion & Trendforecasting", yt: "https://www.youtube.com/watch?v=Oe421EPjeBE", ytTitle: "Digital Fashion", duration: "2 hrs" },
        { title: "Fashion Design Capstone", yt: "https://www.youtube.com/watch?v=Oe421EPjeBE", ytTitle: "Fashion Capstone", duration: "2 hrs" },
    ],
    interior: [
        { title: "Interior Design Principles", yt: "https://www.youtube.com/watch?v=Oe421EPjeBE", ytTitle: "Interior Basics", duration: "2 hrs" },
        { title: "Space Planning & Layouts", yt: "https://www.youtube.com/watch?v=Oe421EPjeBE", ytTitle: "Space Planning", duration: "2.5 hrs" },
        { title: "Colour & Lighting Design", yt: "https://www.youtube.com/watch?v=Oe421EPjeBE", ytTitle: "Colour & Light", duration: "2 hrs" },
        { title: "Furniture & Materials", yt: "https://www.youtube.com/watch?v=Oe421EPjeBE", ytTitle: "Furniture Design", duration: "2 hrs" },
        { title: "AutoCAD for Interiors", yt: "https://www.youtube.com/watch?v=YAIiWcyL_Mg", ytTitle: "AutoCAD", duration: "3 hrs" },
        { title: "3D Visualisation (SketchUp)", yt: "https://www.youtube.com/watch?v=Oe421EPjeBE", ytTitle: "3D Visualisation", duration: "3 hrs" },
        { title: "Sustainable Interior Design", yt: "https://www.youtube.com/watch?v=Oe421EPjeBE", ytTitle: "Sustainable Design", duration: "2 hrs" },
        { title: "Interior Design Portfolio", yt: "https://www.youtube.com/watch?v=Oe421EPjeBE", ytTitle: "Portfolio", duration: "2 hrs" },
    ],
};

// ─── Domain → Stream mapping for resume filtering ──
const DOMAIN_TO_STREAMS: Record<string, string[]> = {
    "Full-Stack Developer": ["cse", "it", "se", "bsc-cs", "bsc-it", "bca", "bcom-ca"],
    "AI/ML Engineer": ["ai", "aids", "aiml", "ds", "bsc-ai", "bsc-ds", "bsc-math", "bsc-stat"],
    "Data Scientist": ["ds", "aids", "bsc-ds", "bsc-stat", "bsc-math", "ai", "bsc-cs"],
    "DevOps Engineer": ["cse", "it", "se", "cy", "bsc-cs", "bsc-it"],
    "Backend Developer": ["cse", "se", "it", "bsc-cs", "bca"],
    "Mobile Developer": ["cse", "it", "se", "bsc-cs", "bsc-it", "bdes"],
    "Cyber Security": ["cy", "cse", "it", "bsc-cs"],
    "Mechanical Engineer": ["me", "mec", "auto", "aero", "ind", "prod", "mfg"],
    "Civil Engineer": ["ce", "env", "barch"],
    "Electronics Engineer": ["ece", "eee", "eie", "ee"],
};

// ─── Career roadmaps for each category ──────────
const CATEGORY_ROADMAP: Record<string, { steps: string[]; skills: string[]; jobs: string[] }> = {
    "Engineering": {
        steps: ["Master fundamentals (Math, Physics, Core domain)", "Build projects & upload to GitHub", "Earn cloud/domain certification", "Land internship or co-op", "Build industry network on LinkedIn"],
        skills: ["Problem Solving", "Domain-specific tools", "Git & Version Control", "Communication", "Data Analysis"],
        jobs: ["Junior Engineer", "Associate Developer", "Research Assistant", "Product Engineer"],
    },
    "Science": {
        steps: ["Complete core B.Sc syllabus with strong lab skills", "Learn data analysis tools (Python/R/MATLAB)", "Publish or contribute to research projects", "Apply for M.Sc or industry roles", "Build academic/professional online profile"],
        skills: ["Laboratory Skills", "Research Methodology", "Data Analysis", "Scientific Writing", "Statistics"],
        jobs: ["Lab Analyst", "Research Associate", "Data Scientist", "Quality Control Officer"],
    },
    "Arts": {
        steps: ["Develop deep subject expertise", "Build a strong writing/creative portfolio", "Learn digital tools (Canva, Adobe, social media)", "Network in your creative field", "Pursue PG or certification for specialization"],
        skills: ["Communication", "Creative Writing", "Research", "Digital Media", "Public Speaking"],
        jobs: ["Content Writer", "Journalist", "Public Relations Officer", "Educator", "Media Analyst"],
    },
    "Commerce": {
        steps: ["Master core accounting, finance, or management concepts", "Get Excel, Tally, or ERP certified", "Complete CA/CMA or MBA (optional)", "Apply for finance/management trainee roles", "Build business acumen with case studies"],
        skills: ["Accounting", "Excel & Tally", "Financial Analysis", "Business Communication", "Tax & Compliance"],
        jobs: ["Accountant", "Business Analyst", "Finance Manager", "Marketing Executive", "HR Officer"],
    },
    "Professional": {
        steps: ["Complete degree with industry-relevant projects", "Gain practical experience through internships", "Build specialization portfolio (design work, legal briefs, etc.)", "Network with industry professionals", "Pursue certifications in your area"],
        skills: ["Domain Expertise", "Client Communication", "Project Management", "Digital Tools", "Research"],
        jobs: ["Domain Specialist", "Consultant", "Manager", "Entrepreneur", "Researcher"],
    },
};

const DOMAIN_SKILLS_REQ: Record<string, string[]> = {
    "Full-Stack Developer": ["React", "Node.js", "MongoDB", "TypeScript", "HTML/CSS", "System Design"],
    "AI/ML Engineer": ["Python", "TensorFlow", "Scikit-Learn", "Deep Learning", "SQL", "Mathematics"],
    "Data Scientist": ["Python", "Pandas", "Statistics", "Machine Learning", "Data Visualization", "SQL"],
    "DevOps Engineer": ["AWS", "Docker", "Kubernetes", "Linux", "CI/CD", "Networking"],
    "Backend Developer": ["Java", "Spring Boot", "SQL", "APIs", "Microservices", "Data Structures"],
    "Mobile Developer": ["React Native", "Flutter", "Swift", "Kotlin", "UI/UX"],
    "Cyber Security": ["Networking", "Linux", "Ethical Hacking", "Cryptography", "Security Protocols"],
    "Mechanical Engineer": ["AutoCAD", "Thermodynamics", "Fluid Mechanics", "Manufacturing", "SolidWorks"],
    "Civil Engineer": ["AutoCAD", "Structural Analysis", "AutoCAD Civil 3D", "Surveying"],
    "Electronics Engineer": ["Circuit Design", "Microcontrollers", "Embedded Systems", "MATLAB", "Signals"],
};

const STREAM_SKILLS: Record<string, string[]> = {
    "cse": ["Data Structures", "HTML/CSS", "Java", "Python", "Networking", "MongoDB", "Node.js", "System Design"],
    "ai": ["Python", "Machine Learning", "Deep Learning", "Mathematics", "TensorFlow"],
    "aids": ["Python", "Pandas", "Statistics", "Data Visualization", "SQL", "Scikit-Learn"],
    "cy": ["Networking", "Linux", "Ethical Hacking", "Cryptography", "Security Protocols"],
    "me": ["AutoCAD", "Thermodynamics", "Fluid Mechanics", "Manufacturing", "SolidWorks"],
    "it": ["Networking", "Linux", "CI/CD", "AWS", "Docker", "TypeScript"],
    "se": ["React", "Node.js", "TypeScript", "Java", "Spring Boot", "Microservices", "Kubernetes"],
    "ds": ["SQL", "Pandas", "Machine Learning", "Data Visualization", "Python"],
    "ce": ["AutoCAD", "Structural Analysis", "Surveying", "AutoCAD Civil 3D"],
    "ece": ["Circuit Design", "Microcontrollers", "MATLAB", "Signals", "Embedded Systems"],
    "bsc-cs": ["React", "Node.js", "Python", "Data Structures", "SQL"],
    "bsc-it": ["Networking", "Linux", "CI/CD", "Docker", "APIs"],
    "bca": ["Java", "Spring Boot", "SQL", "APIs", "Microservices", "React Native"],
    "bcom-ca": ["SQL", "Data Structures", "APIs"],
    "aiml": ["Python", "TensorFlow", "Scikit-Learn", "Deep Learning"],
    "bsc-ai": ["Mathematics", "Python", "Scikit-Learn", "Machine Learning"],
    "bsc-ds": ["Python", "Pandas", "Data Visualization"],
    "bsc-math": ["Mathematics", "Statistics", "Data Visualization"],
    "bsc-stat": ["Statistics", "Python", "Machine Learning"],
    "eee": ["Circuit Design", "MATLAB", "Microcontrollers"],
    "eie": ["Embedded Systems", "Signals", "MATLAB"],
    "bdes": ["UI/UX", "Flutter", "Swift", "React Native"]
};

const CATEGORY_YT: Record<string, { title: string; url: string }> = {
    "Engineering": { title: "Engineering Career Roadmap", url: "https://www.youtube.com/watch?v=B3y0RsVCyrw" },
    "Science": { title: "Science Careers Explained", url: "https://www.youtube.com/watch?v=ua-CiDNNj30" },
    "Arts": { title: "Arts & Humanities Careers", url: "https://www.youtube.com/watch?v=wsYcxdTpB3E" },
    "Commerce": { title: "Commerce Career Guide", url: "https://www.youtube.com/watch?v=7t9spv2GXGM" },
    "Professional": { title: "Professional Courses Guide", url: "https://www.youtube.com/watch?v=Oe421EPjeBE" },
};

const CATS = ["All", "Engineering", "Science", "Arts", "Commerce", "Professional"];

export default function LearningPage() {
    const { profile, addXP, role } = useAppStore();
    const router = useRouter();
    const [search, setSearch] = useState("");
    const [filterCat, setFilterCat] = useState("All");
    const [selected, setSelected] = useState<typeof STREAMS[0] | null>(null);
    const [progress, setProgress] = useState<Record<string, boolean>>({});

    useEffect(() => {
        if (typeof window !== "undefined") {
            const p = localStorage.getItem("ciq-stream-progress");
            if (p) setProgress(JSON.parse(p));
        }
    }, []);

    const markDone = (id: string) => {
        if (progress[id]) return;
        const np = { ...progress, [id]: true };
        setProgress(np);
        localStorage.setItem("ciq-stream-progress", JSON.stringify(np));
        addXP(30, `Completed ${STREAMS.find(s => s.id === id)?.name || "module"}`);
        if (Object.keys(np).length % 4 === 0) localStorage.setItem("ciq-lesson-done", "1");
    };

    const filtered = STREAMS.filter(s => {
        const matchSearch = !search || s.name.toLowerCase().includes(search.toLowerCase());
        const matchCat = filterCat === "All" || s.cat === filterCat;
        return matchSearch && matchCat;
    });

    const totalDone = Object.keys(progress).length;

    // Resume-based recommendations
    const userDomain = profile?.domain || "";
    const allDomainCourseIds = DOMAIN_TO_STREAMS[userDomain] || [];
    const hasResume = !!profile?.skills?.length;

    // Step 1 - Identify Skill Gaps
    const domainReqSkills = DOMAIN_SKILLS_REQ[userDomain] || [];
    const userSkillsLower = (profile?.skills || []).map(s => s.toLowerCase());
    const missingSkills = domainReqSkills.filter(req => !userSkillsLower.some(ps => ps.includes(req.toLowerCase()) || req.toLowerCase().includes(ps)));

    // Step 2 & 4 - Course Recommendation (Filter mapped courses based on missing skills)
    const recommendedIds = allDomainCourseIds.filter(id => {
        const taughtSkills = STREAM_SKILLS[id] || [];
        // recommend course if it teaches any of the missing skills
        return taughtSkills.some(ts => missingSkills.some(ms => ms.toLowerCase() === ts.toLowerCase()));
    });
    // Fallback if no matching skills found but we have domain courses
    if (recommendedIds.length === 0 && missingSkills.length > 0 && allDomainCourseIds.length > 0) {
        recommendedIds.push(allDomainCourseIds[0]);
    }

    const [showRecommended, setShowRecommended] = useState(false);
    const [lessonProgress, setLessonProgress] = useState<Record<string, boolean>>({});

    useEffect(() => {
        if (typeof window !== "undefined") {
            const lp = localStorage.getItem("ciq-lesson-progress");
            if (lp) setLessonProgress(JSON.parse(lp));
        }
    }, []);

    const markLessonDone = (key: string) => {
        if (lessonProgress[key]) return;
        const np = { ...lessonProgress, [key]: true };
        setLessonProgress(np);
        localStorage.setItem("ciq-lesson-progress", JSON.stringify(np));
        addXP(15, "Completed lesson");
    };

    // ── Stream Detail View ──
    if (selected) {
        const roadmap = CATEGORY_ROADMAP[selected.cat]!;
        const categoryYt = CATEGORY_YT[selected.cat];
        const done = !!progress[selected.id];
        return (
            <div className="page-enter" style={{ maxWidth: 760, margin: "0 auto" }}>
                <div style={{ display: "flex", gap: 10, marginBottom: 20, alignItems: "center", flexWrap: "wrap" }}>
                    <button className="btn-ghost" onClick={() => setSelected(null)}>← All Streams</button>
                    <span style={{ fontSize: "1.5rem" }}>{selected.emoji}</span>
                    <h1 style={{ fontSize: "1.1rem", margin: 0 }}>{selected.name}</h1>
                    <span style={{ fontSize: "0.68rem", background: `${selected.color}18`, color: selected.color, border: `1px solid ${selected.color}28`, borderRadius: 20, padding: "2px 10px" }}>{selected.cat}</span>
                    {done && <span className="badge-green">✓ Completed</span>}
                </div>

                {/* YouTube Resource */}
                <div className="card" style={{ marginBottom: 16, borderColor: "rgba(255,60,60,0.2)", background: "rgba(255,0,0,0.02)" }}>
                    <div style={{ display: "flex", gap: 10, alignItems: "center", marginBottom: 12 }}>
                        <div style={{ width: 30, height: 30, borderRadius: 8, background: "#ff0000", display: "flex", alignItems: "center", justifyContent: "center", color: "white", fontSize: "0.8rem" }}>▶</div>
                        <span style={{ fontWeight: 700 }}>YouTube Learning Resource</span>
                    </div>
                    <a href={selected.yt} target="_blank" rel="noopener noreferrer" style={{ textDecoration: "none", display: "flex", alignItems: "center", gap: 10, background: "rgba(255,0,0,0.05)", border: "1px solid rgba(255,60,60,0.2)", borderRadius: 10, padding: "12px 16px" }}>
                        <div style={{ width: 28, height: 28, borderRadius: 7, background: "#ff0000", display: "flex", alignItems: "center", justifyContent: "center", color: "white", fontSize: "0.7rem" }}>▶</div>
                        <div>
                            <div style={{ fontSize: "0.84rem", fontWeight: 600, color: "var(--text)" }}>{selected.ytTitle}</div>
                            <div style={{ fontSize: "0.66rem", color: "var(--text-muted)" }}>📺 YouTube · {selected.name}</div>
                        </div>
                        <div style={{ marginLeft: "auto", fontSize: "0.72rem", color: "#f87171", fontWeight: 600 }}>Watch →</div>
                    </a>
                    {categoryYt && (
                        <a href={categoryYt.url} target="_blank" rel="noopener noreferrer" style={{ textDecoration: "none", display: "flex", alignItems: "center", gap: 10, background: "rgba(255,0,0,0.04)", border: "1px solid rgba(255,60,60,0.15)", borderRadius: 10, padding: "10px 16px", marginTop: 8 }}>
                            <div style={{ width: 28, height: 28, borderRadius: 7, background: "#cc0000", display: "flex", alignItems: "center", justifyContent: "center", color: "white", fontSize: "0.7rem" }}>▶</div>
                            <div>
                                <div style={{ fontSize: "0.8rem", fontWeight: 600, color: "var(--text)" }}>{categoryYt.title}</div>
                                <div style={{ fontSize: "0.66rem", color: "var(--text-muted)" }}>📺 Career guidance for {selected.cat}</div>
                            </div>
                            <div style={{ marginLeft: "auto", fontSize: "0.72rem", color: "#f87171", fontWeight: 600 }}>Watch →</div>
                        </a>
                    )}
                </div>

                {/* Roadmap */}
                <div className="card liquid-glass" style={{ marginBottom: 16, borderColor: `${selected.color}30` }}>
                    <h3 style={{ marginBottom: 14, color: selected.color }}>🗺️ Career Roadmap for {selected.name}</h3>
                    {roadmap.steps.map((step, i) => (
                        <div key={i} style={{ display: "flex", gap: 10, marginBottom: 10, alignItems: "flex-start" }}>
                            <div style={{ width: 24, height: 24, borderRadius: "50%", background: `linear-gradient(135deg,${selected.color}99,${selected.color})`, display: "flex", alignItems: "center", justifyContent: "center", fontSize: "0.7rem", fontWeight: 800, color: "white", flexShrink: 0 }}>{i + 1}</div>
                            <span style={{ fontSize: "0.82rem", color: "var(--text-sub)", lineHeight: 1.6 }}>{step}</span>
                        </div>
                    ))}
                </div>

                {/* Skills + Jobs */}
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14, marginBottom: 16 }}>
                    <div className="card">
                        <h4 style={{ marginBottom: 10, fontSize: "0.85rem" }}>🛠️ Key Skills to Build</h4>
                        {roadmap.skills.map(s => <div key={s} className="skill-tag" style={{ display: "block", marginBottom: 5 }}>{s}</div>)}
                    </div>
                    <div className="card">
                        <h4 style={{ marginBottom: 10, fontSize: "0.85rem" }}>💼 Career Opportunities</h4>
                        {roadmap.jobs.map(j => <div key={j} style={{ padding: "5px 0", borderBottom: "1px solid var(--border)", fontSize: "0.82rem", color: "var(--text-sub)" }}>→ {j}</div>)}
                    </div>
                </div>

                {/* Lessons inside this stream */}
                {(STREAM_LESSONS[selected.id] || []).length > 0 && (
                    <div className="card" style={{ marginBottom: 16 }}>
                        <h3 style={{ marginBottom: 14 }}>📖 Course Modules ({(STREAM_LESSONS[selected.id] || []).length} lessons)</h3>
                        <div className="progress-track" style={{ height: 5, marginBottom: 14 }}>
                            <div className="progress-fill" style={{ width: `${(STREAM_LESSONS[selected.id] || []).filter((_, li) => lessonProgress[`${selected.id}-${li}`]).length / (STREAM_LESSONS[selected.id] || []).length * 100}%` }} />
                        </div>
                        {(STREAM_LESSONS[selected.id] || []).map((lesson, li) => {
                            const lKey = `${selected.id}-${li}`;
                            const lDone = !!lessonProgress[lKey];
                            return (
                                <div key={li} style={{ display: "flex", gap: 12, alignItems: "center", padding: "10px 0", borderBottom: li < (STREAM_LESSONS[selected.id] || []).length - 1 ? "1px solid var(--border)" : "none" }}>
                                    <div style={{ width: 28, height: 28, borderRadius: "50%", background: lDone ? "var(--green)" : "rgba(102,51,153,0.15)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "0.7rem", color: lDone ? "white" : "var(--text-muted)", fontWeight: 700, flexShrink: 0 }}>{lDone ? "✓" : li + 1}</div>
                                    <div style={{ flex: 1 }}>
                                        <div style={{ fontSize: "0.82rem", fontWeight: 600, color: lDone ? "var(--green)" : "var(--text)" }}>{lesson.title}</div>
                                        <div style={{ fontSize: "0.65rem", color: "var(--text-muted)" }}>⏱ {lesson.duration}</div>
                                    </div>
                                    <a href={lesson.yt} target="_blank" rel="noopener noreferrer" style={{ textDecoration: "none", display: "flex", alignItems: "center", gap: 5, fontSize: "0.7rem", color: "#f87171", fontWeight: 600, background: "rgba(255,0,0,0.06)", border: "1px solid rgba(255,60,60,0.15)", borderRadius: 8, padding: "4px 10px" }}>▶ {lesson.ytTitle}</a>
                                    {!lDone && <button onClick={() => markLessonDone(lKey)} style={{ padding: "4px 10px", fontSize: "0.68rem", borderRadius: 8, border: "1px solid rgba(86,227,160,0.3)", background: "rgba(86,227,160,0.08)", color: "var(--green)", cursor: "pointer", fontWeight: 600 }}>✓ Done</button>}
                                </div>
                            );
                        })}
                    </div>
                )}

                {/* Upload prompt */}
                <div className="card" style={{ marginBottom: 16, background: "linear-gradient(135deg, rgba(102,51,153,0.10), rgba(155,89,182,0.06))", borderColor: "rgba(155,89,182,0.3)", boxShadow: "0 4px 20px rgba(102,51,153,0.10)" }}>
                    <div style={{ display: "flex", gap: 12, alignItems: "center" }}>
                        <div style={{ width: 44, height: 44, borderRadius: 12, background: "linear-gradient(135deg,rgba(102,51,153,0.4),rgba(155,89,182,0.6))", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "1.3rem", flexShrink: 0, boxShadow: "0 4px 12px rgba(102,51,153,0.3)" }}>📄</div>
                        <div style={{ flex: 1 }}>
                            <div style={{ fontWeight: 700, marginBottom: 3 }}>Get personalised guidance</div>
                            <div style={{ fontSize: "0.78rem", color: "var(--text-muted)" }}>Upload your resume to get an ATS score, skill gap analysis, and a custom path for {selected.name}</div>
                        </div>
                        <button className="btn-primary" style={{ whiteSpace: "nowrap", flexShrink: 0, background: "linear-gradient(135deg,#663399,#9b59b6)", boxShadow: "0 4px 16px rgba(102,51,153,0.4)" }}
                            onClick={() => {
                                if (role === "guest") {
                                    if (typeof window !== "undefined") localStorage.setItem("ciq-redirect-after-login", "learning");
                                    router.push("/login");
                                } else {
                                    router.push("/resume");
                                }
                            }}
                        >Upload Resume →</button>
                    </div>
                </div>

                {!done
                    ? <button className="btn-primary" onClick={() => markDone(selected.id)}>✓ Mark as Studied · +30 XP</button>
                    : <div className="badge-green" style={{ fontSize: "0.9rem" }}>✓ Marked as Studied</div>
                }
            </div>
        );
    }

    // ── Stream Grid ──
    const grouped = CATS.slice(1).map(cat => ({
        cat, items: filtered.filter(s => s.cat === cat),
    })).filter(g => g.items.length > 0 && (filterCat === "All" || filterCat === g.cat));

    const StreamCard = ({ s }: { s: typeof STREAMS[0] }) => {
        const done = !!progress[s.id];
        const isRecommended = recommendedIds.includes(s.id);
        const isMatch = isRecommended;
        return (
            <div className="card liquid-glass" onClick={() => setSelected(s)}
                style={{ cursor: "pointer", borderColor: done ? "rgba(86,227,160,0.25)" : isRecommended ? "rgba(251,191,36,0.3)" : `${s.color}22`, padding: "14px 16px", transition: "all 0.2s", position: "relative" }}
                onMouseEnter={e => { const el = e.currentTarget as HTMLDivElement; el.style.transform = "translateY(-4px) scale(1.02)"; el.style.boxShadow = `0 10px 32px ${s.color}18`; el.style.borderColor = `${s.color}55`; }}
                onMouseLeave={e => { const el = e.currentTarget as HTMLDivElement; el.style.transform = ""; el.style.boxShadow = ""; el.style.borderColor = done ? "rgba(86,227,160,0.25)" : isRecommended ? "rgba(251,191,36,0.3)" : `${s.color}22`; }}>
                {isMatch && (
                    <div style={{ position: "absolute", top: 6, right: 8, fontSize: "0.6rem", background: "rgba(251,191,36,0.15)", color: "#fbbf24", borderRadius: 10, padding: "2px 8px", fontWeight: 700 }}>Recommended for You</div>
                )}
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 8 }}>
                    <span style={{ fontSize: "1.5rem" }}>{s.emoji}</span>
                    {done && <span style={{ fontSize: "0.6rem", background: "rgba(86,227,160,0.12)", color: "var(--green)", border: "1px solid rgba(86,227,160,0.25)", borderRadius: 20, padding: "1px 7px" }}>✓</span>}
                </div>
                <div style={{ fontSize: "0.78rem", fontWeight: 600, color: "var(--text)", lineHeight: 1.4, marginBottom: 6 }}>{s.name}</div>
                <div style={{ display: "flex", gap: 6, alignItems: "center" }}>
                    <span style={{ width: 5, height: 5, borderRadius: "50%", background: s.color, flexShrink: 0 }} />
                    <span style={{ fontSize: "0.6rem", color: "var(--text-muted)" }}>▶ YouTube · Roadmap · +30 XP</span>
                </div>
            </div>
        );
    };

    return (
        <div className="page-enter">
            <div style={{ display: "flex", justifyContent: "space-between", flexWrap: "wrap", gap: 12, marginBottom: 8 }}>
                <div>
                    <h1 style={{ marginBottom: 4 }}>📚 Learning Path</h1>
                    <p style={{ color: "var(--text-muted)", fontSize: "0.82rem" }}>
                        <strong style={{ color: "var(--accent)" }}>{STREAMS.length} streams</strong> · {totalDone} studied{hasResume ? ` · Domain: ${userDomain}` : " · Upload resume for personalised path"}
                    </p>
                </div>
                <input className="input-field" placeholder="Search streams…" value={search} onChange={e => setSearch(e.target.value)} style={{ maxWidth: 200 }} />
            </div>

            {/* ── Section 1: Recommended Courses for Your Skill Gaps ── */}
            {hasResume && recommendedIds.length > 0 && (
                <div style={{ marginBottom: 40 }}>
                    <div style={{
                        display: "flex", alignItems: "center", gap: 12, marginBottom: 16,
                        padding: "12px 18px", borderRadius: 12,
                        background: "linear-gradient(135deg, rgba(251,191,36,0.08), rgba(245,158,11,0.04))",
                        border: "1px solid rgba(251,191,36,0.2)",
                    }}>
                        <div style={{ fontSize: "1.4rem" }}>🎯</div>
                        <div>
                            <div style={{ fontWeight: 700, fontSize: "1rem", color: "var(--text)", marginBottom: 2 }}>
                                Recommended Courses for Your Skill Gaps
                            </div>
                            <div style={{ fontSize: "0.75rem", color: "var(--text-muted)" }}>
                                Missing skills: {missingSkills.length > 0 ? (
                                    <strong style={{ color: "#fbbf24" }}>{missingSkills.slice(0, 3).join(", ")}{missingSkills.length > 3 ? "..." : ""}</strong>
                                ) : "None"} — we found these courses to help you master them.
                            </div>
                        </div>
                        <span style={{ marginLeft: "auto", fontSize: "0.7rem", background: "rgba(251,191,36,0.12)", color: "#fbbf24", border: "1px solid rgba(251,191,36,0.25)", borderRadius: 20, padding: "4px 12px", fontWeight: 600 }}>
                            {recommendedIds.length} recommended
                        </span>
                    </div>
                    <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill,minmax(200px,1fr))", gap: 10 }}>
                        {filtered.filter(s => recommendedIds.includes(s.id)).map(s => (
                            <StreamCard key={s.id} s={s} />
                        ))}
                    </div>
                </div>
            )}

            {/* Upload prompt when no resume */}
            {!hasResume && (
                <div className="card" style={{ marginBottom: 24, background: "linear-gradient(135deg, rgba(102,51,153,0.10), rgba(155,89,182,0.06))", borderColor: "rgba(155,89,182,0.3)", display: "flex", gap: 14, alignItems: "center", padding: 20, boxShadow: "0 4px 24px rgba(102,51,153,0.12)" }}>
                    <div style={{ width: 52, height: 52, borderRadius: 14, background: "linear-gradient(135deg,rgba(102,51,153,0.4),rgba(155,89,182,0.6))", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "1.5rem", flexShrink: 0, boxShadow: "0 4px 16px rgba(102,51,153,0.3)" }}>📄</div>
                    <div style={{ flex: 1 }}>
                        <div style={{ fontWeight: 700, marginBottom: 3, fontSize: "0.95rem" }}>Upload your resume for a personalised learning path</div>
                        <div style={{ fontSize: "0.78rem", color: "var(--text-muted)" }}>Get ATS score, skill gap analysis, and a curated course list matched to your background</div>
                    </div>
                    <button className="btn-primary" style={{ whiteSpace: "nowrap", flexShrink: 0, background: "linear-gradient(135deg,#663399,#9b59b6)", boxShadow: "0 4px 16px rgba(102,51,153,0.4)" }}
                        onClick={() => {
                            if (role === "guest") {
                                if (typeof window !== "undefined") localStorage.setItem("ciq-redirect-after-login", "learning");
                                router.push("/login");
                            } else {
                                router.push("/resume");
                            }
                        }}
                    >Upload Resume →</button>
                </div>
            )}

            {/* ── Section 2: All Courses (full catalog always shown) ── */}
            <div>
                <div style={{
                    display: "flex", alignItems: "center", gap: 12, marginBottom: 16,
                    padding: "12px 18px", borderRadius: 12,
                    background: "linear-gradient(135deg, rgba(102,51,153,0.08), rgba(155,89,182,0.04))",
                    border: "1px solid rgba(102,51,153,0.2)",
                }}>
                    <div style={{ fontSize: "1.4rem" }}>📖</div>
                    <div>
                        <div style={{ fontWeight: 700, fontSize: "1rem", color: "var(--text)", marginBottom: 2 }}>All Courses</div>
                        <div style={{ fontSize: "0.75rem", color: "var(--text-muted)" }}>
                            Browse all {STREAMS.length} streams across Engineering, Science, Arts, Commerce &amp; Professional
                        </div>
                    </div>
                </div>

                {/* Category filter pills — always shown */}
                <div style={{ display: "flex", gap: 8, flexWrap: "wrap", marginBottom: 20 }}>
                    {CATS.map(c => (
                        <button key={c} onClick={() => setFilterCat(c)} style={{
                            padding: "5px 16px", borderRadius: 20,
                            border: `1px solid ${filterCat === c ? "var(--accent)" : "rgba(163,119,157,0.2)"}`,
                            background: filterCat === c ? "rgba(102,51,153,0.2)" : "transparent",
                            color: filterCat === c ? "var(--accent)" : "var(--text-muted)",
                            fontSize: "0.75rem", fontWeight: 600, cursor: "pointer", transition: "all 0.15s",
                        }}>
                            {c} {c !== "All" ? `(${STREAMS.filter(s => s.cat === c).length})` : `(${STREAMS.length})`}
                        </button>
                    ))}
                </div>

                {/* Stream groups — full catalog */}
                {grouped.map(({ cat, items }) => (
                    <div key={cat} style={{ marginBottom: 32 }}>
                        <h2 style={{ fontSize: "1rem", marginBottom: 14, display: "flex", alignItems: "center", gap: 8 }}>
                            {cat === "Engineering" ? "⚙️" : cat === "Science" ? "🔬" : cat === "Arts" ? "🎨" : cat === "Commerce" ? "💼" : "🏆"} {cat}
                            <span style={{ fontSize: "0.65rem", color: "var(--text-muted)", fontWeight: 400 }}>({items.length} streams)</span>
                        </h2>
                        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill,minmax(200px,1fr))", gap: 10 }}>
                            {items.map(s => <StreamCard key={s.id} s={s} />)}
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}
