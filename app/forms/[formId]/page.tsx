"use client";

import { useEffect, useState, useRef } from "react";
import { useParams, useRouter } from "next/navigation";
import { Loader2 } from "lucide-react";
import { normalizeSchema } from "@/lib/schema-validation";
import { FormField } from "@/types/form";

export default function PublicFormPage() {
  const params = useParams();
  const router = useRouter();
  const formId = params.formId as string;

  const [form, setForm] = useState<any>(null);
  const [fields, setFields] = useState<FormField[]>([]);
  const [loading, setLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);

  useEffect(() => {
    fetch(`/api/forms/${formId}/public`)
      .then((res) => {
        if (res.status === 404 || res.status === 403) {
          setNotFound(true);
          return null;
        }
        return res.json();
      })
      .then((data) => {
        if (data) {
          setForm(data);
          setFields(normalizeSchema(data.schema).fields);
        }
      })
      .catch(() => setNotFound(true))
      .finally(() => setLoading(false));
  }, [formId]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50">
        <Loader2 className="h-8 w-8 text-slate-400 animate-spin" />
      </div>
    );
  }

  if (notFound || !form) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50">
        <div className="text-center space-y-3">
          <h1 className="text-3xl font-bold text-slate-800">Form not found</h1>
          <p className="text-slate-500">This form may not be published or does not exist.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center p-6">
      <div className="w-full max-w-2xl">
        <div className="mb-8 text-center">
          <h1 className="text-2xl font-bold text-slate-900">{form.title}</h1>
          {form.description && (
            <p className="mt-2 text-slate-500">{form.description}</p>
          )}
        </div>
        <FormFill fields={fields} formId={formId} />
      </div>
    </div>
  );
}

interface FormFillProps {
  fields: FormField[];
  formId: string;
}

function FormFill({ fields, formId }: FormFillProps) {
  const router = useRouter();
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [submitting, setSubmitting] = useState(false);
  const submittingRef = useRef(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (submittingRef.current) return;
    submittingRef.current = true;

    const newErrors: Record<string, string> = {};
    for (const field of fields) {
      if (field.required && !answers[field.id]) {
        newErrors[field.id] = "This field is required";
      }
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      submittingRef.current = false;
      return;
    }

    setSubmitting(true);

    try {
      const res = await fetch(`/api/forms/${formId}/public`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ answers }),
      });

      if (res.ok) {
        router.push(`/forms/${formId}/success`);
      }
    } catch {
      // silent fail
    } finally {
      setSubmitting(false);
      submittingRef.current = false;
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="divide-y divide-slate-100">
          {fields.map((field) => (
            <div key={field.id} className="p-6 space-y-1.5">
              <label className="block text-sm font-semibold text-slate-700">
                {field.label}
                {field.required && <span className="ml-1 text-red-400">*</span>}
              </label>
              {field.helpText && (
                <p className="text-xs text-slate-400">{field.helpText}</p>
              )}
              <FieldInput
                field={field}
                value={answers[field.id] ?? ""}
                error={errors[field.id]}
                onChange={(val) => {
                  setAnswers((prev) => ({ ...prev, [field.id]: val }));
                  if (errors[field.id]) setErrors((prev) => ({ ...prev, [field.id]: "" }));
                }}
              />
              {errors[field.id] && (
                <p className="text-xs text-red-500">{errors[field.id]}</p>
              )}
            </div>
          ))}
        </div>
        <div className="p-6 bg-slate-50 border-t border-slate-100">
          <button
            type="submit"
            disabled={submitting}
            className="w-full py-3 rounded-xl bg-slate-900 text-white font-semibold hover:bg-slate-800 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center justify-center gap-2"
          >
            {submitting ? <Loader2 className="h-4 w-4 animate-spin" /> : null}
            {submitting ? "Submitting…" : "Submit"}
          </button>
        </div>
      </div>
    </form>
  );
}

interface FieldInputProps {
  field: FormField;
  value: string;
  error?: string;
  onChange: (value: string) => void;
}

