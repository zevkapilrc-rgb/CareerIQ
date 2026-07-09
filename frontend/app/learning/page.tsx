"use client";
import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAppStore } from "@/src/state/useAppStore";
import { BookOpen, Target, FileText, Wrench, FlaskConical, Palette, Briefcase, Award, PlayCircle, Map, Hammer, PlaySquare, BookMarked, Play, Search, Check, ChevronRight } from "lucide-react";
import Button from "@/src/components/ui/Button";
import Card from "@/src/components/ui/Card";
import PageHeader from "@/src/components/ui/PageHeader";
import { ProgressBar } from "@/src/components/ui/Progress";
import { Input } from "@/src/components/ui/Input";
import GlassCard from "@/src/components/ui/GlassCard";
import Badge from "@/src/components/ui/Badge";
import PremiumButton from "@/src/components/ui/PremiumButton";

const getCategoryIcon = (cat: string, size = 24) => {
    switch (cat) {
        case "Engineering": return <Wrench size={size} />;
        case "Science": return <FlaskConical size={size} />;
        case "Arts": return <Palette size={size} />;
        case "Commerce": return <Briefcase size={size} />;
        case "Professional": return <Award size={size} />;
        default: return <BookOpen size={size} />;
    }
};

// â”€â”€â”€ Stream Catalog â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
const STREAMS = [
    // Engineering
    { id: "cse", name: "Computer Science Engineering", emoji: "ðŸ’»", cat: "Engineering", color: "#F5F4F8", yt: "https://www.youtube.com/watch?v=Oe421EPjeBE", ytTitle: "CS Engineering Roadmap" },
    { id: "it", name: "Information Technology", emoji: "ðŸ–¥ï¸", cat: "Engineering", color: "#FFFFFF", yt: "https://www.youtube.com/watch?v=VfGW0Qiy2I0", ytTitle: "IT Engineering Overview" },
    { id: "ai", name: "Artificial Intelligence", emoji: "ðŸ§ ", cat: "Engineering", color: "#f472b6", yt: "https://www.youtube.com/watch?v=ad79nYk2keg", ytTitle: "AI Full Course" },
    { id: "aids", name: "AI & Data Science", emoji: "ðŸ“Š", cat: "Engineering", color: "#34d399", yt: "https://www.youtube.com/watch?v=ua-CiDNNj30", ytTitle: "AI & DS Roadmap" },
    { id: "aiml", name: "AI & Machine Learning", emoji: "ðŸ¤–", cat: "Engineering", color: "var(--teal)", yt: "https://www.youtube.com/watch?v=GwIo3gDZCVQ", ytTitle: "ML Full Course" },
    { id: "ds", name: "Data Science", emoji: "ðŸ“ˆ", cat: "Engineering", color: "#FFFFFF", yt: "https://www.youtube.com/watch?v=ua-CiDNNj30", ytTitle: "Data Science Roadmap" },
    { id: "cy", name: "Cyber Security", emoji: "ðŸ”", cat: "Engineering", color: "#f87171", yt: "https://www.youtube.com/watch?v=inWWhr5tnEA", ytTitle: "Cyber Security Full Course" },
    { id: "se", name: "Software Engineering", emoji: "âš™ï¸", cat: "Engineering", color: "#56e3a0", yt: "https://www.youtube.com/watch?v=B3y0RsVCyrw", ytTitle: "Software Engineering" },
    { id: "iot", name: "Internet of Things", emoji: "ðŸ“¡", cat: "Engineering", color: "#7eb8f7", yt: "https://www.youtube.com/watch?v=4NpZedvVMeo", ytTitle: "IoT Full Course" },
    { id: "ro", name: "Robotics Engineering", emoji: "ðŸ¦¾", cat: "Engineering", color: "#f472b6", yt: "https://www.youtube.com/watch?v=Ye7Wg_BhzUw", ytTitle: "Robotics Engineering" },
    { id: "mec", name: "Mechatronics Engineering", emoji: "ðŸ”§", cat: "Engineering", color: "#FFFFFF", yt: "https://www.youtube.com/watch?v=FaOkTuMkXe4", ytTitle: "Mechatronics Overview" },
    { id: "me", name: "Mechanical Engineering", emoji: "ðŸ—ï¸", cat: "Engineering", color: "#FFFFFF", yt: "https://www.youtube.com/watch?v=BQSb0LYAarU", ytTitle: "Mechanical Engineering" },
    { id: "ce", name: "Civil Engineering", emoji: "ðŸ›ï¸", cat: "Engineering", color: "var(--teal)", yt: "https://www.youtube.com/watch?v=kqX7y9hkDqQ", ytTitle: "Civil Engineering" },
    { id: "ee", name: "Electrical Engineering", emoji: "âš¡", cat: "Engineering", color: "#FFFFFF", yt: "https://www.youtube.com/watch?v=mc979OhitAg", ytTitle: "Electrical Engineering" },
    { id: "eee", name: "Electrical & Electronics Engineering", emoji: "ðŸ”Œ", cat: "Engineering", color: "#f6c94e", yt: "https://www.youtube.com/watch?v=mc979OhitAg", ytTitle: "EEE Overview" },
    { id: "ece", name: "Electronics & Communication Engineering", emoji: "ðŸ“»", cat: "Engineering", color: "#FFFFFF", yt: "https://www.youtube.com/watch?v=izPRRv9B5Ms", ytTitle: "ECE Full Course" },
    { id: "eie", name: "Electronics & Instrumentation Engineering", emoji: "ðŸ”¬", cat: "Engineering", color: "#34d399", yt: "https://www.youtube.com/watch?v=OhWxUcSuNss", ytTitle: "Instrumentation Engineering" },
    { id: "aero", name: "Aerospace Engineering", emoji: "ðŸš€", cat: "Engineering", color: "#F5F4F8", yt: "https://www.youtube.com/watch?v=6GVSi9e89LA", ytTitle: "Aerospace Engineering" },
    { id: "aeron", name: "Aeronautical Engineering", emoji: "âœˆï¸", cat: "Engineering", color: "#FFFFFF", yt: "https://www.youtube.com/watch?v=6GVSi9e89LA", ytTitle: "Aeronautical Engineering" },
    { id: "auto", name: "Automobile Engineering", emoji: "ðŸš—", cat: "Engineering", color: "#f87171", yt: "https://www.youtube.com/watch?v=zX3l8Gbm8kk", ytTitle: "Automobile Engineering" },
    { id: "mar", name: "Marine Engineering", emoji: "ðŸš¢", cat: "Engineering", color: "#7eb8f7", yt: "https://www.youtube.com/watch?v=MgAXVNi_D3s", ytTitle: "Marine Engineering" },
    { id: "nav", name: "Naval Architecture", emoji: "âš“", cat: "Engineering", color: "#56e3a0", yt: "https://www.youtube.com/watch?v=MgAXVNi_D3s", ytTitle: "Naval Architecture" },
    { id: "pet", name: "Petroleum Engineering", emoji: "ðŸ›¢ï¸", cat: "Engineering", color: "#FFFFFF", yt: "https://www.youtube.com/watch?v=XmimXb7u0sY", ytTitle: "Petroleum Engineering" },
    { id: "min", name: "Mining Engineering", emoji: "â›ï¸", cat: "Engineering", color: "var(--teal)", yt: "https://www.youtube.com/watch?v=fxk3yXX-JfA", ytTitle: "Mining Engineering" },
    { id: "che", name: "Chemical Engineering", emoji: "ðŸ§ª", cat: "Engineering", color: "#FFFFFF", yt: "https://www.youtube.com/watch?v=Oe421EPjeBE", ytTitle: "Chemical Engineering" },
    { id: "bio", name: "Biotechnology Engineering", emoji: "ðŸ§¬", cat: "Engineering", color: "#34d399", yt: "https://www.youtube.com/watch?v=2NeSP-ogJgY", ytTitle: "Biotechnology Engineering" },
    { id: "bme", name: "Biomedical Engineering", emoji: "ðŸ¥", cat: "Engineering", color: "#f472b6", yt: "https://www.youtube.com/watch?v=bJBpDMvCx2Y", ytTitle: "Biomedical Engineering" },
    { id: "env", name: "Environmental Engineering", emoji: "ðŸŒ", cat: "Engineering", color: "#56e3a0", yt: "https://www.youtube.com/watch?v=_YkiDDzuY1E", ytTitle: "Environmental Engineering" },
    { id: "gen", name: "Genetic Engineering", emoji: "ðŸ§¬", cat: "Engineering", color: "#F5F4F8", yt: "https://www.youtube.com/watch?v=jAhjPd4uNFY", ytTitle: "Genetic Engineering" },
    { id: "nano", name: "Nanotechnology Engineering", emoji: "ðŸ”¬", cat: "Engineering", color: "#FFFFFF", yt: "https://www.youtube.com/watch?v=I1apKLHqMv4", ytTitle: "Nanotechnology" },
    { id: "ind", name: "Industrial Engineering", emoji: "ðŸ­", cat: "Engineering", color: "#FFFFFF", yt: "https://www.youtube.com/watch?v=B3y0RsVCyrw", ytTitle: "Industrial Engineering" },
    { id: "prod", name: "Production Engineering", emoji: "ðŸ”©", cat: "Engineering", color: "#f87171", yt: "https://www.youtube.com/watch?v=BQSb0LYAarU", ytTitle: "Production Engineering" },
    { id: "mfg", name: "Manufacturing Engineering", emoji: "ðŸ—ï¸", cat: "Engineering", color: "var(--teal)", yt: "https://www.youtube.com/watch?v=BQSb0LYAarU", ytTitle: "Manufacturing Engineering" },
    { id: "met", name: "Metallurgical Engineering", emoji: "âš—ï¸", cat: "Engineering", color: "#FFFFFF", yt: "https://www.youtube.com/watch?v=mc979OhitAg", ytTitle: "Metallurgical Engineering" },
    { id: "pol", name: "Polymer Engineering", emoji: "ðŸ§´", cat: "Engineering", color: "#F5F4F8", yt: "https://www.youtube.com/watch?v=Oe421EPjeBE", ytTitle: "Polymer Engineering" },
    { id: "tex", name: "Textile Engineering", emoji: "ðŸ§µ", cat: "Engineering", color: "#f472b6", yt: "https://www.youtube.com/watch?v=Oe421EPjeBE", ytTitle: "Textile Engineering" },
    { id: "cer", name: "Ceramic Engineering", emoji: "ðŸº", cat: "Engineering", color: "#FFFFFF", yt: "https://www.youtube.com/watch?v=Oe421EPjeBE", ytTitle: "Ceramic Engineering" },
    { id: "agr", name: "Agricultural Engineering", emoji: "ðŸŒ¾", cat: "Engineering", color: "#56e3a0", yt: "https://www.youtube.com/watch?v=Oe421EPjeBE", ytTitle: "Agricultural Engineering" },
    { id: "food", name: "Food Technology Engineering", emoji: "ðŸ±", cat: "Engineering", color: "#FFFFFF", yt: "https://www.youtube.com/watch?v=Oe421EPjeBE", ytTitle: "Food Technology" },
    { id: "dairy", name: "Dairy Technology", emoji: "ðŸ¥›", cat: "Engineering", color: "#7eb8f7", yt: "https://www.youtube.com/watch?v=Oe421EPjeBE", ytTitle: "Dairy Technology" },
    // Science
    { id: "bsc-phy", name: "B.Sc Physics", emoji: "âš›ï¸", cat: "Science", color: "#FFFFFF", yt: "https://www.youtube.com/watch?v=ZM8ECpBuQYE", ytTitle: "Physics Full Course" },
    { id: "bsc-chem", name: "B.Sc Chemistry", emoji: "ðŸ§ª", cat: "Science", color: "#34d399", yt: "https://www.youtube.com/watch?v=uVFCOfSuPto", ytTitle: "Chemistry Full Course" },
    { id: "bsc-math", name: "B.Sc Mathematics", emoji: "ðŸ“", cat: "Science", color: "#F5F4F8", yt: "https://www.youtube.com/watch?v=WnjQeAtPrEo", ytTitle: "Mathematics Full Course" },
    { id: "bsc-stat", name: "B.Sc Statistics", emoji: "ðŸ“Š", cat: "Science", color: "#FFFFFF", yt: "https://www.youtube.com/watch?v=xxpc-HPKN28", ytTitle: "Statistics Full Course" },
    { id: "bsc-cs", name: "B.Sc Computer Science", emoji: "ðŸ’»", cat: "Science", color: "#F5F4F8", yt: "https://www.youtube.com/watch?v=Oe421EPjeBE", ytTitle: "CS Fundamentals" },
    { id: "bsc-it", name: "B.Sc Information Technology", emoji: "ðŸ–¥ï¸", cat: "Science", color: "#FFFFFF", yt: "https://www.youtube.com/watch?v=VfGW0Qiy2I0", ytTitle: "IT Overview" },
    { id: "bsc-ai", name: "B.Sc Artificial Intelligence", emoji: "ðŸ§ ", cat: "Science", color: "#f472b6", yt: "https://www.youtube.com/watch?v=ad79nYk2keg", ytTitle: "AI Course" },
    { id: "bsc-ds", name: "B.Sc Data Science", emoji: "ðŸ“ˆ", cat: "Science", color: "#34d399", yt: "https://www.youtube.com/watch?v=ua-CiDNNj30", ytTitle: "Data Science" },
    { id: "bsc-bt", name: "B.Sc Biotechnology", emoji: "ðŸ§¬", cat: "Science", color: "#56e3a0", yt: "https://www.youtube.com/watch?v=2NeSP-ogJgY", ytTitle: "Biotechnology" },
    { id: "bsc-mb", name: "B.Sc Microbiology", emoji: "ðŸ”¬", cat: "Science", color: "var(--teal)", yt: "https://www.youtube.com/watch?v=URUJD5NEXC8", ytTitle: "Microbiology" },
    { id: "bsc-bc", name: "B.Sc Biochemistry", emoji: "ðŸ§«", cat: "Science", color: "#f472b6", yt: "https://www.youtube.com/watch?v=7Hk9jct2ozY", ytTitle: "Biochemistry" },
    { id: "bsc-gn", name: "B.Sc Genetics", emoji: "ðŸ§¬", cat: "Science", color: "#F5F4F8", yt: "https://www.youtube.com/watch?v=jAhjPd4uNFY", ytTitle: "Genetics" },
    { id: "bsc-zoo", name: "B.Sc Zoology", emoji: "ðŸ¦", cat: "Science", color: "#FFFFFF", yt: "https://www.youtube.com/watch?v=Oe421EPjeBE", ytTitle: "Zoology" },
    { id: "bsc-bot", name: "B.Sc Botany", emoji: "ðŸŒ¿", cat: "Science", color: "#56e3a0", yt: "https://www.youtube.com/watch?v=Oe421EPjeBE", ytTitle: "Botany" },
    { id: "bsc-env", name: "B.Sc Environmental Science", emoji: "ðŸŒ", cat: "Science", color: "#34d399", yt: "https://www.youtube.com/watch?v=_YkiDDzuY1E", ytTitle: "Environmental Science" },
    { id: "bsc-fs", name: "B.Sc Forensic Science", emoji: "ðŸ”", cat: "Science", color: "#f87171", yt: "https://www.youtube.com/watch?v=Oe421EPjeBE", ytTitle: "Forensic Science" },
    { id: "bsc-nd", name: "B.Sc Nutrition & Dietetics", emoji: "ðŸ¥—", cat: "Science", color: "#FFFFFF", yt: "https://www.youtube.com/watch?v=Oe421EPjeBE", ytTitle: "Nutrition & Dietetics" },
    { id: "bsc-ft", name: "B.Sc Food Technology", emoji: "ðŸ±", cat: "Science", color: "#FFFFFF", yt: "https://www.youtube.com/watch?v=Oe421EPjeBE", ytTitle: "Food Technology" },
    { id: "bsc-ag", name: "B.Sc Agriculture", emoji: "ðŸŒ¾", cat: "Science", color: "#56e3a0", yt: "https://www.youtube.com/watch?v=Oe421EPjeBE", ytTitle: "Agriculture" },
    { id: "bsc-nur", name: "B.Sc Nursing", emoji: "ðŸ¥", cat: "Science", color: "#f472b6", yt: "https://www.youtube.com/watch?v=bJBpDMvCx2Y", ytTitle: "Nursing" },
    // Arts
    { id: "ba-eng", name: "B.A English", emoji: "ðŸ“–", cat: "Arts", color: "#FFFFFF", yt: "https://www.youtube.com/watch?v=Oe421EPjeBE", ytTitle: "English Literature" },
    { id: "ba-tam", name: "B.A Tamil", emoji: "ðŸ“œ", cat: "Arts", color: "#F5F4F8", yt: "https://www.youtube.com/watch?v=Oe421EPjeBE", ytTitle: "Tamil Literature" },
    { id: "ba-hin", name: "B.A Hindi", emoji: "ðŸ“œ", cat: "Arts", color: "#f472b6", yt: "https://www.youtube.com/watch?v=Oe421EPjeBE", ytTitle: "Hindi Literature" },
    { id: "ba-fre", name: "B.A French", emoji: "ðŸ‡«ðŸ‡·", cat: "Arts", color: "#FFFFFF", yt: "https://www.youtube.com/watch?v=Oe421EPjeBE", ytTitle: "French Language" },
    { id: "ba-his", name: "B.A History", emoji: "ðŸ›ï¸", cat: "Arts", color: "var(--teal)", yt: "https://www.youtube.com/watch?v=Oe421EPjeBE", ytTitle: "History" },
    { id: "ba-pol", name: "B.A Political Science", emoji: "ðŸ›ï¸", cat: "Arts", color: "#f87171", yt: "https://www.youtube.com/watch?v=Oe421EPjeBE", ytTitle: "Political Science" },
    { id: "ba-soc", name: "B.A Sociology", emoji: "ðŸ‘¥", cat: "Arts", color: "#34d399", yt: "https://www.youtube.com/watch?v=Oe421EPjeBE", ytTitle: "Sociology" },
    { id: "ba-psy", name: "B.A Psychology", emoji: "ðŸ§ ", cat: "Arts", color: "#F5F4F8", yt: "https://www.youtube.com/watch?v=vo4pMVb0R6M", ytTitle: "Psychology" },
    { id: "ba-eco", name: "B.A Economics", emoji: "ðŸ“‰", cat: "Arts", color: "#FFFFFF", yt: "https://www.youtube.com/watch?v=3ez10ADR_gM", ytTitle: "Economics" },
    { id: "ba-jour", name: "B.A Journalism", emoji: "ðŸ“°", cat: "Arts", color: "#FFFFFF", yt: "https://www.youtube.com/watch?v=Oe421EPjeBE", ytTitle: "Journalism" },
    { id: "ba-mc", name: "B.A Mass Communication", emoji: "ðŸ“¡", cat: "Arts", color: "#f472b6", yt: "https://www.youtube.com/watch?v=Oe421EPjeBE", ytTitle: "Mass Communication" },
    { id: "ba-vc", name: "B.A Visual Communication", emoji: "ðŸ“·", cat: "Arts", color: "var(--teal)", yt: "https://www.youtube.com/watch?v=Oe421EPjeBE", ytTitle: "Visual Communication" },
    { id: "ba-film", name: "B.A Film Studies", emoji: "ðŸŽ¬", cat: "Arts", color: "#f87171", yt: "https://www.youtube.com/watch?v=Oe421EPjeBE", ytTitle: "Film Studies" },
    { id: "ba-pa", name: "B.A Public Administration", emoji: "ðŸ¢", cat: "Arts", color: "#56e3a0", yt: "https://www.youtube.com/watch?v=Oe421EPjeBE", ytTitle: "Public Administration" },
    { id: "ba-tour", name: "B.A Tourism", emoji: "âœˆï¸", cat: "Arts", color: "#7eb8f7", yt: "https://www.youtube.com/watch?v=Oe421EPjeBE", ytTitle: "Tourism Management" },
    { id: "ba-fa", name: "B.A Fine Arts", emoji: "ðŸŽ¨", cat: "Arts", color: "#f472b6", yt: "https://www.youtube.com/watch?v=Oe421EPjeBE", ytTitle: "Fine Arts" },
    { id: "ba-phi", name: "B.A Philosophy", emoji: "ðŸ¤”", cat: "Arts", color: "#F5F4F8", yt: "https://www.youtube.com/watch?v=YtchE6xDz7g", ytTitle: "Philosophy" },
    // Commerce
    { id: "bcom", name: "B.Com General", emoji: "ðŸ’¼", cat: "Commerce", color: "#FFFFFF", yt: "https://www.youtube.com/watch?v=7t9spv2GXGM", ytTitle: "B.Com Overview" },
    { id: "bcom-af", name: "B.Com Accounting & Finance", emoji: "ðŸ’°", cat: "Commerce", color: "#56e3a0", yt: "https://www.youtube.com/watch?v=7t9spv2GXGM", ytTitle: "Accounting & Finance" },
    { id: "bcom-bi", name: "B.Com Banking & Insurance", emoji: "ðŸ¦", cat: "Commerce", color: "#FFFFFF", yt: "https://www.youtube.com/watch?v=7t9spv2GXGM", ytTitle: "Banking & Insurance" },
    { id: "bcom-cs", name: "B.Com Corporate Secretaryship", emoji: "ðŸ—‚ï¸", cat: "Commerce", color: "var(--teal)", yt: "https://www.youtube.com/watch?v=7t9spv2GXGM", ytTitle: "Corporate Secretaryship" },
    { id: "bcom-ca", name: "B.Com Computer Applications", emoji: "ðŸ’»", cat: "Commerce", color: "#F5F4F8", yt: "https://www.youtube.com/watch?v=7t9spv2GXGM", ytTitle: "B.Com CA" },
    { id: "bba", name: "BBA (Business Administration)", emoji: "ðŸ“Š", cat: "Commerce", color: "#f472b6", yt: "https://www.youtube.com/watch?v=7t9spv2GXGM", ytTitle: "BBA Overview" },
    { id: "bms", name: "BMS (Management Studies)", emoji: "ðŸ“‹", cat: "Commerce", color: "#FFFFFF", yt: "https://www.youtube.com/watch?v=7t9spv2GXGM", ytTitle: "BMS Overview" },
    { id: "bca", name: "BCA (Computer Applications)", emoji: "ðŸ’»", cat: "Commerce", color: "#34d399", yt: "https://www.youtube.com/watch?v=Oe421EPjeBE", ytTitle: "BCA Overview" },
    // Professional
    { id: "barch", name: "B.Arch (Architecture)", emoji: "ðŸ›ï¸", cat: "Professional", color: "#FFFFFF", yt: "https://www.youtube.com/watch?v=Oe421EPjeBE", ytTitle: "Architecture" },
    { id: "bpharm", name: "B.Pharm (Pharmacy)", emoji: "ðŸ’Š", cat: "Professional", color: "#f472b6", yt: "https://www.youtube.com/watch?v=Oe421EPjeBE", ytTitle: "Pharmacy" },
    { id: "bdes", name: "B.Des (Design)", emoji: "ðŸŽ¨", cat: "Professional", color: "#F5F4F8", yt: "https://www.youtube.com/watch?v=Oe421EPjeBE", ytTitle: "Design Course" },
    { id: "llb", name: "LLB (Law)", emoji: "âš–ï¸", cat: "Professional", color: "#FFFFFF", yt: "https://www.youtube.com/watch?v=Oe421EPjeBE", ytTitle: "Law Basics" },
    { id: "hotel", name: "Hotel Management", emoji: "ðŸ¨", cat: "Professional", color: "#FFFFFF", yt: "https://www.youtube.com/watch?v=Oe421EPjeBE", ytTitle: "Hotel Management" },
    { id: "avia", name: "Aviation Management", emoji: "âœˆï¸", cat: "Professional", color: "#7eb8f7", yt: "https://www.youtube.com/watch?v=Oe421EPjeBE", ytTitle: "Aviation Management" },
    { id: "anim", name: "Animation & Multimedia", emoji: "ðŸŽ¬", cat: "Professional", color: "#f87171", yt: "https://www.youtube.com/watch?v=Oe421EPjeBE", ytTitle: "Animation" },
    { id: "fashion", name: "Fashion Design", emoji: "ðŸ‘—", cat: "Professional", color: "#f472b6", yt: "https://www.youtube.com/watch?v=Oe421EPjeBE", ytTitle: "Fashion Design" },
    { id: "interior", name: "Interior Design", emoji: "ðŸ›‹ï¸", cat: "Professional", color: "var(--teal)", yt: "https://www.youtube.com/watch?v=Oe421EPjeBE", ytTitle: "Interior Design" },
    { id: "event", name: "Event Management", emoji: "ðŸŽª", cat: "Professional", color: "#56e3a0", yt: "https://www.youtube.com/watch?v=Oe421EPjeBE", ytTitle: "Event Management" },
    { id: "tourm", name: "Tourism Management", emoji: "ðŸŒ", cat: "Professional", color: "#FFFFFF", yt: "https://www.youtube.com/watch?v=Oe421EPjeBE", ytTitle: "Tourism Management" },
    { id: "dm", name: "Digital Marketing", emoji: "ðŸ“±", cat: "Professional", color: "#f87171", yt: "https://www.youtube.com/watch?v=ysEN5RaKOlA", ytTitle: "Digital Marketing" },
]
    ;

