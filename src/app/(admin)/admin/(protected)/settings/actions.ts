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

  let topBannerUrl: string | undefined;
  const topBannerFile = formData.get("topBannerImage");
  if (topBannerFile instanceof File && topBannerFile.size > 0) {
    try {
      topBannerUrl = await uploadPublicImage(topBannerFile, "top-banners");
    } catch (err) {
      if (err instanceof InvalidImageError) {
        return { error: err.message };
      }
      return { error: "Não foi possível enviar o banner do topo." };
    }
  }

  let pickupGameBannerUrl: string | undefined;
  const pickupGameBannerFile = formData.get("pickupGameBannerImage");
  if (pickupGameBannerFile instanceof File && pickupGameBannerFile.size > 0) {
    try {
      pickupGameBannerUrl = await uploadPublicImage(pickupGameBannerFile, "pickup-game-banners");
    } catch (err) {
      if (err instanceof InvalidImageError) {
        return { error: err.message };
      }
      return { error: "Não foi possível enviar o banner do jogo de onze." };
    }
  }

  try {
    await updateTeamSettings({
      ...parsed.data,
      bannerImageUrl,
      crestImageUrl,
      topBannerUrl,
      pickupGameBannerUrl,
    });
  } catch {
    return { error: "Não foi possível salvar." };
  }

  revalidatePath("/admin/settings");
  revalidatePath("/");
  return { success: "Configurações salvas." };
}
