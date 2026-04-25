"""
Advanced unified Resume AI analysis engine.
Performs deep analysis in a single pipeline with 13 intelligence modules.
"""

import json
import re
from typing import Dict, List, Any, Optional
from .ai_client import simple_chat_completion


# ─────────────────────────────────────────────────────────────────────
# HELPER FUNCTIONS
# ─────────────────────────────────────────────────────────────────────

POWER_VERBS = [
    "achieved", "built", "designed", "developed", "engineered", "implemented",
    "improved", "led", "managed", "optimized", "reduced", "scaled", "shipped",
    "launched", "increased", "deployed", "architected", "delivered", "created",
    "owned", "streamlined", "automated", "boosted", "collaborated", "coordinated",
    "established", "executed", "generated", "innovated", "integrated", "mentored",
    "negotiated", "organized", "produced", "resolved", "spearheaded", "transformed"
]

INDUSTRY_KEYWORDS = {
    "tech": ["api", "rest", "microservices", "cloud", "aws", "docker", "kubernetes",
             "react", "nodejs", "python", "typescript", "agile", "ci/cd", "git"],
    "data": ["sql", "python", "tableau", "powerbi", "analytics", "bigquery", "spark",
             "datawarehouse", "etl", "visualization", "statistics", "machine learning"],
    "product": ["agile", "scrum", "jira", "roadmap", "kpis", "user research", "prototyping",
                "wireframing", "figma", "ux", "ui", "product strategy", "stakeholder"],
    "finance": ["excel", "financial modeling", "accounting", "auditing", "sap", "oracle",
                "gaap", "ifrs", "revenue", "cost analysis", "forecasting"],
}

COMMON_GENERIC_PHRASES = [
    "responsible for", "worked on", "was part of", "involved in",
    "helped with", "participated in", "contributed", "assisted with",
    "tasked with", "handled"
]


def extract_text_sections(text: str) -> Dict[str, str]:
    """Extract resume sections (summary, experience, skills, education)"""
    sections = {
        "summary": "",
        "experience": "",
        "skills": "",
        "education": "",
        "full_text": text
    }
    
    lower_text = text.lower()
    
    # Find section boundaries
    summary_match = re.search(r'(?:professional summary|summary|objective)(.*?)(?:experience|education|skills|$)', 
                              lower_text, re.IGNORECASE | re.DOTALL)
    if summary_match:
        sections["summary"] = summary_match.group(1).strip()
    
    exp_match = re.search(r'(?:experience|work history)(.*?)(?:education|skills|$)',
                          lower_text, re.IGNORECASE | re.DOTALL)
    if exp_match:
        sections["experience"] = exp_match.group(1).strip()
    
    skills_match = re.search(r'(?:skills|technical skills)(.*?)(?:experience|education|$)',
                             lower_text, re.IGNORECASE | re.DOTALL)
    if skills_match:
        sections["skills"] = skills_match.group(1).strip()
    
    edu_match = re.search(r'(?:education|certifications)(.*?)(?:experience|skills|$)',
                          lower_text, re.IGNORECASE | re.DOTALL)
    if edu_match:
        sections["education"] = edu_match.group(1).strip()
    
    return sections


def detect_metrics(text: str) -> List[str]:
    """Detect quantitative metrics in text"""
    patterns = [
        r'\d+%',  # percentages
        r'\$[\d,]+',  # currency
        r'\d+[km]?\+',  # numbers with scale
        r'\d+\s*(?:users|customers|projects|team|engineers|employees)',
        r'(?:reduced|increased|improved|boosted)\s+[^.]*\d+',
    ]
    
    metrics = []
    for pattern in patterns:
        matches = re.findall(pattern, text, re.IGNORECASE)
        metrics.extend(matches)
    
    return list(set(metrics))  # remove duplicates


def detect_employment_gaps(text: str) -> List[str]:
    """Detect potential employment gaps or timeline issues"""
    gaps = []
    
    # Look for date patterns
    date_pattern = r'(?:Jan|Feb|Mar|Apr|May|Jun|Jul|Aug|Sep|Oct|Nov|Dec|January|February|March|April|May|June|July|August|September|October|November|December)\s*\d{4}'
    dates = re.findall(date_pattern, text, re.IGNORECASE)
    
    # Extract years
    years = re.findall(r'\b(20\d{2})\b', text)
    if years:
        years_unique = sorted(set(map(int, years)))
        for i in range(len(years_unique) - 1):
            gap = years_unique[i+1] - years_unique[i]
            if gap > 2:
                gaps.append(f"Potential {gap}-year gap between {years_unique[i]} and {years_unique[i+1]}")
    
    return gaps


