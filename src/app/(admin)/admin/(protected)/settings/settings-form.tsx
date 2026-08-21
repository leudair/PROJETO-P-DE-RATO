"use client";

import { useActionState } from "react";
import { updateSettingsAction } from "./actions";

export function SettingsForm({
  defaultValues,
}: {
  defaultValues: { teamName: string; defaultMensalidadeAmount: number };
}) {
  const [state, formAction, pending] = useActionState(updateSettingsAction, undefined);

  return (
    <form action={formAction} className="max-w-md space-y-4 rounded-xl border border-border bg-surface p-6">
      <div className="space-y-1">
        <label className="text-xs font-medium text-foreground">Nome do time</label>
        <input
          name="teamName"
          required
          defaultValue={defaultValues.teamName}
          className="w-full rounded-md border border-border px-3 py-2 text-sm"
        />
      </div>

      <div className="space-y-1">
        <label className="text-xs font-medium text-foreground">Valor padrão da mensalidade (R$)</label>
        <input
          name="defaultMensalidadeAmount"
          type="number"
          step="0.01"
          min="0.01"
          required
          defaultValue={defaultValues.defaultMensalidadeAmount}
          className="w-full rounded-md border border-border px-3 py-2 text-sm"
        />
        <p className="text-xs text-muted">Usado ao gerar as cobranças do mês para todos os jogadores ativos.</p>
      </div>

      {state?.error && <p className="text-sm text-red-600">{state.error}</p>}
      {state?.success && <p className="text-sm text-success">{state.success}</p>}

      <button
        type="submit"
        disabled={pending}
        className="rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground disabled:opacity-50"
      >
        {pending ? "Salvando..." : "Salvar"}
      </button>
    </form>
  );
}
