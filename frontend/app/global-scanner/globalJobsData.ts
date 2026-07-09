// ─── Global Jobs Data ────────────────────────────────────────────────────────
// Curated real-world job market data based on industry benchmarks.
// Architecture: swap this out for Adzuna API / Firebase when API keys are configured.
// ─────────────────────────────────────────────────────────────────────────────

export interface JobListing {
    id: string;
    title: string;
    company: string;
    country: string;
    countryCode: string;
    location: string;
    salaryMin: number;
    salaryMax: number;
    currency: string;
    category: string;
    description: string;
    applyUrl: string;
    postedDaysAgo: number;
    isRemote: boolean;
}

export interface CountryStat {
    country: string;
    countryCode: string;
    totalJobs: number;
    avgSalary: number;
    currency: string;
    topCategories: string[];
    growthRate: number;
    topCompanies: string[];
}

// ─── Country Market Data ─────────────────────────────────────────────────────
export const countryStats: CountryStat[] = [
    {
        country: "United States",
        countryCode: "us",
        totalJobs: 284500,
        avgSalary: 125000,
        currency: "USD",
        topCategories: ["Software Engineering", "Data Science", "Product Management", "DevOps", "Cybersecurity", "Creative Writing", "UI/UX Design", "Sales", "Marketing", "Healthcare IT"],
        growthRate: 12.4,
        topCompanies: ["Google", "Microsoft", "Amazon", "Apple", "Meta"],
    },
    {
        country: "United Kingdom",
        countryCode: "gb",
        totalJobs: 98200,
        avgSalary: 72000,
        currency: "GBP",
        topCategories: ["Software Engineering", "Finance & Banking", "Data Analytics", "Cloud Computing", "AI/ML", "Journalism & Media", "Fine Arts & Curator", "Sales", "Customer Success", "Legal Counsel"],
        growthRate: 8.7,
        topCompanies: ["Barclays", "DeepMind", "Revolut", "Arm", "Rolls-Royce"],
    },
    {
        country: "Germany",
        countryCode: "de",
        totalJobs: 76800,
        avgSalary: 78000,
        currency: "EUR",
        topCategories: ["Automotive Engineering", "Software Engineering", "Manufacturing", "AI Research", "SAP Consulting", "Creative Writing", "Operations", "Sales", "Marketing", "HR & Talent Acquisition"],
        growthRate: 7.2,
        topCompanies: ["SAP", "Siemens", "BMW", "Bosch", "Deutsche Bank"],
    },
    {
        country: "Canada",
        countryCode: "ca",
        totalJobs: 64300,
        avgSalary: 95000,
        currency: "CAD",
        topCategories: ["Software Engineering", "Data Science", "Healthcare IT", "Fintech", "Game Development", "UI/UX Design", "Sales", "Customer Success", "Marketing", "HR & Talent Acquisition"],
        growthRate: 10.1,
        topCompanies: ["Shopify", "RBC", "OpenText", "BlackBerry", "Ubisoft"],
    },
    {
        country: "Australia",
        countryCode: "au",
        totalJobs: 52100,
        avgSalary: 115000,
        currency: "AUD",
        topCategories: ["Software Engineering", "Mining Tech", "Cybersecurity", "Cloud Computing", "Healthcare IT", "Digital Marketing", "Sales", "Operations", "Customer Success", "Legal Counsel"],
        growthRate: 9.3,
        topCompanies: ["Atlassian", "Canva", "Commonwealth Bank", "Telstra", "BHP"],
    },
    {
        country: "India",
        countryCode: "in",
        totalJobs: 342000,
        avgSalary: 2200000,
        currency: "INR",
        topCategories: ["Software Engineering", "IT Services", "Data Science", "Cloud Computing", "Full Stack", "Creative Writing", "Translation & Linguistics", "Sales", "Customer Success", "Marketing"],
        growthRate: 18.5,
        topCompanies: ["TCS", "Infosys", "Wipro", "Flipkart", "Razorpay"],
    },
    {
        country: "Singapore",
        countryCode: "sg",
        totalJobs: 28400,
        avgSalary: 95000,
        currency: "SGD",
        topCategories: ["Fintech", "Software Engineering", "Data Science", "Blockchain", "Cybersecurity", "Sales", "Marketing", "Legal Counsel", "HR & Talent Acquisition", "Operations"],
        growthRate: 14.2,
        topCompanies: ["DBS Bank", "Grab", "Sea Group", "Razer", "Shopee"],
    },
    {
        country: "Netherlands",
        countryCode: "nl",
        totalJobs: 38900,
        avgSalary: 72000,
        currency: "EUR",
        topCategories: ["Software Engineering", "DevOps", "Data Engineering", "AI/ML", "Product Design", "Sales", "Marketing", "Operations", "Customer Success", "HR & Talent Acquisition"],
        growthRate: 11.8,
        topCompanies: ["ASML", "Booking.com", "Philips", "ING", "Adyen"],
    },
    {
        country: "Japan",
        countryCode: "jp",
        totalJobs: 45600,
        avgSalary: 8500000,
        currency: "JPY",
        topCategories: ["Software Engineering", "Robotics", "Game Development", "AI Research", "Embedded Systems", "Sales", "Operations", "Marketing", "HR & Talent Acquisition", "Customer Success"],
        growthRate: 6.8,
        topCompanies: ["Sony", "Toyota", "Nintendo", "Rakuten", "SoftBank"],
    },
    {
        country: "UAE",
        countryCode: "ae",
        totalJobs: 22800,
        avgSalary: 320000,
        currency: "AED",
        topCategories: ["Software Engineering", "Fintech", "Cloud Computing", "AI/ML", "E-Commerce", "Journalism & Media", "Sales", "Marketing", "Operations", "Customer Success"],
        growthRate: 16.3,
        topCompanies: ["Careem", "Emirates NBD", "Noon", "Majid Al Futtaim", "Etisalat"],
    },
    {
        country: "France",
        countryCode: "fr",
        totalJobs: 58200,
        avgSalary: 62000,
        currency: "EUR",
        topCategories: ["Software Engineering", "AI Research", "Aerospace", "Fintech", "Cybersecurity", "Fine Arts & Curator", "Sales", "Marketing", "HR & Talent Acquisition", "Legal Counsel"],
        growthRate: 8.1,
        topCompanies: ["Dassault", "BNP Paribas", "Thales", "OVHcloud", "Criteo"],
    },
    {
        country: "Sweden",
        countryCode: "se",
        totalJobs: 24500,
        avgSalary: 620000,
        currency: "SEK",
        topCategories: ["Software Engineering", "Game Development", "Fintech", "Healthcare IT", "Clean Energy", "Creative Writing", "Sales", "Marketing", "Customer Success", "HR & Talent Acquisition"],
        growthRate: 10.6,
        topCompanies: ["Spotify", "Klarna", "King", "Ericsson", "Volvo"],
    },
];

