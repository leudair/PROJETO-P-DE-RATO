import { getPublicStatus } from "@/lib/data/public-status";
import { ThemeToggle } from "@/components/theme-toggle";
import { formatBRL } from "@/lib/utils/currency";
import { formatReferenceMonth } from "@/lib/utils/month";
import { PlayerPaymentCard } from "./player-payment-card";
import { PickupGameBanner } from "./pickup-game-banner";
import { SponsorsFooter } from "./sponsors-footer";

export const dynamic = "force-dynamic";

export default async function PublicStatusPage() {
  const {
    teamName,
    bannerImageUrl,
    defaultMensalidadeAmount,
    referenceMonth,
    players,
    sponsors,
    caixinhaContributions,
    totals,
  } = await getPublicStatus();

  return (
    <main className="mx-auto min-h-screen max-w-2xl px-4 py-10">
      {bannerImageUrl && (
        // eslint-disable-next-line @next/next/no-img-element -- imagem enviada pelo admin, sem largura/altura conhecida de antemao
        <img
          src={bannerImageUrl}
          alt={teamName}
          className="mb-6 h-40 w-full rounded-xl object-cover sm:h-56"
        />
      )}

      <div className="mb-8 flex items-start justify-between">
        <div>
          <h1 className="text-2xl font-semibold text-primary">{teamName}</h1>
          <p className="text-sm text-muted">
            Mensalidade de {formatReferenceMonth(referenceMonth)} — clique no seu nome pra pagar
          </p>
        </div>
        <ThemeToggle />
      </div>

      <PickupGameBanner />

      <div className="mb-8 space-y-3">
        {players.map((player) => (
          <PlayerPaymentCard key={player.id} player={player} defaultMensalidadeAmount={defaultMensalidadeAmount} />
        ))}
        {players.length === 0 && (
          <p className="rounded-xl border border-border bg-surface px-4 py-6 text-center text-muted">
            Nenhum jogador cadastrado ainda.
          </p>
        )}
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

      <SponsorsFooter sponsors={sponsors} />
    </main>
  );
}
