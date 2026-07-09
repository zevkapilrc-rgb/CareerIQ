import test from 'node:test';
import assert from 'node:assert/strict';
import { buildCoverLetterPrompt } from './coverLetterUtils.ts';

test('buildCoverLetterPrompt includes role, company, and profile highlights', () => {
  const profile = {
    personalInfo: {
      name: 'Ada Lovelace',
    },
    summary: 'Built AI-driven product experiences for modern teams.',
    experience: [
      {
        role: 'Principal Engineer',
        company: 'Northwind Labs',
        bullets: ['Led a cross-functional platform team.'],
      },
    ],
    skills: {
      technical: [{ name: 'TypeScript' }],
      soft: [{ name: 'Communication' }],
      tools: [{ name: 'Next.js' }],
    },
  };

  const prompt = buildCoverLetterPrompt(profile, {
    role: 'Senior Frontend Engineer',
    company: 'Hirevix',
    tone: 'confident and concise',
  });

  assert.match(prompt, /Senior Frontend Engineer/);
  assert.match(prompt, /Hirevix/);
  assert.match(prompt, /Ada Lovelace/);
  assert.match(prompt, /TypeScript/);
});
