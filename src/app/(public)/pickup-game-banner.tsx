"use client";

import { useActionState } from "react";
import { payPickupGameAction } from "./actions";
import { formatBRL } from "@/lib/utils/currency";

export function PickupGameBanner() {
  const [state, formAction, pending] = useActionState(payPickupGameAction, undefined);

  return (
    <div className="mb-8 overflow-hidden rounded-xl border border-accent/40 bg-accent/10">
      <div className="p-4">
        <p className="text-sm font-semibold text-foreground">⚽ Jogo avulso (racha de onze aleatório)</p>
        <p className="mt-1 text-sm text-muted">
          De vez em quando rola um racha com time sorteado na hora. A arrecadação desse jogo é separada da
          mensalidade — cada um contribui com o valor que quiser, a partir de R$ 20.
        </p>

        <form action={formAction} className="mt-3 flex flex-wrap items-center gap-2">
          <input
            name="amount"
            type="number"
            step="0.01"
            min="20"
            placeholder="Valor (mín. R$ 20)"
            required
            className="w-40 rounded-md border border-border bg-surface px-3 py-2 text-sm"
          />
          <button
            type="submit"
            disabled={pending}
            className="rounded-md bg-accent px-4 py-2 text-sm font-semibold text-accent-foreground disabled:opacity-50"
          >
            {pending ? "Gerando Pix..." : "Contribuir pro jogo avulso"}
          </button>
        </form>

        {state?.status === "error" && <p className="mt-2 text-sm text-red-600">{state.message}</p>}
        {state?.status === "pix-ready" && (
          <div className="mt-3 space-y-2 rounded-md bg-surface p-3">
            <p className="text-xs text-muted">
              Pix de {formatBRL(state.amount)} — copie o código abaixo no app do seu banco:
            </p>
            <textarea
              readOnly
              value={state.copyPaste}
              rows={3}
              className="w-full rounded-md border border-border bg-surface-2 p-2 text-xs"
              onFocus={(e) => e.currentTarget.select()}
            />
          </div>
        )}
      </div>
    </div>
  );
}
