"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  BarChart,
  Bar,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  Radar,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  Cell,
} from "recharts";
import { Check, AlertCircle, X, Star, BookOpen, AlertOctagon, AlertTriangle, ArrowRight } from "lucide-react";

// ─────────────────────────────────────────────────────────────────────
// TYPE DEFINITIONS
// ─────────────────────────────────────────────────────────────────────

interface ScoreCard {
  title: string;
  score: number;
  maxScore: number;
  color: string;
  description: string;
}

interface ResumeAnalysis {
  improved_summary: {
    original: string;
    improved: string;
    key_keywords: string[];
    ats_compliance: number;
  };
  enhanced_experience: {
    items: Array<{
      original: string;
      improved: string;
      action_verbs: string[];
      metrics: string[];
      impact_score: number;
    }>;
    overall_strength: number;
  };
  skill_optimization: {
    current_skills: string[];
    optimized_skills: string[];
    industry_keywords: string[];
    missing_trending: string[];
    coverage_percentage: number;
  };
  scores: {
    ats_score: number;
    recruiter_score: number;
    impact_score: number;
    skill_depth_score: number;
    career_consistency_score: number;
    overall_score: number;
  };
  recruiter_simulation: {
    first_impression: string;
    shortlist_probability: number;
    key_concerns: string[];
    strengths_spotted: string[];
  };
  resume_breakdown: {
    bullet_analyses: Array<{
      original: string;
      issues: string[];
      improved: string;
      action_verb: string;
      metric_added: string;
    }>;
    generic_content_percentage: number;
    metrics_percentage: number;
    improvement_potential: number;
  };
  skill_intelligence: {
    core_skills: string[];
    weak_skills: string[];
    missing_skills: string[];
    future_skills: string[];
    skill_gap: number;
  };
  career_insights: {
    role_alignment: number;
    suggested_career_paths: string[];
    growth_recommendations: string[];
    timeline_to_next_level: string;
  };
  risk_detection: {
    generic_content: boolean;
    skill_mismatch: boolean;
    timeline_issues: boolean;
    employment_gaps: boolean;
    risks: string[];
    severity: "low" | "medium" | "high";
  };
  interview_questions: {
    technical: Array<{ category: string; question: string }>;
    hr: Array<{ category: string; question: string }>;
    situational: Array<{ category: string; question: string }>;
  };
  personal_branding: {
    linkedin_headline: string;
    short_bio: string;
    tagline: string;
    elevator_pitch: string;
  };
  portfolio_content: {
    hero: string;
    about: string;
    skills_section: string;
    projects: string[];
    contact_cta: string;
  };
  optimized_resume: {
    content: string;
    is_tailored: boolean;
    job_matched_percentage: number;
  };
}

// ─────────────────────────────────────────────────────────────────────
// COMPONENTS
// ─────────────────────────────────────────────────────────────────────

const ScoreCardComponent: React.FC<ScoreCard> = ({
  title,
  score,
  maxScore,
  color,
  description,
}) => {
  const percentage = (score / maxScore) * 100;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="bg-white rounded-lg shadow-lg p-6 border-t-4"
      style={{ borderTopColor: color }}
    >
      <h3 className="text-sm font-semibold text-gray-600 mb-3">{title}</h3>
      <div className="relative w-full h-24 flex items-center justify-center mb-4">
        <svg width="120" height="120" className="transform -rotate-90">
          <circle
            cx="60"
            cy="60"
            r="50"
            fill="none"
            stroke="#e5e7eb"
            strokeWidth="8"
          />
          <motion.circle
            cx="60"
            cy="60"
            r="50"
            fill="none"
            stroke={color}
            strokeWidth="8"
            strokeDasharray={`${(percentage / 100) * 314} 314`}
            initial={{ strokeDasharray: "0 314" }}
            animate={{ strokeDasharray: `${(percentage / 100) * 314} 314` }}
            transition={{ duration: 1.5, ease: "easeOut" }}
            strokeLinecap="round"
          />
        </svg>
        <div className="absolute text-center">
          <motion.div
            className="text-2xl font-bold"
            style={{ color }}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
          >
            {score}
          </motion.div>
          <div className="text-xs text-gray-500">/100</div>
        </div>
      </div>
      <p className="text-xs text-gray-600">{description}</p>
    </motion.div>
  );
};