// â”€â”€â”€ Per-stream lessons with YouTube â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
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

// â”€â”€â”€ Domain â†’ Stream mapping for resume filtering â”€â”€
const DOMAIN_TO_STREAMS: Record<string, string[]> = {
    // Engineering & Tech
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
    "Software Engineer": ["cse", "se", "it", "bsc-cs", "bca"],
    "Cloud Engineer": ["cse", "it", "se", "cy"],
    // Arts
    "Content Writer": ["ba-eng", "ba-jour", "ba-mc", "ba-vc", "dm"],
    "Journalist": ["ba-jour", "ba-mc", "ba-eng", "ba-pol"],
    "Psychologist": ["ba-psy", "ba-soc", "ba-phi"],
    "Economist": ["ba-eco", "bcom", "bcom-af", "bba"],
    "Social Worker": ["ba-soc", "ba-psy", "ba-pol", "ba-pa"],
    "Media Professional": ["ba-mc", "ba-vc", "ba-jour", "ba-film", "anim"],
    "Educator": ["ba-eng", "ba-his", "ba-pol", "ba-eco", "ba-psy"],
    "Public Administrator": ["ba-pa", "ba-pol", "ba-eco", "ba-his"],
    "Tourism Professional": ["ba-tour", "hotel", "event", "tourm"],
    "Artist": ["ba-fa", "ba-film", "anim", "bdes", "fashion", "interior"],
    "Historian": ["ba-his", "ba-pol", "ba-phi", "ba-eng"],
    "Philosopher": ["ba-phi", "ba-psy", "ba-soc"],
    "Film Professional": ["ba-film", "ba-vc", "anim", "ba-mc"],
    "Linguist": ["ba-eng", "ba-tam", "ba-hin", "ba-fre"],
    // Commerce
    "Accountant": ["bcom", "bcom-af", "bcom-ca"],
    "Business Analyst": ["bba", "bms", "bcom", "bcom-af"],
    "Finance Professional": ["bcom-af", "bcom-bi", "bcom", "ba-eco"],
    "Marketing Manager": ["bba", "bms", "dm", "ba-mc"],
    "HR Manager": ["bba", "bms", "ba-psy"],
    "Banking Professional": ["bcom-bi", "bcom-af", "bcom"],
    "Corporate Secretary": ["bcom-cs", "bcom", "llb"],
    // Science
    "Research Scientist": ["bsc-phy", "bsc-chem", "bsc-math", "bsc-bt", "bsc-mb"],
    "Lab Analyst": ["bsc-chem", "bsc-mb", "bsc-bc", "bsc-bt"],
    "Biotechnologist": ["bsc-bt", "bsc-mb", "bsc-bc", "bsc-gn", "bio", "bme"],
    "Environmentalist": ["bsc-env", "env", "bsc-bot", "bsc-zoo"],
    "Statistician": ["bsc-stat", "bsc-math", "ba-eco"],
    "Healthcare Professional": ["bsc-nur", "bsc-nd", "bpharm", "bme"],
    "Mathematician": ["bsc-math", "bsc-stat", "bsc-phy"],
    // Professional
    "Architect": ["barch", "interior", "ce"],
    "Pharmacist": ["bpharm", "bsc-chem"],
    "Designer": ["bdes", "fashion", "interior", "anim"],
    "Lawyer": ["llb", "ba-pol", "ba-pa"],
    "Hotel Manager": ["hotel", "event", "tourm", "ba-tour"],
    "Digital Marketer": ["dm", "bba", "ba-mc", "ba-vc"],
    "Event Manager": ["event", "hotel", "tourm", "ba-tour"],
    "Fashion Designer": ["fashion", "bdes", "ba-fa"],
    "Interior Designer": ["interior", "barch", "bdes"],
    "Animator": ["anim", "bdes", "ba-film", "ba-vc"],
};

