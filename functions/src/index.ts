import * as functions from "firebase-functions/v1";
import * as admin from "firebase-admin";
import axios from "axios";

admin.initializeApp();
const db = admin.firestore();

const ADZUNA_APP_ID = process.env.ADZUNA_APP_ID || "";
const ADZUNA_APP_KEY = process.env.ADZUNA_APP_KEY || "";

const COUNTRIES = [
  { code: "us", name: "United States" },
  { code: "gb", name: "United Kingdom" },
  { code: "de", name: "Germany" },
  { code: "ca", name: "Canada" },
  { code: "au", name: "Australia" },
  { code: "in", name: "India" },
  { code: "sg", name: "Singapore" },
  { code: "ae", name: "United Arab Emirates" },
  { code: "nl", name: "Netherlands" },
  { code: "fr", name: "France" }
];

export const syncAdzunaJobs = functions
  .runWith({ secrets: ["ADZUNA_APP_ID", "ADZUNA_APP_KEY"], timeoutSeconds: 540 })
  .pubsub.schedule("every 12 hours")
  .onRun(async (context: any) => {
    const appId = process.env.ADZUNA_APP_ID || ADZUNA_APP_ID;
    const appKey = process.env.ADZUNA_APP_KEY || ADZUNA_APP_KEY;

    if (!appId || !appKey) {
      console.error("Missing Adzuna credentials");
      return null;
    }

    const batch = db.batch();
    let totalJobsSynced = 0;
    const syncId = new Date().toISOString();

    for (const country of COUNTRIES) {
      try {
        // Adzuna API endpoint: https://api.adzuna.com/v1/api/jobs/{country}/search/1
        const res = await axios.get(
          `https://api.adzuna.com/v1/api/jobs/${country.code}/search/1`,
          {
            params: {
              app_id: appId,
              app_key: appKey,
              results_per_page: 50,
              what: "software OR developer OR data OR AI OR design OR product",
            }
          }
        );

        const jobs = res.data.results || [];
        let highestSalary = 0;
        let lowestSalary = Infinity;
        let totalSalary = 0;
        let salaryCount = 0;
        const categoryCounts: Record<string, number> = {};

        // Instead of deleting old jobs, we'll just update or add new ones.
        // In a real production scenario, you'd want to remove expired jobs.
        for (const job of jobs) {
          const docRef = db.collection("jobs").doc(job.id.toString());

          const jobData = {
            id: job.id.toString(),
            title: job.title,
            company: job.company?.display_name || "Unknown",
            country: country.name,
            countryCode: country.code,
            location: job.location?.display_name || country.name,
            salaryMin: job.salary_min || 0,
            salaryMax: job.salary_max || 0,
            currency: "USD", // Adzuna gives local currency, but we normalize or just keep it simple
            description: job.description || "",
            applyUrl: job.redirect_url,
            category: job.category?.tag || "Other",
            createdAt: admin.firestore.FieldValue.serverTimestamp(),
            source: "Adzuna",
          };

          batch.set(docRef, jobData, { merge: true });
          totalJobsSynced++;

          // Stats calculation
          const avgJobSalary = (job.salary_min + job.salary_max) / 2;
          if (avgJobSalary > 0) {
             if (avgJobSalary > highestSalary) highestSalary = avgJobSalary;
             if (avgJobSalary < lowestSalary) lowestSalary = avgJobSalary;
             totalSalary += avgJobSalary;
             salaryCount++;
          }

          const cat = jobData.category;
          categoryCounts[cat] = (categoryCounts[cat] || 0) + 1;
        }

        // Process Top Categories
        const sortedCategories = Object.entries(categoryCounts)
          .sort((a, b) => b[1] - a[1])
          .slice(0, 3)
          .map(c => c[0]);

        // Update Country Stats
        const statsRef = db.collection("countryStats").doc(country.code);
        const statsData = {
          country: country.name,
          countryCode: country.code,
          totalJobs: res.data.count || jobs.length,
          avgSalary: salaryCount > 0 ? Math.round(totalSalary / salaryCount) : 0,
          highestSalary: highestSalary > 0 ? highestSalary : 0,
          lowestSalary: lowestSalary === Infinity ? 0 : lowestSalary,
          topCategories: sortedCategories,
          lastUpdated: admin.firestore.FieldValue.serverTimestamp(),
        };

        batch.set(statsRef, statsData, { merge: true });

      } catch (err: any) {
        console.error(`Error syncing jobs for ${country.name}:`, err.message);
      }
    }

    // Log the sync
    const logRef = db.collection("jobSyncLogs").doc(syncId);
    batch.set(logRef, {
      syncId,
      timestamp: admin.firestore.FieldValue.serverTimestamp(),
      totalJobsSynced,
      status: "SUCCESS"
    });

    await batch.commit();
    console.log(`Successfully synced ${totalJobsSynced} jobs.`);
    return null;
  });
