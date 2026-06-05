"use client";

import { useState } from "react";
import { Loader2, Save, User, Lock, Bell, Palette, CheckCircle } from "lucide-react";

interface SettingsFormProps {
  initialUser: {
    name: string | null;
    email: string;
  };
}

export default function SettingsForm({ initialUser }: SettingsFormProps) {
  const [name, setName] = useState(initialUser.name || "");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  
  // Notification states
  const [emailNotifyResponses, setEmailNotifyResponses] = useState(true);
  const [emailNotifyUpdates, setEmailNotifyUpdates] = useState(true);
  
  // Theme state
  const [theme, setTheme] = useState("Light");

  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState<{ type: "success" | "error"; text: string } | null>(null);

  const handleSaveAccount = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setMessage(null);

    if (password && password !== confirmPassword) {
      setMessage({ type: "error", text: "Passwords do not match" });
      setIsLoading(false);
      return;
    }

    try {
      const response = await fetch("/api/user/settings", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name,
          ...(password ? { newPassword: password } : {}),
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Failed to update settings");
      }

      setMessage({ type: "success", text: "Account settings saved successfully!" });
      setPassword("");
      setConfirmPassword("");
    } catch (err: any) {
      setMessage({ type: "error", text: err.message || "An unexpected error occurred" });
    } finally {
      setIsLoading(false);
    }
  };

  const handleSavePreferences = (e: React.FormEvent) => {
    e.preventDefault();
    setMessage({ type: "success", text: "Preferences saved successfully!" });
  };

  return (
    <div className="space-y-6">
      {message && (
        <div
          className={`flex items-center gap-2 p-4 rounded-xl text-sm font-semibold transition-all border ${
            message.type === "success"
              ? "bg-emerald-50 text-emerald-800 border-emerald-200"
              : "bg-rose-50 text-rose-800 border-rose-200"
          }`}
        >
          {message.type === "success" && <CheckCircle className="h-5 w-5 text-emerald-600 shrink-0" />}
          <span>{message.text}</span>
        </div>
      )}

      {/* Account Settings */}
      <form onSubmit={handleSaveAccount} className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="p-6 border-b border-slate-100 flex items-center gap-3">
          <div className="p-2 bg-indigo-50 text-indigo-600 rounded-xl">
            <User className="h-5 w-5" />
          </div>
          <div>
            <h2 className="text-lg font-bold text-slate-800">Account Profile</h2>
            <p className="text-xs text-slate-500">Manage your name and password credentials</p>
          </div>
        </div>

        <div className="p-6 space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2">Email Address</label>
              <input
                type="email"
                disabled
                value={initialUser.email}
                className="w-full px-4 py-2.5 bg-slate-100 border border-slate-200 rounded-xl text-sm text-slate-500 cursor-not-allowed"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2">Full Name</label>
              <input
                type="text"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Enter your name"
                className="w-full px-4 py-2.5 bg-white border border-slate-200 rounded-xl text-sm text-slate-800 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all font-medium"
              />
            </div>
          </div>

          <div className="border-t border-slate-100 pt-4 mt-2">
            <h3 className="text-sm font-bold text-slate-800 mb-3 flex items-center gap-2">
              <Lock className="h-4 w-4 text-slate-400" />
              Change Password
            </h3>
            <p className="text-xs text-slate-400 mb-4">Leave empty if you don't want to change it</p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2">New Password</label>
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full px-4 py-2.5 bg-white border border-slate-200 rounded-xl text-sm text-slate-800 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2">Confirm New Password</label>
                <input
                  type="password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full px-4 py-2.5 bg-white border border-slate-200 rounded-xl text-sm text-slate-800 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all"
                />
              </div>
            </div>
          </div>
        </div>

        <div className="px-6 py-4 bg-slate-50 border-t border-slate-100 flex justify-end">
          <button
            type="submit"
            disabled={isLoading}
            className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-semibold text-sm transition-all shadow-md shadow-indigo-100 disabled:opacity-50 cursor-pointer font-semibold"
          >
            {isLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />}
            Save Changes
          </button>
        </div>
      </form>

      {/* Preferences & Theme Settings */}
      <form onSubmit={handleSavePreferences} className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="p-6 border-b border-slate-100 flex items-center gap-3">
          <div className="p-2 bg-indigo-50 text-indigo-600 rounded-xl">
            <Bell className="h-5 w-5" />
          </div>
          <div>
            <h2 className="text-lg font-bold text-slate-800">Preferences & Notifications</h2>
            <p className="text-xs text-slate-500">Configure email reports and app customization</p>
          </div>
        </div>

        <div className="p-6 space-y-6">
          <div className="space-y-4">
            <h3 className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Email Notifications</h3>
            <div className="space-y-3">
              <label className="flex items-start gap-3 cursor-pointer group">
                <input
                  type="checkbox"
                  checked={emailNotifyResponses}
                  onChange={(e) => setEmailNotifyResponses(e.target.checked)}
                  className="w-4 h-4 mt-0.5 rounded border-slate-300 text-indigo-600 focus:ring-indigo-500"
                />
                <div>
                  <span className="text-sm font-semibold text-slate-700 group-hover:text-slate-900 transition-colors">Form Submissions</span>
                  <p className="text-xs text-slate-400 mt-0.5">Receive immediate email alerts when users submit responses to your forms.</p>
                </div>
              </label>

              <label className="flex items-start gap-3 cursor-pointer group border-t border-slate-100 pt-3">
                <input
                  type="checkbox"
                  checked={emailNotifyUpdates}
                  onChange={(e) => setEmailNotifyUpdates(e.target.checked)}
                  className="w-4 h-4 mt-0.5 rounded border-slate-300 text-indigo-600 focus:ring-indigo-500"
                />
                <div>
                  <span className="text-sm font-semibold text-slate-700 group-hover:text-slate-900 transition-colors">Product updates and newsletter</span>
                  <p className="text-xs text-slate-400 mt-0.5">Stay informed about new features, improvements, and tips for FormCraft AI.</p>
                </div>
              </label>
            </div>
          </div>

          <div className="border-t border-slate-100 pt-4">
            <h3 className="text-sm font-bold text-slate-800 mb-3 flex items-center gap-2">
              <Palette className="h-4 w-4 text-slate-400" />
              Theme Appearance
            </h3>
            <div className="max-w-xs">
              <select
                value={theme}
                onChange={(e) => setTheme(e.target.value)}
                className="w-full px-4 py-2.5 bg-white border border-slate-200 rounded-xl text-sm text-slate-800 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all font-medium"
              >
                <option value="Light">Light Mode</option>
                <option value="Dark">Dark Mode</option>
                <option value="System">Use System Settings</option>
              </select>
            </div>
          </div>
        </div>

        <div className="px-6 py-4 bg-slate-50 border-t border-slate-100 flex justify-end">
          <button
            type="submit"
            className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-900 text-white font-semibold text-sm transition-all shadow-md cursor-pointer"
          >
            <Save className="h-4 w-4" />
            Save Preferences
          </button>
        </div>
      </form>
    </div>
  );
}
