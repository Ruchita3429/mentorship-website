"use client";

import React from "react";

type Props = {
  label: string;
  name: string;
  type?: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => void;
  as?: "input" | "select";
  children?: React.ReactNode;
  placeholder?: string;
};

export function FormInput({
  label,
  name,
  type = "text",
  value,
  onChange,
  as = "input",
  children,
  placeholder,
}: Props) {
  return (
    <label className="flex flex-col gap-1 text-sm text-slate-200">
      <span className="font-medium">{label}</span>
      {as === "select" ? (
        <select
          name={name}
          value={value}
          onChange={onChange}
          className="rounded-md border border-slate-700 bg-slate-900 px-3 py-2 text-sm text-slate-50 outline-none ring-emerald-500/60 focus:ring-2"
        >
          {children}
        </select>
      ) : (
        <input
          name={name}
          type={type}
          value={value}
          onChange={onChange}
          placeholder={placeholder}
          className="rounded-md border border-slate-700 bg-slate-900 px-3 py-2 text-sm text-slate-50 outline-none ring-emerald-500/60 focus:ring-2"
        />
      )}
    </label>
  );
}

