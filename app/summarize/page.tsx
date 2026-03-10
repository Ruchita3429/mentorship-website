"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { summarizeText } from "../../lib/api";

export default function SummarizePage() {
  const router = useRouter();
  const [input, setInput] = useState("");
  const [bullets, setBullets] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (typeof window === "undefined") return;
    const token = localStorage.getItem("token");
    if (!token) {
      router.push("/login");
    }
  }, [router]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setBullets([]);
    setLoading(true);
    try {
      const data = await summarizeText(input);
      const summary = (data as any)?.summary ?? data;

      let items: string[] = [];
      if (Array.isArray(summary)) {
        items = summary;
      } else if (typeof summary === "string") {
        items = summary
          .split("\n")
          .map((line) => line.replace(/^[\s*-]+/, "").trim())
          .filter(Boolean);
      }

      setBullets(items);
    } catch (err: any) {
      setError(err.message ?? "Failed to summarize text");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="mx-auto flex min-h-[calc(100vh-3.5rem)] max-w-5xl flex-col gap-6 px-4 py-8">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight text-slate-50">
          Summarize notes
        </h1>
        <p className="mt-1 text-sm text-slate-400">
          Paste any lesson notes or meeting text and get a concise bullet
          summary.
        </p>
      </div>

      {error && (
        <div className="rounded-md border border-red-500/60 bg-red-950/40 px-3 py-2 text-xs text-red-200">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="flex flex-col gap-3">
        <textarea
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Paste your text here..."
          rows={8}
          className="w-full rounded-xl border border-slate-800 bg-slate-900/80 px-3 py-2 text-sm text-slate-50 outline-none ring-emerald-500/60 focus:ring-2"
        />
        <button
          type="submit"
          disabled={loading || !input.trim()}
          className="inline-flex h-9 w-fit items-center justify-center rounded-lg bg-emerald-500 px-4 text-xs font-medium text-white shadow hover:bg-emerald-400 disabled:opacity-60"
        >
          {loading ? "Summarizing..." : "Summarize"}
        </button>
      </form>

      <section className="rounded-xl border border-slate-800 bg-slate-900/70 p-4">
        <h2 className="mb-2 text-sm font-semibold text-slate-50">
          Summary bullets
        </h2>
        {loading ? (
          <p className="text-xs text-slate-400">Generating summary...</p>
        ) : bullets.length === 0 ? (
          <p className="text-xs text-slate-500">
            No summary yet. Submit some text above.
          </p>
        ) : (
          <ul className="list-disc space-y-1 pl-4 text-xs text-slate-100">
            {bullets.map((b, idx) => (
              <li key={idx}>{b}</li>
            ))}
          </ul>
        )}
      </section>
    </div>
  );
}

