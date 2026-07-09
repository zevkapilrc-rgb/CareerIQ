export interface CoverLetterDraftInput {
  role: string;
  company: string;
  tone?: string;
  focus?: string;
}

export function buildCoverLetterPrompt(profile: any, input: CoverLetterDraftInput): string {
  const technicalSkills = (profile?.skills?.technical || []).map((skill: any) => skill.name).filter(Boolean);
  const softSkills = (profile?.skills?.soft || []).map((skill: any) => skill.name).filter(Boolean);
  const experienceHighlights = (profile?.experience || [])
    .slice(0, 3)
    .flatMap((item: any) => item.bullets || [])
    .filter(Boolean);

  return [
    `Write a polished cover letter for ${input.role} at ${input.company}.`,
    `Tone should be ${input.tone || 'confident, professional, and concise'}.`,
    `The candidate name is ${profile?.personalInfo?.name || 'the applicant'}.`,
    `Use their summary: ${profile?.summary || 'No summary provided.'}`,
    `Highlight relevant experience: ${experienceHighlights.slice(0, 3).join(' | ') || 'No experience highlights provided.'}`,
    `Reference technical skills: ${technicalSkills.join(', ') || 'No technical skills provided.'}`,
    `Reference soft skills: ${softSkills.join(', ') || 'No soft skills provided.'}`,
    input.focus ? `Focus on: ${input.focus}` : '',
  ]
    .filter(Boolean)
    .join('\n');
}
