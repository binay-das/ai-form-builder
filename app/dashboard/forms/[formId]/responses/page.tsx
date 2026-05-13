import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { normalizeSchema } from "@/lib/schema-validation";

interface ResponsesPageProps {
  params: Promise<{ formId: string }>;
}

export default async function ResponsesPage({ params }: ResponsesPageProps) {
  const { formId } = await params;
  const session = await getServerSession(authOptions);
  if (!session) redirect("/api/auth/signin");

  const form = await prisma.form.findFirst({
    where: { id: formId, userId: session.user.id },
  });

  if (!form) redirect("/dashboard");

  const responses = await prisma.response.findMany({
    where: { formId },
    orderBy: { submittedAt: "desc" },
  });

  const normalized = normalizeSchema(form.schema as any);

  return (
    <ResponsesClient
      formTitle={form.title}
      fields={normalized.fields}
      initialResponses={responses.map((r) => ({
        ...r,
        answers: r.answers as Record<string, string>,
        submittedAt: r.submittedAt.toISOString(),
      }))}
    />
  );
}

"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { ArrowLeft, Eye, X, Calendar, Download } from "lucide-react";
import { FormField } from "@/types/form";
import { Skeleton } from "@/components/ui/skeleton";

interface Response {
  id: string;
  formId: string;
  answers: Record<string, string>;
  submittedAt: string;
}

interface ResponsesClientProps {
  formTitle: string;
  fields: FormField[];
  initialResponses: Response[];
}

export function ResponsesClient({
  formTitle,
  fields,
  initialResponses,
}: ResponsesClientProps) {
  const router = useRouter();
  const [responses] = useState(initialResponses);
  const [selectedResponse, setSelectedResponse] = useState<Response | null>(null);
  const [loading, setLoading] = useState(false);

  const formatDate = (dateStr: string) => {
    return new Date(dateStr).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
      hour: "numeric",
      minute: "2-digit",
    });
  };

  const exportCSV = () => {
    const headers = ["Submitted At", ...fields.map((f) => f.label)];
    const rows = responses.map((r) => [
      formatDate(r.submittedAt),
      ...fields.map((f) => {
        const val = r.answers[f.id];
        if (f.type === "select" || f.type === "radio") {
          const opt = f.options?.find((o) => o.id === val);
          return opt?.label || val || "";
        }
        if (f.type === "checkbox" || f.type === "toggle") {
          return val === "true" ? "Yes" : val === "false" ? "No" : "";
        }
        return val || "";
      }),
    ]);

    const csv = [headers.join(","), ...rows.map((row) => row.map((cell) => `"${cell}"`).join(","))].join("\n");
    const blob = new Blob([csv], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `${formTitle}-responses.csv`;
    a.click();
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50 p-6">
        <div className="max-w-4xl mx-auto">
          <div className="flex items-center gap-4 mb-6">
            <Skeleton className="h-8 w-8" />
            <Skeleton className="h-8 w-48" />
          </div>
          <div className="bg-white rounded-xl border border-slate-200 p-6 space-y-4">
            {[1, 2, 3].map((i) => (
              <div key={i} className="flex items-center gap-4">
                <Skeleton className="h-4 w-32" />
                <Skeleton className="h-4 w-64" />
                <Skeleton className="h-8 w-16 ml-auto" />
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (responses.length === 0) {
    return (
      <div className="min-h-screen bg-slate-50 p-6">
        <div className="max-w-4xl mx-auto">
          <div className="flex items-center gap-4 mb-6">
            <button onClick={() => router.push("/dashboard")} className="text-slate-500 hover:text-slate-900">
              <ArrowLeft className="h-5 w-5" />
            </button>
            <div>
              <h1 className="text-2xl font-bold text-slate-900">{formTitle}</h1>
              <p className="text-sm text-slate-500">Responses</p>
            </div>
          </div>
          <div className="bg-white rounded-xl p-12 text-center border border-slate-200">
            <p className="text-slate-500 text-lg">No responses yet</p>
            <p className="text-slate-400 text-sm mt-2">Responses will appear here once respondents submit the form.</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 p-6">
      <div className="max-w-4xl mx-auto">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-4">
            <button onClick={() => router.push("/dashboard")} className="text-slate-500 hover:text-slate-900">
              <ArrowLeft className="h-5 w-5" />
            </button>
            <div>
              <h1 className="text-2xl font-bold text-slate-900">{formTitle}</h1>
              <p className="text-sm text-slate-500">Responses</p>
            </div>
          </div>
          {responses.length > 0 && (
            <button
              onClick={exportCSV}
              className="flex items-center gap-2 px-4 py-2 bg-slate-900 text-white rounded-lg text-sm font-medium hover:bg-slate-800 transition-colors"
            >
              <Download className="h-4 w-4" />
              Export CSV
            </button>
          )}
        </div>

        <div className="bg-white rounded-xl border border-slate-200 overflow-hidden">
          <table className="w-full">
            <thead className="bg-slate-50 border-b border-slate-200">
              <tr>
                <th className="text-left px-4 py-3 text-xs font-semibold text-slate-500 uppercase">Submitted</th>
                <th className="text-left px-4 py-3 text-xs font-semibold text-slate-500 uppercase">Answers</th>
                <th className="text-right px-4 py-3 text-xs font-semibold text-slate-500 uppercase">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {responses.map((response) => (
                <tr key={response.id} className="hover:bg-slate-50 transition-colors">
                  <td className="px-4 py-3 text-sm text-slate-600">
                    <div className="flex items-center gap-2">
                      <Calendar className="h-4 w-4 text-slate-400" />
                      {formatDate(response.submittedAt)}
                    </div>
                  </td>
                  <td className="px-4 py-3 text-sm text-slate-600">
                    <div className="space-y-1">
                      {fields.slice(0, 3).map((field) => {
                        const val = response.answers[field.id];
                        if (!val) return null;
                        let displayVal = val;
                        if (field.type === "select" || field.type === "radio") {
                          const opt = field.options?.find((o) => o.id === val);
                          displayVal = opt?.label || val;
                        }
                        return (
                          <div key={field.id} className="flex items-center gap-2">
                            <span className="text-xs text-slate-400">{field.label}:</span>
                            <span className="text-xs text-slate-600">{displayVal}</span>
                          </div>
                        );
                      })}
                    </div>
                  </td>
                  <td className="px-4 py-3 text-right">
                    <button
                      onClick={() => setSelectedResponse(response)}
                      className="inline-flex items-center gap-1 px-3 py-1 text-sm text-slate-600 hover:text-slate-900 hover:bg-slate-100 rounded-lg transition-colors"
                    >
                      <Eye className="h-4 w-4" />
                      View
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {selectedResponse && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-6">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-hidden flex flex-col">
            <div className="flex items-center justify-between px-6 py-4 border-b border-slate-200">
              <h2 className="text-lg font-semibold text-slate-800">Response Details</h2>
              <button
                onClick={() => setSelectedResponse(null)}
                className="p-1.5 rounded-lg hover:bg-slate-100 transition-colors text-slate-500"
              >
                <X className="h-5 w-5" />
              </button>
            </div>
            <div className="flex-1 overflow-y-auto p-6 space-y-4">
              {fields.map((field) => (
                <div key={field.id} className="border-b border-slate-100 pb-4">
                  <label className="block text-sm font-semibold text-slate-700 mb-1">{field.label}</label>
                  <p className="text-sm text-slate-600">{selectedResponse.answers[field.id] || "—"}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}