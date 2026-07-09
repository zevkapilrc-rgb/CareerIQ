/**
 * Creative Modern Template — Vibrant sidebar with visual hierarchy
 * ATS-safe while looking premium
 */
import React from "react";
import type { ResumeData } from "../types";

interface Props {
  data: ResumeData;
  scale?: number;
}

export default function CreativeModernTemplate({ data, scale = 1 }: Props) {
  const { personalInfo: p, summary, experience, education, skills, projects, certifications, languages } = data;
  const ACCENT = "#7c3aed";
  const SIDEBAR_BG = "#1e1b4b";

  const density = data.spacingDensity || "normal";
  const paddingMap = {
    compact: "20px 16px",
    normal: "32px 28px",
    spacious: "40px 32px",
  };
  const sidebarPaddingMap = {
    compact: "16px 12px",
    normal: "24px 20px",
    spacious: "32px 24px",
  };
  const gapMap = {
    compact: 8,
    normal: 18,
    spacious: 24,
  };
  const listGapMap = {
    compact: 1.5,
    normal: 3,
    spacious: 5,
  };

  const paddingVal = paddingMap[density];
  const sidebarPaddingVal = sidebarPaddingMap[density];
  const sectionGap = gapMap[density];
  const listGap = listGapMap[density];

  return (
    <div style={{
      width: 794,
      height: 1123, // Strict A4
      maxHeight: 1123,
      overflow: "hidden",
      background: "#ffffff",
      fontFamily: "'Arial', 'Helvetica', sans-serif",
      color: "#1f2937",
      display: "flex",
      boxSizing: "border-box",
      fontSize: 10,
      lineHeight: 1.5,
      transform: `scale(${scale})`,
      transformOrigin: "top left",
    }}>
      {/* ─── Vibrant Sidebar ──────────────────────────────────────────── */}
      <div style={{
        width: 220,
        height: 1123,
        background: SIDEBAR_BG,
        color: "#e0e7ff",
        padding: "0 0 32px",
        flexShrink: 0,
        boxSizing: "border-box",
        overflow: "hidden",
      }}>
        {/* Profile Header */}
        <div style={{
          background: ACCENT,
          padding: "24px 20px 20px",
          textAlign: "center",
          clipPath: "polygon(0 0, 100% 0, 100% 85%, 50% 100%, 0 85%)",
          paddingBottom: 32,
          marginBottom: 4,
        }}>
          {p.photo ? (
            <div style={{ display: "flex", justifyContent: "center", marginBottom: 12 }}>
              <img
                src={p.photo}
                alt="Profile"
                style={{
                  width: 70,
                  height: 70,
                  borderRadius: "50%",
                  objectFit: "cover",
                  border: "2px solid #fff",
                  boxShadow: "0 4px 10px rgba(0,0,0,0.15)",
                }}
              />
            </div>
          ) : (
            <div style={{
              width: 60,
              height: 60,
              borderRadius: "50%",
              background: "rgba(255,255,255,0.2)",
              border: "2px solid rgba(255,255,255,0.5)",
              margin: "0 auto 12px",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontSize: 22,
              color: "#fff",
            }}>
              {(p.fullName || "?")[0]?.toUpperCase() || "A"}
            </div>
          )}
          <div style={{ fontSize: 13, fontWeight: "700", color: "#fff", lineHeight: 1.2, marginBottom: 4 }}>
            {p.fullName || "Your Name"}
          </div>
          {p.title && (
            <div style={{ fontSize: 9, color: "#c4b5fd", letterSpacing: 0.5, textTransform: "uppercase" }}>
              {p.title}
            </div>
          )}
        </div>

        <div style={{ padding: sidebarPaddingVal }}>
          {/* Contact */}
          <CreativeSideSection label="Contact" accent={ACCENT}>
            {p.email && <div style={{ fontSize: 9, color: "#c7d2fe", marginBottom: 3, wordBreak: "break-all" }}>✉ {p.email}</div>}
            {p.phone && <div style={{ fontSize: 9, color: "#c7d2fe", marginBottom: 3 }}>☏ {p.phone}</div>}
            {p.location && <div style={{ fontSize: 9, color: "#c7d2fe", marginBottom: 3 }}>⚑ {p.location}</div>}
            {p.linkedin && <div style={{ fontSize: 9, color: "#a5b4fc", marginBottom: 3, wordBreak: "break-all" }}>🔗 {p.linkedin}</div>}
          </CreativeSideSection>

          {/* Technical Skills */}
          {skills.technical.length > 0 && (
            <CreativeSideSection label="Tech Skills" accent={ACCENT}>
              {skills.technical.slice(0, 6).map((s, i) => (
                <div key={i} style={{ marginBottom: 4 }}>
                  <div style={{ fontSize: 9, color: "#e0e7ff", marginBottom: 1 }}>{s}</div>
                  <div style={{ height: 3, background: "rgba(255,255,255,0.1)", borderRadius: 2 }}>
                    <div style={{
                      height: 3,
                      background: `linear-gradient(to right, ${ACCENT}, #818cf8)`,
                      borderRadius: 2,
                      width: `${Math.min(95, 60 + i * 6)}%`,
                    }} />
                  </div>
                </div>
              ))}
            </CreativeSideSection>
          )}

          {/* Frameworks */}
          {skills.frameworks.length > 0 && (
            <CreativeSideSection label="Frameworks" accent={ACCENT}>
              <div style={{ display: "flex", flexWrap: "wrap", gap: 3 }}>
                {skills.frameworks.slice(0, 8).map((f, i) => (
                  <span key={i} style={{
                    padding: "1px 5px",
                    background: "rgba(124,58,237,0.3)",
                    border: "1px solid rgba(167,139,250,0.3)",
                    borderRadius: 3,
                    fontSize: 8.5,
                    color: "#c4b5fd",
                  }}>{f}</span>
                ))}
              </div>
            </CreativeSideSection>
          )}

          {/* Languages */}
          {languages.length > 0 && (
            <CreativeSideSection label="Languages" accent={ACCENT}>
              {languages.map((l) => (
                <div key={l.id} style={{ fontSize: 9, color: "#c7d2fe", marginBottom: 2 }}>
                  {l.language} <span style={{ color: "#818cf8" }}>({l.proficiency})</span>
                </div>
              ))}
            </CreativeSideSection>
          )}
        </div>
      </div>

      {/* ─── Main Content ──────────────────────────────────────────────── */}
      <div style={{ flex: 1, padding: paddingVal, boxSizing: "border-box", overflow: "hidden" }}>
        {/* Summary */}
        {summary && (
          <section style={{ marginBottom: sectionGap }}>
            <CreativeMainHead label="Profile Summary" accent={ACCENT} />
            <p style={{ fontSize: 9.5, color: "#374151", lineHeight: 1.6, margin: 0 }}>{summary}</p>
          </section>
        )}

        {/* Experience */}
        {experience.length > 0 && (
          <section style={{ marginBottom: sectionGap }}>
            <CreativeMainHead label="Work Experience" accent={ACCENT} />
            {experience.map((exp, idx) => (
              <div key={exp.id} style={{ marginBottom: listGap, position: "relative", paddingLeft: 14 }}>
                {/* Timeline dot */}
                <div style={{
                  position: "absolute",
                  left: 0,
                  top: 5,
                  width: 7,
                  height: 7,
                  borderRadius: "50%",
                  background: idx === 0 ? ACCENT : "#d1d5db",
                  border: `2px solid ${idx === 0 ? ACCENT : "#9ca3af"}`,
                }} />
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
                  <div>
                    <div style={{ fontWeight: "700", fontSize: 10.5, color: "#111827" }}>{exp.role || "Role"}</div>
                    <div style={{ fontSize: 9.5, color: ACCENT, fontWeight: "600" }}>{exp.company}</div>
                  </div>
                  <span style={{
                    fontSize: 8.5,
                    padding: "1px 6px",
                    background: "#f3f4f6",
                    color: "#6b7280",
                    borderRadius: 4,
                    whiteSpace: "nowrap",
                    border: "1px solid #e5e7eb",
                  }}>
                    {exp.startDate} – {exp.endDate}
                  </span>
                </div>
                {exp.bullets.filter(Boolean).length > 0 && (
                  <ul style={{ marginTop: 2, paddingLeft: 14, marginBottom: 0 }}>
                    {exp.bullets.filter(Boolean).map((b, i) => (
                      <li key={i} style={{ fontSize: 9, color: "#374151", marginBottom: 1 }}>{b}</li>
                    ))}
                  </ul>
                )}
              </div>
            ))}
          </section>
        )}

        {/* Projects */}
        {projects.length > 0 && (
          <section style={{ marginBottom: sectionGap }}>
            <CreativeMainHead label="Featured Projects" accent={ACCENT} />
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8 }}>
              {projects.slice(0, 4).map((proj) => (
                <div key={proj.id} style={{
                  padding: 8,
                  border: `1px solid #e5e7eb`,
                  borderTop: `2px solid ${ACCENT}`,
                  borderRadius: 4,
                  background: "#fafafa",
                }}>
                  <div style={{ fontWeight: "700", fontSize: 10, color: "#111827" }}>{proj.name}</div>
                  {proj.description && <p style={{ fontSize: 9, color: "#6b7280", margin: "2px 0" }}>{proj.description}</p>}
                </div>
              ))}
            </div>
          </section>
        )}

        {/* Education */}
        {education.length > 0 && (
          <section style={{ marginBottom: sectionGap }}>
            <CreativeMainHead label="Education" accent={ACCENT} />
            {education.map((edu) => (
              <div key={edu.id} style={{ marginBottom: 4, display: "flex", justifyContent: "space-between" }}>
                <div>
                  <div style={{ fontWeight: "700", fontSize: 10, color: "#111827" }}>{edu.institution}</div>
                  <div style={{ fontSize: 9.5, color: "#4b5563", fontStyle: "italic" }}>
                    {edu.degree}{edu.field ? `, ${edu.field}` : ""}
                  </div>
                </div>
                <div style={{ textAlign: "right", fontSize: 9, color: "#9ca3af" }}>
                  {edu.startDate} – {edu.endDate}
                </div>
              </div>
            ))}
          </section>
        )}
      </div>
    </div>
  );
}

function CreativeSideSection({ label, accent, children }: { label: string; accent: string; children: React.ReactNode }) {
  return (
    <div style={{ marginBottom: 14 }}>
      <div style={{
        fontSize: 8.5,
        fontWeight: "700",
        letterSpacing: 1,
        textTransform: "uppercase",
        color: "#818cf8",
        borderBottom: "1px solid rgba(129,140,248,0.2)",
        paddingBottom: 2,
        marginBottom: 6,
      }}>
        {label}
      </div>
      {children}
    </div>
  );
}

function CreativeMainHead({ label, accent }: { label: string; accent: string }) {
  return (
    <div style={{
      display: "flex",
      alignItems: "center",
      gap: 6,
      marginBottom: 8,
    }}>
      <div style={{ width: 3, height: 14, background: accent, borderRadius: 2, flexShrink: 0 }} />
      <div style={{ fontSize: 11, fontWeight: "700", color: "#111827", textTransform: "uppercase", letterSpacing: 0.5 }}>
        {label}
      </div>
      <div style={{ flex: 1, height: 1, background: "#e5e7eb" }} />
    </div>
  );
}
