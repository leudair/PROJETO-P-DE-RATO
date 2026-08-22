import "server-only";
import * as z from "zod";
import { createClient } from "@/lib/supabase/server";
import { requireAdmin } from "./auth";

export const CreateSponsorSchema = z.object({
  name: z.string().trim().min(1, "Informe o nome do patrocinador."),
  websiteUrl: z
    .string()
    .trim()
    .optional()
    .transform((v) => (v ? v : null))
    .refine((v) => v === null || /^https?:\/\//.test(v), "O link precisa começar com http:// ou https://"),
});

export const UpdateSponsorSchema = CreateSponsorSchema.extend({
  sponsorId: z.string().uuid(),
});

export async function listSponsors() {
  await requireAdmin();
  const supabase = await createClient();

  const { data, error } = await supabase
    .from("sponsors")
    .select("*")
    .order("display_order", { ascending: true })
    .order("created_at", { ascending: true });

  if (error) throw error;
  return data;
}

export async function createSponsor(input: z.infer<typeof CreateSponsorSchema> & { logoUrl?: string }) {
  await requireAdmin();
  const supabase = await createClient();

  const { error } = await supabase
    .from("sponsors")
    .insert({ name: input.name, website_url: input.websiteUrl, logo_url: input.logoUrl });

  if (error) throw error;
}

export async function setSponsorActive(sponsorId: string, active: boolean) {
  await requireAdmin();
  const supabase = await createClient();

  const { error } = await supabase.from("sponsors").update({ active }).eq("id", sponsorId);

  if (error) throw error;
}
