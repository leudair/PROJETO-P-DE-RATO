"use client";

import Link from "next/link";
import { useActionState } from "react";
import { useSearchParams } from "next/navigation";
import { ThemeToggle } from "@/components/theme-toggle";
import { login } from "./actions";

export function LoginForm({
  teamName,
  crestImageUrl,
}: {
  teamName: string;
  crestImageUrl: string | null;
}) {
  const [state, formAction, pending] = useActionState(login, undefined);
  const searchParams = useSearchParams();
  const linkInvalido = searchParams.get("erro") === "link_invalido";

  return (
    <main className="relative flex min-h-screen items-center justify-center bg-background px-4">
      <div className="absolute right-4 top-4">
        <ThemeToggle />
      </div>
      <div className="w-full max-w-sm space-y-6">
        <div className="flex flex-col items-center gap-1 text-center">
          {crestImageUrl && (
            // eslint-disable-next-line @next/next/no-img-element -- imagem enviada pelo admin, sem largura/altura conhecida de antemao
            <img src={crestImageUrl} alt="" className="mb-2 h-20 w-20 object-contain" />
          )}
          <p className="text-xs font-semibold uppercase tracking-widest text-primary">Exclusivo</p>
          <p className="text-lg font-bold text-foreground">{teamName}</p>
        </div>

        <form
          action={formAction}
          className="w-full space-y-4 rounded-xl border border-border bg-surface p-8 shadow-sm"
        >
          <div className="space-y-1">
            <h1 className="text-xl font-semibold text-foreground">Caixa do Time</h1>
            <p className="text-sm text-muted">Entre com sua conta de admin para continuar.</p>
          </div>

          {linkInvalido && (
            <p className="text-sm text-red-600">
              Esse link de redefinição de senha é inválido ou expirou. Peça um novo em &quot;Esqueci minha senha&quot;.
            </p>
          )}

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

          <div className="space-y-1">
            <label htmlFor="password" className="text-sm font-medium text-foreground">
              Senha
            </label>
            <input
              id="password"
              name="password"
              type="password"
              required
              autoComplete="current-password"
              className="w-full rounded-md border border-border px-3 py-2 text-sm outline-none focus:border-primary"
            />
          </div>

          {state?.error && <p className="text-sm text-red-600">{state.error}</p>}

          <button
            type="submit"
            disabled={pending}
            className="w-full rounded-md bg-primary py-2 text-sm font-medium text-primary-foreground disabled:opacity-50"
          >
            {pending ? "Entrando..." : "Entrar"}
          </button>

          <Link href="/admin/esqueci-senha" className="block text-center text-sm text-muted hover:text-foreground">
            Esqueci minha senha
          </Link>
        </form>
      </div>
    </main>
  );
}