const ScoreDashboard: React.FC<{ scores: ResumeAnalysis["scores"] }> = ({
  scores,
}) => {
  const scoreCards: ScoreCard[] = [
    {
      title: "ATS Score",
      score: scores.ats_score,
      maxScore: 100,
      color: "#3b82f6",
      description: "Optimization for Applicant Tracking Systems",
    },
    {
      title: "Recruiter Score",
      score: scores.recruiter_score,
      maxScore: 100,
      color: "#10b981",
      description: "Impact on human recruiters",
    },
    {
      title: "Impact Score",
      score: scores.impact_score,
      maxScore: 100,
      color: "#f59e0b",
      description: "Achievement & metrics visibility",
    },
    {
      title: "Skill Depth",
      score: scores.skill_depth_score,
      maxScore: 100,
      color: "#8b5cf6",
      description: "Technical skill breadth",
    },
    {
      title: "Career Consistency",
      score: scores.career_consistency_score,
      maxScore: 100,
      color: "#ec4899",
      description: "Career path coherence",
    },
    {
      title: "Overall Score",
      score: scores.overall_score,
      maxScore: 100,
      color: "#06b6d4",
      description: "Comprehensive resume quality",
    },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 p-6">
      {scoreCards.map((card, idx) => (
        <ScoreCardComponent key={idx} {...card} />
      ))}
    </div>
  );
};

const RecruiterSimulationPanel: React.FC<{
  data: ResumeAnalysis["recruiter_simulation"];
}> = ({ data }) => {
  const probabilityColor =
    data.shortlist_probability > 70
      ? "text-green-600"
      : data.shortlist_probability > 40
        ? "text-yellow-600"
        : "text-red-600";

  return (
    <motion.div
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.6 }}
      className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-lg shadow-lg p-8 border-l-4 border-indigo-600"
    >
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold text-gray-800">6-Second Impression</h2>
        <motion.div
          className={`text-4xl font-bold ${probabilityColor}`}
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ delay: 0.3, type: "spring" }}
        >
          {data.shortlist_probability}%
        </motion.div>
      </div>

      <p className="text-lg text-gray-700 mb-6 italic">
        "{data.first_impression}"
      </p>

      <div className="grid grid-cols-2 gap-6">
        <div>
          <h3 className="font-semibold text-green-700 mb-3 flex items-center">
            <span className="w-2 h-2 bg-green-600 rounded-full mr-2"></span>
            Strengths Spotted
          </h3>
          <ul className="space-y-2">
            {data.strengths_spotted.map((strength, idx) => (
              <motion.li
                key={idx}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.4 + idx * 0.1 }}
                className="text-sm text-green-700 flex items-start"
              >
                <Check size={14} className="mr-2" />
                <span>{strength}</span>
              </motion.li>
            ))}
          </ul>
        </div>

        <div>
          <h3 className="font-semibold text-red-700 mb-3 flex items-center">
            <span className="w-2 h-2 bg-red-600 rounded-full mr-2"></span>
            Key Concerns
          </h3>
          <ul className="space-y-2">
            {data.key_concerns.map((concern, idx) => (
              <motion.li
                key={idx}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.4 + idx * 0.1 }}
                className="text-sm text-red-700 flex items-start"
              >
                <AlertCircle size={14} className="mr-2" />
                <span>{concern}</span>
              </motion.li>
            ))}
          </ul>
        </div>
      </div>

      <div className="mt-6 pt-6 border-t border-indigo-200">
        <p className="text-xs text-gray-600">
          Shortlist Probability:{" "}
          <span className={`font-bold ${probabilityColor}`}>
            {data.shortlist_probability > 70
              ? "HIGHLY LIKELY"
              : data.shortlist_probability > 40
                ? "POSSIBLE"
                : "UNLIKELY"}
          </span>
        </p>
      </div>
    </motion.div>
  );
};

