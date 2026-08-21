"use server";

import {
  PublicCaixinhaSchema,
  attachPixToPaymentPublic,
  createCaixinhaPaymentPublic,
  getOrCreatePendingMensalidade,
} from "@/lib/data/public-payments";
import {
  PickupGameContributionSchema,
  attachPixToPickupGameContribution,
  createPickupGameContribution,
} from "@/lib/data/pickup-game";
import { createPixPayment, isMercadoPagoConfigured, MercadoPagoNotConfiguredError } from "@/lib/mercadopago/client";

export type PayState =
  | { status: "already-paid" }
  | { status: "pix-ready"; copyPaste: string; amount: number }
  | { status: "error"; message: string }
  | undefined;

interface PayableRecord {
  id: string;
  amount: number;
  status: string;
  pix_copy_paste: string | null;
}

type AttachPix = (
  id: string,
  pix: { mercadoPagoPaymentId: string; qrCode: string | null; qrCodeBase64: string | null }
) => Promise<void>;

async function generateOrReusePix(record: PayableRecord, description: string, attachPix: AttachPix): Promise<PayState> {
  if (record.status === "paid") {
    return { status: "already-paid" };
  }

  if (record.pix_copy_paste) {
    return { status: "pix-ready", copyPaste: record.pix_copy_paste, amount: record.amount };
  }

  if (!isMercadoPagoConfigured()) {
    return {
      status: "error",
      message: "Pagamento via Pix ainda não está disponível. Volte em breve.",
    };
  }

  try {
    const pix = await createPixPayment({
      amount: record.amount,
      description,
      externalReference: record.id,
    });

    if (!pix.qrCode) {
      return { status: "error", message: "Pix gerado sem código. Tente novamente." };
    }

    await attachPix(record.id, {
      mercadoPagoPaymentId: pix.mercadoPagoPaymentId,
      qrCode: pix.qrCode,
      qrCodeBase64: pix.qrCodeBase64,
    });

    return { status: "pix-ready", copyPaste: pix.qrCode, amount: record.amount };
  } catch (err) {
    if (err instanceof MercadoPagoNotConfiguredError) {
      return { status: "error", message: err.message };
    }
    return { status: "error", message: "Não foi possível gerar o Pix. Tente novamente." };
  }
}

export async function payMensalidadeAction(playerId: string): Promise<PayState> {
  try {
    const payment = await getOrCreatePendingMensalidade(playerId);
    return await generateOrReusePix(payment, "Mensalidade do time", attachPixToPaymentPublic);
  } catch {
    return { status: "error", message: "Não foi possível iniciar o pagamento." };
  }
}

export async function payCaixinhaAction(
  playerId: string,
  _prevState: PayState,
  formData: FormData
): Promise<PayState> {
  const parsed = PublicCaixinhaSchema.safeParse({ playerId, amount: formData.get("amount") });

  if (!parsed.success) {
    return { status: "error", message: parsed.error.issues[0]?.message ?? "Valor inválido." };
  }

  try {
    const payment = await createCaixinhaPaymentPublic(parsed.data);
    return await generateOrReusePix(payment, "Caixinha do time", attachPixToPaymentPublic);
  } catch {
    return { status: "error", message: "Não foi possível iniciar o pagamento." };
  }
}

export async function payPickupGameAction(_prevState: PayState, formData: FormData): Promise<PayState> {
  const parsed = PickupGameContributionSchema.safeParse({ amount: formData.get("amount") });

  if (!parsed.success) {
    return { status: "error", message: parsed.error.issues[0]?.message ?? "Valor inválido." };
  }

  try {
    const contribution = await createPickupGameContribution(parsed.data.amount);
    return await generateOrReusePix(contribution, "Jogo avulso", attachPixToPickupGameContribution);
  } catch {
    return { status: "error", message: "Não foi possível iniciar o pagamento." };
  }
}
