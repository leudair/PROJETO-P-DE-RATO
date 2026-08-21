"use server";

import { revalidatePath } from "next/cache";
import {
  CreatePlayerSchema,
  UpdatePlayerSchema,
  createPlayer,
  setPlayerActive,
  updatePlayer,
} from "@/lib/data/players";

export type PlayerFormState = { error?: string; success?: string } | undefined;

export async function createPlayerAction(
  _state: PlayerFormState,
  formData: FormData
): Promise<PlayerFormState> {
  const parsed = CreatePlayerSchema.safeParse({
    name: formData.get("name"),
    phone: formData.get("phone"),
  });

  if (!parsed.success) {
    return { error: parsed.error.issues[0]?.message ?? "Dados inválidos." };
  }

  try {
    await createPlayer(parsed.data);
  } catch {
    return { error: "Não foi possível criar o jogador." };
  }

  revalidatePath("/admin/players");
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
  });

  if (!parsed.success) {
    return { error: parsed.error.issues[0]?.message ?? "Dados inválidos." };
  }

  try {
    await updatePlayer(parsed.data);
  } catch {
    return { error: "Não foi possível salvar." };
  }

  revalidatePath("/admin/players");
  return { success: "Atualizado." };
}

export async function setPlayerActiveAction(playerId: string, active: boolean) {
  await setPlayerActive(playerId, active);
  revalidatePath("/admin/players");
}