const ResumeBreaddown: React.FC<{
  data: ResumeAnalysis["resume_breakdown"];
}> = ({ data }) => {
  const [expandedIdx, setExpandedIdx] = useState<number | null>(null);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
      className="bg-white rounded-lg shadow-lg p-8"
    >
      <h2 className="text-2xl font-bold text-gray-800 mb-6">
        Resume Breakdown Analysis
      </h2>

      <div className="grid grid-cols-3 gap-4 mb-6">
        <div className="bg-blue-50 rounded p-4 border-l-4 border-blue-500">
          <div className="text-sm text-gray-600">Generic Content</div>
          <div className="text-2xl font-bold text-blue-600">
            {data.generic_content_percentage}%
          </div>
        </div>
        <div className="bg-green-50 rounded p-4 border-l-4 border-green-500">
          <div className="text-sm text-gray-600">With Metrics</div>
          <div className="text-2xl font-bold text-green-600">
            {data.metrics_percentage}%
          </div>
        </div>
        <div className="bg-purple-50 rounded p-4 border-l-4 border-purple-500">
          <div className="text-sm text-gray-600">Improvement Potential</div>
          <div className="text-2xl font-bold text-purple-600">
            {data.improvement_potential}%
          </div>
        </div>
      </div>

      <div className="space-y-3">
        {data.bullet_analyses.slice(0, 4).map((analysis, idx) => (
          <motion.div
            key={idx}
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: idx * 0.1 }}
            className="border rounded p-4 hover:shadow-md transition-shadow"
          >
            <button
              onClick={() =>
                setExpandedIdx(expandedIdx === idx ? null : idx)
              }
              className="w-full text-left"
            >
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <p className="text-sm font-mono bg-gray-100 p-2 rounded mb-2">
                    {analysis.original}
                  </p>
                  {analysis.issues.length > 0 && (
                    <div className="flex gap-2 mb-2">
                      {analysis.issues.map((issue, i) => (
                        <span
                          key={i}
                          className="text-xs bg-red-100 text-red-700 px-2 py-1 rounded"
                        >
                          {issue}
                        </span>
                      ))}
                    </div>
                  )}
                </div>
                <motion.div
                  animate={{ rotate: expandedIdx === idx ? 180 : 0 }}
                  className="text-gray-400 ml-2"
                >
                  ▼
                </motion.div>
              </div>
            </button>

            <AnimatePresence>
              {expandedIdx === idx && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: "auto" }}
                  exit={{ opacity: 0, height: 0 }}
                  className="mt-4 pt-4 border-t"
                >
                  <div className="mb-3">
                    <span className="text-xs font-semibold text-gray-600">
                      IMPROVED VERSION:
                    </span>
                    <p className="text-sm bg-green-50 p-2 rounded mt-1 text-green-900">
                      {analysis.improved}
                    </p>
                  </div>
                  <div className="grid grid-cols-2 gap-3 text-xs">
                    <div>
                      <span className="font-semibold text-gray-600">
                        Action Verb:
                      </span>
                      <span className="ml-2 text-indigo-600 font-bold">
                        {analysis.action_verb}
                      </span>
                    </div>
                    <div>
                      <span className="font-semibold text-gray-600">
                        Metric:
                      </span>
                      <span className="ml-2 text-green-600 font-bold">
                        {analysis.metric_added}
                      </span>
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        ))}
      </div>
    </motion.div>
  );
};

const SkillIntelligencePanel: React.FC<{
  data: ResumeAnalysis["skill_intelligence"];
}> = ({ data }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
      className="bg-white rounded-lg shadow-lg p-8"
    >
      <h2 className="text-2xl font-bold text-gray-800 mb-6">
        Skill Intelligence
      </h2>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <h3 className="font-semibold text-green-700 mb-3">Core Skills</h3>
          <div className="flex flex-wrap gap-2">
            {data.core_skills.map((skill, idx) => (
              <motion.span
                key={idx}
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: idx * 0.05 }}
                className="px-3 py-1 bg-green-100 text-green-700 rounded-full text-sm font-medium"
              >
                <span className="flex items-center gap-1"><Check size={14} /> {skill}</span>
              </motion.span>
            ))}
          </div>
        </div>

        <div>
          <h3 className="font-semibold text-orange-700 mb-3">Weak Skills</h3>
          <div className="flex flex-wrap gap-2">
            {data.weak_skills.map((skill, idx) => (
              <motion.span
                key={idx}
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: idx * 0.05 }}
                className="px-3 py-1 bg-orange-100 text-orange-700 rounded-full text-sm font-medium"
              >
                <span className="flex items-center gap-1"><ArrowRight size={14} /> {skill}</span>
              </motion.span>
            ))}
          </div>
        </div>

        <div>
          <h3 className="font-semibold text-red-700 mb-3">Missing Skills</h3>
          <div className="flex flex-wrap gap-2">
            {data.missing_skills.map((skill, idx) => (
              <motion.span
                key={idx}
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: idx * 0.05 }}
                className="px-3 py-1 bg-red-100 text-red-700 rounded-full text-sm font-medium"
              >
                <span className="flex items-center gap-1"><X size={14} /> {skill}</span>
              </motion.span>
            ))}
          </div>
        </div>

        <div>
          <h3 className="font-semibold text-purple-700 mb-3">Future Skills</h3>
          <div className="flex flex-wrap gap-2">
            {data.future_skills.map((skill, idx) => (
              <motion.span
                key={idx}
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: idx * 0.05 }}
                className="px-3 py-1 bg-purple-100 text-purple-700 rounded-full text-sm font-medium"
              >
                <span className="flex items-center gap-1"><Star size={14} /> {skill}</span>
              </motion.span>
            ))}
          </div>
        </div>
      </div>

      <div className="mt-6 pt-6 border-t">
        <div className="flex items-center justify-between">
          <span className="font-semibold text-gray-700">Skill Gap Analysis</span>
          <div className="w-48 bg-gray-200 rounded-full h-3 overflow-hidden">
            <motion.div
              className="h-full bg-gradient-to-r from-yellow-400 to-red-500"
              initial={{ width: 0 }}
              animate={{ width: `${data.skill_gap}%` }}
              transition={{ duration: 1.5 }}
            />
          </div>
          <span className="font-bold text-red-600">{data.skill_gap}%</span>
        </div>
      </div>
    </motion.div>
  );
};

