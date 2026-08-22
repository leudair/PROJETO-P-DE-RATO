"use server";

import { revalidatePath } from "next/cache";
import { CreateWithdrawalSchema, createWithdrawal } from "@/lib/data/withdrawals";

export type WithdrawalFormState = { error?: string; success?: string } | undefined;

export async function createWithdrawalAction(
  _state: WithdrawalFormState,
  formData: FormData
): Promise<WithdrawalFormState> {
  const parsed = CreateWithdrawalSchema.safeParse({
    description: formData.get("description"),
    amount: formData.get("amount"),
  });

  if (!parsed.success) {
    return { error: parsed.error.issues[0]?.message ?? "Dados inválidos." };
  }

  try {
    await createWithdrawal(parsed.data);
  } catch {
    return { error: "Não foi possível registrar a retirada." };
  }

  revalidatePath("/admin/cash");
  revalidatePath("/");
  return { success: "Retirada registrada." };
}
