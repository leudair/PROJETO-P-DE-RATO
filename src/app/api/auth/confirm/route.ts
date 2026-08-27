import { type EmailOtpType } from "@supabase/supabase-js";
import { type NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

// Recebe o link do email de redefinicao de senha (template "Reset Password"
// no painel do Supabase deve usar {{ .SiteURL }}/api/auth/confirm?token_hash=
// {{ .TokenHash }}&type=recovery&next=/admin/redefinir-senha). Usar token_hash
// em vez do fluxo PKCE padrao porque o link pode ser aberto num dispositivo
// diferente do que pediu a redefinicao (ex: pedido no computador, aberto no
// celular) — PKCE exige o mesmo navegador em que o pedido foi feito.
export async function GET(request: NextRequest) {
  const { searchParams, origin } = new URL(request.url);
  const tokenHash = searchParams.get("token_hash");
  const type = searchParams.get("type") as EmailOtpType | null;
  const next = searchParams.get("next") ?? "/";

  if (tokenHash && type) {
    const supabase = await createClient();
    const { error } = await supabase.auth.verifyOtp({ type, token_hash: tokenHash });
    if (!error) {
      return NextResponse.redirect(`${origin}${next}`);
    }
  }

  return NextResponse.redirect(`${origin}/admin/login?erro=link_invalido`);
}
