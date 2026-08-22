import "server-only";
import * as z from "zod";
import { createAdminClient } from "@/lib/supabase/admin";

// Arrecadacao pra lavagem dos coletes — independente do elenco fixo,
// contribuicao anonima (sem vincular a um jogador cadastrado), sem valor
// minimo (diferente do jogo avulso). Caixinha separada da mensalidade e do
// jogo avulso, com sua propria tabela.
export const JerseyWashContributionSchema = z.object({
  amount: z.coerce.number().positive("Informe um valor válido.").max(10000, "Valor muito alto."),
});

export async function createJerseyWashContribution(amount: number) {
  const admin = createAdminClient();

  const { data, error } = await admin
    .from("jersey_wash_contributions")
    .insert({ amount, status: "pending" })
    .select("*")
    .single();

  if (error) throw error;
  return data;
}

export async function attachPixToJerseyWashContribution(
  contributionId: string,
  pix: { mercadoPagoPaymentId: string; qrCode: string | null; qrCodeBase64: string | null }
) {
  const admin = createAdminClient();

  const { error } = await admin
    .from("jersey_wash_contributions")
    .update({
      mercado_pago_payment_id: pix.mercadoPagoPaymentId,
      pix_qr_code: pix.qrCode,
      pix_copy_paste: pix.qrCode,
    })
    .eq("id", contributionId);

  if (error) throw error;
}
