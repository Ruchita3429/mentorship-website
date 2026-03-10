import Link from "next/link";

export default function Home() {
  return (
    <main className="min-h-screen flex items-center justify-center bg-slate-950 text-slate-50">
      <div className="max-w-xl w-full px-6 py-10 rounded-2xl bg-slate-900/70 shadow-xl border border-slate-700">
        <h1 className="text-3xl font-semibold tracking-tight mb-3">
          Mentorship Platform
        </h1>
        <p className="text-slate-300 mb-8">
          Connect parents, students, and mentors in one simple dashboard.
        </p>

        <div className="flex flex-col sm:flex-row gap-3 mb-6">
          <Link
            href="/signup"
            className="inline-flex items-center justify-center rounded-lg bg-emerald-500 px-4 py-2.5 text-sm font-medium text-white shadow hover:bg-emerald-400 transition"
          >
            Get started – Sign up
          </Link>
          <Link
            href="/login"
            className="inline-flex items-center justify-center rounded-lg border border-slate-600 px-4 py-2.5 text-sm font-medium text-slate-100 hover:bg-slate-800/60 transition"
          >
            I already have an account
          </Link>
        </div>

        <p className="text-xs text-slate-400">
          Use the dashboard to manage students, lessons, bookings, and AI
          summaries of your notes.
        </p>
      </div>
    </main>
  );
}
