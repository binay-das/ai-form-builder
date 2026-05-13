import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { redirect } from "next/navigation";

export default async function SettingsPage() {
  const session = await getServerSession(authOptions);
  if (!session) redirect("/api/auth/signin");

  return (
    <div className="min-h-screen bg-slate-50 p-6">
      <div className="max-w-2xl mx-auto">
        <h1 className="text-2xl font-bold text-slate-900 mb-6">Settings</h1>

        <div className="bg-white rounded-xl border border-slate-200 divide-y divide-slate-200">
          <div className="p-6">
            <h2 className="text-lg font-semibold text-slate-800 mb-2">Account</h2>
            <p className="text-sm text-slate-500">Manage your account settings</p>
          </div>

          <div className="p-6">
            <h2 className="text-lg font-semibold text-slate-800 mb-2">Notifications</h2>
            <p className="text-sm text-slate-500">Configure notification preferences</p>
          </div>

          <div className="p-6">
            <h2 className="text-lg font-semibold text-slate-800 mb-2">Appearance</h2>
            <p className="text-sm text-slate-500">Customize the look and feel</p>
          </div>
        </div>
      </div>
    </div>
  );
}