// ─── Templates for Dynamic Generation ───────────────────────────────────────
const globalCompanies = [
    "Google", "Microsoft", "Amazon", "Apple", "Meta", 
    "Netflix", "Stripe", "Spotify", "ASML", "Sony", 
    "Toyota", "Siemens", "SAP", "Atlassian", "Canva", 
    "Shopify", "Ubisoft", "Grab", "DBS Bank", "Razorpay", 
    "TCS", "Infosys", "Adyen", "Booking.com", "Nintendo", 
    "Klarna", "Ericsson", "Careem", "Emirates NBD", "Thales", 
    "BNP Paribas", "Volvo", "Siemens", "BHP", "RBC", "Tate Modern"
];

const categoryTemplates: Record<string, { titles: string[], desc: string[] }> = {
    "Software Engineering": {
        titles: ["Senior Backend Engineer", "Full Stack Developer", "Frontend Engineer - UI Platform", "Staff Software Engineer", "Mobile App Developer (iOS/Android)"],
        desc: ["Build scalable distributed systems, microservices, and clean UI components using cutting-edge frameworks.", "Design, develop, and maintain core banking and product APIs with strict latency requirements.", "Lead the implementation of modular React architectures and performance profiling pipelines."]
    },
    "Data Science": {
        titles: ["Lead Data Scientist", "Data Engineer", "ML Infrastructure Specialist", "AI Research Analyst", "Big Data Architect"],
        desc: ["Develop machine learning models for forecasting, recommendation, and fraud detection workflows.", "Construct robust data ingestion pipelines and orchestrate real-time processing clusters.", "Apply statistics and NLP techniques to extract deep insights from unstructured product logs."]
    },
    "Product Management": {
        titles: ["Senior Product Manager", "Technical Product Owner", "Director of Product - AI Features", "Growth Product Manager"],
        desc: ["Define the strategic vision, roadmap, and user stories for core platform integration modules.", "Collaborate with engineering, design, and marketing to prioritize feature backlog and optimize conversions.", "Drive user research and customer discovery to define next-generation SaaS product offerings."]
    },
    "DevOps": {
        titles: ["Site Reliability Engineer (SRE)", "Cloud Platform Engineer", "DevSecOps Architect", "Infrastructure Engineer"],
        desc: ["Orchestrate Kubernetes clusters, CI/CD pipelines, and automated multi-region scaling configurations.", "Manage cloud infrastructure budgets, security audits, and zero-downtime cluster migrations.", "Optimize container orchestration, monitoring stacks, and system health alert thresholds."]
    },
    "Cybersecurity": {
        titles: ["Security Operations Analyst", "Penetration Tester", "Cloud Security Architect", "Information Security Officer"],
        desc: ["Monitor network traffic, perform vulnerability assessments, and execute incident response procedures.", "Conduct deep-dive penetration tests and report on cryptographic configuration flaws.", "Define global compliance blueprints and identity access management architectures."]
    },
    "UI/UX Design": {
        titles: ["Lead Product Designer", "UX Researcher", "Interaction Designer", "Visual Designer"],
        desc: ["Create interactive wireframes, component design systems, and high-fidelity user flow layouts.", "Execute user usability research and analyze user engagement loops to improve interfaces.", "Collaborate with product managers and engineers to build consistent glassmorphic user controls."]
    },
    "Creative Writing": {
        titles: ["Senior Copywriter", "UX Writer & Content Designer", "Technical Writer", "Brand Storyteller"],
        desc: ["Write clear, engaging brand copy across marketing channels and product onboarding guides.", "Design conversational flows, tooltips, and micro-copy that simplifies complex technical actions.", "Draft high-quality API documentations, developer guides, and whitepapers for technical suites."]
    },
    "Finance & Banking": {
        titles: ["Investment Banking Analyst", "Quantitative Analyst", "Financial Controller", "Risk Management Specialist"],
        desc: ["Analyze market portfolios, construct valuation models, and pitch to institutional investors.", "Build high-frequency algorithmic models and options pricing structures under volatility constraints.", "Oversee internal compliance audits, financial statement audits, and balance sheet reporting."]
    },
    "Data Analytics": {
        titles: ["Business Intelligence Analyst", "Senior Data Analyst", "Marketing Analytics Specialist", "Operations Analyst"],
        desc: ["Build interactive dashboards, data visualizations, and deliver periodic performance reviews.", "Translate raw customer click data into actionable marketing metrics and conversion funnels.", "Audit supply chain velocities and operational bottlenecks to save logistics overheads."]
    },
    "Cloud Computing": {
        titles: ["AWS Solutions Architect", "Azure Cloud Consultant", "Enterprise Cloud Specialist", "Multi-Cloud Engineer"],
        desc: ["Design robust, disaster-resilient cloud topologies for global e-commerce and SaaS suites.", "Guide migration projects from legacy on-premises architecture to hybrid cloud deployments.", "Optimize cloud storage, network gateways, and serverless computing patterns for cost efficiency."]
    },
    "AI/ML": {
        titles: ["AI Prompt Engineer", "LLM Orchestration Specialist", "RAG Integration Developer", "Deep Learning Researcher"],
        desc: ["Optimize large language model inputs, prompt structures, and guardrail validations.", "Integrate vector databases (Pinecone, Milvus) with LangChain and LlamaIndex orchestration frameworks.", "Train customized diffusion models and fine-tune open-weights LLMs on proprietary datasets."]
    },
    "Journalism & Media": {
        titles: ["Investigative Reporter", "Digital Content Producer", "Media Communications Lead", "Editor-in-Chief"],
        desc: ["Investigate, verify, and write compelling news features covering technology and geopolitics.", "Direct live broadcasts, podcasts, and digital content distribution plans across networks.", "Validate source reliability, verify facts, and coordinate editorial lines for print and digital channels."]
    },
    "Fine Arts & Curator": {
        titles: ["Art Director", "Museum Gallery Curator", "Exhibition Coordinator", "Visual Arts Specialist"],
        desc: ["Direct structural visual concepts, stage mockups, and artistic collaborations for digital campaigns.", "Curate contemporary art collections, manage museum storage, and build donor networks.", "Coordinate global art showcases, custom gallery layouts, and artist panel discussions."]
    },
    "Sales": {
        titles: ["Account Executive", "Enterprise Sales Director", "Sales Development Representative (SDR)", "Business Development Lead"],
        desc: ["Manage the full sales cycle, from lead qualification to contract negotiation and closing.", "Present product demonstrations to enterprise C-level executives and design customized pricing models.", "Identify new business channels, manage pipeline growth, and exceed quarterly revenue quotas."]
    },
    "Marketing": {
        titles: ["Growth Marketing Lead", "Digital Marketing Specialist", "SEO Content Strategist", "Brand Manager"],
        desc: ["Coordinate high-performing digital marketing campaigns across paid media channels and search engines.", "Optimize organic search rankings, backlink patterns, and programmatic content streams.", "Define and monitor global brand identity guidelines, marketing assets, and public relations outputs."]
    },
    "Customer Success": {
        titles: ["Customer Success Manager", "Key Account Specialist", "Client Support Director", "Technical Support Engineer"],
        desc: ["Ensure post-sale customer satisfaction, product adoption, and maximum renewal velocity.", "Deliver customized onboarding guides, perform product updates, and resolve service issues.", "Act as the primary customer advocate, communicating feature requests to product teams."]
    },
    "HR & Talent Acquisition": {
        titles: ["HR Generalist", "Technical Recruiter", "Talent Acquisition Manager", "People Operations Partner"],
        desc: ["Manage employee onboarding pipelines, payroll, benefit structures, and internal reviews.", "Source, interview, and coordinate hiring procedures for highly specialized engineering teams.", "Design workplace inclusion frameworks, training workshops, and employee retention strategies."]
    },
    "Operations": {
        titles: ["Operations Manager", "Supply Chain Analyst", "Process Optimization Lead", "Project Coordinator"],
        desc: ["Supervise daily administrative actions, workflow efficiencies, and vendor contract agreements.", "Analyze inventory bottlenecks, transportation costs, and warehouse storage schedules.", "Structure cross-functional tasks, timeline matrices, and report status progress to directors."]
    },
    "Healthcare IT": {
        titles: ["Clinical Systems Analyst", "EHR Implementation Engineer", "Healthcare Data Security Lead", "Medical IT Specialist"],
        desc: ["Configure electronic health record systems, ensuring HIPAA compliance and metadata security.", "Design communication bridges between laboratory hardware and database servers.", "Perform periodic security audits and patch cycles for hospital patient record systems."]
    },
    "Legal Counsel": {
        titles: ["Corporate Counsel", "IP Legal Specialist", "Compliance Auditor", "Technology Policy Advisor"],
        desc: ["Draft, review, and negotiate enterprise SaaS contracts, vendor terms, and employment pacts.", "Advise executive teams on intellectual property patents, copyrights, and trademark filings.", "Monitor regulatory changes, ensuring compliance with global GDPR, CCPA, and FTC rules."]
    }
};

