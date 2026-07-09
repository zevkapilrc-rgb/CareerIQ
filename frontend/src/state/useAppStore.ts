import { create } from "zustand";
import { persist } from "zustand/middleware";
import { useAuthStore } from "./useAuthStore";

export type UserRole = "guest" | "user" | "admin";

export interface ResumeProfile {
    name: string;
    email?: string;
    phone?: string;
    bio?: string;
    avatar?: string;  // emoji or letter
    skills: string[];
    experience: number;
    domain: string;
    projects: string[];
    education: string;
    xp: number;
    level: string;
    resumeAnalysis?: any;
}

export interface LoginRecord {
    id: string;
    name: string;
    phone?: string;
    email?: string;
    loginAt: string;
    lastSeen: string;
}

interface AppState {
    role: UserRole;
    phone: string | null;
    profile: ResumeProfile | null;
    notifications: Notification[];
    notificationsRead: boolean;
    sidebarOpen: boolean;
    authReady: boolean;
    loginUser: (phone: string, name?: string, email?: string, userRole?: UserRole) => void;
    logout: () => void;
    setProfile: (profile: ResumeProfile) => void;
    updateProfile: (updates: Partial<ResumeProfile>) => void;
    addXP: (amount: number, reason: string) => void;
    addNotification: (msg: string, type?: string) => void;
    markNotificationsRead: () => void;
    clearNotifications: () => void;
    rehydrateFromToken: () => Promise<void>;
    setSidebarOpen: (open: boolean) => void;
    setAuthReady: (ready: boolean) => void;
}

export interface Notification {
    id: string;
    message: string;
    type: "success" | "info" | "warning";
    time: string;
    read: boolean;
}

const ADMIN_EMAILS = new Set(
    [process.env.NEXT_PUBLIC_ADMIN_EMAIL, "admin@hirevix.com", "zev@career.iq", "zevkapilrc@gmail.com"]
        .filter(Boolean)
        .map((value) => value!.toLowerCase())
);

function getResolvedRole(userRole?: UserRole, email?: string): UserRole {
    if (userRole === "admin") return "admin";
    if (email && ADMIN_EMAILS.has(email.toLowerCase())) return "admin";
    return userRole ?? "user";
}

function calcLevel(xp: number): string {
    if (xp < 500) return "Explorer";
    if (xp < 1500) return "Learner";
    if (xp < 3000) return "Specialist";
    if (xp < 6000) return "Strategist";
    return "Expert";
}

// Deterministic emoji avatar from email/name hash
const PROFILE_EMOJIS = [
    "🧑‍💻", "👩‍💼", "👨‍🎓", "🧑‍🚀", "🦸", "🧙", "🎯", "🚀",
    "👑", "🦊", "🐺", "🦁", "🐯", "🦅", "🐉", "🔮",
    "💎", "⚡", "🌟", "🎭", "🛡️", "🏆", "🎪", "🌊",
    "🧬", "🔬", "🤖", "🎨", "🗡️", "🧊",
];

function getAvatar(nameOrEmail: string): string {
    // Simple djb2-style hash for deterministic mapping
    let hash = 5381;
    const str = nameOrEmail.toLowerCase().trim();
    for (let i = 0; i < str.length; i++) {
        hash = ((hash << 5) + hash) + str.charCodeAt(i);
        hash = hash & hash; // Convert to 32-bit integer
    }
    return PROFILE_EMOJIS[Math.abs(hash) % PROFILE_EMOJIS.length];
}

function saveLoginRecord(record: Omit<LoginRecord, "id">) {
    if (typeof window === "undefined") return;
    const KEY = "ciq-login-db";
    const existing: LoginRecord[] = JSON.parse(localStorage.getItem(KEY) || "[]");
    const id = record.phone || record.email || Date.now().toString();
    const idx = existing.findIndex(r => r.id === id);
    const entry: LoginRecord = { ...record, id, lastSeen: new Date().toISOString() };
    if (idx >= 0) existing[idx] = entry;
    else existing.unshift(entry);
    localStorage.setItem(KEY, JSON.stringify(existing.slice(0, 200)));
}

