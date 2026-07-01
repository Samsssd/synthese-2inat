"use client";

import Link from "next/link";
import { Activity } from "lucide-react";

const FOOTER_LINKS = [
  { href: "/", label: "Vue d'ensemble" },
  { href: "/bugs", label: "Défauts" },
  { href: "/incidents", label: "Incidents" },
  { href: "/campagnes", label: "Campagnes" },
];

export function Footer() {
  return (
    <footer className="mt-auto border-t border-white/[0.07] bg-[var(--surface)]/40">
      <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
        <div className="flex flex-col items-start justify-between gap-8 md:flex-row md:items-center">
          <div className="flex items-center gap-2.5">
            <span className="inline-flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-emerald-400 to-teal-500 shadow-md shadow-emerald-500/20">
              <Activity className="h-4 w-4 text-slate-950" strokeWidth={2.5} />
            </span>
            <div className="leading-none">
              <p className="text-sm font-semibold text-white">Synthèse</p>
              <p className="mt-0.5 text-xs text-slate-500">
                Tableau de bord QA pour Test Lead
              </p>
            </div>
          </div>

          <nav className="flex flex-wrap items-center gap-x-6 gap-y-2">
            {FOOTER_LINKS.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="text-sm text-slate-400 transition-colors hover:text-emerald-300"
              >
                {link.label}
              </Link>
            ))}
          </nav>
        </div>

        <div className="mt-8 flex flex-col items-start justify-between gap-3 border-t border-white/[0.05] pt-6 text-xs text-slate-500 sm:flex-row sm:items-center">
          <p>© {new Date().getFullYear()} Synthèse — Pilotage de la qualité logicielle.</p>
          <p className="flex items-center gap-1.5">
            <span className="inline-block h-1.5 w-1.5 rounded-full bg-emerald-400" />
            Données synchronisées en temps réel
          </p>
        </div>
      </div>
    </footer>
  );
}