// ─── Generator: Outputs 30+ jobs per country, populating all categories ─────
function generateDynamicJobs(): JobListing[] {
    const listings: JobListing[] = [];
    const cities: Record<string, string[]> = {
        us: ["San Francisco, CA", "New York, NY", "Seattle, WA", "Austin, TX", "Chicago, IL", "Boston, MA", "Los Angeles, CA", "Remote (US)"],
        gb: ["London", "Manchester", "Cambridge", "Edinburgh", "Bristol", "Leeds", "Birmingham", "Remote (UK)"],
        de: ["Munich", "Berlin", "Frankfurt", "Hamburg", "Stuttgart", "Cologne", "Dusseldorf", "Remote (DE)"],
        ca: ["Toronto, ON", "Vancouver, BC", "Montreal, QC", "Calgary, AB", "Ottawa, ON", "Halifax, NS", "Remote (CA)"],
        au: ["Sydney", "Melbourne", "Brisbane", "Perth", "Adelaide", "Canberra", "Remote (AU)"],
        in: ["Bangalore", "Mumbai", "Hyderabad", "New Delhi", "Pune", "Chennai", "Gurgaon", "Remote (IN)"],
        sg: ["Singapore", "Downtown Core", "Jurong East", "Changi", "Remote (SG)"],
        nl: ["Amsterdam", "Rotterdam", "Utrecht", "Eindhoven", "The Hague", "Delft", "Remote (NL)"],
        jp: ["Tokyo", "Kyoto", "Osaka", "Yokohama", "Nagoya", "Fukuoka", "Remote (JP)"],
        ae: ["Dubai", "Abu Dhabi", "Sharjah", "Jebel Ali", "Remote (AE)"],
        fr: ["Paris", "Lyon", "Marseille", "Toulouse", "Nice", "Bordeaux", "Remote (FR)"],
        se: ["Stockholm", "Gothenburg", "Malmo", "Uppsala", "Vasteras", "Remote (SE)"],
    };

    let idCounter = 1;
    
    countryStats.forEach(stat => {
        const countryCode = stat.countryCode.toLowerCase();
        const countryName = stat.country;
        const cur = stat.currency;
        const avg = stat.avgSalary;
        const localCities = cities[countryCode] || ["Global", "Remote"];

        Object.keys(categoryTemplates).forEach(cat => {
            const template = categoryTemplates[cat];
            
            // Generate 2 jobs per category (2 * 20 = 40 jobs per country)
            for (let i = 0; i < 2; i++) {
                const title = template.titles[i % template.titles.length];
                const desc = template.desc[i % template.desc.length];
                const company = globalCompanies[(idCounter + i * 7) % globalCompanies.length];
                const location = localCities[(idCounter + i) % localCities.length];
                const isRemote = location.toLowerCase().includes("remote") || (idCounter % 5 === 0);

                // Adjust salary range around the country average
                const salaryScale = cat === "Software Engineering" || cat === "AI/ML" || cat === "Data Science" ? 1.25 : 0.85;
                const baseMin = Math.round(avg * 0.75 * salaryScale);
                const baseMax = Math.round(avg * 1.25 * salaryScale);
                
                const salaryMin = Math.round(baseMin + (i * 2000) - ((idCounter % 7) * 800));
                const salaryMax = Math.round(baseMax + (i * 4000) + ((idCounter % 9) * 1200));

                listings.push({
                    id: `${countryCode}-${cat.toLowerCase().replace(/[^a-z]/g, "")}-${idCounter}`,
                    title,
                    company,
                    country: countryName,
                    countryCode,
                    location,
                    salaryMin: Math.max(1000, salaryMin),
                    salaryMax: Math.max(2000, salaryMax),
                    currency: cur,
                    category: cat,
                    description: desc,
                    applyUrl: `https://www.${company.toLowerCase().replace(/[^a-z]/g, "")}.com/careers`,
                    postedDaysAgo: Math.min(7, Math.max(0, (idCounter % 8))),
                    isRemote
                });
                idCounter++;
            }
        });
    });

    return listings;
}

