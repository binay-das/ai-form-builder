"use client";

import { useState } from "react";
import {
  X,
  Sparkles,
  Loader2,
  Plus,
  Trash2,
  GripVertical,
  ChevronDown,
  ChevronUp,
  ArrowLeft,
  ArrowRight,
  Type,
  AlignLeft,
  Hash,
  Mail,
  Phone,
  Calendar,
  CheckSquare,
  Circle,
  List,
  ToggleLeft,
  Link,
} from "lucide-react";

// ─── Types ────────────────────────────────────────────────────────────────────

type FieldType =
  | "text"
  | "textarea"
  | "email"
  | "number"
  | "phone"
  | "date"
  | "checkbox"
  | "radio"
  | "select"
  | "toggle"
  | "url";

interface FieldOption {
  id: string;
  label: string;
}

interface FormField {
  id: string;
  type: FieldType;
  label: string;
  placeholder?: string;
  required: boolean;
  options?: FieldOption[];
  helpText?: string;
}

const FIELD_TYPES: { type: FieldType; label: string; icon: React.ReactNode }[] = [
  { type: "text",     label: "Short Text",   icon: <Type className="h-4 w-4" /> },
  { type: "textarea", label: "Long Text",    icon: <AlignLeft className="h-4 w-4" /> },
  { type: "email",    label: "Email",        icon: <Mail className="h-4 w-4" /> },
  { type: "number",   label: "Number",       icon: <Hash className="h-4 w-4" /> },
  { type: "phone",    label: "Phone",        icon: <Phone className="h-4 w-4" /> },
  { type: "date",     label: "Date",         icon: <Calendar className="h-4 w-4" /> },
  { type: "select",   label: "Dropdown",     icon: <List className="h-4 w-4" /> },
  { type: "radio",    label: "Multiple Choice", icon: <Circle className="h-4 w-4" /> },
  { type: "checkbox", label: "Checkboxes",   icon: <CheckSquare className="h-4 w-4" /> },
  { type: "toggle",   label: "Toggle",       icon: <ToggleLeft className="h-4 w-4" /> },
  { type: "url",      label: "URL",          icon: <Link className="h-4 w-4" /> },
];

function uid() {
  return Math.random().toString(36).slice(2, 9);
}

interface CreateFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  onFormCreated?: (form: any) => void;
}

function FieldTypeButton({
  type, label, icon, onClick,
}: { type: FieldType; label: string; icon: React.ReactNode; onClick: () => void }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="flex items-center gap-2 px-3 py-2 rounded-lg border border-slate-200 bg-white hover:bg-indigo-50 hover:border-indigo-200 text-slate-600 text-sm font-medium transition-all group"
    >
      <span className="text-indigo-500 group-hover:text-indigo-600 transition-colors">{icon}</span>
      {label}
    </button>
  );
}

