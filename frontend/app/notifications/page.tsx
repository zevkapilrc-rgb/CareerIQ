"use client";

import { useAppStore } from "@/src/state/useAppStore";
import { CheckCircle, Lightbulb, AlertTriangle, Bell, Trash2, CheckSquare } from "lucide-react";
import GlassCard from "@/src/components/ui/GlassCard";
import Badge from "@/src/components/ui/Badge";
import PremiumButton from "@/src/components/ui/PremiumButton";

const typeIcons = { 
    success: <CheckCircle size={14} className="text-emerald-400" />, 
    info: <Lightbulb size={14} className="text-[#C0506A]" />, 
    warning: <AlertTriangle size={14} className="text-amber-400" /> 
};

export default function NotificationsPage() {
    const { notifications, markNotificationsRead, clearNotifications, addNotification } = useAppStore();

    const simulate = () => {
        addNotification("7-day learning streak! Keep it up!", "success");
        addNotification("Your career score improved by 4 points this week", "info");
        addNotification("You have an interview session scheduled — stay prepared!", "warning");
    };

    return (
        <div className="max-w-[760px] mx-auto px-4 pb-16 pt-4 space-y-8 animate-fade font-sans">
            {/* Header */}
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-end gap-5 border-b border-white/[0.05] pb-6 mt-2">
                <div>
                    <div className="flex items-center gap-2 mb-2">
                        <span className="text-[9px] font-bold uppercase tracking-widest text-[#C0506A] font-display">System Inbox</span>
                        <Badge label="Activity Logs" variant="purple" size="sm" dot={true} />
                    </div>
                    <h1 className="text-3xl md:text-5xl font-extrabold text-white tracking-tight leading-none font-display">
                        Notifications
                    </h1>
                    <p className="text-xs text-zinc-550 mt-2.5 leading-relaxed font-semibold">
                        {notifications.length} total · {notifications.filter(n => !n.read).length} unread messages
                    </p>
                </div>
                <div className="flex items-center gap-2.5 flex-wrap w-full sm:w-auto">
                    <PremiumButton variant="secondary" size="sm" onClick={simulate}>
                        <Bell size={13} className="mr-1" /> Simulate
                    </PremiumButton>
                    <PremiumButton variant="secondary" size="sm" onClick={markNotificationsRead}>
                        <CheckSquare size={13} className="mr-1" /> Mark all read
                    </PremiumButton>
                    {notifications.length > 0 && (
                        <PremiumButton size="sm" onClick={clearNotifications} className="text-red-400 border-red-950 hover:bg-red-950/20">
                            <Trash2 size={13} className="mr-1" /> Clear all
                        </PremiumButton>
                    )}
                </div>
            </div>

            {notifications.length === 0 ? (
                <GlassCard className="text-center py-16 px-6 flex flex-col items-center justify-center">
                    <div className="w-12 h-12 rounded-xl bg-white/[0.02] border border-white/[0.08] flex items-center justify-center mb-5 text-zinc-500">
                        <Bell size={22} />
                    </div>
                    <h2 className="text-sm font-bold uppercase tracking-wider text-white font-display mb-1.5">All caught up!</h2>
                    <p className="text-xs text-zinc-500 max-w-sm mx-auto leading-relaxed font-semibold mb-6">
                        No notifications yet. Complete tasks, build streaks, or simulation events to see notifications here.
                    </p>
                    <PremiumButton onClick={simulate}>
                        Generate Sample Notifications
                    </PremiumButton>
                </GlassCard>
            ) : (
                <GlassCard className="p-0 overflow-hidden divide-y divide-white/[0.04]">
                    {notifications.map((n) => (
                        <div 
                            key={n.id} 
                            className={`flex items-start gap-4 p-4 transition-colors hover:bg-white/[0.01] ${n.read ? "opacity-60" : "bg-[#6D001A]/5"}`}
                        >
                            <div className="mt-1 flex-shrink-0">
                                {typeIcons[n.type] || <Bell size={14} className="text-zinc-550" />}
                            </div>
                            <div className="flex-1 min-w-0">
                                <div className="text-xs font-semibold text-zinc-305 leading-relaxed">
                                    {n.message}
                                </div>
                                <div className="text-[9px] text-zinc-550 mt-1.5 font-bold uppercase tracking-widest font-mono">
                                    {n.time}
                                </div>
                            </div>
                            {!n.read && (
                                <div className="w-1.5 h-1.5 rounded-full bg-[#6D001A] mt-2 flex-shrink-0 animate-pulse" />
                            )}
                        </div>
                    ))}
                </GlassCard>
            )}
        </div>
    );
}
