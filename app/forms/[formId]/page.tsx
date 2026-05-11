"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { Loader2 } from "lucide-react";
import { normalizeSchema } from "@/lib/schema-validation";
import { FormField } from "@/types/form";

export default function PublicFormPage() {
  const params = useParams();
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
        <FormFill fields={fields} />
      </div>
    </div>
  );
}

function FormFill({ fields }: { fields: FormField[] }) {
  return (
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
            {field.type === "textarea" ? (
              <textarea
                placeholder={field.placeholder ?? ""}
                rows={4}
                className="w-full border border-slate-200 rounded-xl px-4 py-3 text-sm text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-slate-300 focus:border-slate-300 resize-none"
              />
            ) : (
              <input
                type={field.type === "email" ? "email" : "text"}
                placeholder={field.placeholder ?? ""}
                className="w-full border border-slate-200 rounded-xl px-4 py-3 text-sm text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-slate-300 focus:border-slate-300"
              />
            )}
          </div>
        ))}
      </div>
    </div>
  );
}