function FieldEditor({
  field,
  index,
  total,
  onChange,
  onDelete,
  onMoveUp,
  onMoveDown,
}: {
  field: FormField;
  index: number;
  total: number;
  onChange: (f: FormField) => void;
  onDelete: () => void;
  onMoveUp: () => void;
  onMoveDown: () => void;
}) {
  const [expanded, setExpanded] = useState(true);

  const typeInfo = FIELD_TYPES.find((t) => t.type === field.type)!;
  const hasOptions = ["select", "radio", "checkbox"].includes(field.type);

  const addOption = () => {
    onChange({
      ...field,
      options: [...(field.options ?? []), { id: uid(), label: `Option ${(field.options?.length ?? 0) + 1}` }],
    });
  };

  const updateOption = (id: string, label: string) => {
    onChange({
      ...field,
      options: (field.options ?? []).map((o) => (o.id === id ? { ...o, label } : o)),
    });
  };

  const removeOption = (id: string) => {
    onChange({ ...field, options: (field.options ?? []).filter((o) => o.id !== id) });
  };

  return (
    <div className="border border-slate-200 rounded-xl bg-white overflow-hidden shadow-sm hover:shadow-md transition-shadow">
      <div className="flex items-center gap-3 px-4 py-3 bg-slate-50/50">
        <GripVertical className="h-4 w-4 text-slate-300 cursor-grab shrink-0" />
        <div className="flex items-center gap-2 text-indigo-500 shrink-0">
          {typeInfo.icon}
          <span className="text-xs text-slate-500 font-semibold uppercase tracking-wider">{typeInfo.label}</span>
        </div>
        <span className="flex-1 text-sm text-slate-900 font-medium truncate">
          {field.label || <span className="text-slate-400 italic font-normal">Untitled field</span>}
        </span>
        <div className="flex items-center gap-1">
          <button
            type="button"
            onClick={onMoveUp}
            disabled={index === 0}
            className="p-1.5 rounded-lg hover:bg-slate-100 text-slate-400 disabled:opacity-30 transition-all"
          >
            <ChevronUp className="h-4 w-4" />
          </button>
          <button
            type="button"
            onClick={onMoveDown}
            disabled={index === total - 1}
            className="p-1.5 rounded-lg hover:bg-slate-100 text-slate-400 disabled:opacity-30 transition-all"
          >
            <ChevronDown className="h-4 w-4" />
          </button>
          <button
            type="button"
            onClick={() => setExpanded((v) => !v)}
            className="p-1.5 rounded-lg hover:bg-slate-100 text-slate-400 transition-all"
          >
            {expanded ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
          </button>
          <button
            type="button"
            onClick={onDelete}
            className="p-1.5 rounded-lg hover:bg-red-50 text-slate-400 hover:text-red-500 transition-all"
          >
            <Trash2 className="h-4 w-4" />
          </button>
        </div>
      </div>

      {expanded && (
        <div className="px-4 pb-4 space-y-4 pt-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-slate-700 uppercase tracking-wider">Field Label *</label>
              <input
                value={field.label}
                onChange={(e) => onChange({ ...field, label: e.target.value })}
                placeholder="e.g. Full Name"
                className="w-full bg-slate-50 border border-slate-200 rounded-lg py-2 px-3 text-slate-900 placeholder-slate-400 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all"
              />
            </div>

            {!["checkbox", "radio", "toggle", "date"].includes(field.type) && (
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-slate-700 uppercase tracking-wider">Placeholder</label>
                <input
                  value={field.placeholder ?? ""}
                  onChange={(e) => onChange({ ...field, placeholder: e.target.value })}
                  placeholder="Hint shown inside the field"
                  className="w-full bg-slate-50 border border-slate-200 rounded-lg py-2 px-3 text-slate-900 placeholder-slate-400 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all"
                />
              </div>
            )}
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-slate-700 uppercase tracking-wider">Help Text</label>
            <input
              value={field.helpText ?? ""}
              onChange={(e) => onChange({ ...field, helpText: e.target.value })}
              placeholder="Optional description shown below the field"
              className="w-full bg-slate-50 border border-slate-200 rounded-lg py-2 px-3 text-slate-900 placeholder-slate-400 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all"
            />
          </div>

          {hasOptions && (
            <div className="space-y-2 pt-2 border-t border-slate-100">
              <label className="text-xs font-semibold text-slate-700 uppercase tracking-wider">Options</label>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                {(field.options ?? []).map((opt) => (
                  <div key={opt.id} className="flex items-center gap-2 group/opt">
                    <input
                      value={opt.label}
                      onChange={(e) => updateOption(opt.id, e.target.value)}
                      className="flex-1 bg-slate-50 border border-slate-200 rounded-lg py-1.5 px-3 text-slate-900 placeholder-slate-400 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all"
                    />
                    <button
                      type="button"
                      onClick={() => removeOption(opt.id)}
                      className="p-1.5 rounded-lg text-slate-300 hover:text-red-500 hover:bg-red-50 transition-all"
                    >
                      <X className="h-4 w-4" />
                    </button>
                  </div>
                ))}
                <button
                  type="button"
                  onClick={addOption}
                  className="flex items-center justify-center gap-1.5 px-3 py-1.5 rounded-lg border border-dashed border-slate-300 text-slate-500 hover:text-indigo-600 hover:border-indigo-300 hover:bg-indigo-50 transition-all text-sm"
                >
                  <Plus className="h-4 w-4" />
                  Add option
                </button>
              </div>
            </div>
          )}

          <div className="flex items-center justify-between pt-3 border-t border-slate-100">
            <span className="text-xs font-semibold text-slate-700 uppercase tracking-wider">Required Field</span>
            <button
              type="button"
              onClick={() => onChange({ ...field, required: !field.required })}
              className={`relative w-10 h-5 rounded-full transition-all duration-200 ${
                field.required ? "bg-indigo-600" : "bg-slate-200"
              }`}
            >
              <span
                className={`absolute top-0.5 left-0.5 w-4 h-4 rounded-full bg-white shadow-sm transition-transform duration-200 ${
                  field.required ? "translate-x-5" : "translate-x-0"
                }`}
              />
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

export const CreateFormModal = ({ isOpen, onClose, onFormCreated }: CreateFormModalProps) => {
  const [step, setStep] = useState<1 | 2>(1);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [fields, setFields] = useState<FormField[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  if (!isOpen) return null;

  const resetAndClose = () => {
    setStep(1);
    setTitle("");
    setDescription("");
    setFields([]);
    onClose();
  };

  const addField = (type: FieldType) => {
    const hasOptions = ["select", "radio", "checkbox"].includes(type);
    setFields((prev) => [
      ...prev,
      {
        id: uid(),
        type,
        label: "",
        placeholder: "",
        required: false,
        helpText: "",
        options: hasOptions ? [{ id: uid(), label: "Option 1" }, { id: uid(), label: "Option 2" }] : undefined,
      },
    ]);
  };

  const updateField = (id: string, updated: FormField) => {
    setFields((prev) => prev.map((f) => (f.id === id ? updated : f)));
  };

  const deleteField = (id: string) => {
    setFields((prev) => prev.filter((f) => f.id !== id));
  };

  const moveField = (index: number, direction: "up" | "down") => {
    setFields((prev) => {
      const arr = [...prev];
      const target = direction === "up" ? index - 1 : index + 1;
      [arr[index], arr[target]] = [arr[target], arr[index]];
      return arr;
    });
  };

  const onSubmit = async () => {
    if (!title.trim()) return;
    try {
      setIsLoading(true);
      const response = await fetch("/api/forms", {
        method: "POST",
        body: JSON.stringify({ title, description, schema: fields }),
        headers: { "Content-Type": "application/json" },
      });

      if (response.ok) {
        const newForm = await response.json();
        onFormCreated?.(newForm);
        resetAndClose();
      }
    } catch (error) {
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 lg:p-8">
      <div
        className="absolute inset-0 bg-slate-900/40 backdrop-blur-[2px] transition-opacity duration-300"
        onClick={resetAndClose}
      />

      <div
        className={`relative w-full bg-white rounded-2xl shadow-2xl flex flex-col transition-all duration-500 ease-out transform ${
          step === 2 ? "max-w-5xl max-h-[90vh]" : "max-w-xl"
        }`}
      >
        <div className="flex items-center justify-between px-8 py-6 border-b border-slate-100 shrink-0">
          <div className="flex items-center gap-4">
            <div className="w-10 h-10 bg-indigo-50 rounded-xl flex items-center justify-center border border-indigo-100">
              <Sparkles className="h-5 w-5 text-indigo-600" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-slate-900">
                {step === 1 ? "Create New Form" : "Build Your Form"}
              </h2>
              <p className="text-sm text-slate-500 font-medium">
                Step {step} of 2 — {step === 1 ? "Basic settings" : "Design your fields"}
              </p>
            </div>
          </div>
          <div className="flex items-center gap-6">
            <div className="hidden sm:flex gap-2">
              {[1, 2].map((s) => (
                <div
                  key={s}
                  className={`h-1.5 rounded-full transition-all duration-300 ${
                    s <= step ? "w-8 bg-indigo-600" : "w-4 bg-slate-200"
                  }`}
                />
              ))}
            </div>
            <button
              onClick={resetAndClose}
              className="p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-lg transition-all"
            >
              <X className="h-5 w-5" />
            </button>
          </div>
        </div>

        {/* Step 1: Basic Info */}
        {step === 1 && (
          <div className="px-10 py-8 space-y-6">
            <div className="space-y-2">
              <label className="text-xs font-bold text-slate-700 uppercase tracking-widest">Form Title</label>
              <input
                required
                autoFocus
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="e.g. Product Feedback Survey"
                className="w-full bg-slate-50 border border-slate-200 rounded-xl py-3.5 px-4 text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all text-lg"
              />
            </div>
            <div className="space-y-2">
              <label className="text-xs font-bold text-slate-700 uppercase tracking-widest">Description (Optional)</label>
              <textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Tell your respondents what this form is about..."
                rows={4}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl py-3.5 px-4 text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all resize-none"
              />
            </div>
            <div className="flex gap-4 pt-4">
              <button
                type="button"
                onClick={resetAndClose}
                className="flex-1 py-3 px-6 rounded-xl border border-slate-200 text-slate-600 font-semibold hover:bg-slate-50 hover:border-slate-300 transition-all"
              >
                Cancel
              </button>
              <button
                type="button"
                disabled={!title.trim()}
                onClick={() => setStep(2)}
                className="flex-[1.5] py-3 px-6 rounded-xl bg-indigo-600 text-white font-bold hover:bg-indigo-700 shadow-lg shadow-indigo-200 transition-all disabled:opacity-40 disabled:shadow-none flex items-center justify-center gap-2"
              >
                Next: Build Fields
                <ArrowRight className="h-4 w-4" />
              </button>
            </div>
          </div>
        )}

        {/* Step 2: Field Builder */}
        {step === 2 && (
          <>
            <div className="flex-1 overflow-y-auto px-8 py-6 space-y-4 min-h-0 bg-slate-50/30">
              {fields.length === 0 && (
                <div className="flex flex-col items-center justify-center py-20 text-center border-2 border-dashed border-slate-200 rounded-2xl bg-white/50">
                  <div className="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center mb-4">
                    <Plus className="h-8 w-8 text-slate-400" />
                  </div>
                  <h3 className="text-slate-900 font-bold text-lg">Your form is empty</h3>
                  <p className="text-slate-500 max-w-xs mx-auto mt-1">Start building by choosing a field type from the panel below.</p>
                </div>
              )}

              <div className="max-w-4xl mx-auto space-y-4">
                {fields.map((field, i) => (
                  <FieldEditor
                    key={field.id}
                    field={field}
                    index={i}
                    total={fields.length}
                    onChange={(updated) => updateField(field.id, updated)}
                    onDelete={() => deleteField(field.id)}
                    onMoveUp={() => moveField(i, "up")}
                    onMoveDown={() => moveField(i, "down")}
                  />
                ))}
              </div>
            </div>

            <div className="px-8 py-6 border-t border-slate-100 shrink-0 bg-white">
              <p className="text-[10px] font-bold text-slate-400 uppercase tracking-[0.2em] mb-4 text-center">Available Field Types</p>
              <div className="max-w-4xl mx-auto flex flex-wrap justify-center gap-2">
                {FIELD_TYPES.map(({ type, label, icon }) => (
                  <FieldTypeButton
                    key={type}
                    type={type}
                    label={label}
                    icon={icon}
                    onClick={() => addField(type)}
                  />
                ))}
              </div>
            </div>

            <div className="px-8 py-6 flex justify-between items-center shrink-0 border-t border-slate-100 bg-slate-50/50 rounded-b-2xl">
              <button
                type="button"
                onClick={() => setStep(1)}
                className="flex items-center gap-2 py-2.5 px-5 rounded-xl border border-slate-200 bg-white text-slate-600 font-semibold hover:bg-slate-50 transition-all"
              >
                <ArrowLeft className="h-4 w-4" />
                Settings
              </button>
              
              <div className="flex items-center gap-4">
                <span className="hidden sm:block text-sm font-medium text-slate-500">
                  {fields.length} field{fields.length !== 1 ? "s" : ""} added
                </span>
                <button
                  type="button"
                  disabled={isLoading || fields.length === 0}
                  onClick={onSubmit}
                  className="py-2.5 px-8 rounded-xl bg-indigo-600 text-white font-bold hover:bg-indigo-700 shadow-lg shadow-indigo-200 transition-all disabled:opacity-40 disabled:shadow-none flex items-center justify-center gap-2 min-w-[160px]"
                >
                  {isLoading ? (
                    <Loader2 className="h-5 w-5 animate-spin" />
                  ) : (
                    <>
                      <Sparkles className="h-4 w-4" />
                      Create Form
                    </>
                  )}
                </button>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
};
