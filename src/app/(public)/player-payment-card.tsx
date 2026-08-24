"use client";

import { useActionState, useState } from "react";
import { payCaixinhaAction, payJerseyWashAction, payMensalidadeAction, type PayState } from "./actions";
import { StatusBadge } from "@/components/status-badge";
import { formatBRL } from "@/lib/utils/currency";
import { POSITION_LABEL } from "@/lib/utils/positions";
import { isVideoUrl } from "@/lib/utils/media";
import { formatBirthDate } from "@/lib/utils/age";
import type { PlayerPosition } from "@/lib/supabase/database.types";

type PlayerStatus = "paid" | "pending" | "late" | "exempt";

export function PlayerPaymentCard({
  player,
  defaultMensalidadeAmount,
  mediaBannerUrl,
  infoBannerUrl,
  avatarFrameUrl,
}: {
  player: {
    id: string;
    name: string;
    position: PlayerPosition | null;
    photoUrl: string | null;
    age: number | null;
    birthDate: string | null;
    status: PlayerStatus;
    daysLate: number;
  };
  defaultMensalidadeAmount: number;
  mediaBannerUrl: string | null;
  infoBannerUrl: string | null;
  avatarFrameUrl: string | null;
}) {
  const [open, setOpen] = useState(false);
  const isGoalkeeper = player.position === "goleiro";
  const [mensalidadeState, mensalidadeAction, mensalidadePending] = useActionState(
    payMensalidadeAction.bind(null, player.id),
    undefined
  );
  const [caixinhaState, caixinhaAction, caixinhaPending] = useActionState(
    payCaixinhaAction.bind(null, player.id),
    undefined
  );
  const [jerseyWashState, jerseyWashAction, jerseyWashPending] = useActionState(payJerseyWashAction, undefined);

  return (
    <div className={`overflow-hidden rounded-xl border border-border bg-surface ${open ? "col-span-2" : ""}`}>
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        className="flex w-full items-center gap-3 px-3 py-3 text-left"
      >
        <PlayerThumb
          name={player.name}
          photoUrl={player.photoUrl}
          status={player.status}
          frameUrl={avatarFrameUrl}
        />
        <div className="min-w-0 flex-1">
          <p className="truncate text-sm font-medium text-foreground">{player.name}</p>
          <p className="text-xs text-muted">
            {player.position ? POSITION_LABEL[player.position] : "—"}
            {player.age ? ` · ${player.age} anos` : ""}
          </p>
          <div className="pt-1">
            <StatusBadge status={player.status} daysLate={player.daysLate} />
          </div>
        </div>
      </button>

      {open && (
        <div className="space-y-5 border-t border-border p-4">
          <div className="flex h-32 overflow-hidden rounded-lg border-2 border-accent sm:h-36">
            {player.photoUrl && (
              <div
                className="flex w-2/5 shrink-0 items-center justify-center bg-cover bg-center p-2"
                style={mediaBannerUrl ? { backgroundImage: `url(${mediaBannerUrl})` } : undefined}
              >
                {isVideoUrl(player.photoUrl) ? (
                  <video
                    src={player.photoUrl}
                    className="h-full w-full object-contain"
                    autoPlay
                    loop
                    muted
                    playsInline
                  />
                ) : (
                  // eslint-disable-next-line @next/next/no-img-element -- imagem enviada pelo admin, sem largura/altura conhecida de antemao
                  <img src={player.photoUrl} alt={player.name} className="h-full w-full object-contain" />
                )}
              </div>
            )}
            <div
              className="relative flex min-w-0 flex-1 flex-col justify-center gap-0.5 bg-cover bg-center p-3"
              style={infoBannerUrl ? { backgroundImage: `url(${infoBannerUrl})` } : undefined}
            >
              <div className="absolute inset-0 bg-black/35" />
              <div className="relative">
                <p className="truncate text-base font-bold text-white drop-shadow-sm">{player.name}</p>
                {player.position && (
                  <p className="text-sm text-white/90 drop-shadow-sm">{POSITION_LABEL[player.position]}</p>
                )}
                {player.age && <p className="text-sm text-white/90 drop-shadow-sm">{player.age} anos</p>}
                {player.birthDate && (
                  <p className="text-xs text-white/80 drop-shadow-sm">Nasc. {formatBirthDate(player.birthDate)}</p>
                )}
              </div>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <p className="mb-2 text-sm text-foreground">Mensalidade do mês</p>
              {isGoalkeeper ? (
                <p className="text-sm text-muted">Isento. 🧤</p>
              ) : player.status === "paid" ? (
                <p className="text-sm text-success">Paga! ⚽</p>
              ) : (
                <form action={mensalidadeAction}>
                  <button
                    type="submit"
                    disabled={mensalidadePending}
                    className="rounded-md bg-accent px-3 py-2 text-sm font-semibold text-accent-foreground disabled:opacity-50"
                  >
                    {mensalidadePending ? "Gerando Pix..." : `Pagar — ${formatBRL(defaultMensalidadeAmount)}`}
                  </button>
                </form>
              )}
              {!isGoalkeeper && <PixResult state={mensalidadeState} />}
            </div>

            <div>
              <p className="mb-2 text-sm text-foreground">Lavagem dos coletes</p>
              <form
                action={jerseyWashAction}
                className="flex items-center gap-1.5 rounded-md border-2 border-accent bg-accent/10 p-1.5"
              >
                <input type="hidden" name="contributorName" value={player.name} />
                <input
                  name="amount"
                  type="number"
                  step="0.01"
                  min="1"
                  placeholder="R$"
                  required
                  className="w-14 min-w-0 rounded-md border border-border bg-surface px-2 py-2 text-sm"
                />
                <button
                  type="submit"
                  disabled={jerseyWashPending}
                  className="flex-1 rounded-md bg-accent px-3 py-2 text-sm font-semibold text-accent-foreground disabled:opacity-50"
                >
                  {jerseyWashPending ? "Gerando..." : "Contribuir"}
                </button>
              </form>
              <PixResult state={jerseyWashState} />
            </div>
          </div>

          <div>
            <p className="mb-2 text-sm text-foreground">Compra de bola e colete</p>
            <form action={caixinhaAction} className="flex flex-wrap items-center gap-2">
              <input
                name="amount"
                type="number"
                step="0.01"
                min="1"
                placeholder="Valor (R$)"
                required
                className="w-32 rounded-md border border-border px-3 py-2 text-sm"
              />
              <button
                type="submit"
                disabled={caixinhaPending}
                className="rounded-md border border-primary px-4 py-2 text-sm font-medium text-primary disabled:opacity-50"
              >
                {caixinhaPending ? "Gerando Pix..." : "Contribuir"}
              </button>
            </form>
            <PixResult state={caixinhaState} />
          </div>

          <button
            type="button"
            onClick={() => setOpen(false)}
            className="text-xs text-muted hover:text-foreground"
          >
            Fechar
          </button>
        </div>
      )}
    </div>
  );
}

