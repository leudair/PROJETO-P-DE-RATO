"use client";

import { useTransition } from "react";
import { setSponsorActiveAction } from "./actions";

export function ToggleActiveButton({ sponsorId, active }: { sponsorId: string; active: boolean }) {
  const [pending, startTransition] = useTransition();

  return (
    <button
      type="button"
      disabled={pending}
      onClick={() => startTransition(() => setSponsorActiveAction(sponsorId, !active))}
      className="text-xs text-muted hover:text-foreground disabled:opacity-50"
    >
      {active ? "Ocultar" : "Reativar"}
    </button>
  );
}
