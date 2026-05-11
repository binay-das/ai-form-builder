import { CheckCircle2 } from "lucide-react";
import Link from "next/link";

export default function FormSuccessPage() {
  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center p-6">
      <div className="w-full max-w-lg text-center space-y-6">
        <div className="w-20 h-20 rounded-full bg-slate-900 flex items-center justify-center mx-auto">
          <CheckCircle2 className="h-10 w-10 text-white" />
        </div>
        <div className="space-y-2">
          <h1 className="text-3xl font-bold text-slate-900">Response submitted</h1>
          <p className="text-slate-500">
            Thank you for your response. We have received it successfully.
          </p>
        </div>
        <Link
          href="/"
          className="inline-block px-6 py-3 rounded-xl bg-slate-900 text-white font-semibold hover:bg-slate-800 transition-colors"
        >
          Back to home
        </Link>
      </div>
    </div>
  );
}