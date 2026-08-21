"use server";

import { revalidatePath } from "next/cache";
import {
  CreateCaixinhaSchema,
  GenerateMonthSchema,
  attachPixToPayment,
  createCaixinhaCharge,
  generateMonthlyCharges,
  getPaymentById,
  overridePaymentStatus,
} from "@/lib/data/payments";
import { createPixPayment, isMercadoPagoConfigured, MercadoPagoNotConfiguredError } from "@/lib/mercadopago/client";
import { formatReferenceMonth } from "@/lib/utils/month";

export type GenerateMonthState = { error?: string; success?: string } | undefined;

export async function generateMonthlyChargesAction(
  _state: GenerateMonthState,
  formData: FormData
): Promise<GenerateMonthState> {
  const parsed = GenerateMonthSchema.safeParse({ referenceMonth: formData.get("referenceMonth") });

  if (!parsed.success) {
    return { error: "Mês inválido." };
  }

  let created = 0;
  try {
    const result = await generateMonthlyCharges(parsed.data.referenceMonth);
    created = result.created;
  } catch {
    return { error: "Não foi possível gerar as cobranças." };
  }

  revalidatePath("/admin/charges");
  return {
    success:
      created > 0
        ? `${created} cobrança(s) de mensalidade gerada(s) para ${formatReferenceMonth(parsed.data.referenceMonth)}.`
        : "Todos os jogadores ativos já têm a mensalidade desse mês gerada.",
  };
}

export type CaixinhaFormState = { error?: string; success?: string } | undefined;

export async function createCaixinhaChargeAction(
  _state: CaixinhaFormState,
  formData: FormData
): Promise<CaixinhaFormState> {
  const parsed = CreateCaixinhaSchema.safeParse({
    playerId: formData.get("playerId"),
    amount: formData.get("amount"),
  });

  if (!parsed.success) {
    return { error: parsed.error.issues[0]?.message ?? "Dados inválidos." };
  }

  try {
    await createCaixinhaCharge(parsed.data);
  } catch {
    return { error: "Não foi possível criar a cobrança." };
  }

  revalidatePath("/admin/charges");
  return { success: "Caixinha registrada." };
}

export type GeneratePixState = { error?: string; success?: string } | undefined;

export async function generatePixForChargeAction(paymentId: string): Promise<GeneratePixState> {
  if (!isMercadoPagoConfigured()) {
    return {
      error: "Mercado Pago ainda não está configurado. Configure as credenciais para gerar cobranças Pix.",
    };
  }

  const payment = await getPaymentById(paymentId);
  const description =
    payment.type === "mensalidade"
      ? `Mensalidade - ${payment.players?.name ?? "jogador"}`
      : `Caixinha - ${payment.players?.name ?? "jogador"}`;

  try {
    const pix = await createPixPayment({
      amount: payment.amount,
      description,
      externalReference: payment.id,
    });
    await attachPixToPayment(paymentId, {
      mercadoPagoPaymentId: pix.mercadoPagoPaymentId,
      qrCode: pix.qrCode,
      qrCodeBase64: pix.qrCodeBase64,
    });
  } catch (err) {
    if (err instanceof MercadoPagoNotConfiguredError) {
      return { error: err.message };
    }
    return { error: "Não foi possível gerar o Pix. Tente novamente." };
  }

  revalidatePath("/admin/charges");
  return { success: "Pix gerado." };
}

export async function overridePaymentStatusAction(paymentId: string, status: "paid" | "pending" | "cancelled") {
  await overridePaymentStatus(paymentId, status);
  revalidatePath("/admin/charges");
}
