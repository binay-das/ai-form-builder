"use client";

import { FormField } from "@/types/form";
import { Trash2, GripVertical, Pencil } from "lucide-react";
import { cn } from "@/lib/utils";

interface FieldRendererProps {
  field: FormField;
  index: number;
  isSelected: boolean;
  onSelect: () => void;
  onDelete: () => void;
}

export function FieldRenderer({
  field,
  isSelected,
  onSelect,
  onDelete,
}: FieldRendererProps) {
  return (
    <div
      onClick={(e) => {
        e.stopPropagation();
        onSelect();
      }}
      className={cn(
        "group relative bg-white rounded-xl border-2 p-4 cursor-pointer transition-all duration-150",
        isSelected
          ? "border-indigo-400 shadow-md shadow-indigo-100 ring-4 ring-indigo-50"
          : "border-slate-200 hover:border-slate-300 hover:shadow-sm"
      )}
    >
      <div className="absolute left-2 top-1/2 -translate-y-1/2 opacity-0 group-hover:opacity-30 transition-opacity">
        <GripVertical className="h-4 w-4 text-slate-400" />
      </div>

      <button
        onClick={(e) => {
          e.stopPropagation();
          onDelete();
        }}
        className="absolute right-3 top-3 opacity-0 group-hover:opacity-100 transition-opacity p-1 rounded-lg hover:bg-red-50 hover:text-red-500 text-slate-400"
        title="Delete field"
      >
        <Trash2 className="h-3.5 w-3.5" />
      </button>

      <div className="space-y-2 pl-3">
        <div className="flex items-center gap-2">
          <label className="text-sm font-semibold text-slate-700">
            {field.label || <span className="italic text-slate-300">Untitled field</span>}
            {field.required && (
              <span className="ml-1 text-red-400">*</span>
            )}
          </label>
          {isSelected ? (
            <>
              <span className="text-[10px] bg-indigo-100 text-indigo-600 font-semibold px-1.5 py-0.5 rounded-md uppercase tracking-wide">
                {field.type}
              </span>
              <span className="flex items-center gap-0.5 text-[10px] text-indigo-400 font-medium">
                <Pencil className="h-2.5 w-2.5" />
                Edit in panel →
              </span>
            </>
          ) : null}
        </div>

        {field.helpText && (
          <p className="text-xs text-slate-400">{field.helpText}</p>
        )}

        <FieldPreview field={field} />
      </div>
    </div>
  );
}

function FieldPreview({ field }: { field: FormField }) {
  switch (field.type) {
    case "textarea":
      return (
        <textarea
          readOnly
          rows={3}
          placeholder={field.placeholder ?? "Enter text…"}
          className="w-full text-sm border border-slate-200 rounded-lg px-3 py-2 resize-none bg-slate-50 text-slate-400 cursor-pointer focus:outline-none"
        />
      );

    case "radio":
      return (
        <div className="space-y-1.5">
          {(field.options ?? []).map((opt) => (
            <label key={opt.id} className="flex items-center gap-2 text-sm text-slate-500 cursor-pointer">
              <span className="w-4 h-4 rounded-full border-2 border-slate-300 shrink-0" />
              {opt.label}
            </label>
          ))}
        </div>
      );

    case "checkbox":
      return (
        <label className="flex items-center gap-2 text-sm text-slate-500 cursor-pointer">
          <span className="w-4 h-4 rounded border-2 border-slate-300 shrink-0" />
          {field.label}
        </label>
      );

    case "select":
      return (
        <select
          disabled
          className="w-full text-sm border border-slate-200 rounded-lg px-3 py-2 bg-slate-50 text-slate-400 cursor-pointer focus:outline-none appearance-none"
        >
          <option>Select an option…</option>
          {(field.options ?? []).map((opt) => (
            <option key={opt.id}>{opt.label}</option>
          ))}
        </select>
      );

    case "toggle":
      return (
        <div className="flex items-center gap-2">
          <div className="w-9 h-5 rounded-full bg-slate-200 relative shrink-0">
            <div className="absolute left-0.5 top-0.5 w-4 h-4 rounded-full bg-white shadow-sm" />
          </div>
          <span className="text-sm text-slate-400">Off</span>
        </div>
      );

    case "date":
      return (
        <input
          readOnly
          type="date"
          className="w-full text-sm border border-slate-200 rounded-lg px-3 py-2 bg-slate-50 text-slate-400 cursor-pointer focus:outline-none"
        />
      );

    default:
      return (
        <input
          readOnly
          type={field.type === "email" ? "email" : field.type === "number" ? "number" : "text"}
          placeholder={field.placeholder ?? ""}
          className="w-full text-sm border border-slate-200 rounded-lg px-3 py-2 bg-slate-50 text-slate-400 cursor-pointer focus:outline-none"
        />
      );
  }
}
