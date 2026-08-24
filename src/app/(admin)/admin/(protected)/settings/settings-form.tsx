"use client";

import { useActionState } from "react";
import { updateSettingsAction } from "./actions";
import { isVideoUrl } from "@/lib/utils/media";

export function SettingsForm({
  defaultValues,
}: {
  defaultValues: {
    teamName: string;
    defaultMensalidadeAmount: number;
    bannerImageUrl: string | null;
    crestImageUrl: string | null;
    topBannerUrl: string | null;
    pickupGameBannerUrl: string | null;
  };
}) {
  const [state, formAction, pending] = useActionState(updateSettingsAction, undefined);

  return (
    <form action={formAction} className="max-w-md space-y-4 rounded-xl border border-border bg-surface p-6">
      <div className="space-y-1">
        <label className="text-xs font-medium text-foreground">Nome do time</label>
        <input
          name="teamName"
          required
          defaultValue={defaultValues.teamName}
          className="w-full rounded-md border border-border px-3 py-2 text-sm"
        />
      </div>

      <div className="space-y-1">
        <label className="text-xs font-medium text-foreground">Valor padrão da mensalidade (R$)</label>
        <input
          name="defaultMensalidadeAmount"
          type="number"
          step="0.01"
          min="0.01"
          required
          defaultValue={defaultValues.defaultMensalidadeAmount}
          className="w-full rounded-md border border-border px-3 py-2 text-sm"
        />
        <p className="text-xs text-muted">Usado ao gerar as cobranças do mês para todos os jogadores ativos.</p>
      </div>

      <div className="space-y-1">
        <label className="text-xs font-medium text-foreground">Escudo do time</label>
        {defaultValues.crestImageUrl && (
          // eslint-disable-next-line @next/next/no-img-element -- imagem enviada pelo admin, sem largura/altura conhecida de antemao
          <img src={defaultValues.crestImageUrl} alt="Escudo atual" className="mb-2 h-16 w-16 object-contain" />
        )}
        <input
          name="crestImage"
          type="file"
          accept="image/png,image/jpeg,image/webp,image/gif"
          className="w-full rounded-md border border-border px-3 py-2 text-sm"
        />
        <p className="text-xs text-muted">
          PNG, JPEG, WEBP ou GIF, até 5MB. Aparece ao lado do nome do time no topo da página pública.
        </p>
      </div>

      <div className="space-y-1">
        <label className="text-xs font-medium text-foreground">Banner fino do topo (propaganda/patrocínio)</label>
        {defaultValues.topBannerUrl && (
          // eslint-disable-next-line @next/next/no-img-element -- imagem enviada pelo admin, sem largura/altura conhecida de antemao
          <img
            src={defaultValues.topBannerUrl}
            alt="Banner do topo atual"
            className="mb-2 h-12 w-full rounded-md object-cover"
          />
        )}
        <input
          name="topBannerImage"
          type="file"
          accept="image/png,image/jpeg,image/webp,image/gif"
          className="w-full rounded-md border border-border px-3 py-2 text-sm"
        />
        <p className="text-xs text-muted">
          PNG, JPEG, WEBP ou GIF, até 5MB. Faixa fina no topo da página pública — espaço reservado pra
          divulgar patrocinador no futuro. Deixe em branco pra não mostrar nada.
        </p>
      </div>

      <div className="space-y-1">
        <label className="text-xs font-medium text-foreground">Banner do jogo de onze</label>
        {defaultValues.pickupGameBannerUrl && (
          // eslint-disable-next-line @next/next/no-img-element -- imagem enviada pelo admin, sem largura/altura conhecida de antemao
          <img
            src={defaultValues.pickupGameBannerUrl}
            alt="Banner do jogo de onze atual"
            className="mb-2 h-24 w-full rounded-md object-cover"
          />
        )}
        <input
          name="pickupGameBannerImage"
          type="file"
          accept="image/png,image/jpeg,image/webp,image/gif"
          className="w-full rounded-md border border-border px-3 py-2 text-sm"
        />
        <p className="text-xs text-muted">
          PNG, JPEG, WEBP ou GIF, até 5MB. Aparece logo abaixo do cabeçalho — use pra divulgar quando tiver
          um jogo de onze marcado. Deixe em branco pra não mostrar nada.
        </p>
      </div>

      <div className="space-y-1">
        <label className="text-xs font-medium text-foreground">Banner do rodapé (imagem ou vídeo)</label>
        {defaultValues.bannerImageUrl &&
          (isVideoUrl(defaultValues.bannerImageUrl) ? (
            <video
              src={defaultValues.bannerImageUrl}
              className="mb-2 h-24 w-full rounded-md object-cover"
              autoPlay
              loop
              muted
              playsInline
            />
          ) : (
            // eslint-disable-next-line @next/next/no-img-element -- imagem enviada pelo admin, sem largura/altura conhecida de antemao
            <img
              src={defaultValues.bannerImageUrl}
              alt="Banner atual"
              className="mb-2 h-24 w-full rounded-md object-cover"
            />
          ))}
        <input
          name="bannerImage"
          type="file"
          accept="image/png,image/jpeg,image/webp,image/gif,video/mp4,video/webm"
          className="w-full rounded-md border border-border px-3 py-2 text-sm"
        />
        <p className="text-xs text-muted">
          PNG, JPEG, WEBP, GIF (até 5MB) ou MP4/WEBM (até 20MB). Aparece perto do rodapé da página pública.
          Deixe em branco para manter o atual.
        </p>
      </div>

      {state?.error && <p className="text-sm text-red-600">{state.error}</p>}
      {state?.success && <p className="text-sm text-success">{state.success}</p>}

      <button
        type="submit"
        disabled={pending}
        className="rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground disabled:opacity-50"
      >
        {pending ? "Salvando..." : "Salvar"}
      </button>
    </form>
  );
}