// â”€â”€â”€ Career roadmaps for each category â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
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
    // Engineering & Tech
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
    "Software Engineer": ["Java", "Python", "System Design", "SQL", "APIs", "Data Structures"],
    "Cloud Engineer": ["AWS", "Docker", "Kubernetes", "Linux", "Terraform"],
    // Arts
    "Content Writer": ["Creative Writing", "SEO", "Communication", "Research", "Digital Media"],
    "Journalist": ["News Writing", "Investigative Research", "Media Law", "Digital Journalism", "Communication"],
    "Psychologist": ["Counselling", "Research Methods", "Cognitive Science", "Social Psychology", "Communication"],
    "Economist": ["Microeconomics", "Macroeconomics", "Econometrics", "Data Analysis", "Statistics"],
    "Social Worker": ["Counselling", "Community Development", "Research", "Communication", "Public Policy"],
    "Media Professional": ["Video Production", "Digital Media", "Content Strategy", "Photography", "Communication"],
    "Educator": ["Teaching Methods", "Curriculum Design", "Communication", "Research", "Public Speaking"],
    "Public Administrator": ["Public Policy", "Governance", "Communication", "Research", "Data Analysis"],
    "Tourism Professional": ["Hospitality Management", "Customer Service", "Event Planning", "Communication", "Marketing"],
    "Artist": ["Creative Design", "Adobe Suite", "Portfolio Development", "Art History", "Digital Art"],
    "Historian": ["Research", "Archival Methods", "Critical Analysis", "Writing", "Documentation"],
    "Film Professional": ["Video Editing", "Cinematography", "Screenwriting", "Direction", "Adobe Premiere"],
    "Linguist": ["Translation", "Grammar", "Communication", "Linguistics", "Writing"],
    // Commerce
    "Accountant": ["Accounting", "Taxation", "Auditing", "Excel", "Tally", "Financial Analysis"],
    "Business Analyst": ["Data Analysis", "Business Communication", "Excel", "SQL", "Strategy"],
    "Finance Professional": ["Financial Analysis", "Investment", "Risk Management", "Excel", "Accounting"],
    "Marketing Manager": ["Marketing Strategy", "Digital Marketing", "Analytics", "Communication", "Branding"],
    "HR Manager": ["HRM", "Communication", "Organizational Behavior", "Leadership", "Conflict Resolution"],
    "Banking Professional": ["Banking Operations", "Financial Analysis", "Risk Management", "Compliance"],
    "Corporate Secretary": ["Corporate Law", "Compliance", "Governance", "Business Communication"],
    // Science
    "Research Scientist": ["Research Methodology", "Data Analysis", "Statistics", "Scientific Writing", "Lab Skills"],
    "Lab Analyst": ["Lab Techniques", "Analytical Chemistry", "Quality Control", "Data Analysis"],
    "Biotechnologist": ["Molecular Biology", "Genetic Engineering", "Bioinformatics", "Lab Skills"],
    "Environmentalist": ["Environmental Science", "Data Analysis", "GIS", "Sustainability", "Research"],
    "Statistician": ["Statistics", "R Programming", "Data Analysis", "Probability", "Machine Learning"],
    "Healthcare Professional": ["Clinical Skills", "Patient Care", "Medical Knowledge", "Communication"],
    "Mathematician": ["Mathematics", "Statistics", "Numerical Methods", "Research", "Data Analysis"],
    // Professional
    "Architect": ["AutoCAD", "3D Design", "Space Planning", "Building Materials", "Sustainability"],
    "Pharmacist": ["Pharmacology", "Clinical Pharmacy", "Drug Formulation", "Chemistry"],
    "Designer": ["UI/UX", "Figma", "Adobe Suite", "Typography", "Branding"],
    "Lawyer": ["Constitutional Law", "Contract Law", "Legal Drafting", "Research", "Communication"],
    "Hotel Manager": ["Hospitality Management", "Customer Service", "Revenue Management", "F&B"],
    "Digital Marketer": ["SEO", "Google Ads", "Social Media", "Content Marketing", "Analytics"],
    "Event Manager": ["Event Planning", "Budget Management", "Vendor Management", "Communication"],
    "Fashion Designer": ["Fashion Illustration", "Pattern Making", "Textile Science", "Merchandising"],
    "Interior Designer": ["Space Planning", "AutoCAD", "3D Visualization", "Materials", "Color Theory"],
    "Animator": ["2D Animation", "3D Modelling", "Adobe After Effects", "Storyboarding", "Motion Graphics"],
};

