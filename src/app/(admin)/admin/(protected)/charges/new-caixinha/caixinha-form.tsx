"use client";

import { useActionState } from "react";
import { createCaixinhaChargeAction } from "../actions";

export function CaixinhaForm({ players }: { players: { id: string; name: string }[] }) {
  const [state, formAction, pending] = useActionState(createCaixinhaChargeAction, undefined);

  return (
    <form action={formAction} className="space-y-4 rounded-xl border border-border bg-surface p-6">
      <div className="space-y-1">
        <label className="text-xs font-medium text-foreground">Jogador</label>
        <select name="playerId" required className="w-full rounded-md border border-border px-3 py-2 text-sm">
          <option value="">Selecione...</option>
          {players.map((p) => (
            <option key={p.id} value={p.id}>
              {p.name}
            </option>
          ))}
        </select>
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

      {state?.error && <p className="text-sm text-red-600">{state.error}</p>}
      {state?.success && <p className="text-sm text-success">{state.success}</p>}

      <button
        type="submit"
        disabled={pending}
        className="rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground disabled:opacity-50"
      >
        {pending ? "Salvando..." : "Registrar caixinha"}
      </button>
    </form>
  );
}
