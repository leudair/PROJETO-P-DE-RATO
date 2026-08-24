"use client";

import { useActionState } from "react";
import type { PayState } from "./actions";
import { formatBRL } from "@/lib/utils/currency";

type Action = (prevState: PayState, formData: FormData) => Promise<PayState>;

export function ExtraFundBanner({
  emoji,
  title,
  minAmount,
  buttonLabel,
  action,
  imageUrl,
}: {
  emoji: string;
  title: string;
  minAmount?: number;
  buttonLabel: string;
  action: Action;
  imageUrl?: string | null;
}) {
  const [state, formAction, pending] = useActionState(action, undefined);

  return (
    <div className="flex h-32 overflow-hidden rounded-xl border border-accent/40 bg-accent/10 sm:h-36">
      {imageUrl && (
        <div className="flex w-2/5 shrink-0 items-center justify-center overflow-hidden bg-black/10">
          {/* eslint-disable-next-line @next/next/no-img-element -- imagem enviada pelo admin, sem largura/altura conhecida de antemao */}
          <img src={imageUrl} alt="" className="h-full w-full object-cover" />
        </div>
      )}

      <div className="flex min-w-0 flex-1 flex-col justify-center gap-1.5 p-2.5 sm:p-3">
        <p className="truncate text-sm font-semibold text-foreground">
          {emoji} {title}
        </p>

        {state?.status === "pix-ready" ? (
          <div className="space-y-1 rounded-md bg-surface p-1.5">
            <p className="text-[10px] text-muted">Pix de {formatBRL(state.amount)} — copie:</p>
            <textarea
              readOnly
              value={state.copyPaste}
              rows={2}
              className="w-full rounded border border-border bg-surface-2 p-1 text-[10px]"
              onFocus={(e) => e.currentTarget.select()}
            />
          </div>
        ) : (
          <form action={formAction} className="space-y-1.5">
            <div className="flex gap-1.5">
              <input
                name="contributorName"
                placeholder="Seu nome"
                required
                className="w-1/2 min-w-0 rounded-md border border-border bg-surface px-2 py-1.5 text-xs"
              />
              <input
                name="amount"
                type="number"
                step="0.01"
                min={minAmount ?? 0.01}
                placeholder={minAmount ? `Mín. R$${minAmount}` : "R$"}
                required
                className="w-1/2 min-w-0 rounded-md border border-border bg-surface px-2 py-1.5 text-xs"
              />
            </div>
            <button
              type="submit"
              disabled={pending}
              className="w-full rounded-md bg-accent px-3 py-1.5 text-xs font-semibold text-accent-foreground disabled:opacity-50"
            >
              {pending ? "Gerando Pix..." : buttonLabel}
            </button>
          </form>
        )}

        {state?.status === "error" && <p className="text-[10px] text-red-600">{state.message}</p>}
      </div>
    </div>
  );
}