function FieldInput({ field, value, error, onChange }: FieldInputProps) {
  const baseCls = "w-full border rounded-xl px-4 py-3 text-sm text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-slate-300 focus:border-slate-300";
  const errorCls = "border-red-400 focus:ring-red-200 focus:border-red-400";
  const normalCls = "border-slate-200";
  if (field.type === "textarea") {
    return (
      <textarea
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={field.placeholder ?? ""}
        rows={4}
        className={`${baseCls} ${error ? errorCls : normalCls} resize-none`}
      />
    );
  }

  if (field.type === "email") {
    return (
      <input
        type="email"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={field.placeholder ?? "you@example.com"}
        className={`${baseCls} ${error ? errorCls : normalCls}`}
      />
    );
  }

  if (field.type === "number") {
    return (
      <input
        type="number"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={field.placeholder ?? "0"}
        className={`${baseCls} ${error ? errorCls : normalCls}`}
      />
    );
  }

  if (field.type === "phone") {
    return (
      <input
        type="tel"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={field.placeholder ?? "+1 (555) 000-0000"}
        className={`${baseCls} ${error ? errorCls : normalCls}`}
      />
    );
  }

  if (field.type === "date") {
    return (
      <input
        type="date"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-full border border-slate-200 rounded-xl px-4 py-3 text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-slate-300 focus:border-slate-300"
      />
    );
  }

  if (field.type === "url") {
    return (
      <input
        type="url"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={field.placeholder ?? "https://"}
        className={`${baseCls} ${error ? errorCls : normalCls}`}
      />
    );
  }

  if (field.type === "radio") {
    return (
      <div className="space-y-2">
        {(field.options ?? []).map((opt) => (
          <label
            key={opt.id}
            className={`flex items-center gap-3 p-3 rounded-xl border cursor-pointer transition-colors ${
              value === opt.id
                ? "border-slate-900 bg-slate-50"
                : error ? "border-red-300" : "border-slate-200 hover:border-slate-300"
            }`}
          >
            <input
              type="radio"
              name={field.id}
              value={opt.id}
              checked={value === opt.id}
              onChange={() => onChange(opt.id)}
              className="w-4 h-4"
            />
            <span className="text-sm text-slate-700">{opt.label}</span>
          </label>
        ))}
      </div>
    );
  }

  if (field.type === "select") {
    return (
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-full border border-slate-200 rounded-xl px-4 py-3 text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-slate-300 focus:border-slate-300 appearance-none bg-white"
      >
        <option value="">Select an option</option>
        {(field.options ?? []).map((opt) => (
          <option key={opt.id} value={opt.id}>{opt.label}</option>
        ))}
      </select>
    );
  }

  if (field.type === "checkbox") {
    return (
      <label
        className={`flex items-center gap-3 p-3 rounded-xl border cursor-pointer transition-colors ${
          value === "true"
            ? "border-slate-900 bg-slate-50"
            : "border-slate-200 hover:border-slate-300"
        }`}
      >
        <input
          type="checkbox"
          checked={value === "true"}
          onChange={(e) => onChange(e.target.checked ? "true" : "false")}
          className="w-4 h-4 rounded"
        />
        <span className="text-sm text-slate-700">{field.label}</span>
      </label>
    );
  }

  if (field.type === "toggle") {
    return (
      <button
        type="button"
        onClick={() => onChange(value === "true" ? "false" : "true")}
        className={`relative w-12 h-6 rounded-full transition-colors duration-200 ${
          value === "true" ? "bg-slate-900" : "bg-slate-200"
        }`}
      >
        <span
          className={`absolute top-0.5 w-5 h-5 rounded-full bg-white shadow transition-transform duration-200 ${
            value === "true" ? "translate-x-6" : "translate-x-0.5"
          }`}
        />
      </button>
    );
  }

  return (
    <input
      type="text"
      value={value}
      onChange={(e) => onChange(e.target.value)}
      placeholder={field.placeholder ?? ""}
      className={`${baseCls} ${error ? errorCls : normalCls}`}
    />
  );
}