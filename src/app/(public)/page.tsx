import { getPublicStatus } from "@/lib/data/public-status";
import { ThemeToggle } from "@/components/theme-toggle";
import { formatBRL } from "@/lib/utils/currency";
import { formatReferenceMonth } from "@/lib/utils/month";
import { isVideoUrl } from "@/lib/utils/media";
import { PlayersList } from "./players-list";
import { ExtraFundBanner } from "./extra-fund-banner";
import { payJerseyWashAction, payPickupGameAction } from "./actions";
import { SponsorsFooter } from "./sponsors-footer";

export const dynamic = "force-dynamic";

export default async function PublicStatusPage() {
  const {
    teamName,
    bannerImageUrl,
    crestImageUrl,
    defaultMensalidadeAmount,
    referenceMonth,
    players,
    sponsors,
    caixinhaContributions,
    withdrawals,
    totals,
  } = await getPublicStatus();

  return (
    <main className="mx-auto min-h-screen max-w-2xl px-3 py-6 sm:px-4 sm:py-10">
      {bannerImageUrl &&
        (isVideoUrl(bannerImageUrl) ? (
          <video
            src={bannerImageUrl}
            className="mb-4 h-36 w-full rounded-xl object-cover sm:mb-6 sm:h-56"
            autoPlay
            loop
            muted
            playsInline
          />
        ) : (
          // eslint-disable-next-line @next/next/no-img-element -- imagem enviada pelo admin, sem largura/altura conhecida de antemao
          <img
            src={bannerImageUrl}
            alt=""
            className="mb-4 h-36 w-full rounded-xl object-cover sm:mb-6 sm:h-56"
          />
        ))}

      <div className="mb-6 flex items-center justify-between gap-3 rounded-xl border border-border bg-surface px-4 py-4 sm:mb-8">
        <div className="flex min-w-0 items-center gap-3">
          {crestImageUrl && (
            // eslint-disable-next-line @next/next/no-img-element -- imagem enviada pelo admin, sem largura/altura conhecida de antemao
            <img src={crestImageUrl} alt="" className="h-12 w-12 shrink-0 object-contain sm:h-14 sm:w-14" />
          )}
          <div className="min-w-0">
            <h1 className="truncate text-xl font-bold text-primary sm:text-2xl">{teamName}</h1>
            <p className="text-xs text-muted sm:text-sm">
              Mensalidade de {formatReferenceMonth(referenceMonth)} — clique no seu nome pra pagar
            </p>
          </div>
        </div>
        <ThemeToggle />
      </div>

      <div className="mb-6 space-y-3 sm:mb-8">
        <ExtraFundBanner
          emoji="⚽"
          title="Jogo avulso (racha de onze aleatório)"
          description="De vez em quando rola um racha com time sorteado na hora. A arrecadação desse jogo é separada da mensalidade — cada um contribui com o valor que quiser, a partir de R$ 20."
          minAmount={20}
          buttonLabel="Contribuir pro jogo avulso"
          action={payPickupGameAction}
        />
        <ExtraFundBanner
          emoji="🧺"
          title="Lavagem dos coletes"
          description="Caixinha separada pra pagar quem lava os coletes do time. Também não entra na mensalidade nem no jogo avulso."
          buttonLabel="Contribuir pra lavagem"
          action={payJerseyWashAction}
        />
      </div>

      <div className="mb-6 sm:mb-8">
        <PlayersList players={players} defaultMensalidadeAmount={defaultMensalidadeAmount} />
      </div>

      {caixinhaContributions.length > 0 && (
        <div className="mb-6 sm:mb-8">
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
        <div className="flex justify-between py-1">
          <span className="text-muted">Jogo avulso arrecadado</span>
          <span className="text-foreground">{formatBRL(totals.pickupGame)}</span>
        </div>
        <div className="flex justify-between py-1">
          <span className="text-muted">Coletes arrecadado</span>
          <span className="text-foreground">{formatBRL(totals.jerseyWash)}</span>
        </div>
        <div className="mt-1 flex justify-between border-t border-border pt-2">
          <span className="text-muted">Total arrecadado</span>
          <span className="text-foreground">{formatBRL(totals.grossTotal)}</span>
        </div>

        {withdrawals.length > 0 && (
          <div className="mt-2 space-y-1 border-t border-border pt-2">
            {withdrawals.map((w) => (
              <div key={w.id} className="flex justify-between text-pending">
                <span>Retirada: {w.description}</span>
                <span>-{formatBRL(w.amount)}</span>
              </div>
            ))}
          </div>
        )}

        <div className="mt-2 flex justify-between border-t border-border pt-2 font-semibold">
          <span className="text-foreground">Saldo em caixa</span>
          <span className="text-success">{formatBRL(totals.balance)}</span>
        </div>
      </div>

      <SponsorsFooter sponsors={sponsors} />
    </main>
  );
}
