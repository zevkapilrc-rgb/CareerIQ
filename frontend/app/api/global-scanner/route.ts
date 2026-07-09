import { NextResponse } from 'next/server';
import { countryStats as fallbackCountryStats, jobListings as fallbackJobListings, type JobListing, type CountryStat } from "@/app/global-scanner/globalJobsData";

export const dynamic = "force-dynamic";

// In-memory cache to stay safe from Adzuna rate limits (25 requests/min)
interface CacheStore {
  [queryKey: string]: {
    timestamp: number;
    data: {
      countryStats: CountryStat[];
      jobListings: JobListing[];
    };
  }
}

let adzunaCache = (global as any).adzunaCache as CacheStore;
if (!adzunaCache) {
  adzunaCache = (global as any).adzunaCache = {};
}

const CACHE_TTL = 15 * 60 * 1000; // 15 minutes cache TTL

const countryNames: Record<string, string> = {
  us: "United States",
  gb: "United Kingdom",
  de: "Germany",
  ca: "Canada",
  au: "Australia",
  in: "India",
  sg: "Singapore",
  nl: "Netherlands",
  fr: "France",
  jp: "Japan",
  ae: "UAE",
  se: "Sweden"
};

const countryCurrencies: Record<string, string> = {
  us: "USD",
  gb: "GBP",
  de: "EUR",
  ca: "CAD",
  au: "AUD",
  in: "INR",
  sg: "SGD",
  nl: "EUR",
  fr: "EUR",
  jp: "JPY",
  ae: "AED",
  se: "SEK"
};

function cleanHtmlTags(str: string): string {
  if (!str) return "";
  return str.replace(/<\/?[^>]+(>|$)/g, "").trim();
}

function mapToCategory(title: string, desc: string, allowedCategories: string[]): string {
  const t = (title + " " + desc).toLowerCase();
  if (t.includes("data science") || t.includes("data scientist") || t.includes("machine learning") || t.includes(" ml ") || t.includes(" ai ") || t.includes("artificial intelligence")) {
    const match = allowedCategories.find(c => c.includes("Data Science") || c.includes("AI") || c.includes("Machine Learning"));
    if (match) return match;
  }
  if (t.includes("devops") || t.includes("site reliability") || t.includes("sre") || t.includes("cloud engineer") || t.includes("aws") || t.includes("kubernetes")) {
    const match = allowedCategories.find(c => c.includes("DevOps") || c.includes("Cloud"));
    if (match) return match;
  }
  if (t.includes("cybersecurity") || t.includes("security") || t.includes("penetration") || t.includes("secops")) {
    const match = allowedCategories.find(c => c.includes("Cybersecurity") || c.includes("Security"));
    if (match) return match;
  }
  if (t.includes("product manager") || t.includes("product management") || t.includes("product owner")) {
    const match = allowedCategories.find(c => c.includes("Product"));
    if (match) return match;
  }
  if (t.includes("design") || t.includes("ui") || t.includes("ux") || t.includes("frontend") || t.includes("front-end")) {
    const match = allowedCategories.find(c => c.includes("Design") || c.includes("UI") || c.includes("UX") || c.includes("Software Engineering"));
    if (match) return match;
  }
  return allowedCategories[0] || "Software Engineering";
}

function mapAdzunaJob(job: any, countryCode: string, query: string): JobListing {
  const title = job.title || "";
  const desc = job.description || "";
  const locationName = job.location?.display_name || "";
  const t = (title + " " + desc + " " + locationName).toLowerCase();
  const isRemote = t.includes("remote") || t.includes("wfh") || t.includes("work from home") || t.includes("telecommute");

  const stat = fallbackCountryStats.find(s => s.countryCode === countryCode);
  const allowedCategories = stat?.topCategories || ["Software Engineering"];
  const category = mapToCategory(title, desc, allowedCategories);

  let salaryMin = job.salary_min ? Math.round(job.salary_min) : 0;
  let salaryMax = job.salary_max ? Math.round(job.salary_max) : 0;

  const avgSal = stat?.avgSalary || 80000;
  if (!salaryMin && !salaryMax) {
    salaryMin = Math.round(avgSal * 0.85 + (Math.random() - 0.5) * 10000);
    salaryMax = Math.round(avgSal * 1.25 + (Math.random() - 0.5) * 15000);
  } else if (!salaryMin) {
    salaryMin = Math.round(salaryMax * 0.7);
  } else if (!salaryMax) {
    salaryMax = Math.round(salaryMin * 1.4);
  }

  let postedDaysAgo = 2;
  if (job.created) {
    try {
      const createdDate = new Date(job.created);
      const diffTime = Math.abs(Date.now() - createdDate.getTime());
      const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));
      postedDaysAgo = Math.min(Math.max(0, diffDays), 7);
    } catch (e) {
      // Ignore
    }
  }

  return {
    id: `adzuna-${countryCode}-${job.id || Math.random().toString(36).substr(2, 9)}`,
    title: cleanHtmlTags(title),
    company: cleanHtmlTags(job.company?.display_name || "Confidential Hiring"),
    country: countryNames[countryCode] || stat?.country || "Global",
    countryCode,
    location: cleanHtmlTags(locationName || stat?.country || "Remote"),
    salaryMin,
    salaryMax,
    currency: countryCurrencies[countryCode] || stat?.currency || "USD",
    category,
    description: cleanHtmlTags(desc).substring(0, 200) + (desc.length > 200 ? "..." : ""),
    applyUrl: job.redirect_url || "https://adzuna.com",
    postedDaysAgo,
    isRemote
  };
}

