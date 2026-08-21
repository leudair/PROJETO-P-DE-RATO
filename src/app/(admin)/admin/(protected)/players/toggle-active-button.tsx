"use client";

import { useTransition } from "react";
import { setPlayerActiveAction } from "./actions";

export function ToggleActiveButton({ playerId, active }: { playerId: string; active: boolean }) {
  const [pending, startTransition] = useTransition();

  return (
    <button
      type="button"
      disabled={pending}
      onClick={() => startTransition(() => setPlayerActiveAction(playerId, !active))}
      className="text-xs text-muted hover:text-foreground disabled:opacity-50"
    >
      {active ? "Desativar" : "Reativar"}
    </button>
  );
}
