"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Eye, EyeOff, Loader2, LogIn, ShieldAlert } from "lucide-react";
import { useAuthStore } from "@/lib/stores/useAuthStore";
import { AuthShell } from "@/components/auth/AuthShell";
import { Field, Input } from "@/components/ui/Field";
import { Button } from "@/components/ui/Button";

export default function SignInPage() {
  const router = useRouter();
  const user = useAuthStore((s) => s.user);
  const signIn = useAuthStore((s) => s.signIn);

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Already authenticated → straight to the dashboard.
  useEffect(() => {
    if (user) router.replace("/");
  }, [user, router]);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSubmitting(true);
    setError(null);
    const res = await signIn(email.trim(), password);
    setSubmitting(false);
    if (res.error) {
      setError(res.error);
      return;
    }
    router.replace("/");
  }

  return (
    <AuthShell>
      <div className="mb-8">
        <h1 className="text-2xl font-semibold tracking-tight text-white">
          Connexion
        </h1>
        <p className="mt-1.5 text-sm text-slate-400">
          Accédez à votre cockpit qualité Synthèse.
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        <Field label="E-mail" htmlFor="email" required>
          <Input
            id="email"
            type="email"
            autoComplete="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="vous@entreprise.fr"
            required
            autoFocus
          />
        </Field>

        <Field label="Mot de passe" htmlFor="password" required>
          <div className="relative">
            <Input
              id="password"
              type={showPassword ? "text" : "password"}
              autoComplete="current-password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              required
              className="pr-11"
            />
            <button
              type="button"
              onClick={() => setShowPassword((v) => !v)}
              className="absolute inset-y-0 right-0 flex items-center pr-3.5 text-slate-500 transition hover:text-slate-300"
              aria-label={showPassword ? "Masquer le mot de passe" : "Afficher le mot de passe"}
              tabIndex={-1}
            >
              {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
            </button>
          </div>
        </Field>

        {error && (
          <div className="flex items-start gap-2.5 rounded-xl bg-rose-500/10 px-3.5 py-3 ring-1 ring-inset ring-rose-400/20">
            <ShieldAlert className="mt-0.5 h-4 w-4 shrink-0 text-rose-400" />
            <p className="text-xs leading-relaxed text-rose-200">{error}</p>
          </div>
        )}

        <Button
          type="submit"
          variant="primary"
          size="md"
          disabled={submitting}
          className="w-full"
        >
          {submitting ? (
            <Loader2 className="h-4 w-4 animate-spin" />
          ) : (
            <LogIn className="h-4 w-4" />
          )}
          {submitting ? "Connexion…" : "Se connecter"}
        </Button>
      </form>

      <p className="mt-6 text-center text-sm text-slate-400">
        Pas encore de compte ?{" "}
        <Link
          href="/inscription"
          className="font-medium text-emerald-400 transition hover:text-emerald-300"
        >
          Créer un compte
        </Link>
      </p>
    </AuthShell>
  );
}