async function fetchJobsForCountry(countryCode: string, query: string, appId: string, appKey: string, resultsPerPage: number): Promise<{ count: number; jobs: any[] }> {
  const url = `https://api.adzuna.com/v1/api/jobs/${countryCode}/search/1?app_id=${appId}&app_key=${appKey}&what=${encodeURIComponent(query)}&results_per_page=${resultsPerPage}&content-type=application/json`;

  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), 2500);

  try {
    const res = await fetch(url, {
      signal: controller.signal,
      headers: {
        "Accept": "application/json"
      },
      next: { revalidate: 0 }
    });
    clearTimeout(timeoutId);

    if (!res.ok) {
      console.warn(`[Adzuna] Fetch failed for ${countryCode}: HTTP ${res.status}`);
      return { count: 0, jobs: [] };
    }

    const data = await res.json();
    return {
      count: typeof data.count === "number" ? data.count : 0,
      jobs: Array.isArray(data.results) ? data.results : []
    };
  } catch (err: any) {
    clearTimeout(timeoutId);
    console.warn(`[Adzuna] Fetch error or timeout for ${countryCode}:`, err.message || err);
    return { count: 0, jobs: [] };
  }
}

async function fetchJSearchJobsForCountry(countryCode: string, query: string, apiKey: string): Promise<any[]> {
  const countryName = countryNames[countryCode] || countryCode;
  const fullQuery = `${query} in ${countryName}`;
  const url = `https://jsearch.p.rapidapi.com/search?query=${encodeURIComponent(fullQuery)}&page=1&num_pages=1`;

  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), 4000);

  try {
    const res = await fetch(url, {
      signal: controller.signal,
      headers: {
        "x-rapidapi-key": apiKey,
        "x-rapidapi-host": "jsearch.p.rapidapi.com",
        "Accept": "application/json"
      },
      next: { revalidate: 0 }
    });
    clearTimeout(timeoutId);

    if (!res.ok) {
      console.warn(`[JSearch] Fetch failed for ${countryCode}: HTTP ${res.status}`);
      return [];
    }

    const data = await res.json();
    return Array.isArray(data.data) ? data.data : [];
  } catch (err: any) {
    clearTimeout(timeoutId);
    console.warn(`[JSearch] Fetch error or timeout for ${countryCode}:`, err.message || err);
    return [];
  }
}

function mapJSearchJob(job: any, countryCode: string, query: string): JobListing {
  const title = job.job_title || "";
  const desc = job.job_description || "";
  const company = job.employer_name || "Confidential Hiring";
  const location = [job.job_city, job.job_state, job.job_country].filter(Boolean).join(", ");

  const stat = fallbackCountryStats.find(s => s.countryCode === countryCode);
  const allowedCategories = stat?.topCategories || ["Software Engineering"];
  const category = mapToCategory(title, desc, allowedCategories);

  let salaryMin = job.job_min_salary ? Math.round(Number(job.job_min_salary)) : 0;
  let salaryMax = job.job_max_salary ? Math.round(Number(job.job_max_salary)) : 0;

  const avgSal = stat?.avgSalary || 80000;
  if (!salaryMin && !salaryMax) {
    salaryMin = Math.round(avgSal * 0.85 + (Math.random() - 0.5) * 10000);
    salaryMax = Math.round(avgSal * 1.25 + (Math.random() - 0.5) * 15000);
  } else if (!salaryMin) {
    salaryMin = Math.round(salaryMax * 0.7);
  } else if (!salaryMax) {
    salaryMax = Math.round(salaryMin * 1.4);
  }

  let postedDaysAgo = 3;
  if (job.job_posted_at_timestamp) {
    try {
      const diffTime = Math.abs(Date.now() - (Number(job.job_posted_at_timestamp) * 1000));
      postedDaysAgo = Math.min(Math.max(0, Math.floor(diffTime / (1000 * 60 * 60 * 24))), 7);
    } catch (e) {
      // Ignore
    }
  }

  return {
    id: `jsearch-${countryCode}-${job.job_id || Math.random().toString(36).substr(2, 9)}`,
    title: cleanHtmlTags(title),
    company: cleanHtmlTags(company),
    country: countryNames[countryCode] || stat?.country || "Global",
    countryCode,
    location: cleanHtmlTags(location || stat?.country || "Remote"),
    salaryMin,
    salaryMax,
    currency: job.job_salary_currency || countryCurrencies[countryCode] || "USD",
    category,
    description: cleanHtmlTags(desc).substring(0, 200) + (desc.length > 200 ? "..." : ""),
    applyUrl: job.job_apply_link || "https://google.com/search?q=" + encodeURIComponent(title + " job"),
    postedDaysAgo,
    isRemote: !!job.job_is_remote
  };
}

