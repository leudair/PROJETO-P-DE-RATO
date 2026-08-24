import "server-only";
import { createAdminClient } from "@/lib/supabase/admin";

// Leitura publica minima pra tela de sorteio de times: so nome e posicao,
// nada de dado sensivel. Mesma logica de public-status.ts (client admin,
// selecao explicita de colunas).
export async function getActivePlayersForDraw() {
  const admin = createAdminClient();

  const { data, error } = await admin
    .from("players")
    .select("id, name, position")
    .eq("active", true)
    .order("name", { ascending: true });

  if (error) throw error;
  return data;
}
