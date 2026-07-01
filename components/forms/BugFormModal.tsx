"use client";

import { useEffect, useState } from "react";
import { Bug as BugIcon, Loader2 } from "lucide-react";
import { Modal } from "@/components/ui/Modal";
import { Field, Input, Textarea, Select } from "@/components/ui/Field";
import { Button } from "@/components/ui/Button";
import { createBug } from "@/app/actions/qa";
import { supabase } from "@/lib/supabase/client";
import { TABLES } from "@/lib/supabase/tables";
import {
  BUG_STATUSES,
  SEVERITIES,
  LABELS,
} from "@/lib/constants";
import type { UserRow } from "@/lib/supabase/tables";
import type { BugRow } from "@/lib/supabase/tables";

type FormState = {
  title: string;
  description: string;
  status: string;
  severity: string;
  assigned_to: string;
};

const EMPTY: FormState = {
  title: "",
  description: "",
  status: "open",
  severity: "major",
  assigned_to: "",
};

export function BugFormModal({
  open,
  onClose,
  onCreated,
}: {
  open: boolean;
  onClose: () => void;
  onCreated: (bug: BugRow) => void;
}) {
  const [form, setForm] = useState<FormState>(EMPTY);
  const [users, setUsers] = useState<UserRow[]>([]);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!open) return;
    setForm(EMPTY);
    setError(null);
    supabase
      .from(TABLES.users)
      .select("id, email, full_name")
      .order("full_name", { ascending: true })
      .then(({ data }) => {
        if (data) setUsers(data as UserRow[]);
      });
  }, [open]);

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
    const res = await createBug({
      title: form.title.trim(),
      description: form.description.trim() || null,
      status: form.status || null,
      severity: form.severity || null,
      assigned_to: form.assigned_to || null,
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
      title="Nouveau défaut"
      description="Renseignez les informations du défaut à suivre."
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
              <BugIcon className="h-3.5 w-3.5" />
            )}
            {submitting ? "Création…" : "Créer le défaut"}
          </Button>
        </>
      }
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        <Field label="Titre" htmlFor="bug-title" required>
          <Input
            id="bug-title"
            value={form.title}
            onChange={(e) => update("title", e.target.value)}
            placeholder="ex. Échec d'authentification sur mobile"
            autoFocus
          />
        </Field>

        <Field label="Description" htmlFor="bug-desc">
          <Textarea
            id="bug-desc"
            value={form.description}
            onChange={(e) => update("description", e.target.value)}
            placeholder="Étapes pour reproduire, comportement attendu…"
          />
        </Field>

        <div className="grid grid-cols-2 gap-4">
          <Field label="Statut" htmlFor="bug-status">
            <Select
              id="bug-status"
              value={form.status}
              onChange={(e) => update("status", e.target.value)}
            >
              {BUG_STATUSES.map((s) => (
                <option key={s} value={s}>
                  {LABELS[s]}
                </option>
              ))}
            </Select>
          </Field>

          <Field label="Sévérité" htmlFor="bug-severity">
            <Select
              id="bug-severity"
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
        </div>

        <Field label="Assigné à" htmlFor="bug-assigned">
          <Select
            id="bug-assigned"
            value={form.assigned_to}
            onChange={(e) => update("assigned_to", e.target.value)}
          >
            <option value="">Non assigné</option>
            {users.map((u) => (
              <option key={u.id} value={u.id}>
                {u.full_name || u.email}
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
