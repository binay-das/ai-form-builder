"use client";

import { FormField } from "@/types/form";
import { cn } from "@/lib/utils";

interface PublicFieldProps {
  field: FormField;
  onChange: (id: string, value: string | string[] | boolean) => void;
  value?: string | string[] | boolean;
  error?: string;
}

export function PublicField({ field, onChange, value, error }: PublicFieldProps) {
  return (
    <div className="w-full">
      {(() => {
        switch (field.type) {
          case "textarea":
            return (
              <textarea
                id={field.id}
                value={(value as string) ?? ""}
                onChange={(e) => onChange(field.id, e.target.value)}
                placeholder={field.placeholder ?? ""}
                rows={4}
                className="w-full border border-slate-200 rounded-xl px-4 py-3 text-sm text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-slate-300 focus:border-slate-300 resize-none"
              />
            );

          case "email":
            return (
              <input
                id={field.id}
                type="email"
                value={(value as string) ?? ""}
                onChange={(e) => onChange(field.id, e.target.value)}
                placeholder={field.placeholder ?? "you@example.com"}
                className="w-full border border-slate-200 rounded-xl px-4 py-3 text-sm text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-slate-300 focus:border-slate-300"
              />
            );

          case "number":
            return (
              <input
                id={field.id}
                type="number"
                value={(value as string) ?? ""}
                onChange={(e) => onChange(field.id, e.target.value)}
                placeholder={field.placeholder ?? "0"}
                className="w-full border border-slate-200 rounded-xl px-4 py-3 text-sm text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-slate-300 focus:border-slate-300"
              />
            );

          case "phone":
            return (
              <input
                id={field.id}
                type="tel"
                value={(value as string) ?? ""}
                onChange={(e) => onChange(field.id, e.target.value)}
                placeholder={field.placeholder ?? "+1 (555) 000-0000"}
                className="w-full border border-slate-200 rounded-xl px-4 py-3 text-sm text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-slate-300 focus:border-slate-300"
              />
            );

          case "date":
            return (
              <input
                id={field.id}
                type="date"
                value={(value as string) ?? ""}
                onChange={(e) => onChange(field.id, e.target.value)}
                className="w-full border border-slate-200 rounded-xl px-4 py-3 text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-slate-300 focus:border-slate-300"
              />
            );

          case "url":
            return (
              <input
                id={field.id}
                type="url"
                value={(value as string) ?? ""}
                onChange={(e) => onChange(field.id, e.target.value)}
                placeholder={field.placeholder ?? "https://"}
                className="w-full border border-slate-200 rounded-xl px-4 py-3 text-sm text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-slate-300 focus:border-slate-300"
              />
            );

          case "radio":
            return (
              <div className="space-y-2.5">
                {(field.options ?? []).map((opt) => (
                  <label
                    key={opt.id}
                    className={cn(
                      "flex items-center gap-3 p-3 rounded-xl border cursor-pointer transition-colors",
                      value === opt.id
                        ? "border-slate-900 bg-slate-50"
                        : "border-slate-200 hover:border-slate-300"
                    )}
                  >
                    <input
                      type="radio"
                      name={field.id}
                      value={opt.id}
                      checked={value === opt.id}
                      onChange={() => onChange(field.id, opt.id)}
                      className="w-4 h-4 text-slate-900 focus:ring-slate-300"
                    />
                    <span className="text-sm text-slate-700">{opt.label}</span>
                  </label>
                ))}
              </div>
            );

          case "select":
            return (
              <select
                id={field.id}
                value={(value as string) ?? ""}
                onChange={(e) => onChange(field.id, e.target.value)}
                className="w-full border border-slate-200 rounded-xl px-4 py-3 text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-slate-300 focus:border-slate-300 appearance-none bg-white"
              >
                <option value="">Select an option</option>
                {(field.options ?? []).map((opt) => (
                  <option key={opt.id} value={opt.id}>{opt.label}</option>
                ))}
              </select>
            );

          case "checkbox":
            return (
              <label
                className={cn(
                  "flex items-center gap-3 p-3 rounded-xl border cursor-pointer transition-colors",
                  value
                    ? "border-slate-900 bg-slate-50"
                    : "border-slate-200 hover:border-slate-300"
                )}
              >
                <input
                  type="checkbox"
                  id={field.id}
                  checked={(value as boolean) ?? false}
                  onChange={(e) => onChange(field.id, e.target.checked)}
                  className="w-4 h-4 text-slate-900 rounded focus:ring-slate-300"
                />
                <span className="text-sm text-slate-700">{field.label}</span>
              </label>
            );

          case "toggle":
            return (
              <button
                type="button"
                role="switch"
                aria-checked={value ?? false}
                onClick={() => onChange(field.id, !(value ?? false))}
                className={cn(
                  "relative w-12 h-6 rounded-full transition-colors duration-200",
                  value ? "bg-slate-900" : "bg-slate-200"
                )}
              >
                <span
                  className={cn(
                    "absolute top-0.5 w-5 h-5 rounded-full bg-white shadow transition-transform duration-200",
                    value ? "translate-x-6" : "translate-x-0.5"
                  )}
                />
              </button>
            );

          default:
            return (
              <input
                id={field.id}
                type="text"
                value={(value as string) ?? ""}
                onChange={(e) => onChange(field.id, e.target.value)}
                placeholder={field.placeholder ?? ""}
                className="w-full border border-slate-200 rounded-xl px-4 py-3 text-sm text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-slate-300 focus:border-slate-300"
              />
            );
        }
      })()}
    </div>
  );
}