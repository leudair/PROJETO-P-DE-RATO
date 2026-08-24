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
    <div className="overflow-hidden rounded-xl border border-accent/40 bg-accent/10">
      <div className="p-4 sm:p-5">
        <p className="text-base font-semibold text-foreground sm:text-lg">
          {emoji} {title}
        </p>
        <p className="mt-1 text-sm text-muted">{description}</p>

        <form action={formAction} className="mt-4 flex flex-wrap items-center gap-2">
          <input
            name="amount"
            type="number"
            step="0.01"
            min={minAmount ?? 0.01}
            placeholder={minAmount ? `Mín. ${formatBRL(minAmount)}` : "Valor (R$)"}
            required
            className="w-36 rounded-md border border-border bg-surface px-3 py-2.5 text-sm"
          />
          <button
            type="submit"
            disabled={pending}
            className="flex-1 rounded-md bg-accent px-4 py-2.5 text-sm font-semibold text-accent-foreground disabled:opacity-50 sm:flex-none"
          >
            {pending ? "Gerando Pix..." : buttonLabel}
          </button>
        </form>

        {state?.status === "error" && <p className="mt-2 text-sm text-red-600">{state.message}</p>}
        {state?.status === "pix-ready" && (
          <div className="mt-3 space-y-2 rounded-md bg-surface p-3">
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
