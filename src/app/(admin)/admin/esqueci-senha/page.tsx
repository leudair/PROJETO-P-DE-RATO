"use client";

import Link from "next/link";
import { useActionState } from "react";
import { ThemeToggle } from "@/components/theme-toggle";
import { requestPasswordReset } from "./actions";

export default function ForgotPasswordPage() {
  const [state, formAction, pending] = useActionState(requestPasswordReset, undefined);

  return (
    <main className="relative flex min-h-screen items-center justify-center bg-background px-4">
      <div className="absolute right-4 top-4">
        <ThemeToggle />
      </div>
      <div className="w-full max-w-sm space-y-4 rounded-xl border border-border bg-surface p-8 shadow-sm">
        <div className="space-y-1">
          <h1 className="text-xl font-semibold text-foreground">Esqueci minha senha</h1>
          <p className="text-sm text-muted">
            Informe seu email de login e enviaremos um link para você criar uma nova senha.
          </p>
        </div>

        {state?.sent ? (
          <p className="text-sm text-foreground">
            Se esse email tiver uma conta, enviamos um link de redefinição para ele. Confira também a caixa de spam.
          </p>
        ) : (
          <form action={formAction} className="space-y-4">
            <div className="space-y-1">
              <label htmlFor="email" className="text-sm font-medium text-foreground">
                Email
              </label>
              <input
                id="email"
                name="email"
                type="email"
                required
                autoComplete="email"
                className="w-full rounded-md border border-border px-3 py-2 text-sm outline-none focus:border-primary"
              />
            </div>

            {state?.error && <p className="text-sm text-red-600">{state.error}</p>}

            <button
              type="submit"
              disabled={pending}
              className="w-full rounded-md bg-primary py-2 text-sm font-medium text-primary-foreground disabled:opacity-50"
            >
              {pending ? "Enviando..." : "Enviar link"}
            </button>
          </form>
        )}

        <Link href="/admin/login" className="block text-center text-sm text-muted hover:text-foreground">
          Voltar para o login
        </Link>
      </div>
    </main>
  );
}
