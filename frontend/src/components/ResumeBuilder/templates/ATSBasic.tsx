/**
 * ATS Classic Template — Maximum ATS compatibility
 * Single column, clean typography, universal format
 */
import React from "react";
import type { ResumeData } from "../types";

interface Props {
  data: ResumeData;
  scale?: number;
}

export default function ATSBasicTemplate({ data, scale = 1 }: Props) {
  const { personalInfo: p, summary, experience, education, skills, projects, certifications, languages } = data;

  const density = data.spacingDensity || "normal";
  const paddingMap = {
    compact: "24px 36px",
    normal: "48px 56px",
    spacious: "64px 72px",
  };
  const gapMap = {
    compact: 6,
    normal: 10,
    spacious: 16,
  };
  const listGapMap = {
    compact: 1,
    normal: 2.5,
    spacious: 4,
  };

  const paddingVal = paddingMap[density];
  const sectionGap = gapMap[density];
  const listGap = listGapMap[density];

  const allSkills = [
    ...skills.technical,
    ...skills.frameworks,
    ...skills.tools,
    ...skills.soft,
  ].filter(Boolean);

  return (
    <div
      className="resume-sheet"
      style={{
        width: 794,
        height: 1123, // Strict A4 Height
        maxHeight: 1123,
        overflow: "hidden", // Enforce single page layout limit
        background: "#fff",
        fontFamily: "'Times New Roman', Times, serif",
        color: "#111",
        padding: paddingVal,
        boxSizing: "border-box",
        fontSize: 10,
        lineHeight: 1.5,
        transform: `scale(${scale})`,
        transformOrigin: "top left",
        position: "relative",
      }}
    >
      {/* ─── Header ─────────────────────────────────────────────────── */}
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", borderBottom: "2px solid #111", paddingBottom: 8, marginBottom: sectionGap }}>
        <div style={{ flex: 1, textAlign: p.photo ? "left" : "center" }}>
          <div style={{ fontSize: 22, fontWeight: "bold", letterSpacing: 2, textTransform: "uppercase", color: "#111" }}>
            {p.fullName || "YOUR NAME"}
          </div>
          {p.title && (
            <div style={{ fontSize: 11, marginTop: 2, color: "#444", fontStyle: "italic" }}>{p.title}</div>
          )}
          <div style={{ marginTop: 6, fontSize: 9.5, display: "flex", justifyContent: p.photo ? "flex-start" : "center", gap: 16, flexWrap: "wrap", color: "#333" }}>
            {p.email && <span>{p.email}</span>}
            {p.phone && <span>{p.phone}</span>}
            {p.location && <span>{p.location}</span>}
            {p.linkedin && <span>{p.linkedin}</span>}
            {p.github && <span>{p.github}</span>}
          </div>
        </div>
        {p.photo && (
          <img
            src={p.photo}
            alt="Profile"
            style={{
              width: 60,
              height: 60,
              borderRadius: "50%",
              objectFit: "cover",
              border: "1px solid #111",
              marginLeft: 20,
              flexShrink: 0,
            }}
          />
        )}
      </div>

      {/* ─── Summary ─────────────────────────────────────────────────── */}
      {summary && (
        <section style={{ marginBottom: sectionGap }}>
          <SectionHeading label="PROFESSIONAL SUMMARY" />
          <p style={{ fontSize: 9.5, color: "#222", textAlign: "justify", margin: 0 }}>{summary}</p>
        </section>
      )}

      {/* ─── Experience ──────────────────────────────────────────────── */}
      {experience.length > 0 && (
        <section style={{ marginBottom: sectionGap }}>
          <SectionHeading label="WORK EXPERIENCE" />
          {experience.map((exp) => (
            <div key={exp.id} style={{ marginBottom: listGap }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline" }}>
                <div style={{ fontWeight: "bold", fontSize: 10.5 }}>{exp.role || "Role"}</div>
                <div style={{ fontSize: 9.5, color: "#444" }}>
                  {exp.startDate} – {exp.endDate}
                </div>
              </div>
              <div style={{ display: "flex", justifyContent: "space-between" }}>
                <div style={{ fontSize: 10, fontStyle: "italic", color: "#333" }}>{exp.company}</div>
                {exp.location && <div style={{ fontSize: 9.5, color: "#555" }}>{exp.location}</div>}
              </div>
              {exp.bullets.filter(Boolean).length > 0 && (
                <ul style={{ marginTop: 3, paddingLeft: 16, marginBottom: 0 }}>
                  {exp.bullets.filter(Boolean).map((b, i) => (
                    <li key={i} style={{ fontSize: 9.5, color: "#222", marginBottom: 1 }}>{b}</li>
                  ))}
                </ul>
              )}
            </div>
          ))}
        </section>
      )}

      {/* ─── Education ───────────────────────────────────────────────── */}
      {education.length > 0 && (
        <section style={{ marginBottom: sectionGap }}>
          <SectionHeading label="EDUCATION" />
          {education.map((edu) => (
            <div key={edu.id} style={{ marginBottom: listGap }}>
              <div style={{ display: "flex", justifyContent: "space-between" }}>
                <div style={{ fontWeight: "bold", fontSize: 10.5 }}>{edu.institution}</div>
                <div style={{ fontSize: 9.5, color: "#444" }}>
                  {edu.startDate} – {edu.endDate}
                </div>
              </div>
              <div style={{ fontSize: 10, fontStyle: "italic", color: "#333" }}>
                {edu.degree}{edu.field ? `, ${edu.field}` : ""}
                {edu.gpa ? ` | GPA: ${edu.gpa}` : ""}
              </div>
            </div>
          ))}
        </section>
      )}

      {/* ─── Skills ──────────────────────────────────────────────────── */}
      {allSkills.length > 0 && (
        <section style={{ marginBottom: sectionGap }}>
          <SectionHeading label="SKILLS" />
          <p style={{ fontSize: 9.5, color: "#222", margin: 0 }}>{allSkills.join(" • ")}</p>
        </section>
      )}

      {/* ─── Projects ────────────────────────────────────────────────── */}
      {projects.length > 0 && (
        <section style={{ marginBottom: sectionGap }}>
          <SectionHeading label="PROJECTS" />
          {projects.map((proj) => (
            <div key={proj.id} style={{ marginBottom: listGap }}>
              <div style={{ fontWeight: "bold", fontSize: 10.5 }}>
                {proj.name}
                {proj.techStack?.length ? ` | ${proj.techStack.join(", ")}` : ""}
              </div>
              {proj.description && <p style={{ fontSize: 9.5, color: "#333", margin: "2px 0 0" }}>{proj.description}</p>}
            </div>
          ))}
        </section>
      )}

      {/* ─── Certifications ──────────────────────────────────────────── */}
      {certifications.length > 0 && (
        <section style={{ marginBottom: sectionGap }}>
          <SectionHeading label="CERTIFICATIONS" />
          {certifications.map((cert) => (
            <div key={cert.id} style={{ fontSize: 9.5, color: "#222", marginBottom: 2 }}>
              <strong>{cert.name}</strong> — {cert.issuer} ({cert.date})
            </div>
          ))}
        </section>
      )}

      {/* ─── Languages ───────────────────────────────────────────────── */}
      {languages.length > 0 && (
        <section>
          <SectionHeading label="LANGUAGES" />
          <p style={{ fontSize: 9.5, color: "#222", margin: 0 }}>
            {languages.map((l) => `${l.language} (${l.proficiency})`).join(" • ")}
          </p>
        </section>
      )}
    </div>
  );
}

function SectionHeading({ label }: { label: string }) {
  return (
    <div style={{
      fontSize: 10,
      fontWeight: "bold",
      letterSpacing: 1.5,
      textTransform: "uppercase",
      borderBottom: "1px solid #111",
      marginBottom: 5,
      paddingBottom: 2,
      color: "#111",
    }}>
      {label}
    </div>
  );
}
