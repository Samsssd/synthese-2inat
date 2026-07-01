"use client";

import { Activity, Bug, History, Target } from "lucide-react";

/**
 * Shared split-screen shell for the auth pages.
 * Left: branded aside with a QA-themed decorative panel.
 * Right: the form slot.
 */
export function AuthShell({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="relative min-h-[calc(100vh-4rem)] lg:min-h-[calc(100vh-4rem)] lg:grid lg:grid-cols-2">
      {/* ---------- Branded aside ---------- */}
      <aside className="relative hidden overflow-hidden border-r border-white/[0.07] bg-[var(--surface)]/40 lg:flex lg:flex-col lg:justify-between">
        <div className="pointer-events-none absolute inset-0 bg-grid opacity-60" />
        <div className="pointer-events-none absolute -left-24 top-1/4 h-72 w-72 rounded-full bg-emerald-500/[0.08] blur-3xl" />
        <div className="pointer-events-none absolute -right-16 bottom-0 h-80 w-80 rounded-full bg-teal-500/[0.06] blur-3xl" />

        {/* Brand */}
        <div className="relative z-10 p-10">
          <div className="flex items-center gap-2.5">
            <span className="relative inline-flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-emerald-400 to-teal-500 shadow-lg shadow-emerald-500/20">
              <Activity className="h-5 w-5 text-slate-950" strokeWidth={2.5} />
              <span className="absolute -bottom-0.5 -right-0.5 h-2.5 w-2.5 rounded-full bg-emerald-400 ring-2 ring-[var(--surface)]" />
            </span>
            <div className="leading-none">
              <p className="text-base font-semibold tracking-tight text-white">Synthèse</p>
              <p className="mt-0.5 text-[10px] font-medium uppercase tracking-[0.18em] text-slate-500">
                QA Cockpit
              </p>
            </div>
          </div>
        </div>

        {/* Headline */}
        <div className="relative z-10 px-10 pb-6">
          <h2 className="max-w-md text-balance text-3xl font-semibold leading-tight tracking-tight text-white">
            Pilotez la qualité logicielle en un coup d'œil.
          </h2>
          <p className="mt-4 max-w-md text-sm leading-relaxed text-slate-400">
            Centralisez l'analyse des défauts, l'historique des incidents et
            l'avancement des campagnes de test dans un tableau de bord unique.
          </p>
        </div>

        {/* Floating metric cards */}
        <div className="relative z-10 grid grid-cols-3 gap-3 px-10 pb-10">
          {[
            { icon: Bug, label: "Défauts", value: "Suivi", cls: "text-rose-300", ring: "ring-rose-400/20 bg-rose-500/[0.06]" },
            { icon: History, label: "Incidents", value: "Historique", cls: "text-amber-300", ring: "ring-amber-400/20 bg-amber-400/[0.06]" },
            { icon: Target, label: "Campagnes", value: "Avancement", cls: "text-emerald-300", ring: "ring-emerald-400/20 bg-emerald-400/[0.06]" },
          ].map((m) => (
            <div
              key={m.label}
              className={`rounded-xl p-4 ring-1 ring-inset ${m.ring} backdrop-blur`}
            >
              <m.icon className={`h-4 w-4 ${m.cls}`} />
              <p className="mt-3 text-sm font-semibold text-white">{m.value}</p>
              <p className="text-[11px] text-slate-500">{m.label}</p>
            </div>
          ))}
        </div>
      </aside>

      {/* ---------- Form side ---------- */}
      <div className="relative flex min-h-[calc(100vh-4rem)] items-center justify-center px-4 py-12 sm:px-6">
        <div className="pointer-events-none absolute inset-0 bg-dots opacity-40 lg:hidden" />
        <div className="relative z-10 w-full max-w-sm">{children}</div>
      </div>
    </div>
  );
}