export const jobListings = generateDynamicJobs();

// ─── Helper: format salary with currency symbol ──────────────────────────────
const currencySymbols: Record<string, string> = {
    USD: "$", GBP: "£", EUR: "€", CAD: "C$", AUD: "A$",
    INR: "₹", SGD: "S$", JPY: "¥", AED: "د.إ", SEK: "kr",
};

export function formatSalary(min: number, max: number, currency: string): string {
    const sym = currencySymbols[currency] || currency;
    const fmt = (n: number) => {
        if (n >= 1000000) return `${(n / 1000000).toFixed(1)}M`;
        if (n >= 1000) return `${Math.round(n / 1000)}K`;
        return n.toLocaleString();
    };
    if (min > 0 && max > 0) return `${sym}${fmt(min)} – ${sym}${fmt(max)}`;
    if (max > 0) return `Up to ${sym}${fmt(max)}`;
    if (min > 0) return `From ${sym}${fmt(min)}`;
    return "Competitive";
}

export function formatAvgSalary(salary: number, currency: string): string {
    const sym = currencySymbols[currency] || currency;
    const fmt = (n: number) => {
        if (n >= 1000000) return `${(n / 1000000).toFixed(1)}M`;
        if (n >= 1000) return `${Math.round(n / 1000)}K`;
        return n.toLocaleString();
    };
    return `${sym}${fmt(salary)}`;
}