def calculate_genericity_score(text: str) -> float:
    """Calculate how generic the resume content is (0-100)"""
    lower_text = text.lower()
    generic_count = sum(1 for phrase in COMMON_GENERIC_PHRASES if phrase in lower_text)
    power_verb_count = sum(1 for verb in POWER_VERBS if verb in lower_text)
    
    total_sentences = len(re.split(r'[.!?]', text))
    
    if total_sentences == 0:
        return 50.0
    
    genericity = (generic_count / max(1, total_sentences)) * 100
    
    # Reduce score if there are power verbs
    if power_verb_count > 0:
        genericity = max(0, genericity - (power_verb_count * 5))
    
    return min(100, genericity)


def extract_skills_list(text: str) -> List[str]:
    """Extract technical and soft skills"""
    lower_text = text.lower()
    found_skills = set()
    
    # Look for skills section
    skills_section_match = re.search(r'(?:skills|technical skills)[\s:]*(.+?)(?:experience|education|$)',
                                      lower_text, re.IGNORECASE | re.DOTALL)
    
    if skills_section_match:
        skills_text = skills_section_match.group(1)
        # Split by common delimiters
        for skill in re.split(r'[,;•\n]', skills_text):
            skill = skill.strip()
            if skill and len(skill) > 1 and len(skill) < 50:
                found_skills.add(skill.title())
    
    # Also scan for common tech keywords
    for keyword in sum(INDUSTRY_KEYWORDS.values(), []):
        if keyword.lower() in lower_text:
            found_skills.add(keyword.title())
    
    return list(found_skills)[:20]  # Return top 20


# ─────────────────────────────────────────────────────────────────────
# AI ANALYSIS MODULES
# ─────────────────────────────────────────────────────────────────────

async def analyze_improved_summary(sections: Dict[str, str], original_skills: List[str]) -> Dict[str, Any]:
    """Module 1: Generate ATS-optimized improved summary"""
    
    prompt = f"""You are an expert resume writer and ATS optimizer. 
    
Given this resume summary:
{sections['summary'][:500]}

And these skills: {', '.join(original_skills[:10])}

Generate a professional ATS-optimized summary that:
1. Starts with a powerful statement
2. Highlights 2-3 key achievements with metrics
3. Mentions relevant technical skills
4. Is 3-4 sentences, 30-40 words per sentence

Return ONLY valid JSON (no markdown):
{{
  "improved": "The improved summary text here",
  "key_keywords": ["keyword1", "keyword2", "keyword3"],
  "ats_compliance": 85
}}"""

    response = await simple_chat_completion(prompt)
    
    try:
        data = json.loads(response)
        return {
            "original": sections['summary'][:200],
            "improved": data.get("improved", ""),
            "key_keywords": data.get("key_keywords", []),
            "ats_compliance": data.get("ats_compliance", 75)
        }
    except:
        return {
            "original": sections['summary'][:200],
            "improved": "Professional with proven expertise in technology solutions.",
            "key_keywords": original_skills[:3],
            "ats_compliance": 65
        }


async def analyze_enhanced_experience(sections: Dict[str, str]) -> Dict[str, Any]:
    """Module 2: Generate enhanced experience with power verbs and metrics"""
    
    bullet_points = [line.strip() for line in sections['experience'].split('\n') if line.strip().startswith(('-', '•', '*')) or re.match(r'^\d+\.', line.strip())][:8]
    
    if not bullet_points:
        bullet_points = [line.strip() for line in sections['experience'].split('\n') if line.strip()][:8]
    
    prompt = f"""You are an expert career coach specializing in resume enhancement.

Given these experience bullet points:
{chr(10).join(bullet_points)}

For EACH bullet point:
1. Identify the action verb (if weak, suggest stronger alternative)
2. Extract or add quantifiable metrics
3. Rewrite to maximize impact

Return ONLY valid JSON array (no markdown):
[
  {{
    "original": "original bullet",
    "improved": "enhanced bullet with metrics and power verb",
    "action_verb": "Achieved",
    "metric_added": "30%"
  }}
]

Provide enhancements for all {len(bullet_points)} bullets."""

    response = await simple_chat_completion(prompt)
    
    try:
        items = json.loads(response)
        return {
            "items": items[:8],
            "overall_strength": 78
        }
    except:
        return {
            "items": [
                {
                    "original": bp,
                    "improved": bp.replace("Responsible for", "Led").replace("Worked on", "Architected"),
                    "action_verb": "Enhanced",
                    "metric_added": "TBD"
                } for bp in bullet_points
            ],
            "overall_strength": 65
        }


