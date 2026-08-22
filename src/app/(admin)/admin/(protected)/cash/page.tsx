import { listWithdrawals } from "@/lib/data/withdrawals";
import { formatBRL } from "@/lib/utils/currency";
import { WithdrawalForm } from "./withdrawal-form";

export default async function CashPage() {
  const withdrawals = await listWithdrawals();

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold text-foreground">Caixa</h1>
        <p className="text-sm text-muted">Retiradas do caixa geral do time — aparecem no extrato público.</p>
      </div>

      <WithdrawalForm />

      <div className="overflow-hidden rounded-xl border border-border bg-surface">
        <table className="w-full text-sm">
          <thead className="border-b border-border bg-surface-2 text-left text-xs text-muted">
            <tr>
              <th className="px-4 py-2 font-medium">Data</th>
              <th className="px-4 py-2 font-medium">Motivo</th>
              <th className="px-4 py-2 font-medium">Valor</th>
            </tr>
          </thead>
          <tbody>
            {withdrawals.map((w) => (
              <tr key={w.id} className="border-b border-border last:border-0">
                <td className="px-4 py-3 text-muted">{new Date(w.created_at).toLocaleDateString("pt-BR")}</td>
                <td className="px-4 py-3 text-foreground">{w.description}</td>
                <td className="px-4 py-3 text-foreground">{formatBRL(w.amount)}</td>
              </tr>
            ))}
            {withdrawals.length === 0 && (
              <tr>
                <td colSpan={3} className="px-4 py-6 text-center text-muted">
                  Nenhuma retirada registrada ainda.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
