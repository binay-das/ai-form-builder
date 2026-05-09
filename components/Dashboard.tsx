"use client";

import { useCallback, useEffect, useState } from "react";
import { Plus, LayoutGrid, List, Sparkles, Loader2 } from "lucide-react";
import { FormCard } from "./FormCard";
import { CreateFormModal } from "./CreateFormModal";
import { FormResponse } from "@/types/form";
import { cn } from "@/lib/utils";

type Tab = "all" | "published" | "draft";

export const Dashboard = () => {
  const [forms, setForms] = useState<FormResponse[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [activeTab, setActiveTab] = useState<Tab>("all");
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");

  const fetchForms = useCallback(async () => {
    try {
      setIsLoading(true);
      const response = await fetch("/api/forms");
      const data = await response.json();
      setForms(data);
    } catch (error) {
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchForms();
  }, [fetchForms]);

  // Optimistic delete — no extra DB round-trip
  const onDelete = async (id: string) => {
    if (!confirm("Delete this form? This cannot be undone.")) return;
    setForms((prev) => prev.filter((f) => f.id !== id));
    try {
      await fetch(`/api/forms/${id}`, { method: "DELETE" });
    } catch (error) {
      console.error(error);
      fetchForms(); // rollback on error
    }
  };

  const onFormCreated = (newForm: FormResponse) => {
    setForms((prev) => [newForm, ...prev]);
  };

  const filteredForms = forms.filter((f) => {
    if (activeTab === "published") return f.isPublished;
    if (activeTab === "draft") return !f.isPublished;
    return true;
  });

  const tabs: { key: Tab; label: string }[] = [
    { key: "all", label: `All (${forms.length})` },
    { key: "published", label: `Published (${forms.filter((f) => f.isPublished).length})` },
    { key: "draft", label: `Drafts (${forms.filter((f) => !f.isPublished).length})` },
  ];

  return (
    <div className="flex-1 min-h-screen bg-slate-50 text-slate-900">
      <div className="max-w-7xl mx-auto px-6 py-10 space-y-8">

        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-slate-900">Your Forms</h1>
            <p className="text-slate-500 mt-0.5 text-sm">Manage and share your forms.</p>
          </div>
          <div className="flex items-center gap-3">
            <button
              onClick={fetchForms}
              disabled={isLoading}
              className="p-2.5 rounded-xl bg-white border border-slate-200 text-slate-600 hover:bg-slate-50 hover:text-slate-900 transition-all disabled:opacity-50"
              title="Refresh forms"
            >
              <Loader2 className={cn("h-4 w-4", isLoading && "animate-spin")} />
            </button>
            <button
              onClick={() => setIsModalOpen(true)}
              className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-indigo-600 text-white font-semibold hover:bg-indigo-700 shadow-md shadow-indigo-200 transition-all text-sm"
            >
              <Plus className="h-4 w-4" />
              New Form
            </button>
          </div>
        </div>

        {/* Tabs + View toggle */}
        <div className="flex items-center justify-between border-b border-slate-200 pb-0">
          <div className="flex gap-1">
            {tabs.map((tab) => (
              <button
                key={tab.key}
                onClick={() => setActiveTab(tab.key)}
                className={`px-4 py-2.5 text-sm font-semibold rounded-t-lg transition-colors border-b-2 -mb-px ${
                  activeTab === tab.key
                    ? "border-indigo-600 text-indigo-600"
                    : "border-transparent text-slate-500 hover:text-slate-700"
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>
          <div className="flex items-center gap-1 bg-white border border-slate-200 rounded-lg p-1 mb-1">
            <button
              onClick={() => setViewMode("grid")}
              className={`p-1.5 rounded-md transition-colors ${
                viewMode === "grid" ? "bg-slate-100 text-slate-800" : "text-slate-400 hover:text-slate-600"
              }`}
            >
              <LayoutGrid className="h-4 w-4" />
            </button>
            <button
              onClick={() => setViewMode("list")}
              className={`p-1.5 rounded-md transition-colors ${
                viewMode === "list" ? "bg-slate-100 text-slate-800" : "text-slate-400 hover:text-slate-600"
              }`}
            >
              <List className="h-4 w-4" />
            </button>
          </div>
        </div>

        {isLoading ? (
          <div className="flex flex-col items-center justify-center py-32 space-y-3">
            <Loader2 className="h-8 w-8 text-indigo-500 animate-spin" />
            <p className="text-slate-400 text-sm">Loading your forms…</p>
          </div>
        ) : filteredForms.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-32 text-center border-2 border-dashed border-slate-200 rounded-2xl bg-white">
            <div className="w-16 h-16 bg-indigo-50 rounded-full flex items-center justify-center mb-4">
              <Sparkles className="h-7 w-7 text-indigo-500" />
            </div>
            <h2 className="text-lg font-bold text-slate-800">
              {activeTab === "all" ? "No forms yet" : `No ${activeTab} forms`}
            </h2>
            <p className="text-slate-500 text-sm mt-1 max-w-xs">
              {activeTab === "all"
                ? "Create your first form to start collecting responses."
                : "Switch to another tab or create a new form."}
            </p>
            {activeTab === "all" && (
              <button
                onClick={() => setIsModalOpen(true)}
                className="mt-6 flex items-center gap-2 px-5 py-2.5 rounded-xl bg-indigo-600 text-white font-semibold hover:bg-indigo-700 transition-all text-sm"
              >
                <Plus className="h-4 w-4" />
                Create a form
              </button>
            )}
          </div>
        ) : (
          <div
            className={
              viewMode === "grid"
                ? "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5"
                : "flex flex-col gap-3"
            }
          >
            {filteredForms.map((form) => (
              <FormCard
                key={form.id}
                id={form.id}
                title={form.title}
                description={form.description}
                submissionCount={form.submissionCount}
                updatedAt={form.updatedAt}
                isPublished={form.isPublished}
                viewMode={viewMode}
                onDelete={onDelete}
              />
            ))}
          </div>
        )}
      </div>

      <CreateFormModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onFormCreated={onFormCreated}
      />
    </div>
  );
};
