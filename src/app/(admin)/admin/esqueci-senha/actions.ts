"use server";

import { createClient } from "@/lib/supabase/server";

export type ForgotPasswordState = { sent?: boolean; error?: string } | undefined;

// O link enviado por email usa {{ .TokenHash }}/{{ .SiteURL }} do template
// "Reset Password" do Supabase (ver /api/auth/confirm), entao redirectTo nao
// e necessario aqui — evita depender do fluxo PKCE, que quebra quando o link
// e aberto num dispositivo diferente do que pediu a redefinicao.
export async function requestPasswordReset(
  _state: ForgotPasswordState,
  formData: FormData,
): Promise<ForgotPasswordState> {
  const email = String(formData.get("email") ?? "").trim();

  if (!email) {
    return { error: "Preencha o email." };
  }

  const supabase = await createClient();
  await supabase.auth.resetPasswordForEmail(email);

  // Sempre retorna sucesso, exista ou nao o email cadastrado — evita expor
  // quais emails tem conta (mesma logica de "Email ou senha invalidos" no login).
  return { sent: true };
}
