"use client";

import { useState, useCallback, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Loader2, ArrowLeft, Save, Eye, CheckCircle2, Globe } from "lucide-react";
import { BuilderSidebar } from "./BuilderSidebar";
import { BuilderCanvas } from "./BuilderCanvas";
import { PropertiesPanel } from "./PropertiesPanel";
import { useBuilderState } from "@/lib/use-builder-state";
import { FormField } from "@/types/form";

interface BuilderClientProps {
  formId: string;
  formTitle: string;
  initialFields: FormField[];
  initialPublished?: boolean;
}

export function BuilderClient({
  formId,
  formTitle,
  initialFields,
  initialPublished = false,
}: BuilderClientProps) {
  const router = useRouter();
  const [isSaving, setIsSaving] = useState(false);
  const [saveError, setSaveError] = useState<string | null>(null);
  const [savedAt, setSavedAt] = useState<Date | null>(null);
  const [isPublished, setIsPublished] = useState(initialPublished);
  const [isPublishing, setIsPublishing] = useState(false);
  const [showPreview, setShowPreview] = useState(false);

  const {
    fields,
    selectedFieldId,
    selectedField,
    addField,
    selectField,
    updateField,
    deleteField,
    duplicateField,
    moveField,
    reorderFields,
  } = useBuilderState(initialFields);

  // Keyboard shortcut: Delete/Backspace removes the selected field
  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      const tag = (e.target as HTMLElement).tagName;
      // Don't fire when user is typing in an input/textarea
      if (tag === "INPUT" || tag === "TEXTAREA" || tag === "SELECT") return;
      if ((e.key === "Delete" || e.key === "Backspace") && selectedFieldId) {
        deleteField(selectedFieldId);
      }
    };
    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  }, [selectedFieldId, deleteField]);

  const handleSave = useCallback(async () => {
    try {
      setIsSaving(true);
      setSaveError(null);
      const res = await fetch(`/api/forms/${formId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ schema: fields }),
      });
      if (!res.ok) throw new Error("Failed to save");
      setSavedAt(new Date());
    } catch {
      setSaveError("Could not save. Please try again.");
    } finally {
      setIsSaving(false);
    }
  }, [formId, fields]);

  const handlePublish = useCallback(async () => {
    try {
      setIsPublishing(true);
      const res = await fetch(`/api/forms/${formId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ isPublished: !isPublished }),
      });
      if (!res.ok) throw new Error("Failed to publish");
      setIsPublished(!isPublished);
    } catch {
      // silent fail
    } finally {
      setIsPublishing(false);
    }
  }, [formId, isPublished]);

  return (
    <div className="flex flex-col h-screen bg-[#F5F5F7] overflow-hidden">
      {/* Top bar */}
      <header className="h-14 shrink-0 flex items-center justify-between px-4 bg-white border-b border-slate-200 z-20">
        <div className="flex items-center gap-3">
          <button
            onClick={() => router.push("/dashboard")}
            className="flex items-center gap-1.5 text-slate-500 hover:text-slate-900 text-sm font-medium transition-colors"
          >
            <ArrowLeft className="h-4 w-4" />
            Back
          </button>
          <div className="h-5 w-px bg-slate-200" />
          <span className="text-sm font-semibold text-slate-800 truncate max-w-[200px]">
            {formTitle}
          </span>
          {/* Field counter pill */}
          <span className="text-[11px] font-semibold bg-slate-100 text-slate-500 px-2 py-0.5 rounded-full">
            {fields.length} {fields.length === 1 ? "field" : "fields"}
          </span>
        </div>

        <div className="flex items-center gap-2">
          {saveError && (
            <span className="text-xs text-red-500">{saveError}</span>
          )}
          {savedAt && !saveError && !isSaving && (
            <span className="flex items-center gap-1 text-xs text-emerald-600 font-medium">
              <CheckCircle2 className="h-3.5 w-3.5" />
              Saved {savedAt.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
            </span>
          )}
          <button
            onClick={() => setShowPreview(true)}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm font-medium text-slate-600 hover:bg-slate-100 transition-colors"
          >
            <Eye className="h-4 w-4" />
            Preview
          </button>
          <button
            onClick={handleSave}
            disabled={isSaving}
            className="flex items-center gap-1.5 px-4 py-1.5 rounded-lg bg-indigo-600 text-white text-sm font-semibold hover:bg-indigo-700 disabled:opacity-60 disabled:cursor-not-allowed transition-colors shadow-sm"
          >
            {isSaving ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <Save className="h-4 w-4" />
            )}
            {isSaving ? "Saving…" : "Save"}
          </button>
          <button
            onClick={handlePublish}
            disabled={isPublishing}
            className={`flex items-center gap-1.5 px-4 py-1.5 rounded-lg text-sm font-semibold transition-colors shadow-sm ${
              isPublished
                ? "bg-emerald-600 text-white hover:bg-emerald-700"
                : "bg-slate-900 text-white hover:bg-slate-800"
            } disabled:opacity-60 disabled:cursor-not-allowed`}
          >
            {isPublishing ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <Globe className="h-4 w-4" />
            )}
            {isPublished ? "Published" : "Publish"}
          </button>
        </div>
      </header>

      {/* 3-panel layout */}
      <div className="flex flex-1 overflow-hidden">
        {/* Left: Field palette */}
        <BuilderSidebar onAddField={addField} />

        {/* Center: Canvas */}
        <BuilderCanvas
          fields={fields}
          selectedFieldId={selectedFieldId}
          onSelectField={selectField}
          onDeleteField={deleteField}
          onMoveField={moveField}
          onReorderFields={reorderFields}
        />

        {/* Right: Properties */}
        <PropertiesPanel
          selectedField={selectedField}
          onUpdateField={updateField}
          onDeleteField={deleteField}
          onDuplicateField={duplicateField}
        />
      </div>

      {/* Preview Modal */}
      {showPreview && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-6">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-hidden flex flex-col">
            <div className="flex items-center justify-between px-6 py-4 border-b border-slate-200">
              <h2 className="text-lg font-semibold text-slate-800">Form Preview</h2>
              <button
                onClick={() => setShowPreview(false)}
                className="p-1.5 rounded-lg hover:bg-slate-100 transition-colors text-slate-500"
              >
                <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            <div className="flex-1 overflow-y-auto p-6">
              {fields.length === 0 ? (
                <p className="text-center text-slate-400 py-12">No fields to preview</p>
              ) : (
                <div className="space-y-6">
                  {fields.map((field) => (
                    <div key={field.id} className="space-y-1.5">
                      <label className="block text-sm font-semibold text-slate-700">
                        {field.label}
                        {field.required && <span className="ml-1 text-red-400">*</span>}
                      </label>
                      {field.helpText && (
                        <p className="text-xs text-slate-400">{field.helpText}</p>
                      )}
                      <PreviewField field={field} />
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function PreviewField({ field }: { field: FormField }) {
  const [value, setValue] = useState<string | string[] | boolean | undefined>(undefined);

  const handleChange = (val: string | string[] | boolean) => setValue(val);

  switch (field.type) {
    case "text":
      return (
        <input
          type="text"
          value={(value as string) ?? ""}
          onChange={(e) => handleChange(e.target.value)}
          placeholder={field.placeholder ?? ""}
          className="w-full border border-slate-200 rounded-xl px-4 py-3 text-sm text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-slate-300"
        />
      );
    case "textarea":
      return (
        <textarea
          value={(value as string) ?? ""}
          onChange={(e) => handleChange(e.target.value)}
          placeholder={field.placeholder ?? ""}
          rows={4}
          className="w-full border border-slate-200 rounded-xl px-4 py-3 text-sm text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-slate-300 resize-none"
        />
      );
    case "email":
      return (
        <input
          type="email"
          value={(value as string) ?? ""}
          onChange={(e) => handleChange(e.target.value)}
          placeholder={field.placeholder ?? "you@example.com"}
          className="w-full border border-slate-200 rounded-xl px-4 py-3 text-sm text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-slate-300"
        />
      );
    case "number":
      return (
        <input
          type="number"
          value={(value as string) ?? ""}
          onChange={(e) => handleChange(e.target.value)}
          placeholder={field.placeholder ?? "0"}
          className="w-full border border-slate-200 rounded-xl px-4 py-3 text-sm text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-slate-300"
        />
      );
    case "phone":
      return (
        <input
          type="tel"
          value={(value as string) ?? ""}
          onChange={(e) => handleChange(e.target.value)}
          placeholder={field.placeholder ?? "+1 (555) 000-0000"}
          className="w-full border border-slate-200 rounded-xl px-4 py-3 text-sm text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-slate-300"
        />
      );
    case "date":
      return (
        <input
          type="date"
          value={(value as string) ?? ""}
          onChange={(e) => handleChange(e.target.value)}
          className="w-full border border-slate-200 rounded-xl px-4 py-3 text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-slate-300"
        />
      );
    case "url":
      return (
        <input
          type="url"
          value={(value as string) ?? ""}
          onChange={(e) => handleChange(e.target.value)}
          placeholder={field.placeholder ?? "https://"}
          className="w-full border border-slate-200 rounded-xl px-4 py-3 text-sm text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-slate-300"
        />
      );
    case "radio":
      return (
        <div className="space-y-2.5">
          {(field.options ?? []).map((opt) => (
            <label
              key={opt.id}
              className="flex items-center gap-3 p-3 rounded-xl border border-slate-200 cursor-pointer hover:border-slate-300 transition-colors"
            >
              <input
                type="radio"
                name={field.id}
                value={opt.id}
                checked={value === opt.id}
                onChange={() => handleChange(opt.id)}
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
          value={(value as string) ?? ""}
          onChange={(e) => handleChange(e.target.value)}
          className="w-full border border-slate-200 rounded-xl px-4 py-3 text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-slate-300 appearance-none bg-white"
        >
          <option value="">Select an option</option>
          {(field.options ?? []).map((opt) => (
            <option key={opt.id} value={opt.id}>{opt.label}</option>
          ))}
        </select>
      );
    case "checkbox":
      return (
        <label className="flex items-center gap-3 p-3 rounded-xl border border-slate-200 cursor-pointer hover:border-slate-300 transition-colors">
          <input
            type="checkbox"
            checked={(value as boolean) ?? false}
            onChange={(e) => handleChange(e.target.checked)}
            className="w-4 h-4 text-slate-900 rounded focus:ring-slate-300"
          />
          <span className="text-sm text-slate-700">{field.label}</span>
        </label>
      );
    case "toggle":
      return (
        <button
          type="button"
          onClick={() => handleChange(!(value ?? false))}
          className={`relative w-12 h-6 rounded-full transition-colors duration-200 ${
            value ? "bg-slate-900" : "bg-slate-200"
          }`}
        >
          <span
            className={`absolute top-0.5 w-5 h-5 rounded-full bg-white shadow transition-transform duration-200 ${
              value ? "translate-x-6" : "translate-x-0.5"
            }`}
          />
        </button>
      );
    default:
      return (
        <input
          type="text"
          value={(value as string) ?? ""}
          onChange={(e) => handleChange(e.target.value)}
          placeholder={field.placeholder ?? ""}
          className="w-full border border-slate-200 rounded-xl px-4 py-3 text-sm text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-slate-300"
        />
      );
  }
}