async def analyze_skill_optimization(sections: Dict[str, str], skills: List[str]) -> Dict[str, Any]:
    """Module 3: Generate industry keyword optimization"""
    
    skills_str = ", ".join(skills)
    
    prompt = f"""You are an ATS and industry keywords expert.

Current skills: {skills_str}

Analyze these skills and:
1. Optimize them for ATS (make them standard industry terms)
2. Add 5-7 trending industry keywords that would strengthen this resume
3. Identify 3-5 critical missing skills

Provide response in ONLY valid JSON (no markdown):
{{
  "optimized_skills": ["Skill1", "Skill2"],
  "industry_keywords": ["Keyword1", "Keyword2"],
  "missing_trending": ["Trending1", "Trending2"],
  "coverage_percentage": 72
}}"""

    response = await simple_chat_completion(prompt)
    
    try:
        data = json.loads(response)
        return {
            "current_skills": skills[:10],
            "optimized_skills": data.get("optimized_skills", skills[:10]),
            "industry_keywords": data.get("industry_keywords", []),
            "missing_trending": data.get("missing_trending", []),
            "coverage_percentage": data.get("coverage_percentage", 65)
        }
    except:
        return {
            "current_skills": skills[:10],
            "optimized_skills": skills[:10],
            "industry_keywords": ["Cloud Architecture", "DevOps", "Microservices"],
            "missing_trending": ["AI/ML", "Kubernetes", "GraphQL"],
            "coverage_percentage": 58
        }


async def analyze_multi_dimensional_scores(full_text: str, sections: Dict[str, str]) -> Dict[str, int]:
    """Module 4: Calculate 6 key dimension scores"""
    
    lower_text = full_text.lower()
    
    # ATS Score: formatting, keywords, structure
    ats_components = [
        len(re.findall(r'\d+%|\$[\d,]+', full_text)) * 5,  # metrics
        sum(1 for verb in POWER_VERBS if verb in lower_text) * 3,  # power verbs
        len(extract_skills_list(full_text)) * 2,  # skills diversity
    ]
    ats_score = min(100, sum(ats_components))
    
    # Recruiter Score: readability, impact, achievement focus
    recruiter_components = [
        max(0, 100 - calculate_genericity_score(full_text)),
        len(detect_metrics(full_text)) * 3,
        sum(1 for verb in POWER_VERBS if verb in lower_text) * 2,
    ]
    recruiter_score = min(100, int(sum(recruiter_components) / len(recruiter_components)))
    
    # Impact Score: quantifiable achievements
    impact_score = min(100, len(detect_metrics(full_text)) * 12)
    
    # Skill Depth Score: diversity and depth of skills
    skills = extract_skills_list(full_text)
    skill_depth_score = min(100, len(skills) * 5)
    
    # Career Consistency Score: coherent career progression
    consistency_components = [
        100 - len(detect_employment_gaps(full_text)) * 15,
        len(sections['education']) > 0 and 20 or 0,
    ]
    career_consistency_score = max(0, min(100, int(sum(consistency_components) / len(consistency_components))))
    
    overall_score = int((ats_score + recruiter_score + impact_score + skill_depth_score + career_consistency_score) / 5)
    
    return {
        "ats_score": int(ats_score),
        "recruiter_score": recruiter_score,
        "impact_score": int(impact_score),
        "skill_depth_score": int(skill_depth_score),
        "career_consistency_score": career_consistency_score,
        "overall_score": overall_score
    }


