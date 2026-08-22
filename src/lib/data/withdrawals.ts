import "server-only";
import * as z from "zod";
import { createClient } from "@/lib/supabase/server";
import { requireAdmin } from "./auth";

export const CreateWithdrawalSchema = z.object({
  description: z.string().trim().min(1, "Descreva o motivo da retirada."),
  amount: z.coerce.number().positive("Informe um valor válido."),
});

export async function listWithdrawals() {
  await requireAdmin();
  const supabase = await createClient();

  const { data, error } = await supabase
    .from("withdrawals")
    .select("*")
    .order("created_at", { ascending: false });

  if (error) throw error;
  return data;
}

export async function createWithdrawal(input: z.infer<typeof CreateWithdrawalSchema>) {
  await requireAdmin();
  const supabase = await createClient();

  const { error } = await supabase
    .from("withdrawals")
    .insert({ description: input.description, amount: input.amount });

  if (error) throw error;
}
