"use client";

import { useActionState } from "react";
import { createPlayerAction, updatePlayerAction, type PlayerFormState } from "./actions";
import { POSITIONS, POSITION_LABEL } from "@/lib/utils/positions";
import { isVideoUrl } from "@/lib/utils/media";
import type { PlayerPosition } from "@/lib/supabase/database.types";

export function PlayerForm({
  mode,
  defaultValues,
}: {
  mode: "create" | "edit";
  defaultValues?: {
    playerId: string;
    name: string;
    phone: string | null;
    position: PlayerPosition | null;
    birthDate: string | null;
    photoUrl: string | null;
    avatarPhotoUrl: string | null;
  };
}) {
  const action = mode === "create" ? createPlayerAction : updatePlayerAction;
  const [state, formAction, pending] = useActionState<PlayerFormState, FormData>(action, undefined);

  return (
    <form action={formAction} className="space-y-4 rounded-xl border border-border bg-surface p-6">
      {mode === "edit" && <input type="hidden" name="playerId" value={defaultValues?.playerId} />}

      <div className="grid gap-4 sm:grid-cols-2">
        <div className="space-y-1">
          <label className="text-xs font-medium text-foreground">Nome</label>
          <input
            name="name"
            required
            defaultValue={defaultValues?.name}
            className="w-full rounded-md border border-border px-3 py-2 text-sm"
          />
        </div>
        <div className="space-y-1">
          <label className="text-xs font-medium text-foreground">Telefone (opcional)</label>
          <input
            name="phone"
            placeholder="+5511999999999"
            defaultValue={defaultValues?.phone ?? ""}
            className="w-full rounded-md border border-border px-3 py-2 text-sm"
          />
        </div>
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <div className="space-y-1">
          <label className="text-xs font-medium text-foreground">Posição</label>
          <select
            name="position"
            defaultValue={defaultValues?.position ?? ""}
            className="w-full rounded-md border border-border px-3 py-2 text-sm"
          >
            <option value="">Não informada</option>
            {POSITIONS.map((position) => (
              <option key={position} value={position}>
                {POSITION_LABEL[position]}
              </option>
            ))}
          </select>
          <p className="text-xs text-muted">Goleiro fica isento da mensalidade automaticamente.</p>
        </div>
        <div className="space-y-1">
          <label className="text-xs font-medium text-foreground">Data de nascimento (opcional)</label>
          <input
            name="birthDate"
            type="date"
            defaultValue={defaultValues?.birthDate ?? ""}
            className="w-full rounded-md border border-border px-3 py-2 text-sm"
          />
          <p className="text-xs text-muted">A idade é calculada automaticamente a partir daqui.</p>
        </div>
      </div>

      <div className="space-y-1">
        <label className="text-xs font-medium text-foreground">Foto ou vídeo (opcional)</label>
        {defaultValues?.photoUrl &&
          (isVideoUrl(defaultValues.photoUrl) ? (
            <video
              src={defaultValues.photoUrl}
              className="mb-2 h-32 w-24 rounded-md border border-border bg-surface-2 object-contain"
              autoPlay
              loop
              muted
              playsInline
            />
          ) : (
            // eslint-disable-next-line @next/next/no-img-element -- imagem enviada pelo admin, sem largura/altura conhecida de antemao
            <img
              src={defaultValues.photoUrl}
              alt={defaultValues.name}
              className="mb-2 h-32 w-24 rounded-md border border-border bg-surface-2 object-contain"
            />
          ))}
        <input
          name="photo"
          type="file"
          accept="image/png,image/jpeg,image/webp,image/gif,video/mp4,video/webm"
          className="w-full rounded-md border border-border px-3 py-2 text-sm"
        />
        <p className="text-xs text-muted">
          PNG (de preferência de corpo inteiro, fundo transparente, até 5MB) ou vídeo curto MP4/WEBM (até
          20MB). Aparece dentro do card do jogador na página pública.
        </p>
      </div>

      <div className="space-y-1">
        <label className="text-xs font-medium text-foreground">Foto do avatar (círculo pequeno, opcional)</label>
        {defaultValues?.avatarPhotoUrl && (
          // eslint-disable-next-line @next/next/no-img-element -- imagem enviada pelo admin, sem largura/altura conhecida de antemao
          <img
            src={defaultValues.avatarPhotoUrl}
            alt={defaultValues.name}
            className="mb-2 h-24 w-24 rounded-full border border-border bg-surface-2 object-cover"
          />
        )}
        <input
          name="avatarPhoto"
          type="file"
          accept="image/png,image/jpeg,image/webp,image/gif"
          className="w-full rounded-md border border-border px-3 py-2 text-sm"
        />
        <p className="text-xs text-muted">
          Só imagem estática (sem vídeo), rosto centralizado — aparece na bolinha com moldura ao lado do
          nome. Se não enviar, a bolinha usa a foto/vídeo de cima.
        </p>
      </div>

      {state?.error && <p className="text-sm text-red-600">{state.error}</p>}
      {state?.success && <p className="text-sm text-success">{state.success}</p>}

      <button
        type="submit"
        disabled={pending}
        className="rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground disabled:opacity-50"
      >
        {pending ? "Salvando..." : mode === "create" ? "Criar jogador" : "Salvar"}
      </button>
    </form>
  );
}
