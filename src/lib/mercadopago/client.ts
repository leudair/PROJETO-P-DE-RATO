import "server-only";
import type { CreatePixPaymentInput, CreatePixPaymentResult, MpPaymentResponse } from "./types";

const MP_API_BASE = "https://api.mercadopago.com/v1";

export class MercadoPagoNotConfiguredError extends Error {
  constructor() {
    super("Mercado Pago nao configurado: defina MP_ACCESS_TOKEN.");
    this.name = "MercadoPagoNotConfiguredError";
  }
}

export function isMercadoPagoConfigured(): boolean {
  return Boolean(process.env.MP_ACCESS_TOKEN);
}

function accessToken(): string {
  const token = process.env.MP_ACCESS_TOKEN;
  if (!token) {
    throw new MercadoPagoNotConfiguredError();
  }
  return token;
}

// Email do pagador e' exigido pela API do Mercado Pago para criar um
// pagamento, mas o time nao coleta email dos jogadores. Usamos um email
// sintetico baseado na referencia externa — so precisa ter formato valido,
// nao precisa existir de verdade. Confirmar se isso segue aceito assim que
// as credenciais reais estiverem configuradas (ver README).
function fallbackPayerEmail(externalReference: string): string {
  return `${externalReference}@caixa-time.pagadores.local`;
}

export async function createPixPayment(input: CreatePixPaymentInput): Promise<CreatePixPaymentResult> {
  const token = accessToken();

  const res = await fetch(`${MP_API_BASE}/payments`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
      "X-Idempotency-Key": crypto.randomUUID(),
    },
    body: JSON.stringify({
      transaction_amount: input.amount,
      description: input.description,
      payment_method_id: "pix",
      external_reference: input.externalReference,
      notification_url: notificationUrl(),
      payer: {
        email: input.payerEmail ?? fallbackPayerEmail(input.externalReference),
      },
    }),
  });

  if (!res.ok) {
    const text = await res.text().catch(() => "");
    throw new Error(`Falha ao criar pagamento Pix no Mercado Pago (${res.status}): ${text}`);
  }

  const data = (await res.json()) as MpPaymentResponse;
  const transactionData = data.point_of_interaction?.transaction_data;

  return {
    mercadoPagoPaymentId: String(data.id),
    status: data.status,
    qrCode: transactionData?.qr_code ?? null,
    qrCodeBase64: transactionData?.qr_code_base64 ?? null,
    ticketUrl: transactionData?.ticket_url ?? null,
  };
}

export async function getPayment(mercadoPagoPaymentId: string): Promise<MpPaymentResponse> {
  const token = accessToken();

  const res = await fetch(`${MP_API_BASE}/payments/${mercadoPagoPaymentId}`, {
    headers: { Authorization: `Bearer ${token}` },
  });

  if (!res.ok) {
    const text = await res.text().catch(() => "");
    throw new Error(`Falha ao consultar pagamento no Mercado Pago (${res.status}): ${text}`);
  }

  return (await res.json()) as MpPaymentResponse;
}

function notificationUrl(): string {
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000";
  return `${siteUrl}/api/webhooks/mercadopago`;
}
