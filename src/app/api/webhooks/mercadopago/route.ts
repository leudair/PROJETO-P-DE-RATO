import { NextRequest, NextResponse } from "next/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { getPayment } from "@/lib/mercadopago/client";
import { verifyQuerySecret, verifySignature } from "@/lib/mercadopago/webhook";

export const dynamic = "force-dynamic";

interface WebhookBody {
  type?: string;
  action?: string;
  data?: { id?: string | number };
}

// O Mercado Pago manda notificacoes tanto no formato novo
// ({ type: "payment", data: { id } } no corpo) quanto no formato antigo
// (query string ?topic=payment&id=...). Suportamos os dois.
function extractPaymentEvent(request: NextRequest, body: WebhookBody | null) {
  const bodyType = body?.type ?? null;
  const bodyDataId = body?.data?.id != null ? String(body.data.id) : null;

  const topic = request.nextUrl.searchParams.get("topic");
  const queryId = request.nextUrl.searchParams.get("id") ?? request.nextUrl.searchParams.get("data.id");

  const type = bodyType ?? topic;
  const dataId = bodyDataId ?? queryId;

  if (type !== "payment" || !dataId) return null;
  return { dataId };
}

function isAuthorized(request: NextRequest, dataId: string | null): boolean {
  const bySignature = verifySignature({
    xSignature: request.headers.get("x-signature"),
    xRequestId: request.headers.get("x-request-id"),
    dataId,
  });
  if (bySignature) return true;

  // Fallback temporario para testes locais antes de ter o segredo real
  // configurado no dashboard do Mercado Pago — ver lib/mercadopago/webhook.ts.
  return verifyQuerySecret(request.nextUrl.searchParams.get("secret"));
}

export async function POST(request: NextRequest) {
  const body = (await request.json().catch(() => null)) as WebhookBody | null;

  const event = extractPaymentEvent(request, body);

  // Falha fechado: sem assinatura/segredo valido, nunca toca o banco —
  // mesmo que o payload pareça legitimo.
  if (!isAuthorized(request, event?.dataId ?? null)) {
    return new NextResponse("Unauthorized", { status: 401 });
  }

  if (!event) {
    // Evento que nao e' de pagamento (ex: merchant_order) — aceita (200)
    // mas nao ha o que fazer, evita retries infinitos do Mercado Pago.
    return NextResponse.json({ ok: true, matched: false });
  }

  let mpPayment;
  try {
    // Nunca confia no valor/status vindo no corpo do webhook — busca o
    // pagamento de verdade na API do Mercado Pago.
    mpPayment = await getPayment(event.dataId);
  } catch (err) {
    console.error("Erro ao consultar pagamento no Mercado Pago:", err);
    return new NextResponse("Internal error", { status: 500 });
  }

  if (mpPayment.status !== "approved") {
    return NextResponse.json({ ok: true, matched: false, status: mpPayment.status });
  }

  const paymentId = mpPayment.external_reference;
  if (!paymentId) {
    return NextResponse.json({ ok: true, matched: false });
  }

  const admin = createAdminClient();
  const { error } = await admin
    .from("payments")
    .update({
      status: "paid",
      mercado_pago_payment_id: String(mpPayment.id),
      paid_at: new Date().toISOString(),
    })
    .eq("id", paymentId);

  if (error) {
    console.error("Erro ao atualizar cobranca a partir do webhook:", error);
    return new NextResponse("Internal error", { status: 500 });
  }

  return NextResponse.json({ ok: true, matched: true });
}
