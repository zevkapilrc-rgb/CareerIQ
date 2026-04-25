"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ResumeIntelligenceDashboard } from "./ResumeIntelligenceDashboard";
import { FileText, BarChart, User, Target, Rocket, AlertTriangle, Briefcase } from "lucide-react";

interface ResumeAnalysis {
  improved_summary: any;
  enhanced_experience: any;
  skill_optimization: any;
  scores: any;
  recruiter_simulation: any;
  resume_breakdown: any;
  skill_intelligence: any;
  career_insights: any;
  risk_detection: any;
  interview_questions: any;
  personal_branding: any;
  portfolio_content: any;
  optimized_resume: any;
}

export const ResumeAnalyzerPage: React.FC = () => {
  const [file, setFile] = useState<File | null>(null);
  const [jobDescription, setJobDescription] = useState<string>("");
  const [loading, setLoading] = useState(false);
  const [analysis, setAnalysis] = useState<ResumeAnalysis | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [thinking, setThinking] = useState(false);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setFile(e.target.files[0]);
      setError(null);
    }
  };

  const handleAnalyze = async () => {
    if (!file) {
      setError("Please select a resume file");
      return;
    }

    setLoading(true);
    setThinking(true);
    setError(null);

    try {
      const formData = new FormData();
      formData.append("file", file);

      // Build URL with query params
      let url = "/api/resume/analyze";
      if (jobDescription) {
        url += `?job_description=${encodeURIComponent(jobDescription)}`;
      }

      const response = await fetch(url, {
        method: "POST",
        body: formData,
      });

      if (!response.ok) {
        throw new Error(`API error: ${response.statusText}`);
      }

      const data: ResumeAnalysis = await response.json();
      
      // Simulate "AI thinking" for UX effect
      await new Promise((resolve) => setTimeout(resolve, 1500));
      
      setAnalysis(data);
      setThinking(false);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to analyze resume");
      setThinking(false);
    } finally {
      setLoading(false);
    }
  };

  if (analysis) {
    return (
      <div>
        <button
          onClick={() => {
            setAnalysis(null);
            setFile(null);
            setJobDescription("");
          }}
          className="fixed top-6 left-6 bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded font-semibold z-50 transition-colors"
        >
          ← Back to Upload
        </button>
        <ResumeIntelligenceDashboard analysis={analysis} />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 flex items-center justify-center p-6">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="w-full max-w-2xl"
      >
        <div className="bg-white rounded-2xl shadow-2xl p-12">
          {/* Header */}
          <div className="text-center mb-8">
            <motion.h1
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.2 }}
              className="text-4xl font-bold text-gray-900 mb-3"
            >
              Resume Intelligence Analyzer
            </motion.h1>
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.3 }}
              className="text-gray-600 text-lg"
            >
              Get comprehensive AI-powered analysis of your resume
            </motion.p>
          </div>

          {/* File Upload Section */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="mb-8"
          >
            <label className="block mb-3">
              <span className="block text-sm font-semibold text-gray-700 mb-3">
                Upload Your Resume
              </span>
              <div className="relative group">
                <input
                  type="file"
                  onChange={handleFileChange}
                  accept=".pdf,.doc,.docx,.txt"
                  className="absolute inset-0 opacity-0 cursor-pointer"
                  disabled={loading}
                />
                <div
                  className={`border-2 border-dashed rounded-xl p-8 text-center transition-all ${
                    file
                      ? "border-green-500 bg-green-50"
                      : "border-gray-300 bg-gray-50 group-hover:border-indigo-500 group-hover:bg-indigo-50"
                  }`}
                >
                  <motion.div
                    initial={{ scale: 0.8 }}
                    animate={{ scale: 1 }}
                    className="mb-3 flex justify-center text-gray-500"
                  >
                    <FileText size={36} />
                  </motion.div>
                  <p className="text-gray-800 font-semibold">
                    {file ? file.name : "Drop your resume here"}
                  </p>
                  <p className="text-gray-500 text-sm mt-1">
                    PDF, DOC, DOCX, or TXT format
                  </p>
                </div>
              </div>
            </label>
          </motion.div>

          {/* Job Description Section */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className="mb-8"
          >
            <label className="block mb-3">
              <span className="block text-sm font-semibold text-gray-700 mb-2">
                Job Description (Optional)
              </span>
              <textarea
                value={jobDescription}
                onChange={(e) => setJobDescription(e.target.value)}
                placeholder="Paste job description for tailored analysis..."
                disabled={loading}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 resize-none"
                rows={4}
              />
            </label>
            <p className="text-xs text-gray-500 mt-2">
              Adding a job description will tailor the analysis to that specific
              role
            </p>
          </motion.div>

          {/* Error Message */}
          <AnimatePresence>
            {error && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg text-red-700 text-sm"
              >
                {error}
              </motion.div>
            )}
          </AnimatePresence>

          {/* Thinking State */}
          <AnimatePresence>
            {thinking && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="mb-6 p-4 bg-blue-50 border border-blue-200 rounded-lg"
              >
                <div className="flex items-center gap-3">
                  <motion.div
                    animate={{ rotate: 360 }}
                    transition={{ duration: 1, repeat: Infinity }}
                    className="w-5 h-5 border-2 border-blue-500 border-t-transparent rounded-full"
                  />
                  <span className="text-blue-700 font-semibold">
                    AI is analyzing your resume...
                  </span>
                </div>
                <p className="text-blue-600 text-sm mt-2">
                  Performing deep analysis across 13 intelligence modules
                </p>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Submit Button */}
          <motion.button
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6 }}
            onClick={handleAnalyze}
            disabled={!file || loading}
            whileHover={!loading && file ? { scale: 1.05 } : {}}
            whileTap={!loading && file ? { scale: 0.95 } : {}}
            className={`w-full py-3 rounded-lg font-bold text-white text-lg transition-all ${
              !file || loading
                ? "bg-gray-400 cursor-not-allowed"
                : "bg-gradient-to-r from-indigo-600 to-blue-600 hover:shadow-lg hover:shadow-indigo-500/50"
            }`}
          >
            {loading ? (
              <div className="flex items-center justify-center gap-2">
                <motion.div
                  animate={{ rotate: 360 }}
                  transition={{ duration: 1, repeat: Infinity }}
                  className="w-5 h-5 border-2 border-white border-t-transparent rounded-full"
                />
                Analyzing...
              </div>
            ) : (
              "Analyze Resume"
            )}
          </motion.button>

          {/* Features */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.7 }}
            className="mt-12 grid grid-cols-2 gap-4 text-center text-sm"
          >
            {[
              { icon: <BarChart size={24} />, label: "Multi-Dimensional Scores" },
              { icon: <User size={24} />, label: "Recruiter Simulation" },
              { icon: <Target size={24} />, label: "Skill Intelligence" },
              { icon: <Rocket size={24} />, label: "Career Insights" },
              { icon: <AlertTriangle size={24} />, label: "Risk Detection" },
              { icon: <Briefcase size={24} />, label: "Personal Branding" },
            ].map((feature, idx) => (
              <motion.div
                key={idx}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.8 + idx * 0.1 }}
                className="text-gray-700"
              >
                <div className="mb-1 flex justify-center text-indigo-500">{feature.icon}</div>
                <div className="text-xs font-medium">{feature.label}</div>
              </motion.div>
            ))}
          </motion.div>
        </div>

        {/* Footer Info */}
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.2 }}
          className="text-center text-gray-600 text-sm mt-8"
        >
          Your resume will be analyzed using advanced AI models across 13
          intelligence modules
        </motion.p>
      </motion.div>
    </div>
  );
};

export default ResumeAnalyzerPage;
