import "server-only";
import * as z from "zod";
import { createClient } from "@/lib/supabase/server";
import { requireAdmin } from "./auth";

export const UpdateSettingsSchema = z.object({
  teamName: z.string().trim().min(1, "Informe o nome do time."),
  defaultMensalidadeAmount: z.coerce.number().positive("Informe um valor válido."),
});

export async function getTeamSettings() {
  const supabase = await createClient();
  const { data, error } = await supabase.from("team_settings").select("*").eq("id", 1).single();

  if (error) throw error;
  return data;
}

export async function updateTeamSettings(
  input: z.infer<typeof UpdateSettingsSchema> & {
    bannerImageUrl?: string;
    crestImageUrl?: string;
    topBannerUrl?: string;
    pickupGameBannerUrl?: string;
  }
) {
  await requireAdmin();
  const supabase = await createClient();

  const { error } = await supabase
    .from("team_settings")
    .update({
      team_name: input.teamName,
      default_mensalidade_amount: input.defaultMensalidadeAmount,
      // so sobrescreve banner/escudo/topo quando uma nova imagem foi
      // enviada nesse submit — salvar as outras configuracoes nao deve
      // apagar o que ja estava la.
      ...(input.bannerImageUrl ? { banner_image_url: input.bannerImageUrl } : {}),
      ...(input.crestImageUrl ? { crest_image_url: input.crestImageUrl } : {}),
      ...(input.topBannerUrl ? { top_banner_url: input.topBannerUrl } : {}),
      ...(input.pickupGameBannerUrl ? { pickup_game_banner_url: input.pickupGameBannerUrl } : {}),
      updated_at: new Date().toISOString(),
    })
    .eq("id", 1);

  if (error) throw error;
}
