export default function SkillCloud() {
  const skills = ["React", "TypeScript", "Python", "SQL", "System Design"];

  return (
    <section className="rounded-2xl border border-slate-800 bg-slate-900/60 p-4">
      <h2 className="text-lg font-semibold mb-2">Skill Cloud (stub)</h2>
      <div className="flex flex-wrap gap-2">
        {skills.map((skill) => (
          <span
            key={skill}
            className="rounded-full border border-slate-700 bg-slate-800/70 px-3 py-1 text-xs"
          >
            {skill}
          </span>
        ))}
      </div>
    </section>
  );
}



