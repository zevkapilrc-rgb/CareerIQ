# 🏗️ Resume AI System - Architecture Visualizations

## Complete System Flow

```
┌────────────────────────────────────────────────────────────────────────────┐
│                          RESUME AI SYSTEM 1.0                             │
│                     Next-Generation Career Intelligence                    │
└────────────────────────────────────────────────────────────────────────────┘

╔═══════════════════════════════════════════════════════════════════════════╗
║                           STEP 1: USER INTERACTION                        ║
╚═══════════════════════════════════════════════════════════════════════════╝

        ┌─────────────────────────────────────────┐
        │   FRONTEND: ResumeAnalyzerPage          │
        ├─────────────────────────────────────────┤
        │                                         │
        │  📤 Upload Resume (drag-drop)           │
        │  │                                      │
        │  ├─ PDF, DOC, DOCX, TXT                 │
        │  ├─ Max 10MB                            │
        │  └─ File validation                     │
        │                                         │
        │  📝 Job Description (Optional)          │
        │  │                                      │
        │  ├─ For tailored analysis               │
        │  └─ Improves job matching               │
        │                                         │
        │  ⏳ Loading Animation                   │
        │  │                                      │
        │  ├─ "AI thinking..."                    │
        │  └─ Smooth transitions                  │
        │                                         │
        └─────────────────────────────────────────┘
                         ↓
                    🔄 HTTP POST
                         │
                    /api/resume/analyze
                    + job_description (optional)
                         │
                         ↓

╔═══════════════════════════════════════════════════════════════════════════╗
║                        STEP 2: BACKEND PROCESSING                         ║
╚═══════════════════════════════════════════════════════════════════════════╝

    ┌──────────────────────────────────────────────────┐
    │   BACKEND: FastAPI Endpoint                      │
    ├──────────────────────────────────────────────────┤
    │                                                  │
    │   1️⃣ File Reception & Validation               │
    │   │                                             │
    │   ├─ Check JWT token                            │
    │   ├─ Validate file type                         │
    │   ├─ Verify file size                           │
    │   └─ Decode to text                             │
    │                                                  │
    │   2️⃣ Text Extraction (resume_analyzer.py)      │
    │   │                                             │
    │   ├─ Extract sections                           │
    │   │  ├─ Summary                                 │
    │   │  ├─ Experience                              │
    │   │  ├─ Skills                                  │
    │   │  └─ Education                               │
    │   │                                             │
    │   └─ Detect metrics & keywords                  │
    │      ├─ Power verbs                             │
    │      ├─ Quantifiable achievements               │
    │      ├─ Employment gaps                         │
    │      └─ Skills list                             │
    │                                                  │
    └──────────────────────────────────────────────────┘
                         ↓
    ┌──────────────────────────────────────────────────────────────┐
    │   3️⃣ PARALLEL AI ANALYSIS (13 Modules Async)                │
    ├──────────────────────────────────────────────────────────────┤
    │                                                              │
    │   Module 1: Improved Summary       ──────┐                  │
    │   Module 2: Enhanced Experience   ──────┤                   │
    │   Module 3: Skill Optimization    ──────┤                   │
    │   Module 4: Multi-Dim Scores      ──────┼─→ ✓ Calculated   │
    │   Module 5: Recruiter Simulation  ──────┤                   │
    │   Module 6: Resume Breakdown      ──────┤                   │
    │   Module 7: Skill Intelligence    ──────┤                   │
    │   Module 8: Career Insights       ──────┤                   │
    │   Module 9: Risk Detection        ──────┼─→ ✓ Detected     │
    │   Module 10: Interview Questions  ──────┤                   │
    │   Module 11: Personal Branding    ──────┤                   │
    │   Module 12: Portfolio Content    ──────┤                   │
    │   Module 13: Optimized Resume     ──────┼─→ ✓ Generated    │
    │                                          ↑                   │
    │                                    AI Processing             │
    │                                    OpenAI API                │
    │                                                              │
    └──────────────────────────────────────────────────────────────┘
                         ↓
    ┌──────────────────────────────────────────────────────┐
    │   4️⃣ Response Assembly                              │
    ├──────────────────────────────────────────────────────┤
    │                                                      │
    │   {                                                 │
    │     "improved_summary": {...},                      │
    │     "enhanced_experience": {...},                   │
    │     "skill_optimization": {...},                    │
    │     "scores": {...},                                │
    │     "recruiter_simulation": {...},                  │
    │     "resume_breakdown": {...},                      │
    │     "skill_intelligence": {...},                    │
    │     "career_insights": {...},                       │
    │     "risk_detection": {...},                        │
    │     "interview_questions": {...},                   │
    │     "personal_branding": {...},                     │
    │     "portfolio_content": {...},                     │
    │     "optimized_resume": {...}                       │
    │   }                                                 │
    │                                                      │
    │   Status: 200 OK                                    │
    │   Size: ~50KB                                       │
    │   Time: ~25-30 seconds                              │
    │                                                      │
    └──────────────────────────────────────────────────────┘
                         ↓
                    🔄 HTTP 200
                    JSON Response
                         │
                         ↓

╔═══════════════════════════════════════════════════════════════════════════╗
║                     STEP 3: FRONTEND VISUALIZATION                        ║
╚═══════════════════════════════════════════════════════════════════════════╝

    ┌──────────────────────────────────────────────────────┐
    │   FRONTEND: Intelligence Dashboard                   │
    ├──────────────────────────────────────────────────────┤
    │                                                      │
    │   📊 HEADER: Next-Generation Resume Intelligence    │
    │                                                      │
    │   TAB NAVIGATION:                                    │
    │   ┌─────┬──────┬─────────┬──────┬──────┬──────┐    │
    │   │Scores│Recruiter│Breakdown│Skills│Career│...│    │
    │   └─────┴──────┴─────────┴──────┴──────┴──────┘    │
    │                                                      │
    │   ┌──────────────────────────────────────────────┐  │
    │   │ TAB 1: SCORES (Animated Cards)               │  │
    │   ├──────────────────────────────────────────────┤  │
    │   │ ┌──────────┐ ┌──────────┐ ┌──────────┐      │  │
    │   │ │   ATS    │ │ Recruiter│ │  Impact  │      │  │
    │   │ │    85    │ │    78    │ │    82    │      │  │
    │   │ │ /100     │ │ /100     │ │ /100     │      │  │
    │   │ └──────────┘ └──────────┘ └──────────┘      │  │
    │   │ ┌──────────┐ ┌──────────┐ ┌──────────┐      │  │
    │   │ │ Skill Dp │ │Consistency│ │ Overall  │      │  │
    │   │ │    75    │ │    80    │ │    80    │      │  │
    │   │ │ /100     │ │ /100     │ │ /100     │      │  │
    │   │ └──────────┘ └──────────┘ └──────────┘      │  │
    │   │                                              │  │
    │   │ Animation: Circular progress + reveal        │  │
    │   └──────────────────────────────────────────────┘  │
    │                                                      │
    │   ┌──────────────────────────────────────────────┐  │
    │   │ TAB 2: RECRUITER SIMULATION (6-Sec View)     │  │
    │   ├──────────────────────────────────────────────┤  │
    │   │                                              │  │
    │   │ "Strong technical background with clear      │  │
    │   │  measurable achievements."                   │  │
    │   │                                              │  │
    │   │ Shortlist Probability: 72%  🟢               │  │
    │   │                                              │  │
    │   │ ✓ Strengths:                                 │  │
    │   │  ├─ Clear technical skills                   │  │
    │   │  ├─ Multiple measurable impacts              │  │
    │   │  └─ Strong online presence                   │  │
    │   │                                              │  │
    │   │ ! Key Concerns:                              │  │
    │   │  ├─ Could strengthen soft skills             │  │
    │   │  └─ Add more leadership examples             │  │
    │   │                                              │  │
    │   └──────────────────────────────────────────────┘  │
    │                                                      │
    │   ┌──────────────────────────────────────────────┐  │
    │   │ TAB 3: RESUME BREAKDOWN (Expandable)         │  │
    │   ├──────────────────────────────────────────────┤  │
    │   │                                              │  │
    │   │ 📊 Generic Content: 25%                      │  │
    │   │ 📊 With Metrics: 75%                         │  │
    │   │ 📊 Improvement Potential: 85%                │  │
    │   │                                              │  │
    │   │ Bullet Analysis:                             │  │
    │   │ ┌─────────────────────────────────────┐     │  │
    │   │ │ ▼ Responsible for project mgmt     │     │  │
    │   │ │   Issues: Weak verb, No metrics    │     │  │
    │   │ │                                     │     │  │
    │   │ │   ✓ IMPROVED:                      │     │  │
    │   │ │   Led cross-functional team to     │     │  │
    │   │ │   deliver 3 projects 40% ahead     │     │  │
    │   │ │   of schedule                      │     │  │
    │   │ │                                     │     │  │
    │   │ │   Power Verb: Led                  │     │  │
    │   │ │   Metric Added: 40% ahead          │     │  │
    │   │ └─────────────────────────────────────┘     │  │
    │   │                                              │  │
    │   └──────────────────────────────────────────────┘  │
    │                                                      │
    │   ┌──────────────────────────────────────────────┐  │
    │   │ TAB 4-9: Additional Intelligence...          │  │
    │   │                                              │  │
    │   │ 4. SKILLS (Core/Weak/Missing/Future)        │  │
    │   │ 5. CAREER (Paths + Timeline)                 │  │
    │   │ 6. RISKS (Severity Indicator)                │  │
    │   │ 7. INTERVIEW (13 Q&A)                        │  │
    │   │ 8. BRANDING (LinkedIn + Bio)                 │  │
    │   │ 9. OPTIMIZED (Rewritten Resume)              │  │
    │   │                                              │  │
    │   └──────────────────────────────────────────────┘  │
    │                                                      │
    └──────────────────────────────────────────────────────┘
```

