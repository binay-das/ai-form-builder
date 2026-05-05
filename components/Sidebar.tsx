"use client";

import { LayoutDashboard, FileText, Settings } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";

const routes = [
  { label: "Forms", icon: LayoutDashboard, href: "/dashboard" },
  { label: "Responses", icon: FileText, href: "/responses" },
  { label: "Settings", icon: Settings, href: "/settings" },
];

export const Sidebar = () => {
  const pathname = usePathname();

  return (
    <div className="h-full flex flex-col bg-white border-r border-slate-200">
      <div className="px-5 py-5 border-b border-slate-100">
        <span className="text-base font-bold text-slate-900 tracking-tight">
          AI Form Builder
        </span>
      </div>

      <nav className="flex-1 px-3 py-4 space-y-0.5">
        {routes.map((route) => {
          const isActive = pathname === route.href;
          return (
            <Link
              key={route.href}
              href={route.href}
              className={cn(
                "flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-colors",
                isActive
                  ? "bg-indigo-50 text-indigo-700"
                  : "text-slate-600 hover:bg-slate-50 hover:text-slate-900"
              )}
            >
              <route.icon
                className={cn(
                  "h-4 w-4 shrink-0",
                  isActive ? "text-indigo-600" : "text-slate-400"
                )}
              />
              {route.label}
            </Link>
          );
        })}
      </nav>
    </div>
  );
};
