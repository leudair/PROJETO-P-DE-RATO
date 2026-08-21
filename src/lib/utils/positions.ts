import type { PlayerPosition } from "@/lib/supabase/database.types";

export const POSITIONS = [
  "goleiro",
  "zagueiro",
  "lateral",
  "volante",
  "meia",
  "atacante",
] as const satisfies readonly PlayerPosition[];

export const POSITION_LABEL: Record<PlayerPosition, string> = {
  goleiro: "Goleiro",
  zagueiro: "Zagueiro",
  lateral: "Lateral",
  volante: "Volante",
  meia: "Meia",
  atacante: "Atacante",
};
