"use client";

import { useActionState, useTransition } from "react";
import { generatePixForChargeAction, overridePaymentStatusAction } from "./actions";
import type { PaymentWithPlayer } from "@/lib/data/payments";

export function PaymentRowActions({ payment }: { payment: PaymentWithPlayer }) {
  const [pixState, pixAction, pixPending] = useActionState(generatePixForChargeAction.bind(null, payment.id), undefined);
  const [overridePending, startOverride] = useTransition();

  if (payment.status === "paid") {
    return <span className="text-xs text-muted">Confirmado</span>;
  }

  return (
    <div className="flex flex-col items-end gap-1">
      <div className="flex items-center gap-3">
        <form action={pixAction}>
          <button
            type="submit"
            disabled={pixPending}
            className="text-xs font-medium text-primary hover:underline disabled:opacity-50"
          >
            {pixPending ? "Gerando..." : payment.pix_copy_paste ? "Gerar novo Pix" : "Gerar Pix"}
          </button>
        </form>
        <button
          type="button"
          disabled={overridePending}
          onClick={() => {
            if (confirm(`Marcar cobrança de ${payment.players?.name ?? "jogador"} como paga manualmente?`)) {
              startOverride(() => overridePaymentStatusAction(payment.id, "paid"));
            }
          }}
          className="text-xs text-muted hover:text-foreground disabled:opacity-50"
        >
          Marcar paga
        </button>
      </div>
      {pixState?.error && <p className="max-w-xs text-right text-xs text-red-600">{pixState.error}</p>}
      {payment.pix_copy_paste && (
        <details className="text-right">
          <summary className="cursor-pointer text-xs text-muted">Ver código Pix</summary>
          <textarea
            readOnly
            value={payment.pix_copy_paste}
            className="mt-1 w-64 rounded-md border border-border bg-surface-2 p-2 text-xs"
            rows={3}
            onFocus={(e) => e.currentTarget.select()}
          />
        </details>
      )}
    </div>
  );
}
