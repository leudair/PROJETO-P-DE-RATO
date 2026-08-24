import "server-only";
import * as z from "zod";
import { createAdminClient } from "@/lib/supabase/admin";

// Arrecadacao do "jogo avulso" (pelada/racha esporadico com time de onze
// aleatorio) — independente do elenco fixo, valor minimo R$20 a criterio de
// quem paga. O nome de quem contribuiu e' pedido no mesmo formulario (nao
// um passo separado depois do Pix) — sem isso o dinheiro chega mas ninguem
// sabe quem pagou.
export const PickupGameContributionSchema = z.object({
  amount: z.coerce.number().min(20, "O valor mínimo é R$ 20,00.").max(10000, "Valor muito alto."),
  contributorName: z.string().trim().min(1, "Informe seu nome."),
});

export async function createPickupGameContribution(input: z.infer<typeof PickupGameContributionSchema>) {
  const admin = createAdminClient();

  const { data, error } = await admin
    .from("pickup_game_contributions")
    .insert({ amount: input.amount, contributor_name: input.contributorName, status: "pending" })
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