async def analyze_recruiter_simulation(full_text: str, scores: Dict[str, int]) -> Dict[str, Any]:
    """Module 5: Simulate 6-second recruiter impression"""
    
    metrics = detect_metrics(full_text)
    power_verbs_count = sum(1 for verb in POWER_VERBS if verb.lower() in full_text.lower())
    
    prompt = f"""You are a busy recruiter with 6 seconds to review a resume.

Quick scan summary:
- Has {len(metrics)} quantifiable achievements
- Uses {power_verbs_count} strong action verbs
- Recruiter score: {scores.get('recruiter_score', 70)}
- Key metrics: {', '.join(metrics[:3]) if metrics else 'None detected'}

Generate a quick impression in JSON (no markdown):
{{
  "first_impression": "1-2 sentence quick impression",
  "shortlist_probability": 65,
  "key_concerns": ["Concern 1", "Concern 2"],
  "strengths_spotted": ["Strength 1", "Strength 2"]
}}"""

    response = await simple_chat_completion(prompt)
    
    try:
        data = json.loads(response)
        return {
            "first_impression": data.get("first_impression", "Solid technical background with clear achievements."),
            "shortlist_probability": data.get("shortlist_probability", 65),
            "key_concerns": data.get("key_concerns", []),
            "strengths_spotted": data.get("strengths_spotted", [])
        }
    except:
        return {
            "first_impression": "Strong technical background with quantifiable achievements.",
            "shortlist_probability": scores.get("recruiter_score", 65),
            "key_concerns": ["More specific role targeting needed"],
            "strengths_spotted": ["Clear technical skills", "Measurable impact"]
        }


async def analyze_resume_breakdown(sections: Dict[str, str]) -> Dict[str, Any]:
    """Module 6: Analyze each bullet point for issues"""
    
    bullet_points = [line.strip() for line in sections['experience'].split('\n') if line.strip()][:6]
    
    analyses = []
    for bp in bullet_points:
        is_generic = any(phrase in bp.lower() for phrase in COMMON_GENERIC_PHRASES)
        has_metric = bool(detect_metrics(bp))
        
        analyses.append({
            "original": bp[:100],
            "issues": ["Weak verb used", "No metrics"] if not has_metric else [],
            "improved": bp.replace("Responsible for", "Delivered").replace("Worked on", "Architected"),
            "action_verb": re.findall(r'\b(' + '|'.join(POWER_VERBS) + r')\b', bp.lower())[0].title() if re.findall(r'\b(' + '|'.join(POWER_VERBS) + r')\b', bp.lower()) else "Action needed",
            "metric_added": detect_metrics(bp)[0] if detect_metrics(bp) else "N/A"
        })
    
    genericity = calculate_genericity_score(sections['experience'])
    
    return {
        "bullet_analyses": analyses,
        "generic_content_percentage": int(genericity),
        "metrics_percentage": int((sum(1 for a in analyses if a['metric_added'] != 'N/A') / len(analyses)) * 100) if analyses else 0,
        "improvement_potential": max(0, 100 - int(genericity))
    }


async def analyze_skill_intelligence(skills: List[str], full_text: str) -> Dict[str, Any]:
    """Module 7: Analyze core, weak, missing, and future skills"""
    
    prompt = f"""You are a career development expert analyzing technical skills.

Current skills: {', '.join(skills)}

Categorize these into:
1. Core skills (strongest, most relevant)
2. Weak skills (outdated or less relevant)
3. Missing skills (critical for their role)
4. Future skills (emerging, good to learn)

Return ONLY valid JSON (no markdown):
{{
  "core_skills": ["Skill1", "Skill2"],
  "weak_skills": ["Outdated1"],
  "missing_skills": ["Missing1", "Missing2"],
  "future_skills": ["Emerging1", "Emerging2"],
  "skill_gap": 35
}}"""

    response = await simple_chat_completion(prompt)
    
    try:
        data = json.loads(response)
        return data
    except:
        return {
            "core_skills": skills[:3],
            "weak_skills": skills[3:5] if len(skills) > 3 else [],
            "missing_skills": ["Cloud Architecture", "Kubernetes"],
            "future_skills": ["AI/ML", "GraphQL"],
            "skill_gap": 42
        }


