import "server-only";
import * as z from "zod";
import { createAdminClient } from "@/lib/supabase/admin";
import { currentReferenceMonth } from "@/lib/utils/month";
import type { SupabaseClient } from "@supabase/supabase-js";
import type { Database } from "@/lib/supabase/database.types";

// Camada de dados usada pela pagina PUBLICA (sem login) para permitir que o
// proprio jogador inicie o pagamento. Usa o client de service_role porque
// nao ha sessao de usuario aqui — por isso toda entrada e validada
// explicitamente (jogador precisa existir e estar ativo, valores tem limites
// razoaveis) antes de qualquer insert, já que não há RLS de usuário autenticado
// segurando essa porta.

export const PublicCaixinhaSchema = z.object({
  playerId: z.string().uuid(),
  amount: z.coerce.number().positive("Informe um valor válido.").max(10000, "Valor muito alto."),
});

async function assertActivePlayer(admin: SupabaseClient<Database>, playerId: string) {
  const { data, error } = await admin.from("players").select("id, active").eq("id", playerId).single();
  if (error || !data || !data.active) {
    throw new Error("Jogador inválido.");
  }
}

const UNIQUE_VIOLATION = "23505";

export async function getOrCreatePendingMensalidade(playerId: string) {
  const admin = createAdminClient();
  await assertActivePlayer(admin, playerId);
  const referenceMonth = currentReferenceMonth();

  const { data: existing, error: existingError } = await admin
    .from("payments")
    .select("*")
    .eq("player_id", playerId)
    .eq("type", "mensalidade")
    .eq("reference_month", referenceMonth)
    .maybeSingle();
  if (existingError) throw existingError;
  if (existing) return existing;

  const { data: settings, error: settingsError } = await admin
    .from("team_settings")
    .select("default_mensalidade_amount")
    .eq("id", 1)
    .single();
  if (settingsError) throw settingsError;

  const { data: created, error: insertError } = await admin
    .from("payments")
    .insert({
      player_id: playerId,
      type: "mensalidade",
      amount: settings.default_mensalidade_amount,
      reference_month: referenceMonth,
      status: "pending",
    })
    .select("*")
    .single();

  if (insertError) {
    // Corrida entre dois cliques quase simultaneos pro mesmo jogador/mes —
    // o indice unico parcial barrou o segundo insert. Busca a linha que o
    // outro request acabou de criar em vez de falhar.
    if (insertError.code === UNIQUE_VIOLATION) {
      const { data: retried, error: retryError } = await admin
        .from("payments")
        .select("*")
        .eq("player_id", playerId)
        .eq("type", "mensalidade")
        .eq("reference_month", referenceMonth)
        .single();
      if (retryError) throw retryError;
      return retried;
    }
    throw insertError;
  }

  return created;
}

export async function createCaixinhaPaymentPublic(input: z.infer<typeof PublicCaixinhaSchema>) {
  const admin = createAdminClient();
  await assertActivePlayer(admin, input.playerId);

  const { data, error } = await admin
    .from("payments")
    .insert({
      player_id: input.playerId,
      type: "caixinha",
      amount: input.amount,
      reference_month: null,
      status: "pending",
    })
    .select("*")
    .single();

  if (error) throw error;
  return data;
}

export async function attachPixToPaymentPublic(
  paymentId: string,
  pix: { mercadoPagoPaymentId: string; qrCode: string | null; qrCodeBase64: string | null }
) {
  const admin = createAdminClient();
  const { error } = await admin
    .from("payments")
    .update({
      mercado_pago_payment_id: pix.mercadoPagoPaymentId,
      pix_qr_code: pix.qrCode,
      pix_copy_paste: pix.qrCode,
    })
    .eq("id", paymentId);

  if (error) throw error;
}
