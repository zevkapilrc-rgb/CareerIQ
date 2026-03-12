import { create } from "zustand";
import { persist } from "zustand/middleware";

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
    // Actions
    loginUser: (phone: string, name?: string, email?: string) => void;
    loginAdmin: () => void;
    logout: () => void;
    setProfile: (profile: ResumeProfile) => void;
    updateProfile: (updates: Partial<ResumeProfile>) => void;
    addXP: (amount: number, reason: string) => void;
    addNotification: (msg: string, type?: string) => void;
    markNotificationsRead: () => void;
    clearNotifications: () => void;
}

export interface Notification {
    id: string;
    message: string;
    type: "success" | "info" | "warning";
    time: string;
    read: boolean;
}

function calcLevel(xp: number): string {
    if (xp < 500) return "Explorer";
    if (xp < 1500) return "Learner";
    if (xp < 3000) return "Specialist";
    if (xp < 6000) return "Strategist";
    return "Expert";
}

function getAvatar(name: string): string {
    const emojis = ["🧑", "👩", "🧑‍💻", "👨‍🎓", "👩‍💼", "🧑‍🚀"];
    return emojis[name.charCodeAt(0) % emojis.length];
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

export const useAppStore = create<AppState>()(
    persist(
        (set, get) => ({
            role: "guest",
            phone: null,
            profile: null,
            notifications: [],
            notificationsRead: true,

            loginUser: (phone, name?: string, email?: string) => {
                const displayName = name || (email ? email.split("@")[0].replace(/[._]/g, " ").replace(/\b\w/g, c => c.toUpperCase()) : "User");
                const initial: ResumeProfile = {
                    name: displayName,
                    phone,
                    email,
                    bio: "",
                    avatar: getAvatar(displayName),
                    skills: [],
                    experience: 0,
                    domain: "",
                    projects: [],
                    education: "",
                    xp: 0,
                    level: "Explorer",
                };
                set({ role: "user", phone, profile: initial });
                saveLoginRecord({ name: displayName, phone, email, loginAt: new Date().toISOString(), lastSeen: new Date().toISOString() });
                get().addNotification(`Welcome, ${displayName}! Upload your resume to get started.`, "info");
            },

            loginAdmin: () => {
                const adminProfile: ResumeProfile = {
                    name: "KAPILDEV",
                    phone: "9360097924",
                    avatar: "👑",
                    skills: ["Platform Management", "AI Strategy", "Analytics"],
                    experience: 5,
                    domain: "AI & Data Science",
                    projects: ["CareerIQ Platform"],
                    education: "Artificial Intelligence & Data Science",
                    xp: 9999,
                    level: "Expert",
                };
                set({ role: "admin", phone: "9360097924", profile: adminProfile });
            },

            logout: () => set({ role: "guest", phone: null, profile: null, notifications: [] }),

            setProfile: (profile) => {
                set({ profile });
                get().addNotification(`Resume processed! Domain: ${profile.domain} · +${profile.xp} XP earned`, "success");
            },

            updateProfile: (updates) => {
                const p = get().profile;
                if (!p) return;
                set({ profile: { ...p, ...updates } });
            },

            addXP: (amount, reason) => {
                const p = get().profile;
                if (!p) return;
                const newXP = p.xp + amount;
                const newLevel = calcLevel(newXP);
                const leveledUp = newLevel !== p.level;
                set({ profile: { ...p, xp: newXP, level: newLevel } });
                get().addNotification(`+${amount} XP — ${reason}`, "success");
                if (leveledUp) get().addNotification(`🎉 Level Up! You are now a ${newLevel}`, "success");
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
        }),
        { name: "careeriq-v3-store" }
    )
);