async def analyze_career_insights(full_text: str, skills: List[str]) -> Dict[str, Any]:
    """Module 8: Generate career insights and growth recommendations"""
    
    prompt = f"""You are a career strategist analyzing career progression.

Resume highlights:
- Skills: {', '.join(skills[:5])}
- Role alignment to assess

Provide career insights in JSON (no markdown):
{{
  "role_alignment": 78,
  "suggested_career_paths": ["Path 1", "Path 2"],
  "growth_recommendations": ["Recommendation 1", "Recommendation 2"],
  "timeline_to_next_level": "18-24 months"
}}"""

    response = await simple_chat_completion(prompt)
    
    try:
        data = json.loads(response)
        return data
    except:
        return {
            "role_alignment": 72,
            "suggested_career_paths": ["Senior Engineer", "Tech Lead"],
            "growth_recommendations": ["Develop leadership skills", "Expand cloud expertise"],
            "timeline_to_next_level": "18-24 months"
        }


async def analyze_risk_detection(full_text: str, sections: Dict[str, str]) -> Dict[str, Any]:
    """Module 9: Detect potential red flags"""
    
    risks = []
    genericity = calculate_genericity_score(full_text)
    gaps = detect_employment_gaps(full_text)
    metrics = detect_metrics(full_text)
    
    if genericity > 60:
        risks.append("Generic language detected - use specific achievements")
    
    if len(metrics) < 2:
        risks.append("Few quantifiable metrics - add numbers and percentages")
    
    if gaps:
        risks.extend(gaps)
    
    severity = "high" if len(risks) > 3 else "medium" if len(risks) > 1 else "low"
    
    return {
        "generic_content": genericity > 60,
        "skill_mismatch": len(sections['skills']) < 5,
        "timeline_issues": len(gaps) > 0,
        "employment_gaps": len(gaps) > 0,
        "risks": risks,
        "severity": severity
    }


async def analyze_interview_questions(full_text: str, skills: List[str]) -> Dict[str, List]:
    """Module 10: Generate predicted interview questions"""
    
    prompt = f"""Based on this resume with these skills: {', '.join(skills[:5])}

Generate 5 technical, 5 HR, and 3 situational interview questions likely to be asked.

Return ONLY valid JSON (no markdown):
{{
  "technical": [
    {{"category": "Technical", "question": "Question 1"}},
    {{"category": "Technical", "question": "Question 2"}}
  ],
  "hr": [
    {{"category": "HR", "question": "Question 1"}},
    {{"category": "HR", "question": "Question 2"}}
  ],
  "situational": [
    {{"category": "Situational", "question": "Question 1"}}
  ]
}}"""

    response = await simple_chat_completion(prompt)
    
    try:
        data = json.loads(response)
        return {
            "technical": data.get("technical", []),
            "hr": data.get("hr", []),
            "situational": data.get("situational", [])
        }
    except:
        return {
            "technical": [
                {"category": "Technical", "question": "Describe a complex project you led"},
                {"category": "Technical", "question": "How do you approach system design?"}
            ],
            "hr": [
                {"category": "HR", "question": "Tell us about your teamwork experience"},
                {"category": "HR", "question": "How do you handle challenges?"}
            ],
            "situational": [
                {"category": "Situational", "question": "Give an example of overcoming a technical obstacle"}
            ]
        }


async def analyze_personal_branding(sections: Dict[str, str], skills: List[str], name: str = "Professional") -> Dict[str, str]:
    """Module 11: Generate personal branding content"""
    
    prompt = f"""Create compelling personal branding content for a professional with these skills: {', '.join(skills[:5])}

Generate in JSON (no markdown):
{{
  "linkedin_headline": "Job title | Core Skills",
  "short_bio": "1-2 sentence bio",
  "tagline": "Memorable tagline",
  "elevator_pitch": "30-second pitch"
}}"""

    response = await simple_chat_completion(prompt)
    
    try:
        data = json.loads(response)
        return data
    except:
        return {
            "linkedin_headline": "Senior Software Engineer | Cloud Architecture | Full-Stack Development",
            "short_bio": "Passionate technologist with proven track record of building scalable systems.",
            "tagline": "Engineering excellence through innovation and collaboration.",
            "elevator_pitch": "I design and build enterprise-scale systems that drive business impact."
        }


