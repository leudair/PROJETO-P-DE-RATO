"use client";

import { useActionState } from "react";
import { createWithdrawalAction } from "./actions";

export function WithdrawalForm() {
  const [state, formAction, pending] = useActionState(createWithdrawalAction, undefined);

  return (
    <form action={formAction} className="space-y-4 rounded-xl border border-border bg-surface p-6">
      <div className="grid gap-4 sm:grid-cols-2">
        <div className="space-y-1">
          <label className="text-xs font-medium text-foreground">Motivo</label>
          <input
            name="description"
            required
            placeholder="Ex: Churrasco do time"
            className="w-full rounded-md border border-border px-3 py-2 text-sm"
          />
        </div>
        <div className="space-y-1">
          <label className="text-xs font-medium text-foreground">Valor (R$)</label>
          <input
            name="amount"
            type="number"
            step="0.01"
            min="0.01"
            required
            className="w-full rounded-md border border-border px-3 py-2 text-sm"
          />
        </div>
      </div>

      <p className="text-xs text-muted">
        Aparece no extrato público, reduzindo o saldo total exibido. Use pra dar transparência quando o
        dinheiro do caixa geral for usado (churrasco, material, etc).
      </p>

      {state?.error && <p className="text-sm text-red-600">{state.error}</p>}
      {state?.success && <p className="text-sm text-success">{state.success}</p>}

      <button
        type="submit"
        disabled={pending}
        className="rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground disabled:opacity-50"
      >
        {pending ? "Salvando..." : "Registrar retirada"}
      </button>
    </form>
  );
}
