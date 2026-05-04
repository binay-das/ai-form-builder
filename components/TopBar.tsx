"use client";

import { LogOut, User } from "lucide-react";
import { signOut, useSession } from "next-auth/react";

export const TopBar = () => {
  const { data: session } = useSession();

  return (
    <div className="h-14 border-b border-gray-200 bg-white flex items-center justify-between px-6">
      <span className="text-lg font-semibold text-gray-800">AI Form Builder</span>
      <div className="flex items-center gap-4">
        <span className="text-sm text-gray-600">{session?.user?.name || session?.user?.email?.toString().slice(0, 2).toUpperCase() || "User"}</span>
        <button
          onClick={() => signOut()}
          className="p-1.5 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-md transition-colors"
        >
          <LogOut className="h-4 w-4" />
        </button>
      </div>
    </div>
  );
};
