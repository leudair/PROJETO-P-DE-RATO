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
  input: z.infer<typeof UpdateSettingsSchema> & { bannerImageUrl?: string }
) {
  await requireAdmin();
  const supabase = await createClient();

  const { error } = await supabase
    .from("team_settings")
    .update({
      team_name: input.teamName,
      default_mensalidade_amount: input.defaultMensalidadeAmount,
      // so sobrescreve o banner quando uma nova imagem foi enviada nesse
      // submit — salvar as outras configuracoes nao deve apagar o banner atual.
      ...(input.bannerImageUrl ? { banner_image_url: input.bannerImageUrl } : {}),
      updated_at: new Date().toISOString(),
    })
    .eq("id", 1);

  if (error) throw error;
}
