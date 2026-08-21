"use client";

import { useActionState, useState } from "react";
import { payCaixinhaAction, payMensalidadeAction, type PayState } from "./actions";
import { StatusBadge } from "@/components/status-badge";
import { formatBRL } from "@/lib/utils/currency";

export function PlayerPaymentCard({
  player,
  defaultMensalidadeAmount,
}: {
  player: { id: string; name: string; status: "paid" | "pending" };
  defaultMensalidadeAmount: number;
}) {
  const [open, setOpen] = useState(false);
  const [mensalidadeState, mensalidadeAction, mensalidadePending] = useActionState(
    payMensalidadeAction.bind(null, player.id),
    undefined
  );
  const [caixinhaState, caixinhaAction, caixinhaPending] = useActionState(
    payCaixinhaAction.bind(null, player.id),
    undefined
  );

  return (
    <div className="overflow-hidden rounded-xl border border-border bg-surface">
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        className="flex w-full items-center justify-between px-4 py-3 text-left"
      >
        <span className="font-medium text-foreground">{player.name}</span>
        <div className="flex items-center gap-3">
          <StatusBadge status={player.status} />
          <span className="text-xs text-muted">{open ? "Fechar" : "Pagar"}</span>
        </div>
      </button>

      {open && (
        <div className="space-y-5 border-t border-border p-4">
          <div>
            <p className="mb-2 text-sm text-foreground">Mensalidade do mês</p>
            {player.status === "paid" ? (
              <p className="text-sm text-success">Mensalidade já paga. Obrigado! ⚽</p>
            ) : (
              <form action={mensalidadeAction}>
                <button
                  type="submit"
                  disabled={mensalidadePending}
                  className="rounded-md bg-accent px-4 py-2 text-sm font-semibold text-accent-foreground disabled:opacity-50"
                >
                  {mensalidadePending
                    ? "Gerando Pix..."
                    : `Pagar mensalidade — ${formatBRL(defaultMensalidadeAmount)}`}
                </button>
              </form>
            )}
            <PixResult state={mensalidadeState} />
          </div>

          <div>
            <p className="mb-2 text-sm text-foreground">Dar uma caixinha</p>
            <form action={caixinhaAction} className="flex flex-wrap items-center gap-2">
              <input
                name="amount"
                type="number"
                step="0.01"
                min="1"
                placeholder="Valor (R$)"
                required
                className="w-32 rounded-md border border-border px-3 py-2 text-sm"
              />
              <button
                type="submit"
                disabled={caixinhaPending}
                className="rounded-md border border-primary px-4 py-2 text-sm font-medium text-primary disabled:opacity-50"
              >
                {caixinhaPending ? "Gerando Pix..." : "Contribuir"}
              </button>
            </form>
            <PixResult state={caixinhaState} />
          </div>
        </div>
      )}
    </div>
  );
}

function PixResult({ state }: { state: PayState }) {
  if (!state) return null;

  if (state.status === "already-paid") {
    return <p className="mt-2 text-sm text-success">Já está pago 🎉</p>;
  }

  if (state.status === "error") {
    return <p className="mt-2 text-sm text-red-600">{state.message}</p>;
  }

  return (
    <div className="mt-2 space-y-2 rounded-md bg-surface-2 p-3">
      <p className="text-xs text-muted">
        Pix de {formatBRL(state.amount)} — copie o código abaixo no app do seu banco:
      </p>
      <textarea
        readOnly
        value={state.copyPaste}
        rows={3}
        className="w-full rounded-md border border-border bg-surface p-2 text-xs"
        onFocus={(e) => e.currentTarget.select()}
      />
    </div>
  );
}
