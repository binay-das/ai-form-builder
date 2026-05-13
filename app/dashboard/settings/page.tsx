import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";

export default async function SettingsPage() {
  const session = await getServerSession(authOptions);
  if (!session) redirect("/api/auth/signin");

  const user = await prisma.user.findUnique({
    where: { id: session.user.id },
    select: { name: true, email: true },
  });

  return (
    <div className="min-h-screen bg-slate-50 p-6">
      <div className="max-w-2xl mx-auto">
        <h1 className="text-2xl font-bold text-slate-900 mb-6">Settings</h1>

        <div className="bg-white rounded-xl border border-slate-200 divide-y divide-slate-200">
          <div className="p-6">
            <h2 className="text-lg font-semibold text-slate-800 mb-2">Account</h2>
            <p className="text-sm text-slate-500 mb-4">Manage your account settings</p>
            <div className="space-y-4">
              <div>
                <label className="text-sm font-medium text-slate-700">Email</label>
                <p className="text-sm text-slate-600">{user?.email}</p>
              </div>
              <div>
                <label className="text-sm font-medium text-slate-700">Name</label>
                <p className="text-sm text-slate-600">{user?.name || "Not set"}</p>
              </div>
            </div>
          </div>

          <div className="p-6">
            <h2 className="text-lg font-semibold text-slate-800 mb-2">Notifications</h2>
            <p className="text-sm text-slate-500 mb-4">Configure notification preferences</p>
            <div className="space-y-4">
              <label className="flex items-center gap-3 cursor-pointer">
                <input type="checkbox" defaultChecked className="w-4 h-4 rounded border-slate-300" />
                <span className="text-sm text-slate-700">Email notifications for new responses</span>
              </label>
              <label className="flex items-center gap-3 cursor-pointer">
                <input type="checkbox" defaultChecked className="w-4 h-4 rounded border-slate-300" />
                <span className="text-sm text-slate-700">Email notifications for form updates</span>
              </label>
            </div>
          </div>

          <div className="p-6">
            <h2 className="text-lg font-semibold text-slate-800 mb-2">Appearance</h2>
            <p className="text-sm text-slate-500 mb-4">Customize the look and feel</p>
            <div>
              <label className="text-sm font-medium text-slate-700 block mb-2">Theme</label>
              <select className="w-full max-w-xs px-3 py-2 border border-slate-200 rounded-lg text-sm">
                <option>Light</option>
                <option>Dark</option>
                <option>System</option>
              </select>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}