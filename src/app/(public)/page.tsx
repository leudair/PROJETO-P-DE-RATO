import { getPublicStatus } from "@/lib/data/public-status";
import { StatusBadge } from "@/components/status-badge";
import { ThemeToggle } from "@/components/theme-toggle";
import { formatBRL } from "@/lib/utils/currency";
import { formatReferenceMonth } from "@/lib/utils/month";

export const dynamic = "force-dynamic";

export default async function PublicStatusPage() {
  const { teamName, referenceMonth, players, caixinhaContributions, totals } = await getPublicStatus();

  return (
    <main className="mx-auto min-h-screen max-w-2xl px-4 py-10">
      <div className="mb-8 flex items-start justify-between">
        <div>
          <h1 className="text-2xl font-semibold text-foreground">{teamName}</h1>
          <p className="text-sm text-muted">Situação da mensalidade — {formatReferenceMonth(referenceMonth)}</p>
        </div>
        <ThemeToggle />
      </div>

      <div className="mb-8 overflow-hidden rounded-xl border border-border bg-surface">
        <table className="w-full text-sm">
          <thead className="border-b border-border bg-surface-2 text-left text-xs text-muted">
            <tr>
              <th className="px-4 py-2 font-medium">Jogador</th>
              <th className="px-4 py-2 font-medium">Mensalidade</th>
            </tr>
          </thead>
          <tbody>
            {players.map((player) => (
              <tr key={player.id} className="border-b border-border last:border-0">
                <td className="px-4 py-3 text-foreground">{player.name}</td>
                <td className="px-4 py-3">
                  <StatusBadge status={player.status} />
                </td>
              </tr>
            ))}
            {players.length === 0 && (
              <tr>
                <td colSpan={2} className="px-4 py-6 text-center text-muted">
                  Nenhum jogador cadastrado ainda.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {caixinhaContributions.length > 0 && (
        <div className="mb-8">
          <h2 className="mb-2 text-sm font-semibold text-foreground">Caixinha do mês</h2>
          <ul className="space-y-1 text-sm">
            {caixinhaContributions.map((c, i) => (
              <li key={i} className="flex justify-between rounded-md bg-surface-2 px-3 py-2">
                <span className="text-foreground">{c.playerName}</span>
                <span className="text-success">{formatBRL(c.amount)}</span>
              </li>
            ))}
          </ul>
        </div>
      )}

      <div className="rounded-xl border border-border bg-surface p-4 text-sm">
        <div className="flex justify-between py-1">
          <span className="text-muted">Mensalidades pagas</span>
          <span className="text-foreground">{formatBRL(totals.mensalidade)}</span>
        </div>
        <div className="flex justify-between py-1">
          <span className="text-muted">Caixinha arrecadada</span>
          <span className="text-foreground">{formatBRL(totals.caixinha)}</span>
        </div>
        <div className="mt-1 flex justify-between border-t border-border pt-2 font-semibold">
          <span className="text-foreground">Total arrecadado</span>
          <span className="text-success">{formatBRL(totals.total)}</span>
        </div>
      </div>
    </main>
  );
}