const STREAM_SKILLS: Record<string, string[]> = {
    // Engineering
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
    "ee": ["Circuit Design", "MATLAB", "Power Systems", "Control Systems"],
    "eee": ["Circuit Design", "MATLAB", "Microcontrollers"],
    "eie": ["Embedded Systems", "Signals", "MATLAB"],
    "ro": ["Robotics", "Arduino", "ROS", "Machine Vision", "Automation"],
    "mec": ["Sensors", "Control Systems", "CAD/CAM", "Embedded Systems"],
    "aero": ["Aerodynamics", "Propulsion", "Flight Mechanics", "Avionics"],
    "auto": ["Engine Design", "Vehicle Dynamics", "Automotive Electronics", "EV Technology"],
    "bio": ["Molecular Biology", "Genetic Engineering", "Bioinformatics"],
    "bme": ["Clinical Skills", "Medical Devices", "Biomechanics"],
    "env": ["Environmental Science", "GIS", "Sustainability"],
    // Science
    "bsc-cs": ["React", "Node.js", "Python", "Data Structures", "SQL"],
    "bsc-it": ["Networking", "Linux", "CI/CD", "Docker", "APIs"],
    "bsc-ai": ["Mathematics", "Python", "Scikit-Learn", "Machine Learning"],
    "bsc-ds": ["Python", "Pandas", "Data Visualization"],
    "bsc-math": ["Mathematics", "Statistics", "Data Visualization"],
    "bsc-stat": ["Statistics", "Python", "Machine Learning", "R Programming"],
    "bsc-phy": ["Physics", "Mathematics", "Data Analysis", "Lab Skills"],
    "bsc-chem": ["Analytical Chemistry", "Lab Techniques", "Research"],
    "bsc-bt": ["Molecular Biology", "Genetic Engineering", "Bioinformatics", "Lab Skills"],
    "bsc-mb": ["Lab Techniques", "Immunology", "Clinical Microbiology"],
    "bsc-bc": ["Biochemistry", "Lab Techniques", "Research"],
    "bsc-gn": ["Genetic Engineering", "Molecular Biology", "Bioinformatics"],
    "bsc-env": ["Environmental Science", "GIS", "Sustainability", "Data Analysis"],
    "bsc-zoo": ["Zoology", "Research", "Lab Skills"],
    "bsc-bot": ["Botany", "Research", "Lab Skills"],
    "bsc-fs": ["Forensic Analysis", "Lab Techniques", "Criminal Investigation"],
    "bsc-nur": ["Clinical Skills", "Patient Care", "Medical Knowledge"],
    "bsc-nd": ["Nutrition", "Dietetics", "Clinical Skills"],
    // Arts
    "ba-eng": ["Creative Writing", "Communication", "Research", "Digital Media", "Public Speaking"],
    "ba-tam": ["Creative Writing", "Communication", "Research", "Translation"],
    "ba-hin": ["Creative Writing", "Communication", "Research", "Translation"],
    "ba-fre": ["French Language", "Translation", "Communication"],
    "ba-his": ["Research", "Archival Methods", "Critical Analysis", "Writing", "Documentation"],
    "ba-pol": ["Public Policy", "Research", "Communication", "Critical Analysis"],
    "ba-soc": ["Research Methods", "Data Analysis", "Communication", "Community Development"],
    "ba-psy": ["Counselling", "Research Methods", "Cognitive Science", "Communication"],
    "ba-eco": ["Microeconomics", "Macroeconomics", "Econometrics", "Data Analysis", "Statistics"],
    "ba-jour": ["News Writing", "Digital Journalism", "Media Law", "Communication"],
    "ba-mc": ["Video Production", "Digital Media", "Content Strategy", "Communication"],
    "ba-vc": ["Photography", "Video Production", "Adobe Suite", "Digital Media"],
    "ba-film": ["Video Editing", "Cinematography", "Screenwriting", "Adobe Premiere"],
    "ba-pa": ["Public Policy", "Governance", "Communication", "Data Analysis"],
    "ba-tour": ["Hospitality Management", "Customer Service", "Event Planning", "Marketing"],
    "ba-fa": ["Creative Design", "Art History", "Digital Art", "Portfolio Development"],
    "ba-phi": ["Critical Analysis", "Research", "Writing", "Logic"],
    // Commerce
    "bcom": ["Accounting", "Taxation", "Financial Analysis", "Excel", "Tally"],
    "bcom-af": ["Financial Analysis", "Investment", "Accounting", "Risk Management"],
    "bcom-bi": ["Banking Operations", "Financial Analysis", "Risk Management", "Compliance"],
    "bcom-cs": ["Corporate Law", "Compliance", "Governance", "Business Communication"],
    "bcom-ca": ["SQL", "Data Structures", "APIs", "Accounting", "E-Commerce"],
    "bba": ["Marketing Strategy", "Business Communication", "HRM", "Finance", "Leadership"],
    "bms": ["Strategy", "Marketing", "Finance", "HRM", "Operations"],
    "bca": ["Java", "Spring Boot", "SQL", "APIs", "Microservices", "React Native"],
    // Professional
    "barch": ["AutoCAD", "3D Design", "Space Planning", "Building Materials"],
    "bpharm": ["Pharmacology", "Clinical Pharmacy", "Drug Formulation", "Chemistry"],
    "bdes": ["UI/UX", "Figma", "Adobe Suite", "Typography", "Branding"],
    "llb": ["Constitutional Law", "Contract Law", "Legal Drafting", "Research"],
    "hotel": ["Hospitality Management", "Customer Service", "Revenue Management", "F&B"],
    "avia": ["Aviation Management", "Safety Regulations", "Operations"],
    "anim": ["2D Animation", "3D Modelling", "Adobe After Effects", "Storyboarding", "Motion Graphics"],
    "fashion": ["Fashion Illustration", "Pattern Making", "Textile Science", "Merchandising"],
    "interior": ["Space Planning", "AutoCAD", "3D Visualization", "Materials", "Color Theory"],
    "event": ["Event Planning", "Budget Management", "Vendor Management", "Communication"],
    "tourm": ["Tourism Management", "Hospitality", "Customer Service", "Marketing"],
    "dm": ["SEO", "Google Ads", "Social Media", "Content Marketing", "Analytics"],
};

