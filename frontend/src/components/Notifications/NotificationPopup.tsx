"use client";

import { useEffect, useState } from "react";

const WS_URL = "ws://localhost:8000/ws/notifications";

type Notification = {
  type: string;
  message: string;
};

export default function NotificationPopup() {
  const [lastNotification, setLastNotification] = useState<Notification | null>(
    null
  );

  useEffect(() => {
    const ws = new WebSocket(WS_URL);
    ws.onmessage = (event) => {
      try {
        const data = JSON.parse(event.data);
        setLastNotification(data);
      } catch {
        // ignore
      }
    };
    return () => ws.close();
  }, []);

  return (
    <section className="rounded-2xl border border-slate-800 bg-slate-900/60 p-4">
      <h2 className="text-lg font-semibold mb-2">Real-time Notifications</h2>
      {lastNotification ? (
        <p className="text-sm text-slate-300">{lastNotification.message}</p>
      ) : (
        <p className="text-sm text-slate-400">
          Connecting to notification stream...
        </p>
      )}
    </section>
  );
}



