/**
 * Executive Leadership Template — Premium corporate layout
 * McKinsey-inspired conservative design
 */
import React from "react";
import type { ResumeData } from "../types";

interface Props {
  data: ResumeData;
  scale?: number;
}

export default function ExecutiveTemplate({ data, scale = 1 }: Props) {
  const { personalInfo: p, summary, experience, education, skills, projects, certifications, languages } = data;
  const PRIMARY = "#1c1917";
  const GOLD = "#92400e";

  const density = data.spacingDensity || "normal";
  const paddingMap = {
    compact: "20px 32px",
    normal: "32px 52px",
    spacious: "44px 60px",
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
  const sectionGap = gapMap[density];
  const listGap = listGapMap[density];

  return (
    <div style={{
      width: 794,
      height: 1123, // Strict A4
      maxHeight: 1123,
      overflow: "hidden",
      background: "#fffbf5",
      fontFamily: "'Georgia', 'Palatino', serif",
      color: PRIMARY,
      boxSizing: "border-box",
      fontSize: 10,
      lineHeight: 1.5,
      transform: `scale(${scale})`,
      transformOrigin: "top left",
    }}>
      {/* ─── Header ───────────────────────────────────────────────────── */}
      <div style={{
        background: PRIMARY,
        color: "#fdf8f0",
        padding: "24px 52px",
        position: "relative",
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
      }}>
        <div style={{
          position: "absolute",
          top: 0,
          left: 0,
          right: 0,
          height: 4,
          background: `linear-gradient(to right, ${GOLD}, #d97706, ${GOLD})`,
        }} />
        <div>
          <div style={{ fontSize: 24, fontWeight: "normal", letterSpacing: 2, textTransform: "uppercase", color: "#fdf8f0" }}>
            {p.fullName || "Your Name"}
          </div>
          {p.title && (
            <div style={{ fontSize: 11, color: "#d97706", letterSpacing: 1, marginTop: 4, textTransform: "uppercase", fontStyle: "italic" }}>
              {p.title}
            </div>
          )}
          <div style={{
            display: "flex",
            flexWrap: "wrap",
            gap: "4px 20px",
            marginTop: 10,
            fontSize: 9,
            color: "#d6d3d1",
            fontFamily: "'Arial', sans-serif",
            borderTop: `1px solid rgba(217,119,6,0.3)`,
            paddingTop: 8,
          }}>
            {p.email && <span>{p.email}</span>}
            {p.phone && <span>{p.phone}</span>}
            {p.location && <span>{p.location}</span>}
            {p.linkedin && <span>{p.linkedin}</span>}
          </div>
        </div>

        {/* Profile Image if uploaded */}
        {p.photo ? (
          <img
            src={p.photo}
            alt="Profile"
            style={{
              width: 65,
              height: 65,
              borderRadius: "50%",
              objectFit: "cover",
              border: `2px solid ${GOLD}`,
              marginLeft: 20,
              flexShrink: 0,
            }}
          />
        ) : null}
      </div>

      {/* ─── Body ─────────────────────────────────────────────────────── */}
      <div style={{ padding: paddingVal }}>

        {/* Executive Summary */}
        {summary && (
          <section style={{ marginBottom: sectionGap }}>
            <ExecHeading label="Executive Profile" gold={GOLD} />
            <p style={{ fontSize: 10, color: "#374151", lineHeight: 1.6, fontStyle: "italic", borderLeft: `3px solid ${GOLD}`, paddingLeft: 12, margin: 0 }}>
              {summary}
            </p>
          </section>
        )}

        {/* Experience */}
        {experience.length > 0 && (
          <section style={{ marginBottom: sectionGap }}>
            <ExecHeading label="Career History" gold={GOLD} />
            {experience.map((exp) => (
              <div key={exp.id} style={{ marginBottom: listGap }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
                  <div>
                    <div style={{ fontWeight: "bold", fontSize: 11, color: PRIMARY, textTransform: "uppercase", letterSpacing: 0.5 }}>
                      {exp.role || "Role"}
                    </div>
                    <div style={{ fontSize: 10.5, color: GOLD, fontStyle: "italic" }}>
                      {exp.company}{exp.location ? ` | ${exp.location}` : ""}
                    </div>
                  </div>
                  <div style={{
                    fontSize: 9,
                    color: "#78716c",
                    whiteSpace: "nowrap",
                    background: "#fdf2e9",
                    padding: "2px 8px",
                    borderRadius: 2,
                    border: `1px solid #f5c88a`,
                    fontFamily: "'Arial', sans-serif",
                  }}>
                    {exp.startDate} — {exp.endDate}
                  </div>
                </div>
                {exp.bullets.filter(Boolean).length > 0 && (
                  <ul style={{ marginTop: 4, paddingLeft: 16, marginBottom: 0 }}>
                    {exp.bullets.filter(Boolean).map((b, i) => (
                      <li key={i} style={{ fontSize: 9.5, color: "#374151", marginBottom: 1.5, lineHeight: 1.5 }}>{b}</li>
                    ))}
                  </ul>
                )}
              </div>
            ))}
          </section>
        )}

        {/* Two-column bottom */}
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 24 }}>

          {/* Education */}
          {education.length > 0 && (
            <section>
              <ExecHeading label="Education" gold={GOLD} />
              {education.map((edu) => (
                <div key={edu.id} style={{ marginBottom: 6 }}>
                  <div style={{ fontWeight: "bold", fontSize: 10, color: PRIMARY }}>{edu.institution}</div>
                  <div style={{ fontSize: 9.5, color: "#78716c", fontStyle: "italic" }}>
                    {edu.degree}{edu.field ? `, ${edu.field}` : ""}
                  </div>
                  <div style={{ fontSize: 9, color: "#a8a29e" }}>
                    {edu.startDate} – {edu.endDate}
                    {edu.gpa ? ` · GPA ${edu.gpa}` : ""}
                  </div>
                </div>
              ))}
            </section>
          )}

          {/* Skills + Certifications */}
          <section>
            {skills.technical.length > 0 && (
              <>
                <ExecHeading label="Core Competencies" gold={GOLD} />
                <div style={{ display: "flex", flexWrap: "wrap", gap: 4, marginBottom: 10 }}>
                  {[...skills.technical, ...skills.soft].map((s, i) => (
                    <span key={i} style={{
                      padding: "2px 6px",
                      background: "#fef3c7",
                      color: GOLD,
                      border: `1px solid #fcd34d`,
                      borderRadius: 2,
                      fontSize: 8.5,
                      fontFamily: "'Arial', sans-serif",
                    }}>{s}</span>
                  ))}
                </div>
              </>
            )}

            {certifications.length > 0 && (
              <>
                <ExecHeading label="Certifications" gold={GOLD} />
                {certifications.slice(0, 3).map((c) => (
                  <div key={c.id} style={{ fontSize: 9, marginBottom: 2, color: "#374151" }}>
                    ◆ <strong>{c.name}</strong> · {c.issuer}
                  </div>
                ))}
              </>
            )}
          </section>
        </div>
      </div>
    </div>
  );
}

function ExecHeading({ label, gold }: { label: string; gold: string }) {
  return (
    <div style={{
      fontSize: 9,
      fontWeight: "bold",
      letterSpacing: 1.5,
      textTransform: "uppercase",
      color: gold,
      borderBottom: `1px solid ${gold}`,
      paddingBottom: 3,
      marginBottom: 6,
      fontFamily: "'Arial', sans-serif",
    }}>
      {label}
    </div>
  );
}
