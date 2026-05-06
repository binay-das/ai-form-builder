"use client";

import { FormField, FieldOption } from "@/types/form";
import { Settings2, Trash2, Plus, X, Copy } from "lucide-react";
import { nanoid } from "nanoid";
import { cn } from "@/lib/utils";

interface PropertiesPanelProps {
  selectedField: FormField | null;
  onUpdateField: (id: string, updates: Partial<FormField>) => void;
  onDeleteField: (id: string) => void;
  onDuplicateField: (id: string) => void;
}

export function PropertiesPanel({
  selectedField,
  onUpdateField,
  onDeleteField,
  onDuplicateField,
}: PropertiesPanelProps) {
  if (!selectedField) {
    return (
      <aside className="w-72 shrink-0 bg-white border-l border-slate-200 flex flex-col items-center justify-center p-6 text-center">
        <div className="w-12 h-12 rounded-xl bg-slate-100 flex items-center justify-center mb-3">
          <Settings2 className="h-5 w-5 text-slate-400" />
        </div>
        <p className="text-sm font-medium text-slate-600">No field selected</p>
        <p className="text-xs text-slate-400 mt-1 leading-relaxed">
          Click a field on the canvas to edit its properties
        </p>
      </aside>
    );
  }

  const hasOptions = ["radio", "select"].includes(selectedField.type);

  return (
    <aside className="w-72 shrink-0 bg-white border-l border-slate-200 flex flex-col overflow-hidden">
      {/* Header */}
      <div className="px-4 py-3.5 border-b border-slate-100 flex items-center justify-between">
        <div>
          <h2 className="text-xs font-semibold text-slate-400 uppercase tracking-widest">
            Properties
          </h2>
          <p className="text-sm font-semibold text-slate-700 mt-0.5 capitalize">
            {selectedField.type} Field
          </p>
        </div>
        <div className="flex items-center gap-1">
          <button
            onClick={() => onDuplicateField(selectedField.id)}
            className="p-1.5 rounded-lg hover:bg-indigo-50 hover:text-indigo-600 text-slate-400 transition-colors"
            title="Duplicate field"
          >
            <Copy className="h-4 w-4" />
          </button>
          <button
            onClick={() => onDeleteField(selectedField.id)}
            className="p-1.5 rounded-lg hover:bg-red-50 hover:text-red-500 text-slate-400 transition-colors"
            title="Delete field"
          >
            <Trash2 className="h-4 w-4" />
          </button>
        </div>
      </div>

      {/* Scrollable form */}
      <div className="flex-1 overflow-y-auto p-4 space-y-5">
        {/* Label */}
        <PropertyField label="Label" required>
          <input
            id="prop-label"
            type="text"
            value={selectedField.label}
            onChange={(e) =>
              onUpdateField(selectedField.id, { label: e.target.value })
            }
            className={inputCls}
            placeholder="Field label"
          />
        </PropertyField>

        {/* Placeholder (not for radio/checkbox/toggle/date) */}
        {!["radio", "checkbox", "toggle", "select", "date"].includes(
          selectedField.type
        ) && (
          <PropertyField label="Placeholder text">
            <input
              id="prop-placeholder"
              type="text"
              value={selectedField.placeholder ?? ""}
              onChange={(e) =>
                onUpdateField(selectedField.id, { placeholder: e.target.value })
              }
              className={inputCls}
              placeholder="Optional placeholder"
            />
          </PropertyField>
        )}

        {/* Help text */}
        <PropertyField label="Help text">
          <input
            id="prop-help-text"
            type="text"
            value={selectedField.helpText ?? ""}
            onChange={(e) =>
              onUpdateField(selectedField.id, { helpText: e.target.value })
            }
            className={inputCls}
            placeholder="Optional helper message"
          />
        </PropertyField>

        {/* Required toggle */}
        <div className="flex items-center justify-between">
          <label
            htmlFor="prop-required"
            className="text-sm font-medium text-slate-700"
          >
            Required
          </label>
          <button
            id="prop-required"
            role="switch"
            aria-checked={selectedField.required}
            onClick={() =>
              onUpdateField(selectedField.id, {
                required: !selectedField.required,
              })
            }
            className={cn(
              "relative w-9 h-5 rounded-full transition-colors duration-200",
              selectedField.required ? "bg-indigo-500" : "bg-slate-200"
            )}
          >
            <span
              className={cn(
                "absolute top-0.5 w-4 h-4 rounded-full bg-white shadow-sm transition-transform duration-200",
                selectedField.required ? "translate-x-4" : "translate-x-0.5"
              )}
            />
          </button>
        </div>

        {/* Options (radio / select) */}
        {hasOptions && (
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">
              Options
            </label>
            <div className="space-y-1.5">
              {(selectedField.options ?? []).map((opt) => (
                <OptionRow
                  key={opt.id}
                  option={opt}
                  onChange={(label) => {
                    const next = (selectedField.options ?? []).map((o) =>
                      o.id === opt.id ? { ...o, label } : o
                    );
                    onUpdateField(selectedField.id, { options: next });
                  }}
                  onRemove={() => {
                    const next = (selectedField.options ?? []).filter(
                      (o) => o.id !== opt.id
                    );
                    onUpdateField(selectedField.id, { options: next });
                  }}
                />
              ))}
            </div>
            <button
              onClick={() => {
                const newOption: FieldOption = {
                  id: nanoid(),
                  label: `Option ${(selectedField.options?.length ?? 0) + 1}`,
                };
                onUpdateField(selectedField.id, {
                  options: [...(selectedField.options ?? []), newOption],
                });
              }}
              className="mt-2 flex items-center gap-1.5 text-xs font-medium text-indigo-600 hover:text-indigo-800 transition-colors"
            >
              <Plus className="h-3.5 w-3.5" />
              Add option
            </button>
          </div>
        )}
      </div>
    </aside>
  );
}

/* ------------------------------------------------------------------ */
/* Sub-components                                                        */
/* ------------------------------------------------------------------ */

function PropertyField({
  label,
  required,
  children,
}: {
  label: string;
  required?: boolean;
  children: React.ReactNode;
}) {
  return (
    <div className="space-y-1.5">
      <label className="block text-sm font-medium text-slate-700">
        {label}
        {required && <span className="ml-1 text-red-400">*</span>}
      </label>
      {children}
    </div>
  );
}

function OptionRow({
  option,
  onChange,
  onRemove,
}: {
  option: FieldOption;
  onChange: (label: string) => void;
  onRemove: () => void;
}) {
  return (
    <div className="flex items-center gap-1.5">
      <input
        type="text"
        value={option.label}
        onChange={(e) => onChange(e.target.value)}
        className={cn(inputCls, "flex-1")}
        placeholder="Option label"
      />
      <button
        onClick={onRemove}
        className="p-1.5 rounded-lg hover:bg-red-50 hover:text-red-500 text-slate-300 transition-colors shrink-0"
      >
        <X className="h-3.5 w-3.5" />
      </button>
    </div>
  );
}

const inputCls =
  "w-full text-sm border border-slate-200 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-300 focus:border-indigo-300 transition-shadow placeholder:text-slate-300";
