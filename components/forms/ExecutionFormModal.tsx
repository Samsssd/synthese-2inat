"use client";

import { useEffect, useState } from "react";
import { CheckCircle2, Loader2, XCircle } from "lucide-react";
import { Modal } from "@/components/ui/Modal";
import { Field, Input, Select } from "@/components/ui/Field";
import { Button } from "@/components/ui/Button";
import { createTestExecution } from "@/app/actions/qa";
import { EXECUTION_RESULTS, LABELS } from "@/lib/constants";
import type { TestExecutionRow } from "@/lib/supabase/tables";

type FormState = {
  test_case_name: string;
  status: string;
  executed_at: string;
};

const EMPTY: FormState = {
  test_case_name: "",
  status: "ok",
  executed_at: "",
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

export function ExecutionFormModal({
  open,
  onClose,
  onCreated,
  campaignId,
  campaignName,
}: {
  open: boolean;
  onClose: () => void;
  onCreated: (execution: TestExecutionRow) => void;
  campaignId: string;
  campaignName: string;
}) {
  const [form, setForm] = useState<FormState>(EMPTY);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (open) {
      setForm({
        ...EMPTY,
        executed_at: toDatetimeLocalValue(new Date().toISOString()),
      });
      setError(null);
    }
  }, [open]);

  const update = (key: keyof FormState, value: string) =>
    setForm((f) => ({ ...f, [key]: value }));

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!form.test_case_name.trim()) {
      setError("Le nom du cas de test est requis.");
      return;
    }
    setSubmitting(true);
    setError(null);
    const executedIso = form.executed_at
      ? new Date(form.executed_at).toISOString()
      : null;
    const res = await createTestExecution({
      test_case_name: form.test_case_name.trim(),
      status: form.status || null,
      campaign_id: campaignId,
      executed_at: executedIso,
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
      title="Enregistrer un résultat"
      description={`Cas de test pour la campagne « ${campaignName} »`}
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
            ) : form.status === "ok" ? (
              <CheckCircle2 className="h-3.5 w-3.5" />
            ) : (
              <XCircle className="h-3.5 w-3.5" />
            )}
            {submitting ? "Enregistrement…" : "Enregistrer"}
          </Button>
        </>
      }
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        <Field label="Nom du cas de test" htmlFor="exec-name" required>
          <Input
            id="exec-name"
            value={form.test_case_name}
            onChange={(e) => update("test_case_name", e.target.value)}
            placeholder="ex. TC-014 — Paiement par carte valide"
            autoFocus
          />
        </Field>

        <div className="grid grid-cols-2 gap-4">
          <Field label="Résultat" htmlFor="exec-status">
            <Select
              id="exec-status"
              value={form.status}
              onChange={(e) => update("status", e.target.value)}
            >
              {EXECUTION_RESULTS.map((s) => (
                <option key={s} value={s}>
                  {LABELS[s]}
                </option>
              ))}
            </Select>
          </Field>

          <Field label="Date d'exécution" htmlFor="exec-date">
            <Input
              id="exec-date"
              type="datetime-local"
              value={form.executed_at}
              onChange={(e) => update("executed_at", e.target.value)}
            />
          </Field>
        </div>

        {error && (
          <p className="rounded-lg bg-rose-500/10 px-3 py-2 text-xs text-rose-300 ring-1 ring-inset ring-rose-400/20">
            {error}
          </p>
        )}
      </form>
    </Modal>
  );
}
