"use client";

import { Users, Calendar, Trash2, Edit2, ExternalLink } from "lucide-react";
import { formatDistanceToNow } from "date-fns";
import { FormResponse } from "@/types/form";
import Link from "next/link";

interface FormCardProps {
  id: string;
  title: string;
  description: string | null;
  submissionCount: number;
  updatedAt: string;
  isPublished: boolean;
  viewMode?: "grid" | "list";
  onDelete: (id: string) => void;
}

export const FormCard = ({
  id,
  title,
  description,
  submissionCount,
  updatedAt,
  isPublished,
  viewMode = "grid",
  onDelete,
}: FormCardProps) => {
  if (viewMode === "list") {
    return (
      <div className="group flex items-center gap-4 bg-white border border-slate-200 rounded-xl px-5 py-4 hover:border-indigo-200 hover:shadow-sm transition-all">
        <span
          className={`w-2 h-2 rounded-full shrink-0 ${isPublished ? "bg-emerald-500" : "bg-slate-300"}`}
          title={isPublished ? "Published" : "Draft"}
        />

        <div className="flex-1 min-w-0">
          <h3 className="font-semibold text-slate-900 truncate">{title}</h3>
          {description && (
            <p className="text-sm text-slate-500 truncate mt-0.5">{description}</p>
          )}
        </div>

        <div className="hidden sm:flex items-center gap-6 text-xs text-slate-400 shrink-0">
          <span className="flex items-center gap-1.5">
            <Users className="h-3.5 w-3.5" />
            {submissionCount} responses
          </span>
          <span className="flex items-center gap-1.5">
            <Calendar className="h-3.5 w-3.5" />
            {formatDistanceToNow(new Date(updatedAt), { addSuffix: true })}
          </span>
        </div>

        <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
          <Link
            href={`/dashboard/forms/${id}/builder`}
            className="p-2 rounded-lg text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 transition-all"
            title="Open in builder"
          >
            <Edit2 className="h-4 w-4" />
          </Link>
          <button
            onClick={() => onDelete(id)}
            className="p-2 rounded-lg text-slate-400 hover:text-red-500 hover:bg-red-50 transition-all"
          >
            <Trash2 className="h-4 w-4" />
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="group flex flex-col bg-white border border-slate-200 rounded-2xl p-5 hover:border-indigo-200 hover:shadow-md transition-all duration-200">
      <div className="flex items-center justify-between mb-4">
        <span
          className={`inline-flex items-center gap-1.5 text-xs font-semibold px-2.5 py-1 rounded-full ${
            isPublished
              ? "bg-emerald-50 text-emerald-700"
              : "bg-slate-100 text-slate-500"
          }`}
        >
          <span className={`w-1.5 h-1.5 rounded-full ${isPublished ? "bg-emerald-500" : "bg-slate-400"}`} />
          {isPublished ? "Published" : "Draft"}
        </span>
        <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
          <Link
            href={`/dashboard/forms/${id}/builder`}
            className="p-1.5 rounded-lg text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 transition-all"
            title="Open in builder"
          >
            <Edit2 className="h-4 w-4" />
          </Link>
          <button
            onClick={() => onDelete(id)}
            className="p-1.5 rounded-lg text-slate-400 hover:text-red-500 hover:bg-red-50 transition-all"
          >
            <Trash2 className="h-4 w-4" />
          </button>
        </div>
      </div>

      <div className="flex-1 space-y-1.5 mb-5">
        <h3 className="font-bold text-slate-900 leading-snug">{title}</h3>
        <p className="text-sm text-slate-500 line-clamp-2 min-h-[2.5rem]">
          {description || "No description provided."}
        </p>
      </div>

      {/* Footer */}
      <div className="flex items-center justify-between pt-4 border-t border-slate-100 text-xs text-slate-400">
        <div className="flex items-center gap-4">
          <span className="flex items-center gap-1.5">
            <Users className="h-3.5 w-3.5" />
            {submissionCount} responses
          </span>
          <span className="flex items-center gap-1.5">
            <Calendar className="h-3.5 w-3.5" />
            {formatDistanceToNow(new Date(updatedAt), { addSuffix: true })}
          </span>
        </div>
        <Link
          href={`/forms/${id}`}
          className="flex items-center gap-1 text-indigo-500 hover:text-indigo-700 font-semibold transition-colors"
        >
          View <ExternalLink className="h-3 w-3" />
        </Link>
      </div>
    </div>
  );
};
