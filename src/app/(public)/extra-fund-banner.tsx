"use client";

import { useActionState } from "react";
import type { PayState } from "./actions";
import { formatBRL } from "@/lib/utils/currency";

type Action = (prevState: PayState, formData: FormData) => Promise<PayState>;

export function ExtraFundBanner({
  emoji,
  title,
  description,
  minAmount,
  buttonLabel,
  action,
}: {
  emoji: string;
  title: string;
  description: string;
  minAmount?: number;
  buttonLabel: string;
  action: Action;
}) {
  const [state, formAction, pending] = useActionState(action, undefined);

  return (
    <div className="h-full overflow-hidden rounded-xl border border-accent/40 bg-accent/10">
      <div className="flex h-full flex-col p-3">
        <p className="text-sm font-semibold text-foreground">
          {emoji} {title}
        </p>
        <p className="mt-1 flex-1 text-xs text-muted">{description}</p>

        <form action={formAction} className="mt-3 space-y-2">
          <input
            name="amount"
            type="number"
            step="0.01"
            min={minAmount ?? 0.01}
            placeholder={minAmount ? `Mín. ${formatBRL(minAmount)}` : "Valor (R$)"}
            required
            className="w-full rounded-md border border-border bg-surface px-3 py-2 text-sm"
          />
          <button
            type="submit"
            disabled={pending}
            className="w-full rounded-md bg-accent px-3 py-2 text-sm font-semibold text-accent-foreground disabled:opacity-50"
          >
            {pending ? "Gerando Pix..." : buttonLabel}
          </button>
        </form>

        {state?.status === "error" && <p className="mt-2 text-xs text-red-600">{state.message}</p>}
        {state?.status === "pix-ready" && (
          <div className="mt-3 space-y-2 rounded-md bg-surface p-2">
            <p className="text-xs text-muted">Pix de {formatBRL(state.amount)} — copie o código abaixo:</p>
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
