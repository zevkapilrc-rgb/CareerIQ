"use client";
import { useAppStore } from "@/src/state/useAppStore";

import { CheckCircle, Lightbulb, AlertTriangle, Bell } from "lucide-react";

const typeColors = { success: "var(--green)", info: "var(--accent)", warning: "var(--yellow)" };
const typeDots = { success: "#34d399", info: "#a78bfa", warning: "#fbbf24" };
const typeIcons = { success: <CheckCircle size={14} />, info: <Lightbulb size={14} />, warning: <AlertTriangle size={14} /> };

export default function NotificationsPage() {
    const { notifications, markNotificationsRead, clearNotifications, addNotification } = useAppStore();

    const simulate = () => {
        addNotification("7-day learning streak! Keep it up!", "success");
        addNotification("Your career score improved by 4 points this week", "info");
        addNotification("You have an interview session scheduled — stay prepared!", "warning");
    };

    return (
        <div className="page-enter" style={{ maxWidth: 700, margin: "0 auto" }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 24 }}>
                <div>
                    <h1 style={{ marginBottom: 4 }}>Notifications</h1>
                    <p style={{ color: "var(--text-muted)", fontSize: "0.85rem" }}>{notifications.length} total · {notifications.filter(n => !n.read).length} unread</p>
                </div>
                <div style={{ display: "flex", gap: 10 }}>
                    <button className="btn-ghost" onClick={simulate} style={{ display: "flex", alignItems: "center", gap: 6 }}><Bell size={16} /> Simulate</button>
                    <button className="btn-ghost" onClick={markNotificationsRead}>Mark all read</button>
                    {notifications.length > 0 && <button className="btn-danger" onClick={clearNotifications}>Clear all</button>}
                </div>
            </div>

            {notifications.length === 0 ? (
                <div className="card" style={{ textAlign: "center", padding: 60 }}>
                    <div style={{ display: "flex", justifyContent: "center", marginBottom: 16, color: "var(--accent)" }}><Bell size={48} /></div>
                    <h2 style={{ marginBottom: 8 }}>All caught up!</h2>
                    <p style={{ color: "var(--text-muted)", fontSize: "0.85rem", marginBottom: 20 }}>No notifications yet. Complete tasks to earn notifications.</p>
                    <button className="btn-primary" onClick={simulate}>Generate Sample Notifications</button>
                </div>
            ) : (
                <div className="card stagger" style={{ padding: 0, overflow: "hidden" }}>
                    {notifications.map((n) => (
                        <div key={n.id} className={`notif-item ${n.read ? "" : "unread"}`}>
                            <div className="notif-dot" style={{ background: typeDots[n.type] || "#a78bfa" }} />
                            <div style={{ flex: 1 }}>
                                <div style={{ fontSize: "0.83rem", color: "var(--text)", marginBottom: 3, display: "flex", alignItems: "center", gap: 6 }}>
                                    <span style={{ color: typeColors[n.type], display: "flex" }}>{typeIcons[n.type]}</span>
                                    {n.message}
                                </div>
                                <div style={{ fontSize: "0.7rem", color: "var(--text-muted)" }}>{n.time}</div>
                            </div>
                            {!n.read && <div style={{ width: 8, height: 8, borderRadius: "50%", background: "var(--accent)", flexShrink: 0 }} />}
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}



