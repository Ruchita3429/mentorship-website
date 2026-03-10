"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { getMe } from "../../lib/api";

type Me = {
  id?: string;
  name?: string;
  email?: string;
  role?: string;
};

export default function DashboardPage() {
  const router = useRouter();
  const [me, setMe] = useState<Me | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (typeof window === "undefined") return;
    const token = localStorage.getItem("token");
    if (!token) {
      router.push("/login");
      return;
    }

    const load = async () => {
      try {
        const data = await getMe();
        setMe(data as any);
      } catch {
        router.push("/login");
      } finally {
        setLoading(false);
      }
    };

    load();
  }, [router]);

  if (loading) {
    return (
      <div className="flex min-h-[calc(100vh-3.5rem)] items-center justify-center">
        <p className="text-sm text-slate-400">Loading your dashboard...</p>
      </div>
    );
  }

  return (
    <div className="mx-auto flex min-h-[calc(100vh-3.5rem)] max-w-5xl flex-col gap-6 px-4 py-8">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight text-slate-50">
          Welcome{me?.name ? `, ${me.name}` : ""} 👋
        </h1>
        <p className="mt-1 text-sm text-slate-400">
          {me?.role ? `You are logged in as ${me.role}.` : "Mentorship overview"}
        </p>
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        <Link
          href="/student"
          className="rounded-xl border border-slate-800 bg-slate-900/70 p-4 transition hover:border-emerald-500/70 hover:bg-slate-900"
        >
          <h2 className="text-sm font-semibold text-slate-50">Students</h2>
          <p className="mt-1 text-xs text-slate-400">
            Create and manage student profiles.
          </p>
        </Link>

        <Link
          href="/lesson"
          className="rounded-xl border border-slate-800 bg-slate-900/70 p-4 transition hover:border-emerald-500/70 hover:bg-slate-900"
        >
          <h2 className="text-sm font-semibold text-slate-50">Lessons</h2>
          <p className="mt-1 text-xs text-slate-400">
            Set up lessons and track what you teach.
          </p>
        </Link>

        <Link
          href="/summarize"
          className="rounded-xl border border-slate-800 bg-slate-900/70 p-4 transition hover:border-emerald-500/70 hover:bg-slate-900"
        >
          <h2 className="text-sm font-semibold text-slate-50">Summarize</h2>
          <p className="mt-1 text-xs text-slate-400">
            Paste notes and get bullet summaries.
          </p>
        </Link>
      </div>
    </div>
  );
}