// Fill all missing streams automatically with high-quality generated content
if (!(STREAM_LESSONS as any).__initialized) {
    (STREAM_LESSONS as any).__initialized = true;

    STREAMS.forEach(stream => {
        if (!STREAM_LESSONS[stream.id]) {
            const skills = STREAM_SKILLS[stream.id] || [
                "Core Foundations",
                "Intermediate Concepts",
                "Advanced Techniques",
                "Industry Applications",
                "Capstone Project"
            ];
            STREAM_LESSONS[stream.id] = skills.map((skill, index) => ({
                title: `${skill} Mastery`,
                yt: `https://www.youtube.com/results?search_query=${encodeURIComponent(skill + ' full course ' + stream.name)}`,
                ytTitle: `${skill} Course`,
                duration: `${2 + index} hrs`
            }));
        }
    });

    // Fix placeholders and exhaustively EXPAND every single course to resemble a full paid bootcamp
    Object.entries(STREAM_LESSONS).forEach(([streamId, lessons]) => {
        if (!Array.isArray(lessons)) return;
        // 1. Fix placeholders
        lessons.forEach(lesson => {
            if (lesson.yt.includes("Oe421EPjeBE") || lesson.yt.includes("7t9spv2GXGM") || lesson.yt.includes("ua-CiDNNj30")) {
                lesson.yt = `https://www.youtube.com/results?search_query=${encodeURIComponent(lesson.title + ' full course tutorial')}`;
                if (lesson.ytTitle.includes("Overview") || lesson.ytTitle.includes("Intro")) {
                    lesson.ytTitle = "Watch Full Course";
                }
            }
        });

        // 2. Add Exhaustive Modules to EVERY course
        const streamName = STREAMS.find(s => s.id === streamId)?.name || "This Domain";
        const advancedModules = [
            { title: `Advanced Topics in ${streamName}`, duration: "4 hrs", query: `Advanced ${streamName} full course tutorial` },
            { title: "Real-World Projects & Case Studies", duration: "5 hrs", query: `${streamName} projects case studies full tutorial` },
            { title: "Industry Best Practices & Patterns", duration: "3 hrs", query: `${streamName} industry best practices architecture` },
            { title: "Tools of the Trade & Software", duration: "3.5 hrs", query: `Best tools software for ${streamName} tutorial` },
            { title: "Freelancing & Career Opportunities", duration: "2 hrs", query: `How to get a job freelance in ${streamName}` },
            { title: "Interview Preparation & Mock Scenarios", duration: "4 hrs", query: `${streamName} interview questions and answers full` },
            { title: "Certification Preparation Guide", duration: "3 hrs", query: `${streamName} certification exam prep full course` },
            { title: "Masterclass Capstone Project", duration: "8 hrs", query: `${streamName} complete capstone project tutorial from scratch` }
        ];

        advancedModules.forEach(mod => {
            // Prevent duplicate appending if hot-reloaded
            if (!lessons.some(l => l.title === mod.title)) {
                lessons.push({
                    title: mod.title,
                    yt: `https://www.youtube.com/results?search_query=${encodeURIComponent(mod.query)}`,
                    ytTitle: "Full Masterclass Module",
                    duration: mod.duration
                });
            }
        });
    });
}

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

    // Resume-based recommendations â€” with fuzzy domain matching
    const userDomain = profile?.domain || "";
    const hasResume = !!profile?.skills?.length;

    // Fuzzy match: find the best DOMAIN_TO_STREAMS key that matches the user's domain
    const findBestDomainKey = (domain: string): string => {
        if (!domain) return "";
        const domainLower = domain.toLowerCase();
        // Direct match first
        if (DOMAIN_TO_STREAMS[domain]) return domain;
        // Fuzzy match: check if any key is contained in the domain or vice versa
        const keys = Object.keys(DOMAIN_TO_STREAMS);
        for (const key of keys) {
            const keyLower = key.toLowerCase();
            if (domainLower.includes(keyLower) || keyLower.includes(domainLower)) return key;
            // Partial word matching: "Full-Stack" matches "Senior Full-Stack Engineer"
            const keyWords = keyLower.split(/[\s\-\/]+/).filter(w => w.length > 3);
            if (keyWords.some(w => domainLower.includes(w))) return key;
        }
        // Default fallback based on common keywords
        if (domainLower.includes("full") && domainLower.includes("stack")) return "Full-Stack Developer";
        if (domainLower.includes("ai") || domainLower.includes("machine")) return "AI/ML Engineer";
        if (domainLower.includes("data") && domainLower.includes("scien")) return "Data Scientist";
        if (domainLower.includes("devops")) return "DevOps Engineer";
        if (domainLower.includes("backend")) return "Backend Developer";
        if (domainLower.includes("mobile")) return "Mobile Developer";
        if (domainLower.includes("cyber") || domainLower.includes("security")) return "Cyber Security";
        if (domainLower.includes("mechanic")) return "Mechanical Engineer";
        if (domainLower.includes("civil")) return "Civil Engineer";
        if (domainLower.includes("electron")) return "Electronics Engineer";
        return keys[0] || "";
    };

    const matchedDomainKey = findBestDomainKey(userDomain);
    const allDomainCourseIds = DOMAIN_TO_STREAMS[matchedDomainKey] || [];

    // Read stored resume analysis for richer skill gap data
    const [storedAnalysis, setStoredAnalysis] = React.useState<any>(null);
    React.useEffect(() => {
        if (typeof window !== "undefined") {
            const stored = localStorage.getItem("ciq-resume-analysis");
            if (stored) setStoredAnalysis(JSON.parse(stored));
        }
    }, []);

    // Step 1 - Identify Skill Gaps (use stored analysis weak/missing skills if available)
    const domainReqSkills = DOMAIN_SKILLS_REQ[matchedDomainKey] || [];
    const userSkillsLower = (profile?.skills || []).map(s => s.toLowerCase());
    
    const skillIntel = storedAnalysis?.skill_intelligence || storedAnalysis?.skillIntelligence || {};
    const getCleanStringList = (arr: any) => {
        if (!arr) return [];
        if (!Array.isArray(arr)) return [];
        return arr.map((item: any) => {
            if (typeof item === "string") return item;
            return item.skill || item.name || JSON.stringify(item);
        });
    };

    const storedMissing = getCleanStringList(skillIntel.missing_skills || storedAnalysis?.missingSkills || storedAnalysis?.missing_skills || []);
    const storedWeak = getCleanStringList(skillIntel.weak_skills || storedAnalysis?.weakSkills || storedAnalysis?.weak_skills || []);
    const gapFromDomain = domainReqSkills.filter(req => !userSkillsLower.some(ps => ps.includes(req.toLowerCase()) || req.toLowerCase().includes(ps)));
    const missingSkills = [...new Set([...gapFromDomain, ...storedMissing, ...storedWeak])];

    // Step 2 & 4 - Course Recommendation (Filter mapped courses based on missing skills)
    const recommendedIds = allDomainCourseIds.filter(id => {
        const taughtSkills = STREAM_SKILLS[id] || [];
        // recommend course if it teaches any of the missing skills
        return taughtSkills.some(ts => missingSkills.some(ms => ms.toLowerCase() === ts.toLowerCase()));
    });
    // Fallback: if no skill-based match, recommend ALL domain courses
    if (recommendedIds.length === 0 && allDomainCourseIds.length > 0 && hasResume) {
        allDomainCourseIds.forEach(id => { if (!recommendedIds.includes(id)) recommendedIds.push(id); });
    }

    const [lessonProgress, setLessonProgress] = useState<Record<string, boolean>>({});

    useEffect(() => {
        if (typeof window !== "undefined") {
            const stored = localStorage.getItem("ciq-lesson-progress");
            if (stored) {
                try {
                    setLessonProgress(JSON.parse(stored));
                } catch {
                    setLessonProgress({});
                }
            }
        }
    }, []);

    const markLessonDone = (lKey: string) => {
        if (lessonProgress[lKey]) return;
        const nlp = { ...lessonProgress, [lKey]: true };
        setLessonProgress(nlp);
        localStorage.setItem("ciq-lesson-progress", JSON.stringify(nlp));
        addXP(10, "Completed lesson module");
    };

    if (selected) {
        const roadmap = CATEGORY_ROADMAP[selected.cat]!;
        const categoryYt = CATEGORY_YT[selected.cat];
        const done = !!progress[selected.id];
        return (
            <div className="max-w-[800px] mx-auto px-4 pb-16 pt-2 animate-fade">
                <div className="flex flex-wrap gap-3 mb-6 items-center border-b border-white/[0.05] pb-6">
                    <PremiumButton variant="secondary" size="sm" onClick={() => setSelected(null)}>
                        â† All Streams
                    </PremiumButton>
                    <span className="text-[var(--accent)]">{getCategoryIcon(selected.cat, 20)}</span>
                    <h1 className="text-xl font-bold text-white font-display">{selected.name}</h1>
                    <Badge label={selected.cat} variant="purple" size="sm" />
                    {done && (
                        <Badge label="Completed" variant="green" size="sm" dot={true} />
                    )}
                </div>

                {/* YouTube Resource */}
                <GlassCard className="mb-6 p-6">
                    <div className="flex gap-2.5 items-center mb-5">
                        <div className="w-8 h-8 rounded-lg bg-[var(--teal)]/10 border border-[var(--teal)]/20 flex items-center justify-center text-[var(--accent)]">
                            <PlaySquare size={16} />
                        </div>
                        <span className="text-[10px] font-bold text-[var(--accent)] uppercase tracking-widest font-display">Video Tutorial Guides</span>
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        <a 
                            href={selected.yt} 
                            target="_blank" 
                            rel="noopener noreferrer" 
                            className="flex items-center gap-3 bg-black/45 border border-white/[0.05] hover:border-[var(--teal)]/30 p-4 rounded-xl transition-all group"
                        >
                            <div className="w-8 h-8 rounded-lg bg-[var(--teal)]/10 border border-[var(--teal)]/20 flex items-center justify-center text-[var(--accent)] flex-shrink-0">
                                <Play size={14} />
                            </div>
                            <div className="flex-1 min-w-0">
                                <div className="text-xs font-bold text-white truncate group-hover:text-[var(--accent)] transition-colors font-display uppercase tracking-wider">{selected.ytTitle}</div>
                                <div className="text-[9px] text-zinc-500 font-bold uppercase tracking-widest mt-1">Syllabus Overview</div>
                            </div>
                            <span className="text-[10px] text-[var(--accent)] font-bold uppercase tracking-wider font-display">Watch â†’</span>
                        </a>
                        {categoryYt && (
                            <a 
                                href={categoryYt.url} 
                                target="_blank" 
                                rel="noopener noreferrer" 
                                className="flex items-center gap-3 bg-black/45 border border-white/[0.05] hover:border-[var(--teal)]/30 p-4 rounded-xl transition-all group"
                            >
                                <div className="w-8 h-8 rounded-lg bg-white/[0.03] border border-white/[0.08] flex items-center justify-center text-zinc-400 flex-shrink-0">
                                    <Play size={14} />
                                </div>
                                <div className="flex-1 min-w-0">
                                    <div className="text-xs font-bold text-zinc-300 truncate group-hover:text-white transition-colors font-display uppercase tracking-wider">{categoryYt.title}</div>
                                    <div className="text-[9px] text-zinc-500 font-bold uppercase tracking-widest mt-1">General Advice</div>
                                </div>
                                <span className="text-[10px] text-zinc-400 font-bold uppercase tracking-wider font-display">Watch â†’</span>
                            </a>
                        )}
                    </div>
                </GlassCard>

                {/* Roadmap */}
                <GlassCard className="mb-6 p-6">
                    <h3 className="text-xs font-bold text-white flex items-center gap-2 mb-6 font-display uppercase tracking-widest border-b border-white/[0.05] pb-4">
                        <Map size={15} className="text-[var(--accent)]" /> Trajectory Roadmap
                    </h3>
                    <div className="relative pl-6">
                        <div className="absolute left-2.5 top-2 bottom-6 w-0.5 bg-gradient-to-b from-[var(--teal)] to-zinc-800/10" />
                        <div className="space-y-6">
                            {roadmap.steps.map((step, i) => (
                                <div key={i} className="flex gap-4 relative z-10">
                                    <div className="w-6 h-6 rounded-full bg-[var(--teal)] border border-[var(--teal)]/40 flex items-center justify-center text-[10px] font-bold text-white flex-shrink-0 mt-0.5 shadow-[0_2px_8px_rgba(109,0,26,0.3)] font-mono">
                                        {i + 1}
                                    </div>
                                    <p className="text-xs text-zinc-400 leading-relaxed pt-0.5 font-semibold">{step}</p>
                                </div>
                            ))}
                        </div>
                    </div>
                </GlassCard>

                {/* Skills + Jobs */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                    <GlassCard className="p-6">
                        <h4 className="text-[9px] font-bold text-zinc-500 uppercase tracking-widest mb-4 flex items-center gap-2 font-display">
                            <Hammer size={14} /> Core Skillsets
                        </h4>
                        <div className="flex flex-wrap gap-1.5">
                            {roadmap.skills.map(s => (
                                <span key={s} className="text-[9px] border border-white/[0.06] bg-white/[0.01] px-2 py-0.5 rounded text-zinc-400 font-bold uppercase tracking-wider font-display">
                                    {s}
                                </span>
                            ))}
                        </div>
                    </GlassCard>
                    <GlassCard className="p-6">
                        <h4 className="text-[9px] font-bold text-zinc-500 uppercase tracking-widest mb-4 flex items-center gap-2 font-display">
                            <Briefcase size={14} /> Active Roles
                        </h4>
                        <div className="space-y-2 font-sans text-xs">
                            {roadmap.jobs.map(j => (
                                <div key={j} className="text-zinc-405 border-b border-white/[0.03] pb-1.5 last:border-b-0 last:pb-0 font-semibold">
                                    â†’ {j}
                                </div>
                            ))}
                        </div>
                    </GlassCard>
                </div>

                {/* Lessons */}
                {(STREAM_LESSONS[selected.id] || []).length > 0 && (
                    <GlassCard className="mb-6 p-6">
                        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6 border-b border-white/[0.05] pb-4">
                            <h3 className="text-xs font-bold text-white flex items-center gap-2 font-display uppercase tracking-widest">
                                <BookMarked size={15} className="text-[var(--accent)]" /> Course Syllabus Lessons
                            </h3>
                            <div className="flex items-center gap-3 w-full sm:w-48">
                                <ProgressBar 
                                    value={((STREAM_LESSONS[selected.id] || []).filter((_, li) => lessonProgress[`${selected.id}-${li}`]).length / (STREAM_LESSONS[selected.id] || []).length) * 100}
                                    className="flex-1"
                                />
                                <span className="text-[10px] font-bold text-zinc-450 font-mono">
                                    {(STREAM_LESSONS[selected.id] || []).filter((_, li) => lessonProgress[`${selected.id}-${li}`]).length}/{(STREAM_LESSONS[selected.id] || []).length} Done
                                </span>
                            </div>
                        </div>

                        <div className="space-y-3 font-sans">
                            {(STREAM_LESSONS[selected.id] || []).map((lesson, li) => {
                                const lKey = `${selected.id}-${li}`;
                                const lDone = !!lessonProgress[lKey];
                                return (
                                    <div 
                                        key={li} 
                                        className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-3 bg-black/40 border border-white/[0.04] rounded-xl transition-all duration-200 hover:border-white/[0.08]"
                                    >
                                        <div className="flex items-center gap-3 flex-1 min-w-0">
                                            <div className={`w-6 h-6 rounded-full flex items-center justify-center text-[9px] font-bold font-mono ${
                                                lDone ? "bg-emerald-950 text-emerald-450 border border-emerald-900/30" : "bg-white/[0.02] border border-white/[0.08] text-zinc-500"
                                            }`}>
                                                {lDone ? "âœ“" : li + 1}
                                            </div>
                                            <div className="min-w-0">
                                                <div className={`text-xs font-bold ${lDone ? "text-zinc-550 line-through" : "text-white"}`}>
                                                    {lesson.title}
                                                </div>
                                                <div className="text-[9px] text-zinc-550 font-bold uppercase tracking-widest mt-1 font-mono">â± {lesson.duration}</div>
                                            </div>
                                        </div>
                                        <div className="flex items-center gap-2 self-end sm:self-auto flex-shrink-0">
                                            <a 
                                                href={lesson.yt} 
                                                target="_blank" 
                                                rel="noopener noreferrer" 
                                                className="inline-flex items-center gap-1.5 bg-[var(--teal)]/10 border border-[var(--teal)]/20 hover:bg-[var(--teal)]/20 px-3 py-1 rounded-lg text-[9px] font-bold text-[var(--accent)] uppercase tracking-widest font-display transition-colors"
                                            >
                                                <PlayCircle size={12} /> Play
                                            </a>
                                            {!lDone && (
                                                <PremiumButton 
                                                    variant="secondary" 
                                                    size="sm" 
                                                    className="h-7 px-3 text-[9px] uppercase font-bold tracking-widest font-display"
                                                    onClick={() => markLessonDone(lKey)}
                                                >
                                                    Done
                                                </PremiumButton>
                                            )}
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    </GlassCard>
                )}

                {/* Optional resume prompt */}
                {!hasResume && (
                    <GlassCard className="mb-6 border-[var(--teal)]/30 bg-[var(--teal)]/5 p-6 flex flex-col sm:flex-row items-center gap-4 text-center sm:text-left">
                        <div className="w-10 h-10 rounded-xl bg-[var(--teal)]/10 border border-[var(--teal)]/20 flex items-center justify-center text-[var(--accent)] flex-shrink-0">
                            <FileText size={18} />
                        </div>
                        <div className="flex-1">
                            <h4 className="text-xs font-bold text-white uppercase tracking-wider font-display">Unlock Tailored Career Scans</h4>
                            <p className="text-[11px] text-zinc-450 leading-relaxed mt-1 font-semibold">Submit your profile resume to sync this roadmap to active market requirements.</p>
                        </div>
                        <PremiumButton 
                            size="sm"
                            className="w-full sm:w-auto"
                            onClick={() => {
                                if (role === "guest") {
                                    if (typeof window !== "undefined") localStorage.setItem("ciq-redirect-after-login", "learning");
                                    router.push("/login");
                                } else {
                                    router.push("/resume");
                                }
                            }}
                        >
                            Upload Resume
                        </PremiumButton>
                    </GlassCard>
                )}

                {!done ? (
                    <PremiumButton className="w-full flex items-center justify-center gap-2" onClick={() => markDone(selected.id)}>
                        Mark Stream Completed Â· +30 XP
                    </PremiumButton>
                ) : (
                    <div className="text-center bg-emerald-950/10 border border-emerald-900/30 rounded-xl py-3 text-[10px] text-emerald-450 font-bold uppercase tracking-widest font-display">
                        âœ“ Stream Studied Complete
                    </div>
                )}
            </div>
        );
    }

    // â”€â”€ Stream Catalog View â”€â”€
    const remainingFiltered = hasResume && recommendedIds.length > 0
        ? filtered.filter(s => !recommendedIds.includes(s.id))
        : filtered;
    
    const grouped = CATS.slice(1).map(cat => ({
        cat, items: remainingFiltered.filter(s => s.cat === cat),
    })).filter(g => g.items.length > 0 && (filterCat === "All" || filterCat === g.cat));

    const StreamCard = ({ s }: { s: typeof STREAMS[0] }) => {
        const done = !!progress[s.id];
        const isRecommended = recommendedIds.includes(s.id);
        
        return (
            <div onClick={() => setSelected(s)} className="cursor-pointer h-full">
                <GlassCard 
                    className={`h-full flex flex-col justify-between p-5 hover:border-[var(--teal)]/30 transition-all duration-200 ${
                        done ? "border-emerald-900/30 bg-emerald-950/5" : ""
                    }`}
                >
                    <div>
                        <div className="flex justify-between items-start mb-4">
                            <span className="text-[var(--accent)]">{getCategoryIcon(s.cat, 18)}</span>
                            {isRecommended && (
                                <Badge label="Recommended" variant="red" size="sm" />
                            )}
                            {done && (
                                <span className="w-5 h-5 rounded-full bg-emerald-950 border border-emerald-900/40 flex items-center justify-center text-[10px] font-bold text-emerald-400 font-mono">
                                    âœ“
                                </span>
                            )}
                        </div>
                        <h4 className="text-xs font-bold text-white leading-snug mb-3 font-display uppercase tracking-wider">{s.name}</h4>
                    </div>
                    <div className="flex items-center gap-1.5 mt-auto pt-3 border-t border-white/[0.04] text-[9px] text-zinc-550 font-bold uppercase tracking-widest font-display">
                        <span className="w-1.5 h-1.5 rounded-full bg-[var(--teal)]" />
                        Syllabus Roadmap
                    </div>
                </GlassCard>
            </div>
        );
    };

    return (
        <div className="max-w-[1280px] mx-auto px-4 pb-16 pt-2 animate-fade font-sans">
            {/* Header Banner */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-5 border-b border-white/[0.05] pb-6 mb-8 mt-2">
                <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-2">
                        <span className="text-[9px] font-bold uppercase tracking-widest text-[var(--accent)] font-display">Curriculum Database</span>
                        <Badge label="Active Streams" variant="purple" size="sm" dot={true} />
                    </div>
                    <h1 className="text-3xl md:text-5xl font-extrabold text-white tracking-tight leading-none font-display">
                        Learning Paths
                    </h1>
                    <p className="text-xs text-zinc-550 mt-2.5 leading-relaxed font-semibold">
                        Explore structured roadmaps and course syllabus modules curated to professional skill targets.
                    </p>
                    <p className="text-[10px] text-zinc-500 font-bold uppercase tracking-widest font-mono mt-3">
                        Currently mapping <strong className="text-zinc-400">{STREAMS.length} course streams</strong> Â· {totalDone} studied
                        {hasResume ? ` Â· Personalised to domain: ${userDomain}` : " Â· Upload resume to unlock target course alignment"}
                    </p>
                </div>
                <div className="flex-shrink-0 w-full sm:w-72">
                    <div className="flex items-center gap-2 bg-black/45 border border-white/[0.08] rounded-xl px-3.5 h-10 focus-within:border-[var(--teal)]/60">
                        <Search size={14} className="text-zinc-500 flex-shrink-0" />
                        <input 
                            placeholder="Search streams..." 
                            value={search} 
                            onChange={e => setSearch(e.target.value)} 
                            className="bg-transparent border-none text-white text-xs outline-none w-full font-semibold"
                        />
                    </div>
                </div>
            </div>

            {/* Recommended Section (Priority Gaps) */}
            {hasResume && recommendedIds.length > 0 && (
                <div className="mb-10">
                    {(() => {
                        const topPickId = recommendedIds[0];
                        const topPickStream = STREAMS.find(s => s.id === topPickId);
                        if (!topPickStream) return null;
                        
                        return (
                            <GlassCard 
                                className="p-8 relative overflow-hidden mb-8 border-white/[0.06]"
                                style={{
                                    background: "radial-gradient(circle at 100% 0%, rgba(109, 0, 26, 0.08) 0%, transparent 60%), rgba(18,18,20,0.6)"
                                }}
                            >
                                <div className="relative z-10 flex flex-col md:flex-row justify-between items-start md:items-center gap-8">
                                    <div className="flex-1 max-w-2xl">
                                        <div className="mb-4">
                                            <Badge label="Target Calibration Recommendation" variant="red" size="sm" dot={true} />
                                        </div>
                                        <h2 className="text-xl md:text-3xl font-extrabold text-white font-display tracking-tight leading-none mb-4">{topPickStream.name}</h2>
                                        <p className="text-xs text-zinc-450 leading-relaxed mb-6 font-semibold">
                                            Your profile domain is scanned as <strong className="text-white">{userDomain}</strong>, with mapped gaps identified in <strong className="text-[var(--accent)]">{missingSkills.slice(0, 4).join(", ")}</strong>. Mastering this specific roadmap will directly optimize your competence scores.
                                        </p>
                                        <PremiumButton onClick={() => setSelected(topPickStream)}>
                                            Initiate Learning Path <ChevronRight size={12} className="ml-1" />
                                        </PremiumButton>
                                    </div>
                                    <div className="w-16 h-16 rounded-2xl bg-white/[0.02] border border-white/[0.08] flex items-center justify-center text-[var(--accent)] flex-shrink-0">
                                        {getCategoryIcon(topPickStream.cat, 26)}
                                    </div>
                                </div>
                            </GlassCard>
                        );
                    })()}

                    {/* Secondary Recommendations */}
                    {recommendedIds.length > 1 && (
                        <div className="mb-10">
                            <h3 className="text-[10px] font-bold text-zinc-550 uppercase tracking-widest mb-4 flex items-center gap-2 font-display">
                                <BookMarked size={14} /> Secondary Course Recommendations
                            </h3>
                            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
                                {filtered.filter(s => recommendedIds.slice(1).includes(s.id)).map(s => (
                                    <StreamCard key={s.id} s={s} />
                                ))}
                            </div>
                        </div>
                    )}
                </div>
            )}

            {/* Resume Upload CTA */}
            {!hasResume && (
                <GlassCard className="border-[var(--teal)]/30 bg-[var(--teal)]/5 p-6 mb-8 flex flex-col sm:flex-row items-center gap-4 text-center sm:text-left">
                    <div className="w-10 h-10 rounded-xl bg-[var(--teal)]/10 border border-[var(--teal)]/20 flex items-center justify-center text-[var(--accent)] flex-shrink-0">
                        <FileText size={18} />
                    </div>
                    <div className="flex-1">
                        <h4 className="text-xs font-bold text-white uppercase tracking-wider font-display">Sync Course Syllabi to Resume</h4>
                        <p className="text-[11px] text-zinc-455 leading-relaxed mt-1 font-semibold">Upload your resume to calculate keyword overlaps, ATS scoring, and targeted course recommendations.</p>
                    </div>
                    <PremiumButton 
                        size="sm" 
                        className="w-full sm:w-auto"
                        onClick={() => {
                            if (role === "guest") {
                                    if (typeof window !== "undefined") localStorage.setItem("ciq-redirect-after-login", "learning");
                                router.push("/login");
                            } else {
                                router.push("/resume");
                            }
                        }}
                    >
                        Upload Resume
                    </PremiumButton>
                </GlassCard>
            )}

            {/* Course Directory Catalog */}
            <div>
                <GlassCard className="p-5 mb-8 flex items-center gap-3">
                    <div className="text-[var(--accent)] flex-shrink-0"><BookMarked size={18} /></div>
                    <div>
                        <h3 className="text-[10px] font-bold text-white uppercase tracking-widest font-display">
                            {hasResume && recommendedIds.length > 0 ? "Explore Additional Courses" : "Complete Course Directory"}
                        </h3>
                        <p className="text-[9px] text-zinc-550 font-bold uppercase tracking-widest mt-1">
                            {hasResume && recommendedIds.length > 0
                                ? `Explore ${remainingFiltered.length} supplementary courses beyond your core recommendation paths`
                                : `Browse all ${STREAMS.length} pathways mapped across our five main career categories`
                            }
                        </p>
                    </div>
                </GlassCard>

                {/* Category filter pills */}
                <div className="flex gap-2 flex-wrap mb-6">
                    {CATS.map(c => (
                        <button 
                            key={c} 
                            onClick={() => setFilterCat(c)}
                            className={`px-3.5 py-1.5 rounded-xl text-[9px] font-bold uppercase tracking-widest border transition-all duration-200 outline-none ${
                                filterCat === c 
                                    ? "bg-[var(--teal)] text-white border-transparent shadow-[0_2px_10px_rgba(109,0,26,0.3)]" 
                                    : "bg-black/45 text-zinc-500 border-white/[0.05] hover:border-white/[0.1] hover:text-white"
                            }`}
                        >
                            {c} {c !== "All" ? `(${STREAMS.filter(s => s.cat === c).length})` : `(${STREAMS.length})`}
                        </button>
                    ))}
                </div>

                {/* Grouped lists */}
                <div className="space-y-8">
                    {grouped.map(({ cat, items }) => (
                        <div key={cat}>
                            <h3 className="text-xs font-bold text-white flex items-center gap-2 mb-4 font-display uppercase tracking-widest">
                                {getCategoryIcon(cat, 15)} {cat}
                                <span className="text-[9px] text-zinc-550 font-bold uppercase tracking-widest font-mono">({items.length} streams)</span>
                            </h3>
                            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
                                {items.map(s => <StreamCard key={s.id} s={s} />)}
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}

