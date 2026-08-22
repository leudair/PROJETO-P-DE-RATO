import "server-only";
import * as z from "zod";
import { createClient } from "@/lib/supabase/server";
import { requireAdmin } from "./auth";
import { POSITIONS } from "@/lib/utils/positions";

export const CreatePlayerSchema = z.object({
  name: z.string().trim().min(1, "Informe o nome."),
  phone: z
    .string()
    .trim()
    .optional()
    .transform((v) => (v ? v : null)),
  position: z
    .union([z.enum(POSITIONS), z.literal("")])
    .optional()
    .transform((v) => (v ? v : null)),
  age: z
    .union([z.coerce.number().int().positive().max(99), z.literal("")])
    .optional()
    .transform((v) => (v ? v : null)),
});

export const UpdatePlayerSchema = CreatePlayerSchema.extend({
  playerId: z.string().uuid(),
});

export async function listPlayers() {
  await requireAdmin();
  const supabase = await createClient();

  const { data, error } = await supabase.from("players").select("*").order("name", { ascending: true });

  if (error) throw error;
  return data;
}

export async function getPlayer(id: string) {
  await requireAdmin();
  const supabase = await createClient();

  const { data, error } = await supabase.from("players").select("*").eq("id", id).single();

  if (error) throw error;
  return data;
}

export async function createPlayer(input: z.infer<typeof CreatePlayerSchema> & { photoUrl?: string }) {
  await requireAdmin();
  const supabase = await createClient();

  const { error } = await supabase.from("players").insert({
    name: input.name,
    phone: input.phone,
    position: input.position,
    age: input.age,
    photo_url: input.photoUrl,
  });

  if (error) throw error;
}

export async function updatePlayer(
  input: z.infer<typeof UpdatePlayerSchema> & { photoUrl?: string }
) {
  await requireAdmin();
  const supabase = await createClient();

  const { error } = await supabase
    .from("players")
    .update({
      name: input.name,
      phone: input.phone,
      position: input.position,
      age: input.age,
      // so sobrescreve a foto quando uma nova foi enviada nesse submit
      ...(input.photoUrl ? { photo_url: input.photoUrl } : {}),
    })
    .eq("id", input.playerId);

  if (error) throw error;
}

export async function setPlayerActive(playerId: string, active: boolean) {
  await requireAdmin();
  const supabase = await createClient();

  const { error } = await supabase.from("players").update({ active }).eq("id", playerId);

  if (error) throw error;
}