---

## Data Flow Diagram

```
┌─────────────────┐
│  Resume File    │ (PDF/DOC/DOCX/TXT)
└────────┬────────┘
         │
         ▼
┌─────────────────────────────────────────┐
│  API Gateway: /api/resume/analyze       │
│  ├─ Authentication (JWT)                │
│  ├─ File Validation                     │
│  └─ Content-Type Check                  │
└────────┬────────────────────────────────┘
         │
         ▼
┌─────────────────────────────────────────────────────────┐
│  Text Extraction Service                                │
│  ├─ Extract sections (Summary, Exp, Skills, Edu)       │
│  ├─ Parse into structured data                         │
│  └─ Create feature vectors                             │
└────────┬────────────────────────────────────────────────┘
         │
         ▼
╔═══════════════════════════════════════════════════════════════════════╗
║                    13 PARALLEL AI MODULES                             ║
╚═══════════════════════════════════════════════════════════════════════╝
│                                                                        │
│  INPUT: Extracted resume + Job description (optional)                 │
│                                                                        │
│  ┌──────────────────────────────────────────────────────────┐        │
│  │ ASYNC TASKS (Run in Parallel)                            │        │
│  │                                                          │        │
│  │ 1. Improved Summary          ─┐                         │        │
│  │ 2. Enhanced Experience       ─┤                         │        │
│  │ 3. Skill Optimization        ─┤                         │        │
│  │ 4. Multi-Dimensional Scores  ─├─→ await all()          │        │
│  │ 5. Recruiter Simulation      ─┤                         │        │
│  │ 6. Resume Breakdown          ─┤                         │        │
│  │ 7. Skill Intelligence        ─┤                         │        │
│  │ 8. Career Insights           ─┤                         │        │
│  │ 9. Risk Detection            ─┤                         │        │
│  │ 10. Interview Questions      ─┤                         │        │
│  │ 11. Personal Branding        ─┤                         │        │
│  │ 12. Portfolio Content        ─┤                         │        │
│  │ 13. Optimized Resume         ─┘                         │        │
│  │                                                          │        │
│  │ Total Time: ~25-30 seconds (parallelized)               │        │
│  │ OpenAI API Calls: ~10-15                                │        │
│  │ Tokens Used: ~5,000 total                               │        │
│  │                                                          │        │
│  └──────────────────────────────────────────────────────────┘        │
│                                                                        │
╚════════════════════════────┬───────────────────════════════════════════╝
                             │
                             ▼
                ┌────────────────────────────┐
                │  Result Assembly           │
                │  ├─ Combine all modules    │
                │  ├─ Validate schemas      │
                │  ├─ Add metadata          │
                │  └─ Format JSON           │
                └────────────┬───────────────┘
                             │
                             ▼
                ┌────────────────────────────────────┐
                │  Response (ResumeAnalysisResponse) │
                │  Status: 200 OK                    │
                │  Size: ~50KB                       │
                │  Content-Type: application/json    │
                └────────────┬───────────────────────┘
                             │
                             ▼
                ┌────────────────────────────┐
                │  Frontend Renderer         │
                │  ├─ Parse JSON             │
                │  ├─ Validate Data          │
                │  ├─ Load Components        │
                │  └─ Initialize Animations  │
                └────────────┬───────────────┘
                             │
                             ▼
                ┌────────────────────────────────────┐
                │  Intelligence Dashboard            │
                │  9 Interactive Tabs                │
                │  - Animated Score Cards            │
                │  - Interactive Visualizations      │
                │  - Expandable Sections             │
                │  - Responsive Design               │
                │  ✅ Ready for User Review          │
                └────────────────────────────────────┘
```

