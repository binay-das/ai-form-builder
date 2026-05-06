"use client";

import { FormField } from "@/types/form";
import { FieldRenderer } from "./FieldRenderer";
import { Sparkles, MousePointerClick } from "lucide-react";

interface BuilderCanvasProps {
  fields: FormField[];
  selectedFieldId: string | null;
  onSelectField: (id: string | null) => void;
  onDeleteField: (id: string) => void;
  onMoveField: (id: string, direction: "up" | "down") => void;
  onReorderFields: (fields: FormField[]) => void;
}

export function BuilderCanvas({
  fields,
  selectedFieldId,
  onSelectField,
  onDeleteField,
  onMoveField,
}: BuilderCanvasProps) {
  return (
    <main
      className="flex-1 overflow-y-auto p-8"
      onClick={() => onSelectField(null)}
    >
      <div className="max-w-2xl mx-auto">
        {fields.length === 0 ? (
          <EmptyCanvas />
        ) : (
          <div className="space-y-3">
            {fields.map((field, index) => (
              <FieldRenderer
                key={field.id}
                field={field}
                index={index}
                total={fields.length}
                isSelected={selectedFieldId === field.id}
                onSelect={() => onSelectField(field.id)}
                onDelete={() => onDeleteField(field.id)}
                onMoveUp={() => onMoveField(field.id, "up")}
                onMoveDown={() => onMoveField(field.id, "down")}
              />
            ))}

            {/* Drop hint at bottom */}
            <div className="flex items-center gap-3 py-3 px-4 rounded-xl border-2 border-dashed border-slate-200 text-slate-400 text-sm">
              <MousePointerClick className="h-4 w-4 shrink-0" />
              Click a field in the sidebar to add more
            </div>
          </div>
        )}
      </div>
    </main>
  );
}

function EmptyCanvas() {
  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] text-center">
      <div className="w-20 h-20 rounded-2xl bg-indigo-50 flex items-center justify-center mb-5 shadow-sm">
        <Sparkles className="h-9 w-9 text-indigo-400" />
      </div>
      <h2 className="text-xl font-bold text-slate-800 mb-2">
        Start building your form
      </h2>
      <p className="text-slate-500 text-sm max-w-xs leading-relaxed">
        Click any field type in the left panel to add it to your form.
      </p>
    </div>
  );
}