const CareerInsightsPanel: React.FC<{
  data: ResumeAnalysis["career_insights"];
}> = ({ data }) => {
  const chartData = [
    { name: "Alignment", value: data.role_alignment },
    { name: "Gap", value: 100 - data.role_alignment },
  ];

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
      className="bg-white rounded-lg shadow-lg p-8"
    >
      <h2 className="text-2xl font-bold text-gray-800 mb-6">
        Career Insights & Roadmap
      </h2>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div>
          <div className="mb-6">
            <h3 className="font-semibold text-gray-700 mb-2">
              Role Alignment: {data.role_alignment}%
            </h3>
            <div className="w-full bg-gray-200 rounded-full h-2 overflow-hidden">
              <motion.div
                className="h-full bg-gradient-to-r from-cyan-400 to-blue-600"
                initial={{ width: 0 }}
                animate={{ width: `${data.role_alignment}%` }}
                transition={{ duration: 1.5 }}
              />
            </div>
          </div>

          <h3 className="font-semibold text-gray-700 mb-3">
            Suggested Career Paths
          </h3>
          <ul className="space-y-2">
            {data.suggested_career_paths.map((path, idx) => (
              <motion.li
                key={idx}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: idx * 0.1 }}
                className="text-sm text-gray-600 flex items-center"
              >
                <span className="w-2 h-2 bg-blue-500 rounded-full mr-3"></span>
                {path}
              </motion.li>
            ))}
          </ul>
        </div>

        <div>
          <h3 className="font-semibold text-gray-700 mb-3">
            Growth Recommendations
          </h3>
          <ul className="space-y-2">
            {data.growth_recommendations.map((rec, idx) => (
              <motion.li
                key={idx}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: idx * 0.1 }}
                className="text-sm bg-blue-50 text-blue-900 p-2 rounded"
              >
                <span className="flex items-center gap-2"><BookOpen size={16} /> {rec}</span>
              </motion.li>
            ))}
          </ul>
          <div className="mt-6 p-4 bg-yellow-50 rounded-lg border-l-4 border-yellow-500">
            <p className="text-sm text-yellow-900">
              <span className="font-semibold">Timeline to Next Level:</span>{" "}
              {data.timeline_to_next_level}
            </p>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

