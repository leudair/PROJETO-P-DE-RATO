"use client";

import { useActionState } from "react";
import { createPlayerAction, updatePlayerAction, type PlayerFormState } from "./actions";

export function PlayerForm({
  mode,
  defaultValues,
}: {
  mode: "create" | "edit";
  defaultValues?: { playerId: string; name: string; phone: string | null };
}) {
  const action = mode === "create" ? createPlayerAction : updatePlayerAction;
  const [state, formAction, pending] = useActionState<PlayerFormState, FormData>(action, undefined);

  return (
    <form action={formAction} className="space-y-4 rounded-xl border border-border bg-surface p-6">
      {mode === "edit" && <input type="hidden" name="playerId" value={defaultValues?.playerId} />}

      <div className="grid gap-4 sm:grid-cols-2">
        <div className="space-y-1">
          <label className="text-xs font-medium text-foreground">Nome</label>
          <input
            name="name"
            required
            defaultValue={defaultValues?.name}
            className="w-full rounded-md border border-border px-3 py-2 text-sm"
          />
        </div>
        <div className="space-y-1">
          <label className="text-xs font-medium text-foreground">Telefone (opcional)</label>
          <input
            name="phone"
            placeholder="+5511999999999"
            defaultValue={defaultValues?.phone ?? ""}
            className="w-full rounded-md border border-border px-3 py-2 text-sm"
          />
        </div>
      </div>

      {state?.error && <p className="text-sm text-red-600">{state.error}</p>}
      {state?.success && <p className="text-sm text-success">{state.success}</p>}

      <button
        type="submit"
        disabled={pending}
        className="rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground disabled:opacity-50"
      >
        {pending ? "Salvando..." : mode === "create" ? "Criar jogador" : "Salvar"}
      </button>
    </form>
  );
}
