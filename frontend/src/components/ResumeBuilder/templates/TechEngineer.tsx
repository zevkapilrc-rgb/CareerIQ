/**
 * Tech Engineer Template — GitHub-inspired minimal layout
 * Projects and tech stack prominently featured
 * Loved by FAANG recruiters
 */
import React from "react";
import type { ResumeData } from "../types";

interface Props {
  data: ResumeData;
  scale?: number;
}

export default function TechEngineerTemplate({ data, scale = 1 }: Props) {
  const { personalInfo: p, summary, experience, education, skills, projects, certifications, languages } = data;
  const ACCENT = "#238636";
  const HEADER_BG = "#0d1117";

  const density = data.spacingDensity || "normal";
  const paddingMap = {
    compact: "16px 24px",
    normal: "28px 40px",
    spacious: "36px 48px",
  };
  const headerPaddingMap = {
    compact: "16px 24px 12px",
    normal: "28px 40px 22px",
    spacious: "36px 48px 28px",
  };
  const gapMap = {
    compact: 8,
    normal: 20,
    spacious: 28,
  };

  const paddingVal = paddingMap[density];
  const headerPaddingVal = headerPaddingMap[density];
  const sectionGap = gapMap[density];

  return (
    <div
      style={{
        width: 794,
        height: 1123, // Strict A4
        maxHeight: 1123,
        overflow: "hidden",
        background: "#ffffff",
        fontFamily: "'Segoe UI', 'Inter', 'Arial', sans-serif",
        color: "#24292f",
        boxSizing: "border-box",
        fontSize: 10,
        lineHeight: 1.5,
        transform: `scale(${scale})`,
        transformOrigin: "top left",
      }}
    >
      {/* ─── Dark Header ──────────────────────────────────────────────── */}
      <div style={{
        background: HEADER_BG,
        color: "#e6edf3",
        padding: headerPaddingVal,
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
      }}>
        <div>
          <div style={{ fontSize: 22, fontWeight: "600", letterSpacing: -0.5, color: "#e6edf3" }}>
            {p.fullName || "Your Name"}
          </div>
          {p.title && (
            <div style={{ fontSize: 11, color: ACCENT, fontWeight: "500", marginTop: 2 }}>
              {p.title}
            </div>
          )}
          <div style={{
            display: "flex",
            flexWrap: "wrap",
            gap: "4px 14px",
            marginTop: 8,
            fontSize: 9,
            color: "#8b949e",
          }}>
            {p.email && <span>📧 {p.email}</span>}
            {p.phone && <span>📱 {p.phone}</span>}
            {p.location && <span>📍 {p.location}</span>}
            {p.linkedin && <span>🔗 {p.linkedin}</span>}
            {p.github && <span style={{ color: ACCENT }}>⚡ {p.github}</span>}
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
              borderRadius: 6, // github-like rounded square
              objectFit: "cover",
              border: `2px solid ${ACCENT}`,
              marginLeft: 20,
              flexShrink: 0,
            }}
          />
        ) : null}
      </div>

      {/* ─── Main Body ────────────────────────────────────────────────── */}
      <div style={{ padding: paddingVal, display: "grid", gridTemplateColumns: "1fr 220px", gap: sectionGap, height: "calc(100% - 130px)", overflow: "hidden" }}>

        {/* Left Column */}
        <div style={{ overflow: "hidden" }}>
          {/* Summary */}
          {summary && (
            <section style={{ marginBottom: 14 }}>
              <SectionHead label="About" accent={ACCENT} />
              <p style={{ fontSize: 9.5, color: "#57606a", lineHeight: 1.6, margin: 0 }}>{summary}</p>
            </section>
          )}

          {/* Experience */}
          {experience.length > 0 && (
            <section style={{ marginBottom: 14 }}>
              <SectionHead label="Experience" accent={ACCENT} />
              {experience.map((exp) => (
                <div key={exp.id} style={{ marginBottom: 10, paddingLeft: 10, borderLeft: `2px solid #d0d7de` }}>
                  <div style={{ display: "flex", justifyContent: "space-between" }}>
                    <div style={{ fontWeight: "600", fontSize: 10.5, color: "#0d1117" }}>{exp.role || "Role"}</div>
                    <div style={{ fontSize: 9, color: "#57606a", whiteSpace: "nowrap" }}>
                      {exp.startDate} – {exp.endDate}
                    </div>
                  </div>
                  <div style={{ fontSize: 9.5, color: ACCENT, fontWeight: "500" }}>
                    {exp.company}{exp.location ? ` · ${exp.location}` : ""}
                  </div>
                  {exp.bullets.filter(Boolean).length > 0 && (
                    <ul style={{ marginTop: 2, paddingLeft: 14, marginBottom: 0 }}>
                      {exp.bullets.filter(Boolean).map((b, i) => (
                        <li key={i} style={{ fontSize: 9, color: "#24292f", marginBottom: 1 }}>{b}</li>
                      ))}
                    </ul>
                  )}
                </div>
              ))}
            </section>
          )}

          {/* Projects */}
          {projects.length > 0 && (
            <section style={{ marginBottom: 14 }}>
              <SectionHead label="Projects" accent={ACCENT} />
              {projects.map((proj) => (
                <div key={proj.id} style={{
                  marginBottom: 6,
                  padding: "6px 10px",
                  background: "#f6f8fa",
                  border: "1px solid #d0d7de",
                  borderRadius: 6,
                }}>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                    <span style={{ fontWeight: "600", fontSize: 10, color: "#0d1117" }}>{proj.name}</span>
                    {(proj.githubUrl || proj.liveUrl) && (
                      <span style={{ fontSize: 8.5, color: ACCENT }}>{proj.githubUrl || proj.liveUrl}</span>
                    )}
                  </div>
                  {proj.techStack?.length > 0 && (
                    <div style={{ marginTop: 2, display: "flex", gap: 3, flexWrap: "wrap" }}>
                      {proj.techStack.map((t, i) => (
                        <span key={i} style={{
                          padding: "1px 4px",
                          background: "#fff",
                          border: "1px solid #d0d7de",
                          borderRadius: 3,
                          fontSize: 8,
                          color: "#57606a",
                          fontFamily: "monospace",
                        }}>{t}</span>
                      ))}
                    </div>
                  )}
                  {proj.description && (
                    <p style={{ fontSize: 9, color: "#57606a", margin: "2px 0 0" }}>{proj.description}</p>
                  )}
                </div>
              ))}
            </section>
          )}
        </div>

        {/* Right Column */}
        <div style={{ overflow: "hidden" }}>
          {/* Education */}
          {education.length > 0 && (
            <aside style={{ marginBottom: 12 }}>
              <SideHead label="Education" accent={ACCENT} />
              {education.map((edu) => (
                <div key={edu.id} style={{ marginBottom: 6 }}>
                  <div style={{ fontWeight: "600", fontSize: 9.5, color: "#0d1117" }}>{edu.institution}</div>
                  <div style={{ fontSize: 9, color: "#57606a" }}>{edu.degree}</div>
                  <div style={{ fontSize: 8.5, color: "#8b949e" }}>{edu.startDate} – {edu.endDate}</div>
                  {edu.gpa && <div style={{ fontSize: 8.5, color: "#57606a" }}>GPA: {edu.gpa}</div>}
                </div>
              ))}
            </aside>
          )}

          {/* Tools */}
          {skills.technical.length > 0 && (
            <aside style={{ marginBottom: 12 }}>
              <SideHead label="Skills & Languages" accent={ACCENT} />
              <div style={{ display: "flex", flexWrap: "wrap", gap: 3 }}>
                {[...skills.technical, ...skills.frameworks].map((t, i) => (
                  <span key={i} style={{
                    padding: "2px 5px",
                    background: "#f6f8fa",
                    border: "1px solid #d0d7de",
                    borderRadius: 4,
                    fontSize: 8.5,
                    color: "#24292f",
                    fontFamily: "monospace",
                  }}>{t}</span>
                ))}
              </div>
            </aside>
          )}

          {/* Tools & Platforms */}
          {skills.tools.length > 0 && (
            <aside style={{ marginBottom: 12 }}>
              <SideHead label="Tools & Platforms" accent={ACCENT} />
              <div style={{ display: "flex", flexWrap: "wrap", gap: 3 }}>
                {skills.tools.map((t, i) => (
                  <span key={i} style={{
                    padding: "2px 5px",
                    background: "#f6f8fa",
                    border: "1px solid #d0d7de",
                    borderRadius: 4,
                    fontSize: 8.5,
                    color: "#24292f",
                    fontFamily: "monospace",
                  }}>{t}</span>
                ))}
              </div>
            </aside>
          )}

          {/* Certifications */}
          {certifications.length > 0 && (
            <aside style={{ marginBottom: 12 }}>
              <SideHead label="Certifications" accent={ACCENT} />
              {certifications.map((c) => (
                <div key={c.id} style={{ marginBottom: 4 }}>
                  <div style={{ fontSize: 9, fontWeight: "600", color: "#0d1117" }}>{c.name}</div>
                  <div style={{ fontSize: 8.5, color: "#57606a" }}>{c.issuer} ({c.date})</div>
                </div>
              ))}
            </aside>
          )}
        </div>
      </div>
    </div>
  );
}

function SectionHead({ label, accent }: { label: string; accent: string }) {
  return (
    <div style={{
      fontSize: 11.5,
      fontWeight: "600",
      color: "#0d1117",
      borderBottom: `2px solid ${accent}`,
      paddingBottom: 2,
      marginBottom: 8,
    }}>
      {label}
    </div>
  );
}

function SideHead({ label, accent }: { label: string; accent: string }) {
  return (
    <div style={{
      fontSize: 9,
      fontWeight: "700",
      color: "#0d1117",
      letterSpacing: 0.5,
      textTransform: "uppercase",
      borderBottom: `1px solid #d0d7de`,
      paddingBottom: 2,
      marginBottom: 5,
    }}>
      {label}
    </div>
  );
}