const RiskDetectionPanel: React.FC<{
  data: ResumeAnalysis["risk_detection"];
}> = ({ data }) => {
  const severityColors = {
    low: "bg-green-50 border-green-500 text-green-900",
    medium: "bg-yellow-50 border-yellow-500 text-yellow-900",
    high: "bg-red-50 border-red-500 text-red-900",
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
      className={`rounded-lg shadow-lg p-8 border-l-4 ${severityColors[data.severity]}`}
    >
      <h2 className="text-2xl font-bold mb-6 flex items-center">
        <span className="mr-3">
          {data.severity === "high"
            ? <AlertOctagon size={24} />
            : data.severity === "medium"
              ? <AlertTriangle size={24} />
              : <Check size={24} />}
        </span>
        Risk Detection - {data.severity.toUpperCase()}
      </h2>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
        <div className="text-center">
          <div className="text-2xl font-bold mb-1 flex justify-center">
            {data.generic_content ? <X size={24} /> : <Check size={24} />}
          </div>
          <div className="text-sm">Generic Content</div>
        </div>
        <div className="text-center">
          <div className="text-2xl font-bold mb-1 flex justify-center">
            {data.skill_mismatch ? <X size={24} /> : <Check size={24} />}
          </div>
          <div className="text-sm">Skill Match</div>
        </div>
        <div className="text-center">
          <div className="text-2xl font-bold mb-1 flex justify-center">
            {data.timeline_issues ? <X size={24} /> : <Check size={24} />}
          </div>
          <div className="text-sm">Timeline</div>
        </div>
        <div className="text-center">
          <div className="text-2xl font-bold mb-1 flex justify-center">
            {data.employment_gaps ? <X size={24} /> : <Check size={24} />}
          </div>
          <div className="text-sm">Employment Gaps</div>
        </div>
      </div>

      {data.risks.length > 0 && (
        <div>
          <h3 className="font-semibold mb-3">Identified Risks:</h3>
          <ul className="space-y-2">
            {data.risks.map((risk, idx) => (
              <motion.li
                key={idx}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: idx * 0.1 }}
                className="text-sm flex items-start"
              >
                <span className="mr-2">→</span>
                <span>{risk}</span>
              </motion.li>
            ))}
          </ul>
        </div>
      )}
    </motion.div>
  );
};

const InterviewQuestionsPanel: React.FC<{
  data: ResumeAnalysis["interview_questions"];
}> = ({ data }) => {
  const [activeTab, setActiveTab] = React.useState<
    "technical" | "hr" | "situational"
  >("technical");

  const allQuestions = {
    technical: data.technical,
    hr: data.hr,
    situational: data.situational,
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
      className="bg-white rounded-lg shadow-lg p-8"
    >
      <h2 className="text-2xl font-bold text-gray-800 mb-6">
        Predicted Interview Questions
      </h2>

      <div className="flex gap-3 mb-6">
        {(["technical", "hr", "situational"] as const).map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`px-4 py-2 rounded font-medium transition-all ${
              activeTab === tab
                ? "bg-indigo-600 text-white shadow-lg"
                : "bg-gray-100 text-gray-700 hover:bg-gray-200"
            }`}
          >
            {tab === "technical"
              ? "Technical"
              : tab === "hr"
                ? "HR"
                : "Situational"}
          </button>
        ))}
      </div>

      <div className="space-y-3">
        {allQuestions[activeTab].slice(0, 5).map((item, idx) => (
          <motion.div
            key={idx}
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: idx * 0.1 }}
            className="bg-gray-50 p-4 rounded border-l-4 border-indigo-500"
          >
            <div className="text-sm font-semibold text-gray-600 mb-2">
              Q{idx + 1}
            </div>
            <p className="text-sm text-gray-800">{item.question}</p>
          </motion.div>
        ))}
      </div>
    </motion.div>
  );
};

const PersonalBrandingPanel: React.FC<{
  data: ResumeAnalysis["personal_branding"];
}> = ({ data }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
      className="bg-gradient-to-r from-purple-50 to-pink-50 rounded-lg shadow-lg p-8"
    >
      <h2 className="text-2xl font-bold text-gray-800 mb-6">
        Personal Branding
      </h2>

      <div className="space-y-4">
        <div>
          <h3 className="font-semibold text-gray-700 mb-2">LinkedIn Headline</h3>
          <p className="bg-white p-3 rounded border border-purple-200 text-sm text-gray-800">
            {data.linkedin_headline}
          </p>
        </div>

        <div>
          <h3 className="font-semibold text-gray-700 mb-2">Tagline</h3>
          <p className="bg-white p-3 rounded border border-purple-200 text-sm italic text-gray-800">
            "{data.tagline}"
          </p>
        </div>

        <div>
          <h3 className="font-semibold text-gray-700 mb-2">Short Bio</h3>
          <p className="bg-white p-3 rounded border border-purple-200 text-sm text-gray-800">
            {data.short_bio}
          </p>
        </div>

        <div>
          <h3 className="font-semibold text-gray-700 mb-2">
            30-Second Elevator Pitch
          </h3>
          <p className="bg-white p-3 rounded border border-purple-200 text-sm text-gray-800">
            {data.elevator_pitch}
          </p>
        </div>
      </div>
    </motion.div>
  );
};