---

## Module Dependency Chain

```
┌──────────────────────────────────────┐
│  Resume Text Input                   │
│  (Extracted + Cleaned)               │
└────────┬─────────────────────────────┘
         │
         ├──→ Module 1: Improved Summary
         │    ├─ Analyze current summary
         │    ├─ Generate ATS-optimized
         │    ├─ Extract keywords
         │    └─ Score compliance (85%)
         │
         ├──→ Module 2: Enhanced Experience
         │    ├─ Parse bullet points
         │    ├─ Identify weak verbs
         │    ├─ Extract metrics
         │    ├─ Rewrite with power verbs
         │    └─ Calculate impact
         │
         ├──→ Module 3: Skill Optimization
         │    ├─ Detect current skills
         │    ├─ Map to industry standards
         │    ├─ Identify gaps
         │    └─ Suggest trending skills
         │
         ├──→ Module 4: Multi-Dimensional Scores ⭐
         │    ├─ Calculate ATS Score (85)
         │    ├─ Calculate Recruiter Score (78)
         │    ├─ Calculate Impact Score (82)
         │    ├─ Calculate Skill Depth (75)
         │    ├─ Calculate Consistency (80)
         │    └─ Calculate Overall (80)
         │
         ├──→ Module 5: Recruiter Simulation
         │    ├─ Simulate 6-second scan
         │    ├─ Extract key strengths
         │    ├─ Identify concerns
         │    └─ Calculate shortlist % (72%)
         │
         ├──→ Module 6: Resume Breakdown
         │    ├─ Analyze each bullet
         │    ├─ Identify issues
         │    ├─ Suggest improvements
         │    └─ Calculate genericity %
         │
         ├──→ Module 7: Skill Intelligence
         │    ├─ Categorize skills
         │    │  ├─ Core (5 items)
         │    │  ├─ Weak (2 items)
         │    │  ├─ Missing (3 items)
         │    │  └─ Future (4 items)
         │    └─ Calculate skill gap (35%)
         │
         ├──→ Module 8: Career Insights
         │    ├─ Calculate role alignment (82%)
         │    ├─ Suggest career paths
         │    ├─ Generate recommendations
         │    └─ Estimate timeline (18-24mo)
         │
         ├──→ Module 9: Risk Detection
         │    ├─ Check for generic content
         │    ├─ Detect skill mismatches
         │    ├─ Identify employment gaps
         │    ├─ Flag timeline issues
         │    └─ Set severity (Low/Med/High)
         │
         ├──→ Module 10: Interview Questions
         │    ├─ Generate 5 technical
         │    ├─ Generate 5 HR
         │    ├─ Generate 3 situational
         │    └─ Tailor to skills
         │
         ├──→ Module 11: Personal Branding
         │    ├─ Create LinkedIn headline
         │    ├─ Write short bio
         │    ├─ Craft tagline
         │    └─ Generate 30-sec pitch
         │
         ├──→ Module 12: Portfolio Content
         │    ├─ Generate hero text
         │    ├─ Write about section
         │    ├─ Create skills intro
         │    ├─ List portfolio projects
         │    └─ Write call-to-action
         │
         └──→ Module 13: Optimized Resume
              ├─ Rewrite entire resume
              ├─ Apply ATS best practices
              ├─ Tailor to job (if provided)
              └─ Calculate job match %
                     │
                     ▼
         ┌──────────────────────────────┐
         │  All Results Combined         │
         │  ResumeAnalysisResponse       │
         │  (13 Module Outputs)          │
         └──────────────────────────────┘
```

