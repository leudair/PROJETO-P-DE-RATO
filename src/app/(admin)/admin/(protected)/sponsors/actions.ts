"use server";

import { revalidatePath } from "next/cache";
import { CreateSponsorSchema, createSponsor, setSponsorActive } from "@/lib/data/sponsors";
import { InvalidImageError, uploadPublicImage } from "@/lib/supabase/storage";

export type SponsorFormState = { error?: string; success?: string } | undefined;

export async function createSponsorAction(
  _state: SponsorFormState,
  formData: FormData
): Promise<SponsorFormState> {
  const parsed = CreateSponsorSchema.safeParse({
    name: formData.get("name"),
    websiteUrl: formData.get("websiteUrl"),
  });

  if (!parsed.success) {
    return { error: parsed.error.issues[0]?.message ?? "Dados inválidos." };
  }

  let logoUrl: string | undefined;
  const logoFile = formData.get("logo");
  if (logoFile instanceof File && logoFile.size > 0) {
    try {
      logoUrl = await uploadPublicImage(logoFile, "sponsors");
    } catch (err) {
      if (err instanceof InvalidImageError) {
        return { error: err.message };
      }
      return { error: "Não foi possível enviar a logo." };
    }
  }

  try {
    await createSponsor({ ...parsed.data, logoUrl });
  } catch {
    return { error: "Não foi possível adicionar o patrocinador." };
  }

  revalidatePath("/admin/sponsors");
  revalidatePath("/");
  return { success: "Patrocinador adicionado." };
}

export async function setSponsorActiveAction(sponsorId: string, active: boolean) {
  await setSponsorActive(sponsorId, active);
  revalidatePath("/admin/sponsors");
  revalidatePath("/");
}
