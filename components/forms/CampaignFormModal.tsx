"use client";

import { useEffect, useState } from "react";
import { Loader2, Target } from "lucide-react";
import { Modal } from "@/components/ui/Modal";
import { Field, Input, Select } from "@/components/ui/Field";
import { Button } from "@/components/ui/Button";
import { createTestCampaign } from "@/app/actions/qa";
import { CAMPAIGN_STATUSES, LABELS } from "@/lib/constants";
import type { TestCampaignRow } from "@/lib/supabase/tables";

type FormState = {
  name: string;
  objective_total: string;
  status: string;
};

const EMPTY: FormState = {
  name: "",
  objective_total: "",
  status: "planned",
};

export function CampaignFormModal({
  open,
  onClose,
  onCreated,
}: {
  open: boolean;
  onClose: () => void;
  onCreated: (campaign: TestCampaignRow) => void;
}) {
  const [form, setForm] = useState<FormState>(EMPTY);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (open) {
      setForm(EMPTY);
      setError(null);
    }
  }, [open]);

  const update = (key: keyof FormState, value: string) =>
    setForm((f) => ({ ...f, [key]: value }));

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!form.name.trim()) {
      setError("Le nom est requis.");
      return;
    }
    setSubmitting(true);
    setError(null);
    const res = await createTestCampaign({
      name: form.name.trim(),
      objective_total: form.objective_total
        ? Number(form.objective_total)
        : null,
      status: form.status || null,
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
      title="Nouvelle campagne de test"
      description="Définissez une campagne et son objectif total de cas de test à exécuter."
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
              <Target className="h-3.5 w-3.5" />
            )}
            {submitting ? "Création…" : "Créer la campagne"}
          </Button>
        </>
      }
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        <Field label="Nom de la campagne" htmlFor="camp-name" required>
          <Input
            id="camp-name"
            value={form.name}
            onChange={(e) => update("name", e.target.value)}
            placeholder="ex. Recette v2.4 — Module Paiement"
            autoFocus
          />
        </Field>

        <div className="grid grid-cols-2 gap-4">
          <Field
            label="Objectif total"
            htmlFor="camp-objective"
            hint="Nombre de cas à exécuter"
          >
            <Input
              id="camp-objective"
              type="number"
              min={0}
              value={form.objective_total}
              onChange={(e) => update("objective_total", e.target.value)}
              placeholder="ex. 120"
            />
          </Field>

          <Field label="Statut" htmlFor="camp-status">
            <Select
              id="camp-status"
              value={form.status}
              onChange={(e) => update("status", e.target.value)}
            >
              {CAMPAIGN_STATUSES.map((s) => (
                <option key={s} value={s}>
                  {LABELS[s]}
                </option>
              ))}
            </Select>
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
