"use server";

import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";

export type ResetPasswordState = { error?: string } | undefined;

export async function updatePassword(
  _state: ResetPasswordState,
  formData: FormData,
): Promise<ResetPasswordState> {
  const password = String(formData.get("password") ?? "");
  const confirmPassword = String(formData.get("confirmPassword") ?? "");

  if (password.length < 8) {
    return { error: "A senha precisa ter pelo menos 8 caracteres." };
  }
  if (password !== confirmPassword) {
    return { error: "As senhas não coincidem." };
  }

  const supabase = await createClient();
  // So funciona com uma sessao valida de recuperacao, estabelecida pelo
  // /api/auth/confirm a partir do link do email — sem isso, updateUser falha.
  const { error } = await supabase.auth.updateUser({ password });

  if (error) {
    return { error: "Não foi possível trocar a senha. Peça um novo link de redefinição e tente de novo." };
  }

  redirect("/admin");
}
