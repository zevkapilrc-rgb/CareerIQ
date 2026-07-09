"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.syncAdzunaJobs = void 0;
const functions = __importStar(require("firebase-functions"));
const admin = __importStar(require("firebase-admin"));
const axios_1 = __importDefault(require("axios"));
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
exports.syncAdzunaJobs = functions
    .runWith({ secrets: ["ADZUNA_APP_ID", "ADZUNA_APP_KEY"], timeoutSeconds: 540 })
    .pubsub.schedule("every 12 hours")
    .onRun(async (context) => {
    var _a, _b, _c;
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
            const res = await axios_1.default.get(`https://api.adzuna.com/v1/api/jobs/${country.code}/search/1`, {
                params: {
                    app_id: appId,
                    app_key: appKey,
                    results_per_page: 50,
                    what: "software OR developer OR data OR AI OR design OR product",
                }
            });
            const jobs = res.data.results || [];
            let highestSalary = 0;
            let lowestSalary = Infinity;
            let totalSalary = 0;
            let salaryCount = 0;
            const categoryCounts = {};
            // Instead of deleting old jobs, we'll just update or add new ones.
            // In a real production scenario, you'd want to remove expired jobs.
            for (const job of jobs) {
                const docRef = db.collection("jobs").doc(job.id.toString());
                const jobData = {
                    id: job.id.toString(),
                    title: job.title,
                    company: ((_a = job.company) === null || _a === void 0 ? void 0 : _a.display_name) || "Unknown",
                    country: country.name,
                    countryCode: country.code,
                    location: ((_b = job.location) === null || _b === void 0 ? void 0 : _b.display_name) || country.name,
                    salaryMin: job.salary_min || 0,
                    salaryMax: job.salary_max || 0,
                    currency: "USD", // Adzuna gives local currency, but we normalize or just keep it simple
                    description: job.description || "",
                    applyUrl: job.redirect_url,
                    category: ((_c = job.category) === null || _c === void 0 ? void 0 : _c.tag) || "Other",
                    createdAt: admin.firestore.FieldValue.serverTimestamp(),
                    source: "Adzuna",
                };
                batch.set(docRef, jobData, { merge: true });
                totalJobsSynced++;
                // Stats calculation
                const avgJobSalary = (job.salary_min + job.salary_max) / 2;
                if (avgJobSalary > 0) {
                    if (avgJobSalary > highestSalary)
                        highestSalary = avgJobSalary;
                    if (avgJobSalary < lowestSalary)
                        lowestSalary = avgJobSalary;
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
        }
        catch (err) {
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
//# sourceMappingURL=index.js.map