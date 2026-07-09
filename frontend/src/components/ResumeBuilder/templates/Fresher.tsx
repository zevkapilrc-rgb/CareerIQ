/**
 * Fresher / Student Template — Entry-level optimized
 * Emphasizes education, projects, and skills
 */
import React from "react";
import type { ResumeData } from "../types";

interface Props {
  data: ResumeData;
  scale?: number;
}

export default function FresherTemplate({ data, scale = 1 }: Props) {
  const { personalInfo: p, summary, experience, education, skills, projects, certifications, languages } = data;
  const PRIMARY = "#1e3a5f";
  const ACCENT = "#3b82f6";

  const density = data.spacingDensity || "normal";
  const paddingMap = {
    compact: "16px 32px",
    normal: "28px 48px",
    spacious: "36px 56px",
  };
  const headerPaddingMap = {
    compact: "20px 32px 16px",
    normal: "30px 48px 24px",
    spacious: "36px 56px 28px",
  };
  const gapMap = {
    compact: 8,
    normal: 16,
    spacious: 24,
  };
  const listGapMap = {
    compact: 1.5,
    normal: 3,
    spacious: 5,
  };

  const paddingVal = paddingMap[density];
  const headerPaddingVal = headerPaddingMap[density];
  const sectionGap = gapMap[density];
  const listGap = listGapMap[density];

  return (
    <div style={{
      width: 794,
      height: 1123, // Strict A4
      maxHeight: 1123,
      overflow: "hidden",
      background: "#ffffff",
      fontFamily: "'Calibri', 'Arial', sans-serif",
      color: "#1e293b",
      boxSizing: "border-box",
      fontSize: 10,
      lineHeight: 1.5,
      transform: `scale(${scale})`,
      transformOrigin: "top left",
    }}>
      {/* ─── Header ───────────────────────────────────────────────────── */}
      <div style={{
        background: PRIMARY,
        padding: headerPaddingVal,
        color: "#fff",
        position: "relative",
        overflow: "hidden",
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
      }}>
        {/* Decorative circle */}
        <div style={{
          position: "absolute",
          right: -40,
          top: -40,
          width: 160,
          height: 160,
          borderRadius: "50%",
          background: "rgba(59,130,246,0.15)",
        }} />

        <div>
          <div style={{ fontSize: 22, fontWeight: "700", color: "#fff", letterSpacing: 0.5 }}>
            {p.fullName || "Your Name"}
          </div>
          {p.title && (
            <div style={{ fontSize: 11, color: "#93c5fd", marginTop: 3, fontWeight: "500" }}>
              {p.title}
            </div>
          )}
          <div style={{
            display: "flex",
            flexWrap: "wrap",
            gap: "3px 16px",
            marginTop: 8,
            fontSize: 9,
            color: "#bfdbfe",
          }}>
            {p.email && <span>📧 {p.email}</span>}
            {p.phone && <span>📱 {p.phone}</span>}
            {p.location && <span>📍 {p.location}</span>}
            {p.linkedin && <span>🔗 {p.linkedin}</span>}
          </div>
        </div>

        {/* Profile Image if uploaded */}
        {p.photo ? (
          <img
            src={p.photo}
            alt="Profile"
            style={{
              width: 60,
              height: 60,
              borderRadius: "50%",
              objectFit: "cover",
              border: "2px solid #fff",
              marginLeft: 20,
              flexShrink: 0,
              position: "relative",
              zIndex: 10,
            }}
          />
        ) : null}
      </div>

      <div style={{ padding: paddingVal }}>
        {/* Objective */}
        {summary && (
          <section style={{ marginBottom: sectionGap }}>
            <FresherHeading label="Career Objective" accent={ACCENT} primary={PRIMARY} />
            <div style={{
              background: "#eff6ff",
              border: `1px solid #bfdbfe`,
              borderLeft: `3px solid ${ACCENT}`,
              padding: "8px 12px",
              borderRadius: "0 6px 6px 0",
            }}>
              <p style={{ fontSize: 9.5, color: "#1e40af", margin: 0, lineHeight: 1.6 }}>{summary}</p>
            </div>
          </section>
        )}

        {/* Education — FIRST for students */}
        {education.length > 0 && (
          <section style={{ marginBottom: sectionGap }}>
            <FresherHeading label="Education" accent={ACCENT} primary={PRIMARY} />
            {education.map((edu) => (
              <div key={edu.id} style={{
                marginBottom: listGap,
                display: "flex",
                justifyContent: "space-between",
                padding: "6px 10px",
                background: "#f8fafc",
                border: "1px solid #e2e8f0",
                borderRadius: 6,
              }}>
                <div>
                  <div style={{ fontWeight: "700", fontSize: 10.5, color: PRIMARY }}>{edu.institution}</div>
                  <div style={{ fontSize: 9.5, color: "#475569" }}>
                    {edu.degree}{edu.field ? ` — ${edu.field}` : ""}
                  </div>
                </div>
                <div style={{ textAlign: "right", flexShrink: 0 }}>
                  <div style={{ fontSize: 9, color: "#64748b" }}>{edu.startDate} – {edu.endDate}</div>
                  {edu.gpa && (
                    <div style={{
                      fontSize: 9.5,
                      fontWeight: "700",
                      color: ACCENT,
                      marginTop: 1,
                    }}>GPA: {edu.gpa}</div>
                  )}
                </div>
              </div>
            ))}
          </section>
        )}

        {/* Skills Grid */}
        {(skills.technical.length > 0 || skills.frameworks.length > 0 || skills.tools.length > 0) && (
          <section style={{ marginBottom: sectionGap }}>
            <FresherHeading label="Technical Skills" accent={ACCENT} primary={PRIMARY} />
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 8 }}>
              {skills.technical.length > 0 && (
                <SkillBox label="Languages" items={skills.technical.slice(0, 5)} accent={ACCENT} />
              )}
              {skills.frameworks.length > 0 && (
                <SkillBox label="Frameworks" items={skills.frameworks.slice(0, 5)} accent={ACCENT} />
              )}
              {skills.tools.length > 0 && (
                <SkillBox label="Tools" items={skills.tools.slice(0, 5)} accent={ACCENT} />
              )}
            </div>
          </section>
        )}

        {/* Projects — Featured for students */}
        {projects.length > 0 && (
          <section style={{ marginBottom: sectionGap }}>
            <FresherHeading label="Academic Projects" accent={ACCENT} primary={PRIMARY} />
            {projects.slice(0, 3).map((proj) => (
              <div key={proj.id} style={{
                marginBottom: listGap,
                padding: "8px 12px",
                border: `1px solid #e2e8f0`,
                borderTop: `2px solid ${ACCENT}`,
                borderRadius: 6,
                background: "#fafcff",
              }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
                  <div style={{ fontWeight: "700", fontSize: 10, color: PRIMARY }}>{proj.name}</div>
                  {(proj.githubUrl || proj.liveUrl) && (
                    <span style={{ fontSize: 8.5, color: ACCENT }}>{proj.githubUrl || proj.liveUrl}</span>
                  )}
                </div>
                {proj.description && (
                  <p style={{ fontSize: 9, color: "#475569", margin: "2px 0 0", lineHeight: 1.4 }}>{proj.description}</p>
                )}
              </div>
            ))}
          </section>
        )}
      </div>
    </div>
  );
}

function FresherHeading({ label, accent, primary }: { label: string; accent: string; primary: string }) {
  return (
    <div style={{
      display: "flex",
      alignItems: "center",
      gap: 6,
      marginBottom: 6,
    }}>
      <div style={{ width: 12, height: 2, background: accent, borderRadius: 2 }} />
      <div style={{ fontSize: 10.5, fontWeight: "700", color: primary, textTransform: "uppercase", letterSpacing: 0.5 }}>
        {label}
      </div>
      <div style={{ flex: 1, height: 1, background: "#e2e8f0" }} />
    </div>
  );
}

function SkillBox({ label, items, accent }: { label: string; items: string[]; accent: string }) {
  return (
    <div style={{
      padding: "8px 10px",
      background: "#f8fafc",
      border: "1px solid #e2e8f0",
      borderTop: `2px solid ${accent}`,
      borderRadius: 6,
    }}>
      <div style={{ fontSize: 8.5, fontWeight: "700", color: accent, textTransform: "uppercase", letterSpacing: 0.5, marginBottom: 4 }}>
        {label}
      </div>
      {items.map((item, i) => (
        <div key={i} style={{ fontSize: 9, color: "#334155" }}>• {item}</div>
      ))}
    </div>
  );
}