export async function POST(request: Request) {
  try {
    const body = await request.json().catch(() => ({}));
    const { skills = [], domain = "Software Engineering", resumeUploaded = false, resumeAnalysis = null } = body;

    const query = domain || (skills.length > 0 ? skills.join(" ") : "Software Engineering");
    const cacheKey = `${query.trim().toLowerCase()}::resume=${resumeUploaded ? "1" : "0"}`;

    // 1. Check in-memory cache
    const now = Date.now();
    if (adzunaCache[cacheKey] && (now - adzunaCache[cacheKey].timestamp < CACHE_TTL)) {
      console.log(`[Cache] Serving cached jobs for: ${cacheKey}`);
      return NextResponse.json({
        success: true,
        data: adzunaCache[cacheKey].data
      });
    }

    // 2. Fetch from Adzuna or JSearch if configs exist
    const appId = process.env.APPLICATION_ID;
    const appKey = process.env.APPLICATION_KEY;
    const jsearchApiKey = process.env.JSEARCH_ID || process.env.JSEARCH_KEY || process.env.JSEARCH_API_KEY || process.env.RAPIDAPI_KEY;

    if (!appId && !appKey && !jsearchApiKey) {
      console.warn("[Job API] Neither Adzuna nor JSearch credentials defined inside env. Serving curated mock listings.");
      return NextResponse.json({
        success: true,
        data: {
          countryStats: fallbackCountryStats,
          jobListings: fallbackJobListings
        }
      });
    }

    const supportedCountries = ['us', 'gb', 'in', 'ca', 'de', 'au', 'sg', 'nl', 'fr'];
    const resultsPerPage = 25;
    console.log(`[Job API] Fetching live jobs from Adzuna/JSearch for query: "${query}"...`);

    const fetchPromises = supportedCountries.map(async (code) => {
      let adzunaJobs: any[] = [];
      let adzunaCount = 0;
      let jsearchJobs: any[] = [];

      if (appId && appKey) {
        const adzResult = await fetchJobsForCountry(code, query, appId, appKey, resultsPerPage);
        adzunaJobs = adzResult.jobs;
        adzunaCount = adzResult.count;
      }

      if (jsearchApiKey) {
        jsearchJobs = await fetchJSearchJobsForCountry(code, query, jsearchApiKey);
      }

      return { code, adzunaJobs, adzunaCount, jsearchJobs };
    });

    const results = await Promise.all(fetchPromises);

    const finalJobListings: JobListing[] = [];
    const finalCountryStats = fallbackCountryStats.map(stat => {
      const countryCode = stat.countryCode.toLowerCase();
      const countryRes = results.find(r => r.code === countryCode);

      if (countryRes && (countryRes.adzunaJobs.length > 0 || countryRes.jsearchJobs.length > 0)) {
        const adzMapped = countryRes.adzunaJobs.map(job => mapAdzunaJob(job, countryCode, query));
        const jsearchMapped = countryRes.jsearchJobs.map(job => mapJSearchJob(job, countryCode, query));
        
        finalJobListings.push(...adzMapped, ...jsearchMapped);
        
        return {
          ...stat,
          totalJobs: (countryRes.adzunaCount || adzMapped.length + jsearchMapped.length) || stat.totalJobs
        };
      } else {
        const fallbackJobs = fallbackJobListings.filter(j => j.countryCode.toLowerCase() === countryCode);
        finalJobListings.push(...fallbackJobs);
        return stat;
      }
    });

    // Rank by overlap between resumeAnalysis skills (if available) and job details if resumeUploaded
    if (resumeUploaded) {
      let resumeSkills: string[] = [];
      if (Array.isArray(resumeAnalysis?.skill_intelligence?.core_skills)) {
        resumeSkills = resumeAnalysis.skill_intelligence.core_skills;
      } else if (Array.isArray(resumeAnalysis?.skills)) {
        resumeSkills = resumeAnalysis.skills;
      }

      const normalized = resumeSkills
        .filter(Boolean)
        .map((s: string) => s.toLowerCase().trim());

      if (normalized.length > 0) {
        const scoreJob = (j: JobListing) => {
          const text = `${j.title} ${j.description} ${j.category}`.toLowerCase();
          let score = 0;
          for (const sk of normalized) {
            if (sk.length < 3) continue;
            if (text.includes(sk)) score += 5;
            if (sk.endsWith("s") && text.includes(sk.slice(0, -1))) score += 2;
          }
          return score;
        };

        finalJobListings.sort((a, b) => scoreJob(b) - scoreJob(a));
      }
    }

    const responseData = {
      countryStats: finalCountryStats,
      jobListings: finalJobListings
    };

    // Store in cache
    adzunaCache[cacheKey] = {
      timestamp: now,
      data: responseData
    };

    return NextResponse.json({ success: true, data: responseData });
  } catch (error: any) {
    console.error("Global Scanner API Error:", error);
    return NextResponse.json({
      success: true,
      data: {
        countryStats: fallbackCountryStats,
        jobListings: fallbackJobListings
      }
    });
  }
}