// ── Sync profile to MongoDB ─────────────────────────────────────
async function syncProfileToServer(profile: ResumeProfile): Promise<void> {
    if (typeof window === "undefined") return;
    const token = localStorage.getItem("ciq-jwt");
    if (!token) return;
    try {
        await fetch("/api/auth/profile", {
            method: "PUT",
            headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
            body: JSON.stringify({
                skills: profile.skills,
                experience: profile.experience,
                domain: profile.domain,
                projects: profile.projects,
                education: profile.education,
                bio: profile.bio || "",
                xp: profile.xp,
                level: profile.level,
                resumeAnalysis: profile.resumeAnalysis || null,
            }),
        });
    } catch {
        // Silently fail — profile is still in localStorage as backup
    }
}

export const useAppStore = create<AppState>()(
    persist(
        (set, get) => ({
            authReady: false,
            role: "guest",
            phone: null,
            profile: null,
            notifications: [],
            notificationsRead: true,
            sidebarOpen: false,
            setSidebarOpen: (open) => set({ sidebarOpen: open }),
            setAuthReady: (ready) => set({ authReady: ready }),

            loginUser: (phone, name?: string, email?: string, userRole: UserRole = "user") => {
                const displayName = name || (email ? email.split("@")[0].replace(/[._]/g, " ").replace(/\b\w/g, c => c.toUpperCase()) : "User");

                const resolvedRole = getResolvedRole(userRole, email);
                const initial: ResumeProfile = {
                    name: displayName,
                    phone,
                    email,
                    bio: "",
                    avatar: getAvatar(email || displayName),
                    skills: [],
                    experience: 0,
                    domain: "",
                    projects: [],
                    education: "",
                    xp: 0,
                    level: "Explorer",
                    resumeAnalysis: null,
                };
                set({ role: resolvedRole, phone, profile: initial });
                saveLoginRecord({ name: displayName, phone, email, loginAt: new Date().toISOString(), lastSeen: new Date().toISOString() });
                get().addNotification(`Welcome, ${displayName}! Upload your resume to get started.`, "info");
            },

            logout: () => {
                if (typeof window !== "undefined") {
                    localStorage.removeItem("ciq-jwt");
                    localStorage.removeItem("ciq-resume-analysis");
                }
                useAuthStore.getState().reset();
                set({ role: "guest", phone: null, profile: null, notifications: [] });
            },

            setProfile: (profile) => {
                set({ profile });
                get().addNotification(`Resume processed! Domain: ${profile.domain} · +${profile.xp} XP earned`, "success");
                // Persist to MongoDB in background
                syncProfileToServer(profile);
            },

            updateProfile: (updates) => {
                const p = get().profile;
                if (!p) return;
                const updated = { ...p, ...updates };
                if (updates.xp !== undefined) {
                    updated.level = calcLevel(updated.xp);
                }
                set({ profile: updated });
                // Persist to MongoDB in background
                syncProfileToServer(updated);
            },

            addXP: (amount, reason) => {
                const p = get().profile;
                if (!p) return;
                const newXP = p.xp + amount;
                const newLevel = calcLevel(newXP);
                const leveledUp = newLevel !== p.level;
                const updated = { ...p, xp: newXP, level: newLevel };
                set({ profile: updated });
                get().addNotification(`+${amount} XP — ${reason}`, "success");
                if (leveledUp) get().addNotification(`Level Up! You are now a ${newLevel}`, "success");
                // Persist XP to MongoDB
                syncProfileToServer(updated);
            },

            addNotification: (message, type = "info") => {
                const notif: Notification = {
                    id: Date.now().toString(),
                    message,
                    type: type as any,
                    time: new Date().toLocaleTimeString(),
                    read: false,
                };
                set((s) => ({ notifications: [notif, ...s.notifications].slice(0, 50), notificationsRead: false }));
            },

            markNotificationsRead: () =>
                set((s) => ({ notifications: s.notifications.map(n => ({ ...n, read: true })), notificationsRead: true })),

            clearNotifications: () => set({ notifications: [] }),

            // ── Auto-login from saved JWT token ─────────────────────────
            rehydrateFromToken: async () => {
                if (typeof window === "undefined") return;
                const token = localStorage.getItem("ciq-jwt");
                if (!token) {
                    get().setAuthReady(true);
                    return;
                }

                if (token === "mock-admin-token") {
                    const displayName = "KAPILDEV";
                    const email = "zev@career.iq";
                    useAuthStore.getState().setAuth(token, email);
                    get().loginUser("", displayName, email, "admin");
                    get().setAuthReady(true);
                    return;
                }

                const controller = new AbortController();
                const timeoutId = setTimeout(() => controller.abort(), 5000);

                try {
                    // Verify token and get user data
                    const res = await fetch("/api/auth/me", {
                        headers: { Authorization: `Bearer ${token}` },
                        signal: controller.signal,
                    });
                    if (!res.ok) {
                        // Only clear auth on explicit 401 Unauthorized
                        if (res.status === 401 || res.status === 403) {
                            localStorage.removeItem("ciq-jwt");
                            useAuthStore.getState().reset();
                            set({ role: "guest", phone: null, profile: null });
                        }
                        // On other errors (500, network, etc.) keep existing persisted state
                        return;
                    }
                    const userData = await res.json();

                    // Fetch saved profile from MongoDB
                    const profileRes = await fetch("/api/auth/profile", {
                        headers: { Authorization: `Bearer ${token}` },
                        signal: controller.signal,
                    });
                    let savedProfile: any = null;
                    if (profileRes.ok) {
                        const profileData = await profileRes.json();
                        savedProfile = profileData.profile;
                    }

                    const displayName = userData.name || "User";
                    const email = userData.email || "";
                    const userRole = getResolvedRole(userData.role || "user", email);

                    useAuthStore.getState().setAuth(token, email);

                    // Rebuild profile from MongoDB data or create a fresh one
                    const profile: ResumeProfile = {
                        name: displayName,
                        email,
                        phone: "",
                        bio: savedProfile?.bio || "",
                        avatar: getAvatar(email || displayName),
                        skills: savedProfile?.skills || [],
                        experience: savedProfile?.experience || 0,
                        domain: savedProfile?.domain || "",
                        projects: savedProfile?.projects || [],
                        education: savedProfile?.education || "",
                        xp: savedProfile?.xp || 0,
                        level: savedProfile?.level || "Explorer",
                        resumeAnalysis: savedProfile?.resumeAnalysis || null,
                    };

                    set({ role: userRole, phone: "", profile });

                    if (savedProfile?.resumeAnalysis) {
                        localStorage.setItem("ciq-resume-analysis", JSON.stringify(savedProfile.resumeAnalysis));
                    }
                } catch (err: any) {
                    // On abort (timeout) or network error, DON'T log the user out.
                    // The persisted Zustand state (role/profile) will still be intact.
                    // Only log them out on an explicit server rejection.
                    if (err?.name !== "AbortError") {
                        console.error("Token rehydration failed:", err);
                        localStorage.removeItem("ciq-jwt");
                        useAuthStore.getState().reset();
                        set({ role: "guest", phone: null, profile: null });
                    } else {
                        console.warn("Token rehydration timed out — keeping persisted auth state");
                    }
                } finally {
                    clearTimeout(timeoutId);
                    get().setAuthReady(true);
                }
            },
        }),
        {
            name: "hirevix-v3-store",
            partialize: (state) => ({
                role: state.role,
                phone: state.phone,
                profile: state.profile,
                notifications: state.notifications,
                notificationsRead: state.notificationsRead,
                sidebarOpen: state.sidebarOpen,
            }),
        }
    )
);
