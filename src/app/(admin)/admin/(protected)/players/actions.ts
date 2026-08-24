"use server";

import { revalidatePath } from "next/cache";
import {
  CreatePlayerSchema,
  UpdatePlayerSchema,
  createPlayer,
  setPlayerActive,
  updatePlayer,
} from "@/lib/data/players";
import { InvalidImageError, uploadPublicImage, uploadPublicMedia } from "@/lib/supabase/storage";

export type PlayerFormState = { error?: string; success?: string } | undefined;

async function uploadPhotoIfPresent(formData: FormData): Promise<string | undefined> {
  const photoFile = formData.get("photo");
  if (photoFile instanceof File && photoFile.size > 0) {
    return uploadPublicMedia(photoFile, "players");
  }
  return undefined;
}

async function uploadAvatarPhotoIfPresent(formData: FormData): Promise<string | undefined> {
  const avatarFile = formData.get("avatarPhoto");
  if (avatarFile instanceof File && avatarFile.size > 0) {
    return uploadPublicImage(avatarFile, "players-avatar");
  }
  return undefined;
}

export async function createPlayerAction(
  _state: PlayerFormState,
  formData: FormData
): Promise<PlayerFormState> {
  const parsed = CreatePlayerSchema.safeParse({
    name: formData.get("name"),
    phone: formData.get("phone"),
    position: formData.get("position"),
    birthDate: formData.get("birthDate"),
  });

  if (!parsed.success) {
    return { error: parsed.error.issues[0]?.message ?? "Dados inválidos." };
  }

  let photoUrl: string | undefined;
  let avatarPhotoUrl: string | undefined;
  try {
    photoUrl = await uploadPhotoIfPresent(formData);
    avatarPhotoUrl = await uploadAvatarPhotoIfPresent(formData);
  } catch (err) {
    if (err instanceof InvalidImageError) return { error: err.message };
    return { error: "Não foi possível enviar a foto." };
  }

  try {
    await createPlayer({ ...parsed.data, photoUrl, avatarPhotoUrl });
  } catch {
    return { error: "Não foi possível criar o jogador." };
  }

  revalidatePath("/admin/players");
  revalidatePath("/");
  return { success: "Jogador criado." };
}

export async function updatePlayerAction(
  _state: PlayerFormState,
  formData: FormData
): Promise<PlayerFormState> {
  const parsed = UpdatePlayerSchema.safeParse({
    playerId: formData.get("playerId"),
    name: formData.get("name"),
    phone: formData.get("phone"),
    position: formData.get("position"),
    birthDate: formData.get("birthDate"),
  });

  if (!parsed.success) {
    return { error: parsed.error.issues[0]?.message ?? "Dados inválidos." };
  }

  let photoUrl: string | undefined;
  let avatarPhotoUrl: string | undefined;
  try {
    photoUrl = await uploadPhotoIfPresent(formData);
    avatarPhotoUrl = await uploadAvatarPhotoIfPresent(formData);
  } catch (err) {
    if (err instanceof InvalidImageError) return { error: err.message };
    return { error: "Não foi possível enviar a foto." };
  }

  try {
    await updatePlayer({ ...parsed.data, photoUrl, avatarPhotoUrl });
  } catch {
    return { error: "Não foi possível salvar." };
  }

  revalidatePath("/admin/players");
  revalidatePath("/");
  return { success: "Atualizado." };
}

export async function setPlayerActiveAction(playerId: string, active: boolean) {
  await setPlayerActive(playerId, active);
  revalidatePath("/admin/players");
  revalidatePath("/");
}
