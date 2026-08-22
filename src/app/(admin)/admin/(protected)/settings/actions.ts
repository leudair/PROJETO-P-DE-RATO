"use server";

import { revalidatePath } from "next/cache";
import { UpdateSettingsSchema, updateTeamSettings } from "@/lib/data/settings";
import { InvalidImageError, uploadPublicImage, uploadPublicMedia } from "@/lib/supabase/storage";

export type SettingsFormState = { error?: string; success?: string } | undefined;

export async function updateSettingsAction(
  _state: SettingsFormState,
  formData: FormData
): Promise<SettingsFormState> {
  const parsed = UpdateSettingsSchema.safeParse({
    teamName: formData.get("teamName"),
    defaultMensalidadeAmount: formData.get("defaultMensalidadeAmount"),
  });

  if (!parsed.success) {
    return { error: parsed.error.issues[0]?.message ?? "Dados inválidos." };
  }

  let bannerImageUrl: string | undefined;
  const bannerFile = formData.get("bannerImage");
  if (bannerFile instanceof File && bannerFile.size > 0) {
    try {
      bannerImageUrl = await uploadPublicMedia(bannerFile, "banners");
    } catch (err) {
      if (err instanceof InvalidImageError) {
        return { error: err.message };
      }
      return { error: "Não foi possível enviar a imagem/vídeo do banner." };
    }
  }

  let crestImageUrl: string | undefined;
  const crestFile = formData.get("crestImage");
  if (crestFile instanceof File && crestFile.size > 0) {
    try {
      crestImageUrl = await uploadPublicImage(crestFile, "crest");
    } catch (err) {
      if (err instanceof InvalidImageError) {
        return { error: err.message };
      }
      return { error: "Não foi possível enviar o escudo." };
    }
  }

  try {
    await updateTeamSettings({ ...parsed.data, bannerImageUrl, crestImageUrl });
  } catch {
    return { error: "Não foi possível salvar." };
  }

  revalidatePath("/admin/settings");
  revalidatePath("/");
  return { success: "Configurações salvas." };
}