async def analyze_portfolio_content(sections: Dict[str, str], skills: List[str]) -> Dict[str, str]:
    """Module 12: Generate portfolio website content"""
    
    prompt = f"""Generate portfolio website sections for a professional with skills: {', '.join(skills[:5])}

Generate in JSON (no markdown):
{{
  "hero": "Hero section tagline",
  "about": "About section summary",
  "skills_section": "Skills section intro",
  "projects": ["Project 1 title", "Project 2 title"],
  "contact_cta": "Call to action for contact"
}}"""

    response = await simple_chat_completion(prompt)
    
    try:
        data = json.loads(response)
        return data
    except:
        return {
            "hero": "Building technology that scales and impacts businesses.",
            "about": "Full-stack engineer with 10+ years of experience in cloud systems.",
            "skills_section": "Core competencies across modern tech stack.",
            "projects": ["Project: E-commerce Platform", "Project: Analytics Dashboard"],
            "contact_cta": "Let's work together. Get in touch today."
        }


async def generate_optimized_resume(sections: Dict[str, str], enhancements: Dict[str, Any], job_description: Optional[str] = None) -> Dict[str, Any]:
    """Module 13: Generate fully rewritten optimized resume"""
    
    prompt = f"""You are an expert resume writer. Create a fully optimized resume that is:
1. ATS-friendly (proper formatting, keywords)
2. Professionally written with power verbs
3. Achievement-focused with metrics
{f'4. Tailored to this job description: {job_description[:500]}' if job_description else '4. Generalized for broad appeal'}

Current resume structure: {sections.get('summary', '')[:200]}

Generate complete resume in plain text format (no markdown, just formatted text):"""

    response = await simple_chat_completion(prompt)
    
    match_percentage = 0
    if job_description:
        job_words = set(job_description.lower().split())
        resume_words = set(response.lower().split())
        match_percentage = int((len(job_words & resume_words) / len(job_words)) * 100) if job_words else 0
    
    return {
        "content": response[:2000],
        "is_tailored": bool(job_description),
        "job_matched_percentage": match_percentage
    }


# ─────────────────────────────────────────────────────────────────────
# MAIN UNIFIED ANALYSIS PIPELINE
# ─────────────────────────────────────────────────────────────────────

async def analyze_resume_comprehensive(
    resume_text: str,
    job_description: Optional[str] = None,
    name: str = "Professional"
) -> Dict[str, Any]:
    """
    Main unified analysis pipeline.
    Performs all 13 modules in a single flow.
    """
    
    # Extract sections
    sections = extract_text_sections(resume_text)
    
    # Extract skills
    skills = extract_skills_list(resume_text)
    
    # Module 1: Improved Summary
    improved_summary = await analyze_improved_summary(sections, skills)
    
    # Module 2: Enhanced Experience
    enhanced_experience = await analyze_enhanced_experience(sections)
    
    # Module 3: Skill Optimization
    skill_optimization = await analyze_skill_optimization(sections, skills)
    
    # Module 4: Multi-Dimensional Scores (synchronous)
    scores = await analyze_multi_dimensional_scores(resume_text, sections)
    
    # Module 5: Recruiter Simulation
    recruiter_simulation = await analyze_recruiter_simulation(resume_text, scores)
    
    # Module 6: Resume Breakdown
    resume_breakdown = await analyze_resume_breakdown(sections)
    
    # Module 7: Skill Intelligence
    skill_intelligence = await analyze_skill_intelligence(skills, resume_text)
    
    # Module 8: Career Insights
    career_insights = await analyze_career_insights(resume_text, skills)
    
    # Module 9: Risk Detection (synchronous)
    risk_detection = await analyze_risk_detection(resume_text, sections)
    
    # Module 10: Interview Questions
    interview_questions = await analyze_interview_questions(resume_text, skills)
    
    # Module 11: Personal Branding
    personal_branding = await analyze_personal_branding(sections, skills, name)
    
    # Module 12: Portfolio Content
    portfolio_content = await analyze_portfolio_content(sections, skills)
    
    # Module 13: Optimized Resume
    optimized_resume = await generate_optimized_resume(sections, {}, job_description)
    
    # Assemble complete response
    return {
        "improved_summary": improved_summary,
        "enhanced_experience": enhanced_experience,
        "skill_optimization": skill_optimization,
        "scores": scores,
        "recruiter_simulation": recruiter_simulation,
        "resume_breakdown": resume_breakdown,
        "skill_intelligence": skill_intelligence,
        "career_insights": career_insights,
        "risk_detection": risk_detection,
        "interview_questions": interview_questions,
        "personal_branding": personal_branding,
        "portfolio_content": portfolio_content,
        "optimized_resume": optimized_resume
    }
