"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  Map,
  Calendar,
  BrainCircuit,
  Settings,
  Menu,
  X,
} from "lucide-react";
import { clsx } from "clsx";
import { twMerge } from "tailwind-merge";
import { useState } from "react";
import { SignOutButton } from "@/components/sign-out-button";

const navItems = [
  { href: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { href: "/dashboard/roadmap", label: "Roadmap", icon: Map },
  { href: "/dashboard/planner", label: "Planner", icon: Calendar },
  { href: "/dashboard/quiz", label: "AI Quiz", icon: BrainCircuit },
  { href: "/dashboard/settings", label: "Settings", icon: Settings },
] as const;

interface SidebarProps {
  email: string;
  role: string;
}

function cn(...inputs: Parameters<typeof clsx>) {
  return twMerge(clsx(inputs));
}

export function Sidebar({ email, role }: SidebarProps) {
  const pathname = usePathname();
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      {/* Mobile menu button */}
      <button
        type="button"
        onClick={() => setIsOpen((o) => !o)}
        className="fixed left-4 top-4 z-50 rounded-lg bg-slate-800 p-2 text-slate-300 lg:hidden"
        aria-label={isOpen ? "Close menu" : "Open menu"}
      >
        {isOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
      </button>

      {/* Overlay for mobile */}
      {isOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/50 lg:hidden"
          onClick={() => setIsOpen(false)}
          aria-hidden
        />
      )}

      {/* Sidebar */}
      <aside
        className={cn(
          "fixed left-0 top-0 z-40 h-full w-64 border-r border-slate-800 bg-slate-900/95 transition-transform duration-200 lg:translate-x-0",
          isOpen ? "translate-x-0" : "-translate-x-full"
        )}
      >
        <div className="flex h-full flex-col">
          <div className="flex h-16 items-center border-b border-slate-800 px-6 lg:pl-6">
            <Link
              href="/dashboard"
              className="text-lg font-semibold text-white"
              onClick={() => setIsOpen(false)}
            >
              Relanto Pulse
            </Link>
          </div>

          <nav className="flex-1 space-y-0.5 px-4 py-4">
            {navItems.map(({ href, label, icon: Icon }) => {
              const isActive =
                href === "/dashboard"
                  ? pathname === "/dashboard"
                  : pathname === href || pathname.startsWith(href + "/");
              return (
                <Link
                  key={href}
                  href={href}
                  onClick={() => setIsOpen(false)}
                  className={cn(
                    "flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors",
                    isActive
                      ? "bg-sky-500/15 text-sky-300"
                      : "text-slate-400 hover:bg-slate-800 hover:text-slate-100"
                  )}
                >
                  <Icon className="h-5 w-5 shrink-0" />
                  {label}
                </Link>
              );
            })}
          </nav>

          {/* User widget */}
          <div className="border-t border-slate-800 p-4 space-y-2">
            <div className="flex items-center gap-3 rounded-lg bg-slate-800/60 p-3">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-slate-700 text-sm font-semibold text-slate-300">
                {email.charAt(0).toUpperCase()}
              </div>
              <div className="min-w-0 flex-1">
                <p className="truncate text-sm font-medium text-slate-100">
                  {email}
                </p>
                <p className="truncate text-xs text-slate-400">{role}</p>
              </div>
            </div>
            <div className="[&_button]:w-full [&_button]:rounded-lg [&_button]:py-1.5 [&_button]:text-xs">
              <SignOutButton />
            </div>
          </div>
        </div>
      </aside>
    </>
  );
}
