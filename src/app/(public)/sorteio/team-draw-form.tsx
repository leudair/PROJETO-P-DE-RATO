"use client";

import { useState } from "react";
import { POSITIONS, POSITION_LABEL } from "@/lib/utils/positions";
import type { PlayerPosition } from "@/lib/supabase/database.types";

type Player = {
  id: string;
  name: string;
  position: PlayerPosition | null;
};

type Teams = { teamA: Player[]; teamB: Player[] };

const POSITION_ORDER: (PlayerPosition | "sem_posicao")[] = [...POSITIONS, "sem_posicao"];

function positionLabel(position: PlayerPosition | "sem_posicao"): string {
  return position === "sem_posicao" ? "Sem posição" : POSITION_LABEL[position];
}

function drawTeams(players: Player[]): Teams {
  const byPosition = new Map<PlayerPosition | "sem_posicao", Player[]>();
  for (const player of players) {
    const key = player.position ?? "sem_posicao";
    if (!byPosition.has(key)) byPosition.set(key, []);
    byPosition.get(key)!.push(player);
  }

  const teamA: Player[] = [];
  const teamB: Player[] = [];

  for (const key of POSITION_ORDER) {
    const group = byPosition.get(key);
    if (!group) continue;
    const shuffled = [...group].sort(() => Math.random() - 0.5);
    for (const player of shuffled) {
      if (teamA.length === teamB.length) {
        (Math.random() < 0.5 ? teamA : teamB).push(player);
      } else if (teamA.length < teamB.length) {
        teamA.push(player);
      } else {
        teamB.push(player);
      }
    }
  }

  return { teamA, teamB };
}

function groupByPosition(players: Player[]): [PlayerPosition | "sem_posicao", Player[]][] {
  const byPosition = new Map<PlayerPosition | "sem_posicao", Player[]>();
  for (const player of players) {
    const key = player.position ?? "sem_posicao";
    if (!byPosition.has(key)) byPosition.set(key, []);
    byPosition.get(key)!.push(player);
  }
  return POSITION_ORDER.filter((key) => byPosition.has(key)).map((key) => [key, byPosition.get(key)!]);
}

function formatTeamLines(players: Player[]): string {
  return groupByPosition(players)
    .map(([position, group]) => `${positionLabel(position)}: ${group.map((p) => p.name).join(", ")}`)
    .join("\n");
}

function teamsToText(teams: Teams): string {
  return `⚽ Sorteio de times\n\n🅰️ Time A\n${formatTeamLines(teams.teamA)}\n\n🅱️ Time B\n${formatTeamLines(teams.teamB)}`;
}

export function TeamDrawForm({ players }: { players: Player[] }) {
  const [selected, setSelected] = useState<Set<string>>(new Set());
  const [teams, setTeams] = useState<Teams | null>(null);
  const [copied, setCopied] = useState(false);

  const selectedPlayers = players.filter((p) => selected.has(p.id));

  function toggle(id: string) {
    setSelected((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
    setTeams(null);
  }

  function handleDraw() {
    setTeams(drawTeams(selectedPlayers));
    setCopied(false);
  }

  async function handleCopy() {
    if (!teams) return;
    await navigator.clipboard.writeText(teamsToText(teams));
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }

  if (players.length === 0) {
    return (
      <p className="rounded-xl border border-border bg-surface px-4 py-6 text-center text-muted">
        Nenhum jogador cadastrado ainda.
      </p>
    );
  }

  return (
    <div className="space-y-6">
      <div className="rounded-xl border border-border bg-surface p-4">
        <p className="mb-3 text-sm font-medium text-foreground">
          Quem vai jogar hoje? ({selectedPlayers.length} selecionado{selectedPlayers.length !== 1 ? "s" : ""})
        </p>
        <div className="grid grid-cols-2 gap-2 sm:grid-cols-3">
          {players.map((player) => (
            <label
              key={player.id}
              className={`flex items-center gap-2 rounded-md border px-2 py-2 text-sm ${
                selected.has(player.id) ? "border-accent bg-accent/10" : "border-border"
              }`}
            >
              <input
                type="checkbox"
                checked={selected.has(player.id)}
                onChange={() => toggle(player.id)}
                className="h-4 w-4 shrink-0"
              />
              <span className="min-w-0 truncate text-foreground">{player.name}</span>
            </label>
          ))}
        </div>

        <button
          type="button"
          onClick={handleDraw}
          disabled={selectedPlayers.length < 2}
          className="mt-4 w-full rounded-md bg-accent px-4 py-3 text-sm font-semibold text-accent-foreground disabled:opacity-50"
        >
          ⚔️ Sortear times
        </button>
        {selectedPlayers.length > 0 && selectedPlayers.length !== 14 && (
          <p className="mt-2 text-center text-xs text-muted">
            Ideal pro jogo de 7 são 14 jogadores (6 na linha + 1 no gol por time).
          </p>
        )}
      </div>

      {teams && (
        <div className="space-y-3">
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
            <TeamCard label="Time A" emoji="🅰️" players={teams.teamA} />
            <TeamCard label="Time B" emoji="🅱️" players={teams.teamB} />
          </div>
          <div className="flex gap-2">
            <button
              type="button"
              onClick={handleDraw}
              className="flex-1 rounded-md border border-border px-4 py-2 text-sm font-medium text-foreground hover:bg-surface-2"
            >
              Sortear de novo
            </button>
            <button
              type="button"
              onClick={handleCopy}
              className="flex-1 rounded-md border border-primary px-4 py-2 text-sm font-medium text-primary hover:bg-surface-2"
            >
              {copied ? "Copiado! ✓" : "Copiar pra WhatsApp"}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

function TeamCard({ label, emoji, players }: { label: string; emoji: string; players: Player[] }) {
  return (
    <div className="rounded-xl border border-border bg-surface p-4">
      <p className="mb-2 text-sm font-bold text-foreground">
        {emoji} {label}
      </p>
      <div className="space-y-1.5">
        {groupByPosition(players).map(([position, group]) => (
          <div key={position} className="text-sm">
            <span className="text-muted">{positionLabel(position)}: </span>
            <span className="text-foreground">{group.map((p) => p.name).join(", ")}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
