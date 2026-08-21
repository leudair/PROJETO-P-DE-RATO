"use client";

import { useActionState } from "react";
import { generateMonthlyChargesAction } from "../actions";
import { currentReferenceMonth, formatReferenceMonth } from "@/lib/utils/month";

export function GenerateMonthForm() {
  const [state, formAction, pending] = useActionState(generateMonthlyChargesAction, undefined);
  const referenceMonth = currentReferenceMonth();

  return (
    <form action={formAction} className="space-y-4 rounded-xl border border-border bg-surface p-6">
      <input type="hidden" name="referenceMonth" value={referenceMonth} />
      <p className="text-sm text-foreground">
        Isso cria a cobrança de mensalidade pendente para todos os jogadores ativos que ainda não têm uma
        gerada em <strong>{formatReferenceMonth(referenceMonth)}</strong>. Jogadores que já têm mensalidade
        desse mês não são duplicados.
      </p>

      {state?.error && <p className="text-sm text-red-600">{state.error}</p>}
      {state?.success && <p className="text-sm text-success">{state.success}</p>}

      <button
        type="submit"
        disabled={pending}
        className="rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground disabled:opacity-50"
      >
        {pending ? "Gerando..." : `Gerar mensalidades de ${formatReferenceMonth(referenceMonth)}`}
      </button>
    </form>
  );
}
