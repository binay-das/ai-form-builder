"use client";

import { useState, useCallback, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Loader2, ArrowLeft, Save, Eye, CheckCircle2 } from "lucide-react";
import { BuilderSidebar } from "./BuilderSidebar";
import { BuilderCanvas } from "./BuilderCanvas";
import { PropertiesPanel } from "./PropertiesPanel";
import { useBuilderState } from "@/lib/use-builder-state";
import { FormField } from "@/types/form";

interface BuilderClientProps {
  formId: string;
  formTitle: string;
  initialFields: FormField[];
}

export function BuilderClient({
  formId,
  formTitle,
  initialFields,
}: BuilderClientProps) {
  const router = useRouter();
  const [isSaving, setIsSaving] = useState(false);
  const [saveError, setSaveError] = useState<string | null>(null);
  const [savedAt, setSavedAt] = useState<Date | null>(null);

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
          <button className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm font-medium text-slate-600 hover:bg-slate-100 transition-colors">
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
    </div>
  );
}