---

## Frontend Component Hierarchy

```
ResumeAnalyzerPage (Container)
├─ Upload UI
│  ├─ File Input
│  ├─ Job Description Textarea
│  ├─ Analyze Button
│  └─ Loading State
│
└─ ResumeIntelligenceDashboard (Main)
   ├─ Header
   ├─ Tab Navigation (9 tabs)
   │
   ├─ ScoreDashboard (Tab 1)
   │  └─ 6× ScoreCardComponent
   │     ├─ Circular Progress SVG
   │     ├─ Score Number
   │     └─ Description
   │
   ├─ RecruiterSimulationPanel (Tab 2)
   │  ├─ First Impression Text
   │  ├─ Shortlist Probability %
   │  ├─ Strengths List
   │  └─ Concerns List
   │
   ├─ ResumeBreakdown (Tab 3)
   │  ├─ Stats Cards (3)
   │  └─ ExpandableBullets
   │     ├─ Original Text
   │     ├─ Issues List
   │     ├─ Improved Text (on expand)
   │     ├─ Action Verb
   │     └─ Metric Added
   │
   ├─ SkillIntelligencePanel (Tab 4)
   │  ├─ Core Skills Badges
   │  ├─ Weak Skills Badges
   │  ├─ Missing Skills Badges
   │  ├─ Future Skills Badges
   │  └─ Skill Gap Progress Bar
   │
   ├─ CareerInsightsPanel (Tab 5)
   │  ├─ Role Alignment %
   │  ├─ Career Paths List
   │  ├─ Recommendations List
   │  └─ Timeline Text
   │
   ├─ RiskDetectionPanel (Tab 6)
   │  ├─ Severity Badge
   │  ├─ Risk Indicators (4)
   │  └─ Risk Items List
   │
   ├─ InterviewQuestionsPanel (Tab 7)
   │  ├─ Category Tabs (3)
   │  │  ├─ Technical
   │  │  ├─ HR
   │  │  └─ Situational
   │  └─ Question Cards (5+ each)
   │
   ├─ PersonalBrandingPanel (Tab 8)
   │  ├─ LinkedIn Headline
   │  ├─ Tagline
   │  ├─ Short Bio
   │  └─ Elevator Pitch
   │
   └─ OptimizedResume (Tab 9)
      ├─ Job Match Badge
      ├─ Resume Text (scrollable)
      └─ Download Button
```

