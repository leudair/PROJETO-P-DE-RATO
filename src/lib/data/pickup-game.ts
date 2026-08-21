import "server-only";
import * as z from "zod";
import { createAdminClient } from "@/lib/supabase/admin";

// Arrecadacao do "jogo avulso" (pelada/racha esporadico com time de onze
// aleatorio) — independente do elenco fixo, contribuicao anonima (sem
// vincular a um jogador cadastrado), valor minimo R$20 a criterio de quem
// paga.
export const PickupGameContributionSchema = z.object({
  amount: z.coerce.number().min(20, "O valor mínimo é R$ 20,00.").max(10000, "Valor muito alto."),
});

export async function createPickupGameContribution(amount: number) {
  const admin = createAdminClient();

  const { data, error } = await admin
    .from("pickup_game_contributions")
    .insert({ amount, status: "pending" })
    .select("*")
    .single();

  if (error) throw error;
  return data;
}

export async function attachPixToPickupGameContribution(
  contributionId: string,
  pix: { mercadoPagoPaymentId: string; qrCode: string | null; qrCodeBase64: string | null }
) {
  const admin = createAdminClient();

  const { error } = await admin
    .from("pickup_game_contributions")
    .update({
      mercado_pago_payment_id: pix.mercadoPagoPaymentId,
      pix_qr_code: pix.qrCode,
      pix_copy_paste: pix.qrCode,
    })
    .eq("id", contributionId);

  if (error) throw error;
}
