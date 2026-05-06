"use client";

import {
  Type,
  AlignLeft,
  Mail,
  Hash,
  Phone,
  Circle,
  CheckSquare,
  ChevronDown,
  ToggleLeft,
  Calendar,
  Link,
} from "lucide-react";
import { FIELD_TYPE_CONFIGS, FIELD_GROUPS } from "@/lib/field-type-config";
import { FormField } from "@/types/form";

const ICON_MAP: Record<string, React.ElementType> = {
  Type,
  AlignLeft,
  Mail,
  Hash,
  Phone,
  Circle,
  CheckSquare,
  ChevronDown,
  ToggleLeft,
  Calendar,
  Link,
};

interface BuilderSidebarProps {
  onAddField: (field: Omit<FormField, "id">) => void;
}

export function BuilderSidebar({ onAddField }: BuilderSidebarProps) {
  return (
    <aside className="w-64 shrink-0 bg-white border-r border-slate-200 flex flex-col overflow-hidden">
      <div className="px-4 py-3.5 border-b border-slate-100">
        <h2 className="text-xs font-semibold text-slate-400 uppercase tracking-widest">
          Fields
        </h2>
      </div>

      <div className="flex-1 overflow-y-auto px-3 py-3 space-y-5">
        {FIELD_GROUPS.map((group) => {
          const groupFields = FIELD_TYPE_CONFIGS.filter(
            (cfg) => cfg.group === group.key
          );
          return (
            <div key={group.key}>
              <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-2 px-1">
                {group.label}
              </p>
              <div className="grid grid-cols-2 gap-1.5">
                {groupFields.map((cfg) => {
                  const Icon = ICON_MAP[cfg.icon] ?? Type;
                  return (
                    <button
                      key={cfg.type}
                      onClick={() => onAddField(cfg.defaultField)}
                      title={cfg.description}
                      className="group flex flex-col items-center gap-1.5 p-2.5 rounded-xl border border-slate-200 bg-slate-50 hover:bg-indigo-50 hover:border-indigo-200 transition-all text-slate-700 hover:text-indigo-700 cursor-pointer select-none"
                    >
                      <Icon className="h-4 w-4 text-slate-400 group-hover:text-indigo-500 transition-colors" />
                      <span className="text-[11px] font-medium text-center leading-tight">
                        {cfg.label}
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>
          );
        })}
      </div>
    </aside>
  );
}