const STATUS_DOT: Record<PlayerStatus, { icon: string; className: string }> = {
  paid: { icon: "✓", className: "bg-success text-success-foreground" },
  late: { icon: "!", className: "bg-red-600 text-white" },
  pending: { icon: "•", className: "bg-pending text-pending-foreground" },
  exempt: { icon: "–", className: "bg-muted text-background" },
};

function PlayerThumb({
  name,
  photoUrl,
  status,
  frameUrl,
}: {
  name: string;
  photoUrl: string | null;
  status: PlayerStatus;
  frameUrl: string | null;
}) {
  const dot = STATUS_DOT[status];
  // Zoom calibrado pra fotos/videos de corpo inteiro: mostra so o rosto,
  // centralizado, em vez do corte padrao do object-fit:cover (que pegava
  // do topo da imagem — cabeca + fundo — ate a cintura).
  const avatarMediaClass =
    "h-full w-full object-cover object-top [transform:scale(2.3)_translateY(-6%)] [transform-origin:50%_0%]";

  return (
    <div className="relative h-12 w-12 shrink-0">
      {photoUrl ? (
        <div className="h-12 w-12 overflow-hidden rounded-full bg-surface-2">
          {isVideoUrl(photoUrl) ? (
            <video
              src={photoUrl}
              className={avatarMediaClass}
              muted
              playsInline
              preload="metadata"
              onLoadedMetadata={(e) => {
                e.currentTarget.currentTime = 0.4;
              }}
            />
          ) : (
            // eslint-disable-next-line @next/next/no-img-element -- imagem enviada pelo admin, sem largura/altura conhecida de antemao
            <img src={photoUrl} alt={name} className={avatarMediaClass} />
          )}
        </div>
      ) : (
        <span className="flex h-12 w-12 items-center justify-center rounded-full bg-surface-2 text-sm font-medium text-muted">
          {name
            .split(" ")
            .slice(0, 2)
            .map((part) => part[0]?.toUpperCase())
            .join("")}
        </span>
      )}
      {frameUrl && (
        // eslint-disable-next-line @next/next/no-img-element -- imagem enviada pelo admin, sem largura/altura conhecida de antemao
        <img
          src={frameUrl}
          alt=""
          className="pointer-events-none absolute -left-1.5 -top-1.5 h-[60px] w-[60px] max-w-none select-none"
        />
      )}
      <span
        className={`absolute -bottom-0.5 -right-0.5 z-10 flex h-5 w-5 items-center justify-center rounded-full border-2 border-surface text-xs font-bold ${dot.className}`}
        title={status}
      >
        {dot.icon}
      </span>
    </div>
  );
}

function PixResult({ state }: { state: PayState }) {
  if (!state) return null;

  if (state.status === "already-paid") {
    return <p className="mt-2 text-sm text-success">Já está pago 🎉</p>;
  }

  if (state.status === "error") {
    return <p className="mt-2 text-sm text-red-600">{state.message}</p>;
  }

  return (
    <div className="mt-2 space-y-2 rounded-md bg-surface-2 p-3">
      <p className="text-xs text-muted">
        Pix de {formatBRL(state.amount)} — copie o código abaixo no app do seu banco:
      </p>
      <textarea
        readOnly
        value={state.copyPaste}
        rows={3}
        className="w-full rounded-md border border-border bg-surface p-2 text-xs"
        onFocus={(e) => e.currentTarget.select()}
      />
    </div>
  );
}