---

## Scoring Algorithm Flow

```
Resume Input
    │
    ├─→ Extract Power Verbs
    │   ├─ Count hits
    │   └─ Max score: 100
    │
    ├─→ Extract Metrics
    │   ├─ Find %, $, numbers, users
    │   └─ Weight: 0.12
    │
    ├─→ Analyze Structure
    │   ├─ Find section headers
    │   ├─ Check formatting
    │   └─ Weight: 0.12
    │
    ├─→ Detect Skills
    │   ├─ Match known skills
    │   ├─ Count diversity
    │   └─ Weight: 0.18
    │
    ├─→ Check Experience
    │   ├─ Extract years
    │   └─ Weight: 0.15
    │
    ├─→ Verify Contact Info
    │   ├─ Email, phone, LinkedIn, GitHub
    │   └─ Weight: 0.06
    │
    ├─→ Assess Online Presence
    │   ├─ LinkedIn, GitHub, portfolio
    │   └─ Weight: 0.05
    │
    ├─→ Calculate Readability
    │   ├─ Word count (300-800)
    │   ├─ Sentence length
    │   └─ Weight: 0.05
    │
    └─→ Compute Final Score
        └─ Weighted sum of all factors
           = ATS Score (0-100)
```

---

## Timeline: Analysis Process

```
T+0.0s    User clicks "Analyze Resume"
T+0.5s    File upload complete
T+1.0s    Text extraction complete
T+1.5s    Text validation complete
T+2.0s    Feature detection complete
T+2.5s    ┌─────────────────────────────────────┐
          │ Parallel AI Calls Start              │
          │                                     │
T+5.0s    │ ├─ Module 1-3 AI (3s)               │
T+8.0s    │ ├─ Module 5, 7-13 AI (continuing)  │
T+15.0s   │ └─ All AI calls complete (~15s)    │
          └─────────────────────────────────────┘
T+16.0s   Result assembly
T+18.0s   Response sent to frontend
T+20.0s   Dashboard renders
T+25.0s   All animations complete
T+30.0s   ✅ Ready for user review

TOTAL TIME: ~25-30 seconds
```

---

This architecture is designed for:
- ✅ **Speed**: Parallel processing (all 13 modules simultaneously)
- ✅ **Scalability**: Async/await patterns
- ✅ **Maintainability**: Clear separation of concerns
- ✅ **Extensibility**: Easy to add new modules
- ✅ **Reliability**: Error handling & fallbacks
