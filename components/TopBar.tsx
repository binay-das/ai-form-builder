"use client";

import { LogOut, User } from "lucide-react";
import { signOut, useSession } from "next-auth/react";

export const TopBar = () => {
  const { data: session } = useSession();

  return (
    <div className="h-14 border-b border-gray-200 bg-white flex items-center justify-between px-6">
      <span className="text-lg font-semibold text-gray-800">AI Form Builder</span>
      <div className="flex items-center gap-3">
        <div className="flex items-center gap-2 px-3 py-1.5 bg-slate-50 rounded-full border border-slate-100">
          <User className="h-3.5 w-3.5 text-slate-500" />
          <span className="text-xs font-medium text-slate-700">
            {session?.user?.name || session?.user?.email?.toString().split('@')[0] || "User"}
          </span>
        </div>
        <button
          onClick={() => signOut()}
          className="p-1.5 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-lg transition-all"
          title="Sign out"
        >
          <LogOut className="h-4 w-4" />
        </button>
      </div>
    </div>
  );
};
