import { NextResponse } from "next/server";
import connectToDatabase from "@/src/lib/mongodb";
import User from "@/src/models/User";
import Contact from "@/src/models/Contact";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    await connectToDatabase();
    
    // Count total users
    const totalUsers = await User.countDocuments();

    // Active Today
    const todayStart = new Date();
    todayStart.setHours(0, 0, 0, 0);
    const activeToday = await User.countDocuments({ updatedAt: { $gte: todayStart } });

    // Resumes Analyzed — users who have a non-empty skills array
    const resumesAnalyzed = await User.countDocuments({ "profile.skills": { $exists: true, $not: { $size: 0 } } });

    // Avg Career Score (using xp, capped at 100)
    const usersWithXp = await User.find({ "profile.xp": { $gt: 0 } }).select("profile.xp");
    let avgScore = 0;
    if (usersWithXp.length > 0) {
      const totalXp = usersWithXp.reduce((acc, u) => acc + (u.profile?.xp || 0), 0);
      avgScore = Math.min(100, Math.round(totalXp / usersWithXp.length));
    }
    
    // Recent users (last 10 registrations)
    const recentUsersRaw = await User.find().sort({ createdAt: -1 }).limit(10);
    
    const recentUsers = recentUsersRaw.map(u => ({
      name: u.name,
      email: u.email,
      joined: timeAgo(u.createdAt),
      level: u.profile?.level || "Explorer",
      xp: u.profile?.xp || 0,
      skills: u.profile?.skills?.length || 0,
    }));

    // Registration growth — last 6 months
    const growthData: { month: string; users: number }[] = [];
    const now = new Date();
    for (let i = 5; i >= 0; i--) {
      const d = new Date(now.getFullYear(), now.getMonth() - i, 1);
      const end = new Date(now.getFullYear(), now.getMonth() - i + 1, 0, 23, 59, 59);
      const count = await User.countDocuments({ createdAt: { $gte: d, $lte: end } });
      growthData.push({
        month: d.toLocaleString("default", { month: "short" }),
        users: count,
      });
    }

    // Contact messages (last 10)
    const recentMessagesRaw = await Contact.find().sort({ createdAt: -1 }).limit(10);
    const totalMessages = await Contact.countDocuments();

    const recentMessages = recentMessagesRaw.map(m => ({
      name: m.name,
      email: m.email,
      subject: m.subject || "No Subject",
      message: m.message.slice(0, 120) + (m.message.length > 120 ? "..." : ""),
      date: timeAgo(m.createdAt),
    }));

    return NextResponse.json({
      totalUsers,
      activeToday,
      resumesAnalyzed,
      avgScore,
      recentUsers,
      growthData,
      totalMessages,
      recentMessages,
    });
  } catch (error: any) {
    console.error("Admin stats error:", error);
    return NextResponse.json({ error: "Failed to fetch stats" }, { status: 500 });
  }
}

function timeAgo(date: Date): string {
  const now = new Date();
  const diff = now.getTime() - new Date(date).getTime();
  const mins = Math.floor(diff / 60000);
  if (mins < 1) return "Just now";
  if (mins < 60) return `${mins}m ago`;
  const hrs = Math.floor(mins / 60);
  if (hrs < 24) return `${hrs}h ago`;
  const days = Math.floor(hrs / 24);
  if (days < 7) return `${days}d ago`;
  return new Date(date).toLocaleDateString();
}
