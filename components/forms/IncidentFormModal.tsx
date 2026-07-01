"use client";

import { useEffect, useState } from "react";
import { History, Loader2 } from "lucide-react";
import { Modal } from "@/components/ui/Modal";
import { Field, Input, Textarea, Select } from "@/components/ui/Field";
import { Button } from "@/components/ui/Button";
import { createIncident } from "@/app/actions/qa";
import { useDashboardStore } from "@/lib/stores/useDashboardStore";
import {
  INCIDENT_STATUSES,
  SEVERITIES,
  LABELS,
} from "@/lib/constants";
import type { IncidentRow } from "@/lib/supabase/tables";

type FormState = {
  title: string;
  description: string;
  occurred_at: string;
  severity: string;
  status: string;
  bug_id: string;
};

const EMPTY: FormState = {
  title: "",
  description: "",
  occurred_at: "",
  severity: "major",
  status: "open",
  bug_id: "",
};

function toDatetimeLocalValue(iso: string | null | undefined): string {
  if (!iso) return "";
  const d = new Date(iso);
  if (isNaN(d.getTime())) return "";
  const pad = (n: number) => String(n).padStart(2, "0");
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}T${pad(
    d.getHours()
  )}:${pad(d.getMinutes())}`;
}

export function IncidentFormModal({
  open,
  onClose,
  onCreated,
}: {
  open: boolean;
  onClose: () => void;
  onCreated: (incident: IncidentRow) => void;
}) {
  const bugs = useDashboardStore((s) => s.bugs);
  const fetched = useDashboardStore((s) => s.fetched);
  const fetchDashboard = useDashboardStore((s) => s.fetchDashboard);
  const [form, setForm] = useState<FormState>(EMPTY);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (open) {
      setForm({ ...EMPTY, occurred_at: toDatetimeLocalValue(new Date().toISOString()) });
      setError(null);
      if (!fetched) fetchDashboard();
    }
  }, [open, fetched, fetchDashboard]);

  const update = (key: keyof FormState, value: string) =>
    setForm((f) => ({ ...f, [key]: value }));

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!form.title.trim()) {
      setError("Le titre est requis.");
      return;
    }
    setSubmitting(true);
    setError(null);
    const occurredIso = form.occurred_at
      ? new Date(form.occurred_at).toISOString()
      : null;
    const res = await createIncident({
      title: form.title.trim(),
      description: form.description.trim() || null,
      occurred_at: occurredIso,
      severity: form.severity || null,
      status: form.status || null,
      bug_id: form.bug_id || null,
    });
    setSubmitting(false);
    if ("error" in res) {
      setError(res.error);
      return;
    }
    onCreated(res.data);
    onClose();
  }

  return (
    <Modal
      open={open}
      onClose={onClose}
      title="Nouvel incident"
      description="Enregistrez un incident survenu et liez-le à un défaut si nécessaire."
      size="md"
      footer={
        <>
          <Button variant="ghost" size="sm" onClick={onClose} disabled={submitting}>
            Annuler
          </Button>
          <Button
            variant="primary"
            size="sm"
            onClick={handleSubmit}
            disabled={submitting}
            className="gap-2"
          >
            {submitting ? (
              <Loader2 className="h-3.5 w-3.5 animate-spin" />
            ) : (
              <History className="h-3.5 w-3.5" />
            )}
            {submitting ? "Enregistrement…" : "Enregistrer"}
          </Button>
        </>
      }
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        <Field label="Titre" htmlFor="inc-title" required>
          <Input
            id="inc-title"
            value={form.title}
            onChange={(e) => update("title", e.target.value)}
            placeholder="ex. Indisponibilité du module de paiement"
            autoFocus
          />
        </Field>

        <Field label="Description" htmlFor="inc-desc">
          <Textarea
            id="inc-desc"
            value={form.description}
            onChange={(e) => update("description", e.target.value)}
            placeholder="Contexte, impact, périmètre concerné…"
          />
        </Field>

        <Field label="Date de l'incident" htmlFor="inc-occurred">
          <Input
            id="inc-occurred"
            type="datetime-local"
            value={form.occurred_at}
            onChange={(e) => update("occurred_at", e.target.value)}
          />
        </Field>

        <div className="grid grid-cols-2 gap-4">
          <Field label="Sévérité" htmlFor="inc-severity">
            <Select
              id="inc-severity"
              value={form.severity}
              onChange={(e) => update("severity", e.target.value)}
            >
              {SEVERITIES.map((s) => (
                <option key={s} value={s}>
                  {LABELS[s]}
                </option>
              ))}
            </Select>
          </Field>

          <Field label="Statut" htmlFor="inc-status">
            <Select
              id="inc-status"
              value={form.status}
              onChange={(e) => update("status", e.target.value)}
            >
              {INCIDENT_STATUSES.map((s) => (
                <option key={s} value={s}>
                  {LABELS[s]}
                </option>
              ))}
            </Select>
          </Field>
        </div>

        <Field label="Bug lié" htmlFor="inc-bug">
          <Select
            id="inc-bug"
            value={form.bug_id}
            onChange={(e) => update("bug_id", e.target.value)}
          >
            <option value="">Aucun</option>
            {bugs.map((b) => (
              <option key={b.id} value={b.id}>
                {b.title || "Sans titre"}
              </option>
            ))}
          </Select>
        </Field>

        {error && (
          <p className="rounded-lg bg-rose-500/10 px-3 py-2 text-xs text-rose-300 ring-1 ring-inset ring-rose-400/20">
            {error}
          </p>
        )}
      </form>
    </Modal>
  );
}
