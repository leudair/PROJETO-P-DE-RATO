"use client";

import { useActionState } from "react";
import { ThemeToggle } from "@/components/theme-toggle";
import { updatePassword } from "./actions";

export default function ResetPasswordPage() {
  const [state, formAction, pending] = useActionState(updatePassword, undefined);

  return (
    <main className="relative flex min-h-screen items-center justify-center bg-background px-4">
      <div className="absolute right-4 top-4">
        <ThemeToggle />
      </div>
      <form
        action={formAction}
        className="w-full max-w-sm space-y-4 rounded-xl border border-border bg-surface p-8 shadow-sm"
      >
        <div className="space-y-1">
          <h1 className="text-xl font-semibold text-foreground">Criar nova senha</h1>
          <p className="text-sm text-muted">Escolha uma nova senha para sua conta.</p>
        </div>

        <div className="space-y-1">
          <label htmlFor="password" className="text-sm font-medium text-foreground">
            Nova senha
          </label>
          <input
            id="password"
            name="password"
            type="password"
            required
            minLength={8}
            autoComplete="new-password"
            className="w-full rounded-md border border-border px-3 py-2 text-sm outline-none focus:border-primary"
          />
        </div>

        <div className="space-y-1">
          <label htmlFor="confirmPassword" className="text-sm font-medium text-foreground">
            Confirmar nova senha
          </label>
          <input
            id="confirmPassword"
            name="confirmPassword"
            type="password"
            required
            minLength={8}
            autoComplete="new-password"
            className="w-full rounded-md border border-border px-3 py-2 text-sm outline-none focus:border-primary"
          />
        </div>

        {state?.error && <p className="text-sm text-red-600">{state.error}</p>}

        <button
          type="submit"
          disabled={pending}
          className="w-full rounded-md bg-primary py-2 text-sm font-medium text-primary-foreground disabled:opacity-50"
        >
          {pending ? "Salvando..." : "Salvar nova senha"}
        </button>
      </form>
    </main>
  );
}
