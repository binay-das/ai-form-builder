"use client";

import { useState } from "react";
import { LayoutDashboard, FileText, Settings, ChevronLeft, ChevronRight } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";

const routes = [
  { label: "Forms", icon: LayoutDashboard, href: "/dashboard" },
  { label: "Responses", icon: FileText, href: "/responses" },
  { label: "Settings", icon: Settings, href: "/settings" },
];

export const Sidebar = () => {
  const [collapsed, setCollapsed] = useState(false);
  const pathname = usePathname();

  return (
    <div className={cn(
      "h-full flex flex-col bg-white border-r border-gray-200 transition-all duration-300",
      collapsed ? "w-16" : "w-64"
    )}>
      <div className="p-4 flex items-center justify-between border-b border-gray-200">
        {!collapsed && <span className="text-lg font-semibold text-gray-800">AI Form Builder</span>}
        <button
          onClick={() => setCollapsed(!collapsed)}
          className="p-1 rounded-md hover:bg-gray-100 text-gray-500"
        >
          {collapsed ? <ChevronRight className="h-4 w-4" /> : <ChevronLeft className="h-4 w-4" />}
        </button>
      </div>
      <nav className="flex-1 px-3 py-4 space-y-1">
        {routes.map((route) => (
          <Link
            key={route.href}
            href={route.href}
            className={cn(
              "flex items-center gap-3 px-3 py-2 rounded-md text-sm font-medium transition-colors",
              pathname === route.href
                ? "bg-gray-100 text-gray-900"
                : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"
            )}
          >
            <route.icon className="h-5 w-5 shrink-0" />
            {!collapsed && <span>{route.label}</span>}
          </Link>
        ))}
      </nav>
    </div>
  );
};