const OptimizedResume: React.FC<{
  data: ResumeAnalysis["optimized_resume"];
}> = ({ data }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
      className="bg-white rounded-lg shadow-lg p-8"
    >
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold text-gray-800">Optimized Resume</h2>
        {data.is_tailored && (
          <div className="flex items-center gap-2 bg-green-100 px-3 py-1 rounded-full">
            <span className="text-green-700 text-sm font-semibold">
              {data.job_matched_percentage}% Job Match
            </span>
          </div>
        )}
      </div>

      <div className="bg-gray-50 p-6 rounded border border-gray-200 max-h-96 overflow-y-auto">
        <pre className="whitespace-pre-wrap text-sm text-gray-800 font-mono">
          {data.content}
        </pre>
      </div>

      <button className="mt-6 w-full bg-indigo-600 hover:bg-indigo-700 text-white py-2 rounded font-semibold transition-colors">
        Download Optimized Resume
      </button>
    </motion.div>
  );
};

// ─────────────────────────────────────────────────────────────────────
// MAIN DASHBOARD COMPONENT
// ─────────────────────────────────────────────────────────────────────

export const ResumeIntelligenceDashboard: React.FC<{
  analysis: ResumeAnalysis;
}> = ({ analysis }) => {
  const [activeSection, setActiveSection] = React.useState<string>("scores");

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      {/* Header */}
      <div className="bg-gradient-to-r from-indigo-600 to-blue-600 text-white py-12 px-6">
        <div className="max-w-7xl mx-auto">
          <h1 className="text-4xl font-bold mb-2">
            Next-Generation Resume Intelligence
          </h1>
          <p className="text-indigo-100 text-lg">
            Comprehensive analysis of your resume with AI-powered insights
          </p>
        </div>
      </div>

      {/* Navigation */}
      <div className="bg-white border-b sticky top-0 z-40 shadow-sm">
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex overflow-x-auto gap-2 py-4">
            {[
              { id: "scores", label: "Scores" },
              { id: "recruiter", label: "Recruiter View" },
              { id: "breakdown", label: "Breakdown" },
              { id: "skills", label: "Skills" },
              { id: "career", label: "Career" },
              { id: "risks", label: "Risks" },
              { id: "interview", label: "Interview" },
              { id: "branding", label: "Branding" },
              { id: "optimized", label: "Optimized" },
            ].map((item) => (
              <button
                key={item.id}
                onClick={() => setActiveSection(item.id)}
                className={`px-4 py-2 rounded-lg whitespace-nowrap font-medium transition-all ${
                  activeSection === item.id
                    ? "bg-indigo-600 text-white shadow-lg"
                    : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                }`}
              >
                {item.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-7xl mx-auto px-6 py-12">
        <AnimatePresence mode="wait">
          {activeSection === "scores" && (
            <motion.div
              key="scores"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            >
              <ScoreDashboard scores={analysis.scores} />
            </motion.div>
          )}

          {activeSection === "recruiter" && (
            <motion.div
              key="recruiter"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            >
              <RecruiterSimulationPanel data={analysis.recruiter_simulation} />
            </motion.div>
          )}

          {activeSection === "breakdown" && (
            <motion.div
              key="breakdown"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            >
              <ResumeBreaddown data={analysis.resume_breakdown} />
            </motion.div>
          )}

          {activeSection === "skills" && (
            <motion.div
              key="skills"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            >
              <SkillIntelligencePanel data={analysis.skill_intelligence} />
            </motion.div>
          )}

          {activeSection === "career" && (
            <motion.div
              key="career"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            >
              <CareerInsightsPanel data={analysis.career_insights} />
            </motion.div>
          )}

          {activeSection === "risks" && (
            <motion.div
              key="risks"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            >
              <RiskDetectionPanel data={analysis.risk_detection} />
            </motion.div>
          )}

          {activeSection === "interview" && (
            <motion.div
              key="interview"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            >
              <InterviewQuestionsPanel data={analysis.interview_questions} />
            </motion.div>
          )}

          {activeSection === "branding" && (
            <motion.div
              key="branding"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            >
              <PersonalBrandingPanel data={analysis.personal_branding} />
            </motion.div>
          )}

          {activeSection === "optimized" && (
            <motion.div
              key="optimized"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            >
              <OptimizedResume data={analysis.optimized_resume} />
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};

export default ResumeIntelligenceDashboard;
