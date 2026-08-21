"use server";

import { revalidatePath } from "next/cache";
import { UpdateSettingsSchema, updateTeamSettings } from "@/lib/data/settings";

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

  try {
    await updateTeamSettings(parsed.data);
  } catch {
    return { error: "Não foi possível salvar." };
  }

  revalidatePath("/admin/settings");
  revalidatePath("/");
  return { success: "Configurações salvas." };
}
