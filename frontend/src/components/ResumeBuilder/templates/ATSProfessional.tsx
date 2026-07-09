/**
 * ATS Professional Template — Two-column layout
 * Clean sidebar with accent color, fully ATS-parseable
 */
import React from "react";
import type { ResumeData } from "../types";

interface Props {
  data: ResumeData;
  scale?: number;
}

export default function ATSProfessionalTemplate({ data, scale = 1 }: Props) {
  const { personalInfo: p, summary, experience, education, skills, projects, certifications, languages } = data;
  const ACCENT = "#1d4ed8";

  const density = data.spacingDensity || "normal";
  const paddingMap = {
    compact: "20px 18px",
    normal: "40px 32px",
    spacious: "52px 40px",
  };
  const sidebarPaddingMap = {
    compact: "20px 12px",
    normal: "40px 20px",
    spacious: "52px 24px",
  };
  const gapMap = {
    compact: 6,
    normal: 12,
    spacious: 18,
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
    <div
      style={{
        width: 794,
        height: 1123, // Strict A4
        maxHeight: 1123,
        overflow: "hidden",
        background: "#fff",
        fontFamily: "'Calibri', 'Arial', sans-serif",
        color: "#1e293b",
        display: "flex",
        boxSizing: "border-box",
        fontSize: 10,
        lineHeight: 1.5,
        transform: `scale(${scale})`,
        transformOrigin: "top left",
      }}
    >
      {/* ─── Left Sidebar ─────────────────────────────────────────────── */}
      <div style={{
        width: 235,
        height: 1123,
        background: "#f8fafc",
        borderRight: `3px solid ${ACCENT}`,
        padding: sidebarPaddingVal,
        flexShrink: 0,
        boxSizing: "border-box",
        overflow: "hidden",
      }}>
        {/* Profile Image if uploaded */}
        {p.photo && (
          <div style={{ display: "flex", justifyContent: "center", marginBottom: 16 }}>
            <img
              src={p.photo}
              alt="Profile"
              style={{
                width: 90,
                height: 90,
                borderRadius: "50%",
                objectFit: "cover",
                border: `2px solid ${ACCENT}`,
                boxShadow: "0 4px 10px rgba(0,0,0,0.08)",
              }}
            />
          </div>
        )}

        {/* Name Block */}
        <div style={{ marginBottom: 20, textAlign: p.photo ? "center" : "left" }}>
          <div style={{ fontSize: 17, fontWeight: "bold", color: "#0f172a", lineHeight: 1.2 }}>
            {p.fullName || "Your Name"}
          </div>
          {p.title && (
            <div style={{ fontSize: 9.5, color: ACCENT, fontWeight: "600", marginTop: 4, textTransform: "uppercase", letterSpacing: 0.5 }}>
              {p.title}
            </div>
          )}
        </div>

        {/* Contact */}
        <SideSection label="CONTACT" accent={ACCENT}>
          {p.email && <ContactRow icon="✉" value={p.email} />}
          {p.phone && <ContactRow icon="☏" value={p.phone} />}
          {p.location && <ContactRow icon="⚑" value={p.location} />}
          {p.linkedin && <ContactRow icon="in" value={p.linkedin} />}
          {p.github && <ContactRow icon="⌥" value={p.github} />}
          {p.portfolio && <ContactRow icon="⊕" value={p.portfolio} />}
        </SideSection>

        {/* Skills */}
        {skills.technical.length > 0 && (
          <SideSection label="TECHNICAL" accent={ACCENT}>
            {skills.technical.map((s, i) => (
              <div key={i} style={{ fontSize: 9, color: "#334155", marginBottom: 2, paddingLeft: 6, borderLeft: `2px solid ${ACCENT}`, marginTop: 2 }}>
                {s}
              </div>
            ))}
          </SideSection>
        )}

        {skills.frameworks.length > 0 && (
          <SideSection label="FRAMEWORKS" accent={ACCENT}>
            <div style={{ fontSize: 9, color: "#334155", lineHeight: 1.5 }}>
              {skills.frameworks.join(" • ")}
            </div>
          </SideSection>
        )}

        {skills.tools.length > 0 && (
          <SideSection label="TOOLS" accent={ACCENT}>
            <div style={{ fontSize: 9, color: "#334155", lineHeight: 1.5 }}>
              {skills.tools.join(" • ")}
            </div>
          </SideSection>
        )}

        {/* Languages */}
        {languages.length > 0 && (
          <SideSection label="LANGUAGES" accent={ACCENT}>
            {languages.map((l) => (
              <div key={l.id} style={{ fontSize: 9, color: "#334155", marginBottom: 2 }}>
                {l.language} <span style={{ color: "#94a3b8" }}>({l.proficiency})</span>
              </div>
            ))}
          </SideSection>
        )}

        {/* Certifications */}
        {certifications.length > 0 && (
          <SideSection label="CERTIFICATIONS" accent={ACCENT}>
            {certifications.map((c) => (
              <div key={c.id} style={{ fontSize: 9, color: "#334155", marginBottom: 3 }}>
                <div style={{ fontWeight: "600" }}>{c.name}</div>
                <div style={{ color: "#64748b" }}>{c.issuer} · {c.date}</div>
              </div>
            ))}
          </SideSection>
        )}
      </div>

      {/* ─── Main Content ──────────────────────────────────────────────── */}
      <div style={{ flex: 1, padding: paddingVal, boxSizing: "border-box", overflow: "hidden" }}>

        {/* Summary */}
        {summary && (
          <section style={{ marginBottom: sectionGap }}>
            <MainHeading label="PROFESSIONAL SUMMARY" accent={ACCENT} />
            <p style={{ fontSize: 9.5, color: "#374151", textAlign: "justify", lineHeight: 1.5, margin: 0 }}>{summary}</p>
          </section>
        )}

        {/* Experience */}
        {experience.length > 0 && (
          <section style={{ marginBottom: sectionGap }}>
            <MainHeading label="WORK EXPERIENCE" accent={ACCENT} />
            {experience.map((exp) => (
              <div key={exp.id} style={{ marginBottom: listGap }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
                  <div>
                    <div style={{ fontWeight: "700", fontSize: 10.5, color: "#0f172a" }}>{exp.role || "Role Title"}</div>
                    <div style={{ fontSize: 9.5, color: ACCENT, fontWeight: "600" }}>{exp.company}</div>
                  </div>
                  <div style={{ textAlign: "right", flexShrink: 0 }}>
                    <div style={{ fontSize: 9, color: "#64748b", fontWeight: "600" }}>
                      {exp.startDate} – {exp.endDate}
                    </div>
                    {exp.location && <div style={{ fontSize: 8.5, color: "#94a3b8" }}>{exp.location}</div>}
                  </div>
                </div>
                {exp.bullets.filter(Boolean).length > 0 && (
                  <ul style={{ marginTop: 3, paddingLeft: 14, marginBottom: 0 }}>
                    {exp.bullets.filter(Boolean).map((b, i) => (
                      <li key={i} style={{ fontSize: 9, color: "#374151", marginBottom: 1.5, lineHeight: 1.4 }}>{b}</li>
                    ))}
                  </ul>
                )}
              </div>
            ))}
          </section>
        )}

        {/* Education */}
        {education.length > 0 && (
          <section style={{ marginBottom: sectionGap }}>
            <MainHeading label="EDUCATION" accent={ACCENT} />
            {education.map((edu) => (
              <div key={edu.id} style={{ marginBottom: 6 }}>
                <div style={{ display: "flex", justifyContent: "space-between" }}>
                  <div>
                    <div style={{ fontWeight: "700", fontSize: 10.5, color: "#0f172a" }}>{edu.institution}</div>
                    <div style={{ fontSize: 9.5, color: "#374151" }}>
                      {edu.degree}{edu.field ? ` in ${edu.field}` : ""}
                    </div>
                  </div>
                  <div style={{ textAlign: "right", fontSize: 9, color: "#64748b" }}>
                    {edu.startDate} – {edu.endDate}
                    {edu.gpa && <div>GPA: {edu.gpa}</div>}
                  </div>
                </div>
              </div>
            ))}
          </section>
        )}

        {/* Projects */}
        {projects.length > 0 && (
          <section style={{ marginBottom: sectionGap }}>
            <MainHeading label="PROJECTS" accent={ACCENT} />
            {projects.map((proj) => (
              <div key={proj.id} style={{ marginBottom: 6 }}>
                <div style={{ fontWeight: "700", fontSize: 10, color: "#0f172a" }}>
                  {proj.name}
                  {proj.techStack?.length ? (
                    <span style={{ fontWeight: "normal", color: "#64748b", fontSize: 9, fontStyle: "italic" }}>
                      {" · "}{proj.techStack.join(", ")}
                    </span>
                  ) : null}
                </div>
                {proj.description && (
                  <p style={{ fontSize: 9, color: "#374151", margin: "2px 0 0" }}>{proj.description}</p>
                )}
              </div>
            ))}
          </section>
        )}

        {/* Soft Skills */}
        {skills.soft.length > 0 && (
          <section>
            <MainHeading label="CORE COMPETENCIES" accent={ACCENT} />
            <div style={{ display: "flex", flexWrap: "wrap", gap: 4 }}>
              {skills.soft.map((s, i) => (
                <span key={i} style={{
                  padding: "1px 6px",
                  background: "#eff6ff",
                  color: ACCENT,
                  borderRadius: 3,
                  fontSize: 8.5,
                  fontWeight: "600",
                  border: `1px solid #bfdbfe`,
                }}>{s}</span>
              ))}
            </div>
          </section>
        )}
      </div>
    </div>
  );
}

function SideSection({ label, accent, children }: { label: string; accent: string; children: React.ReactNode }) {
  return (
    <div style={{ marginBottom: 14 }}>
      <div style={{
        fontSize: 8,
        fontWeight: "700",
        letterSpacing: 1.2,
        textTransform: "uppercase",
        color: accent,
        borderBottom: `1px solid ${accent}`,
        paddingBottom: 2,
        marginBottom: 5,
      }}>
        {label}
      </div>
      {children}
    </div>
  );
}

function ContactRow({ icon, value }: { icon: string; value: string }) {
  return (
    <div style={{ display: "flex", alignItems: "center", gap: 5, fontSize: 9, color: "#475569", marginBottom: 2, wordBreak: "break-all" }}>
      <span style={{ fontSize: 8.5, color: "#94a3b8", flexShrink: 0 }}>{icon}</span>
      <span>{value}</span>
    </div>
  );
}

function MainHeading({ label, accent }: { label: string; accent: string }) {
  return (
    <div style={{
      fontSize: 9.5,
      fontWeight: "700",
      letterSpacing: 1,
      color: "#0f172a",
      borderBottom: `2px solid ${accent}`,
      paddingBottom: 2,
      marginBottom: 6,
      textTransform: "uppercase",
    }}>
      {label}
    </div>
  );
}
