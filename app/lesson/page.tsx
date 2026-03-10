"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { FormInput } from "../../components/FormInput";
import { createLesson, getLessons } from "../../lib/api";

type Lesson = {
  id?: string;
  title?: string;
  description?: string;
  date?: string;
  [key: string]: any;
};

export default function LessonsPage() {
  const router = useRouter();
  const [lessons, setLessons] = useState<Lesson[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [form, setForm] = useState({
    title: "",
    description: "",
    date: "",
  });

  useEffect(() => {
    if (typeof window === "undefined") return;
    const token = localStorage.getItem("token");
    if (!token) {
      router.push("/login");
      return;
    }

    const load = async () => {
      try {
        const data = await getLessons();
        setLessons((data as any) || []);
      } catch (err: any) {
        setError(err.message ?? "Failed to load lessons");
      } finally {
        setLoading(false);
      }
    };

    load();
  }, [router]);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSaving(true);
    try {
      const payload = {
        title: form.title,
        description: form.description,
        date: form.date || undefined,
      };
      const created = await createLesson(payload);
      setLessons((prev) => [...prev, created as any]);
      setForm({ title: "", description: "", date: "" });
    } catch (err: any) {
      setError(err.message ?? "Failed to create lesson");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="mx-auto flex min-h-[calc(100vh-3.5rem)] max-w-5xl flex-col gap-6 px-4 py-8">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight text-slate-50">
          Lessons
        </h1>
        <p className="mt-1 text-sm text-slate-400">
          Mentors can create lessons and see the list of sessions.
        </p>
      </div>

      {error && (
        <div className="rounded-md border border-red-500/60 bg-red-950/40 px-3 py-2 text-xs text-red-200">
          {error}
        </div>
      )}

      <section className="grid gap-6 md:grid-cols-[minmax(0,2fr)_minmax(0,3fr)]">
        <form
          onSubmit={handleSubmit}
          className="flex flex-col gap-4 rounded-xl border border-slate-800 bg-slate-900/70 p-4"
        >
          <h2 className="text-sm font-semibold text-slate-50">
            Create new lesson
          </h2>
          <FormInput
            label="Title"
            name="title"
            value={form.title}
            onChange={handleChange}
            placeholder="Math tutoring session"
          />
          <FormInput
            label="Description"
            name="description"
            value={form.description}
            onChange={handleChange}
            placeholder="Algebra basics and practice"
          />
          <FormInput
            label="Date"
            name="date"
            type="date"
            value={form.date}
            onChange={handleChange}
          />

          <button
            type="submit"
            disabled={saving}
            className="mt-1 inline-flex h-9 items-center justify-center rounded-lg bg-emerald-500 px-4 text-xs font-medium text-white shadow hover:bg-emerald-400 disabled:opacity-60"
          >
            {saving ? "Saving..." : "Create lesson"}
          </button>
        </form>

        <div className="rounded-xl border border-slate-800 bg-slate-900/70 p-4">
          <h2 className="mb-2 text-sm font-semibold text-slate-50">
            Lesson list
          </h2>
          {loading ? (
            <p className="text-xs text-slate-400">Loading lessons...</p>
          ) : lessons.length === 0 ? (
            <p className="text-xs text-slate-500">
              No lessons yet. Create the first one on the left.
            </p>
          ) : (
            <ul className="space-y-2">
              {lessons.map((l) => (
                <li
                  key={l.id ?? l.title}
                  className="rounded-lg border border-slate-800 bg-slate-950/60 px-3 py-2 text-xs text-slate-100"
                >
                  <div className="font-medium">{l.title}</div>
                  {l.description && (
                    <div className="text-[11px] text-slate-400">
                      {l.description}
                    </div>
                  )}
                  {l.date && (
                    <div className="text-[11px] text-slate-500">
                      {new Date(l.date).toLocaleDateString()}
                    </div>
                  )}
                </li>
              ))}
            </ul>
          )}
        </div>
      </section>
    </div>
  );
}

