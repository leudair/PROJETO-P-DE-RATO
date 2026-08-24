import "server-only";
import * as z from "zod";
import { createAdminClient } from "@/lib/supabase/admin";

// Arrecadacao pra lavagem dos coletes — independente do elenco fixo, sem
// valor minimo (diferente do jogo avulso). Nome de quem contribuiu pedido
// no mesmo formulario, mesmo motivo do jogo avulso (ver pickup-game.ts).
export const JerseyWashContributionSchema = z.object({
  amount: z.coerce.number().positive("Informe um valor válido.").max(10000, "Valor muito alto."),
  contributorName: z.string().trim().min(1, "Informe seu nome."),
});

export async function createJerseyWashContribution(input: z.infer<typeof JerseyWashContributionSchema>) {
  const admin = createAdminClient();

  const { data, error } = await admin
    .from("jersey_wash_contributions")
    .insert({ amount: input.amount, contributor_name: input.contributorName, status: "pending" })
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
