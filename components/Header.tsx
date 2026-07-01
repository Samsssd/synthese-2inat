"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { Activity, Bug, History, LayoutDashboard, LogOut, Menu, ShieldCheck, Target, X } from "lucide-react";
import { useAuthStore } from "@/lib/stores/useAuthStore";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/Button";

const PRIMARY_NAV = [
  { href: "/", label: "Vue d'ensemble", icon: LayoutDashboard },
  { href: "/bugs", label: "Défauts", icon: Bug },
  { href: "/incidents", label: "Incidents", icon: History },
  { href: "/campagnes", label: "Campagnes", icon: Target },
];

export function Header() {
  const pathname = usePathname();
  const user = useAuthStore((s) => s.user);
  const loading = useAuthStore((s) => s.loading);
  const signOut = useAuthStore((s) => s.signOut);

  const [mobileOpen, setMobileOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    setMobileOpen(false);
  }, [pathname]);

  const isActive = (href: string) =>
    href === "/" ? pathname === "/" : pathname.startsWith(href);

  return (
    <header
      className={cn(
        "sticky top-0 z-50 transition-colors duration-300",
        scrolled
          ? "border-b border-white/[0.07] bg-[var(--background)]/80 backdrop-blur-xl"
          : "border-b border-transparent bg-transparent"
      )}
    >
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between gap-4 px-4 sm:px-6 lg:px-8">
        {/* Wordmark */}
        <Link href="/" className="group flex items-center gap-2.5 shrink-0">
          <span className="relative inline-flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-emerald-400 to-teal-500 shadow-lg shadow-emerald-500/20">
            <Activity className="h-5 w-5 text-slate-950" strokeWidth={2.5} />
            <span className="absolute -bottom-0.5 -right-0.5 h-2.5 w-2.5 rounded-full bg-emerald-400 ring-2 ring-[var(--background)]" />
          </span>
          <span className="flex flex-col leading-none">
            <span className="text-[15px] font-semibold tracking-tight text-white">
              Synthèse
            </span>
            <span className="text-[10px] font-medium uppercase tracking-[0.18em] text-slate-500">
              QA Cockpit
            </span>
          </span>
        </Link>

        {/* Desktop nav */}
        <nav className="hidden items-center gap-1 lg:flex">
          {PRIMARY_NAV.map((item) => {
            const active = isActive(item.href);
            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  "group relative flex items-center gap-2 rounded-lg px-3 py-2 text-sm font-medium transition-colors",
                  active
                    ? "text-white"
                    : "text-slate-400 hover:text-slate-200"
                )}
              >
                <item.icon
                  className={cn(
                    "h-4 w-4 transition-colors",
                    active ? "text-emerald-400" : "text-slate-500 group-hover:text-slate-300"
                  )}
                />
                {item.label}
                {active && (
                  <span className="absolute inset-x-3 -bottom-px h-px bg-gradient-to-r from-transparent via-emerald-400 to-transparent" />
                )}
              </Link>
            );
          })}
        </nav>

        {/* Right actions */}
        <div className="flex items-center gap-2.5">
          {!loading && user ? (
            <div className="hidden items-center gap-3 sm:flex">
              <div className="flex items-center gap-2.5 rounded-full border border-white/[0.07] bg-white/[0.03] py-1 pl-1 pr-3">
                <span className="inline-flex h-7 w-7 items-center justify-center rounded-full bg-gradient-to-br from-emerald-400/20 to-teal-500/20 text-xs font-semibold text-emerald-300 ring-1 ring-inset ring-emerald-400/20">
                  {(user.full_name || user.email || "?").charAt(0).toUpperCase()}
                </span>
                <span className="max-w-[140px] truncate text-xs font-medium text-slate-300">
                  {user.full_name || user.email}
                </span>
              </div>
              <button
                onClick={() => signOut()}
                className="inline-flex h-9 w-9 items-center justify-center rounded-lg text-slate-400 ring-1 ring-inset ring-white/10 transition hover:bg-white/5 hover:text-rose-300 hover:ring-rose-400/30"
                aria-label="Se déconnecter"
                title="Se déconnecter"
              >
                <LogOut className="h-4 w-4" />
              </button>
            </div>
          ) : (
            !loading && (
              <div className="hidden items-center gap-2.5 sm:flex">
                <Link
                  href="/connexion"
                  className="rounded-lg px-3 py-2 text-sm font-medium text-slate-300 transition hover:text-white"
                >
                  Connexion
                </Link>
                <Link
                  href="/inscription"
                  className="inline-flex items-center gap-1.5 rounded-lg bg-emerald-500 px-3 py-2 text-sm font-medium text-slate-950 transition hover:bg-emerald-400"
                >
                  <ShieldCheck className="h-3.5 w-3.5" />
                  Créer un compte
                </Link>
              </div>
            )
          )}

          {/* Mobile toggle */}
          <button
            onClick={() => setMobileOpen((v) => !v)}
            className="inline-flex h-9 w-9 items-center justify-center rounded-lg text-slate-300 ring-1 ring-inset ring-white/10 transition hover:bg-white/5 lg:hidden"
            aria-label="Menu"
          >
            {mobileOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>
      </div>

      {/* Mobile panel */}
      {mobileOpen && (
        <div className="border-t border-white/[0.07] bg-[var(--background)]/95 backdrop-blur-xl lg:hidden">
          <nav className="mx-auto max-w-7xl space-y-1 px-4 py-4 sm:px-6">
            {PRIMARY_NAV.map((item) => {
              const active = isActive(item.href);
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={cn(
                    "flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors",
                    active
                      ? "bg-emerald-400/10 text-emerald-300 ring-1 ring-inset ring-emerald-400/20"
                      : "text-slate-300 hover:bg-white/5"
                  )}
                >
                  <item.icon className="h-4 w-4" />
                  {item.label}
                </Link>
              );
            })}
            <div className="!mt-4 border-t border-white/[0.07] pt-4">
              {!loading && user ? (
                <div className="flex items-center justify-between gap-3">
                  <div className="flex min-w-0 items-center gap-2.5">
                    <span className="inline-flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-emerald-400/20 to-teal-500/20 text-xs font-semibold text-emerald-300 ring-1 ring-inset ring-emerald-400/20">
                      {(user.full_name || user.email || "?").charAt(0).toUpperCase()}
                    </span>
                    <span className="truncate text-sm text-slate-300">
                      {user.full_name || user.email}
                    </span>
                  </div>
                  <button
                    onClick={() => signOut()}
                    className="inline-flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs font-medium text-rose-300 ring-1 ring-inset ring-rose-400/30 hover:bg-rose-500/10"
                  >
                    <LogOut className="h-3.5 w-3.5" />
                    Déconnexion
                  </button>
                </div>
              ) : (
                !loading && (
                  <div className="grid grid-cols-2 gap-2">
                    <Link
                      href="/connexion"
                      className="rounded-lg px-3 py-2.5 text-center text-sm font-medium text-slate-300 ring-1 ring-inset ring-white/10 hover:bg-white/5"
                    >
                      Connexion
                    </Link>
                    <Link
                      href="/inscription"
                      className="rounded-lg bg-emerald-500 px-3 py-2.5 text-center text-sm font-medium text-slate-950 hover:bg-emerald-400"
                    >
                      Créer un compte
                    </Link>
                  </div>
                )
              )}
            </div>
          </nav>
        </div>
      )}
    </header>
  );
}
