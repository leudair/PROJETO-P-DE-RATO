"use client";

import { useState } from "react";
import { PlayerPaymentCard } from "./player-payment-card";
import type { PlayerPosition } from "@/lib/supabase/database.types";

type Player = {
  id: string;
  name: string;
  position: PlayerPosition | null;
  photoUrl: string | null;
  status: "paid" | "pending" | "exempt";
};

const INITIAL_COUNT = 5;

export function PlayersList({
  players,
  defaultMensalidadeAmount,
}: {
  players: Player[];
  defaultMensalidadeAmount: number;
}) {
  const [showAll, setShowAll] = useState(false);
  const visiblePlayers = showAll ? players : players.slice(0, INITIAL_COUNT);
  const hiddenCount = players.length - INITIAL_COUNT;

  return (
    <div className="space-y-3">
      {visiblePlayers.map((player) => (
        <PlayerPaymentCard key={player.id} player={player} defaultMensalidadeAmount={defaultMensalidadeAmount} />
      ))}

      {players.length === 0 && (
        <p className="rounded-xl border border-border bg-surface px-4 py-6 text-center text-muted">
          Nenhum jogador cadastrado ainda.
        </p>
      )}

      {!showAll && hiddenCount > 0 && (
        <button
          type="button"
          onClick={() => setShowAll(true)}
          className="w-full rounded-xl border border-dashed border-border py-3 text-sm font-medium text-primary hover:bg-surface-2"
        >
          Ver mais {hiddenCount} jogador{hiddenCount > 1 ? "es" : ""}
        </button>
      )}

      {showAll && hiddenCount > 0 && (
        <button
          type="button"
          onClick={() => setShowAll(false)}
          className="w-full rounded-xl border border-dashed border-border py-3 text-sm font-medium text-muted hover:bg-surface-2"
        >
          Ver menos
        </button>
      )}
    </div>
  );
}
