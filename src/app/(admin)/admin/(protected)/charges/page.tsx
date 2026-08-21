import Link from "next/link";
import { listPayments } from "@/lib/data/payments";
import { StatusBadge } from "@/components/status-badge";
import { formatBRL } from "@/lib/utils/currency";
import { formatReferenceMonth } from "@/lib/utils/month";
import { PaymentRowActions } from "./payment-row-actions";

const TYPE_LABEL: Record<string, string> = {
  mensalidade: "Mensalidade",
  caixinha: "Caixinha",
};

export default async function ChargesPage() {
  const payments = await listPayments();

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold text-foreground">Cobranças</h1>
          <p className="text-sm text-muted">{payments.length} cobrança(s) no total.</p>
        </div>
        <div className="flex gap-2">
          <Link
            href="/admin/charges/new-caixinha"
            className="rounded-md border border-border px-4 py-2 text-sm font-medium text-foreground hover:bg-surface-2"
          >
            Nova caixinha
          </Link>
          <Link
            href="/admin/charges/generate-month"
            className="rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground"
          >
            Gerar cobranças do mês
          </Link>
        </div>
      </div>

      <div className="overflow-x-auto rounded-xl border border-border bg-surface">
        <table className="w-full text-sm">
          <thead className="border-b border-border bg-surface-2 text-left text-xs text-muted">
            <tr>
              <th className="px-4 py-2 font-medium">Jogador</th>
              <th className="px-4 py-2 font-medium">Tipo</th>
              <th className="px-4 py-2 font-medium">Mês</th>
              <th className="px-4 py-2 font-medium">Valor</th>
              <th className="px-4 py-2 font-medium">Status</th>
              <th className="px-4 py-2 font-medium"></th>
            </tr>
          </thead>
          <tbody>
            {payments.map((payment) => (
              <tr key={payment.id} className="border-b border-border last:border-0 align-top">
                <td className="px-4 py-3 text-foreground">{payment.players?.name ?? "—"}</td>
                <td className="px-4 py-3 text-muted">{TYPE_LABEL[payment.type] ?? payment.type}</td>
                <td className="px-4 py-3 text-muted">
                  {payment.reference_month ? formatReferenceMonth(payment.reference_month) : "—"}
                </td>
                <td className="px-4 py-3 text-foreground">{formatBRL(payment.amount)}</td>
                <td className="px-4 py-3">
                  <StatusBadge status={payment.status} />
                </td>
                <td className="px-4 py-3">
                  <PaymentRowActions payment={payment} />
                </td>
              </tr>
            ))}
            {payments.length === 0 && (
              <tr>
                <td colSpan={6} className="px-4 py-6 text-center text-muted">
                  Nenhuma cobrança gerada ainda.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
