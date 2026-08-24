"use client";

import { useState } from "react";
import { PlayerPaymentCard } from "./player-payment-card";
import type { PlayerPosition } from "@/lib/supabase/database.types";

type Player = {
  id: string;
  name: string;
  position: PlayerPosition | null;
  photoUrl: string | null;
  age: number | null;
  birthDate: string | null;
  status: "paid" | "pending" | "late" | "exempt";
  daysLate: number;
};

const INITIAL_COUNT = 10;

export function PlayersList({
  players,
  defaultMensalidadeAmount,
  mediaBannerUrl,
  infoBannerUrl,
}: {
  players: Player[];
  defaultMensalidadeAmount: number;
  mediaBannerUrl: string | null;
  infoBannerUrl: string | null;
}) {
  const [showAll, setShowAll] = useState(false);
  const visiblePlayers = showAll ? players : players.slice(0, INITIAL_COUNT);
  const hiddenCount = players.length - INITIAL_COUNT;

  if (players.length === 0) {
    return (
      <p className="rounded-xl border border-border bg-surface px-4 py-6 text-center text-muted">
        Nenhum jogador cadastrado ainda.
      </p>
    );
  }

  return (
    <div className="grid grid-cols-2 gap-2 sm:gap-3">
      {visiblePlayers.map((player) => (
        <PlayerPaymentCard
          key={player.id}
          player={player}
          defaultMensalidadeAmount={defaultMensalidadeAmount}
          mediaBannerUrl={mediaBannerUrl}
          infoBannerUrl={infoBannerUrl}
        />
      ))}

      {!showAll && hiddenCount > 0 && (
        <button
          type="button"
          onClick={() => setShowAll(true)}
          className="col-span-2 rounded-xl border border-dashed border-border py-3 text-sm font-medium text-primary hover:bg-surface-2"
        >
          Ver mais {hiddenCount} jogador{hiddenCount > 1 ? "es" : ""}
        </button>
      )}

      {showAll && hiddenCount > 0 && (
        <button
          type="button"
          onClick={() => setShowAll(false)}
          className="col-span-2 rounded-xl border border-dashed border-border py-3 text-sm font-medium text-muted hover:bg-surface-2"
        >
          Ver menos
        </button>
      )}
    </div>
  );
}
