"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { FormInput } from "../../components/FormInput";
import { createStudent, getStudents } from "../../lib/api";

type Student = {
  id?: string;
  name?: string;
  age?: number;
  [key: string]: any;
};

export default function StudentsPage() {
  const router = useRouter();
  const [students, setStudents] = useState<Student[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [form, setForm] = useState({ name: "", age: "" });

  useEffect(() => {
    if (typeof window === "undefined") return;
    const token = localStorage.getItem("token");
    if (!token) {
      router.push("/login");
      return;
    }

    const load = async () => {
      try {
        const data = await getStudents();
        setStudents((data as any) || []);
      } catch (err: any) {
        setError(err.message ?? "Failed to load students");
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
        name: form.name,
        age: form.age ? Number(form.age) : undefined,
      };
      const created = await createStudent(payload);
      setStudents((prev) => [...prev, created as any]);
      setForm({ name: "", age: "" });
    } catch (err: any) {
      setError(err.message ?? "Failed to create student");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="mx-auto flex min-h-[calc(100vh-3.5rem)] max-w-5xl flex-col gap-6 px-4 py-8">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight text-slate-50">
          Students
        </h1>
        <p className="mt-1 text-sm text-slate-400">
          Parents can create students and see the list of registered students.
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
            Add new student
          </h2>
          <FormInput
            label="Name"
            name="name"
            value={form.name}
            onChange={handleChange}
            placeholder="Student name"
          />
          <FormInput
            label="Age"
            name="age"
            type="number"
            value={form.age}
            onChange={handleChange}
            placeholder="12"
          />

          <button
            type="submit"
            disabled={saving}
            className="mt-1 inline-flex h-9 items-center justify-center rounded-lg bg-emerald-500 px-4 text-xs font-medium text-white shadow hover:bg-emerald-400 disabled:opacity-60"
          >
            {saving ? "Saving..." : "Create student"}
          </button>
        </form>

        <div className="rounded-xl border border-slate-800 bg-slate-900/70 p-4">
          <h2 className="mb-2 text-sm font-semibold text-slate-50">
            Student list
          </h2>
          {loading ? (
            <p className="text-xs text-slate-400">Loading students...</p>
          ) : students.length === 0 ? (
            <p className="text-xs text-slate-500">
              No students yet. Create the first one on the left.
            </p>
          ) : (
            <ul className="space-y-2">
              {students.map((s) => (
                <li
                  key={s.id ?? s.name}
                  className="flex items-center justify-between rounded-lg border border-slate-800 bg-slate-950/60 px-3 py-2 text-xs text-slate-100"
                >
                  <div>
                    <div className="font-medium">{s.name}</div>
                    {s.age !== undefined && (
                      <div className="text-[11px] text-slate-400">
                        Age: {s.age}
                      </div>
                    )}
                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>
      </section>
    </div>
  );
}

