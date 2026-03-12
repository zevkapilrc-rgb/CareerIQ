"use client";

import { FormEvent, useState } from "react";
import { useMutation } from "@tanstack/react-query";
import toast from "react-hot-toast";
import { useAuthStore } from "../../state/useAuthStore";

const API_BASE = "http://localhost:8000";

export default function AuthPanel() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const setAuth = useAuthStore((s) => s.setAuth);

  const registerMutation = useMutation({
    mutationFn: async () => {
      const res = await fetch(`${API_BASE}/auth/register`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });
      if (!res.ok) throw new Error("Registration failed");
      return res.json();
    },
    onSuccess: () => toast.success("Registered. You can now login."),
    onError: () => toast.error("Registration failed"),
  });

  const loginMutation = useMutation({
    mutationFn: async () => {
      const res = await fetch(`${API_BASE}/auth/token`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });
      if (!res.ok) throw new Error("Login failed");
      return res.json();
    },
    onSuccess: (data: { access_token: string }) => {
      setAuth(data.access_token, email);
      toast.success("Logged in");
    },
    onError: () => toast.error("Login failed"),
  });

  const onSubmit = (e: FormEvent) => {
    e.preventDefault();
    loginMutation.mutate();
  };

  return (
    <form
      onSubmit={onSubmit}
      className="glass-surface mb-6 max-w-md space-y-3 px-4 py-4"
    >
      <div className="text-sm font-semibold text-slate-200">Auth (demo)</div>
      <input
        className="w-full rounded-md border border-white/10 bg-plum/70 px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-primary"
        placeholder="Email"
        type="email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
      />
      <input
        className="w-full rounded-md border border-white/10 bg-plum/70 px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-primary"
        placeholder="Password"
        type="password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
      />
      <div className="flex gap-2 pt-1">
        <button
          type="submit"
          className="rounded-md bg-primary px-3 py-1.5 text-xs font-medium text-white hover:bg-primary-dark"
        >
          Login
        </button>
        <button
          type="button"
          onClick={() => registerMutation.mutate()}
          className="rounded-md border border-primary/40 px-3 py-1.5 text-xs font-medium text-primary hover:bg-primary/10"
        >
          Register
        </button>
      </div>
    </form>
  );
}



