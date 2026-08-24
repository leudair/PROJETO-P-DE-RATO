import "server-only";
import { createAdminClient } from "@/lib/supabase/admin";

// Leitura minima e publica (nome do time + escudo) pra telas que ainda nao
// tem sessao de admin, como a tela de login. Client admin (service_role)
// porque team_settings so tem policy de leitura pra admin — aqui e' sempre
// so essas duas colunas, nada sensivel.
export async function getPublicBranding() {
  const admin = createAdminClient();
  const { data } = await admin.from("team_settings").select("team_name, crest_image_url").eq("id", 1).single();

  return {
    teamName: data?.team_name ?? "Meu Time",
    crestImageUrl: data?.crest_image_url ?? null,
  };
}
