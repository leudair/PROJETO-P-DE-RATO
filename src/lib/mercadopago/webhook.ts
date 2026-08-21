import "server-only";
import { createHmac, timingSafeEqual } from "node:crypto";

// Mercado Pago assina notificacoes com um header "x-signature" no formato
// "ts=<timestamp>,v1=<hash>" (HMAC-SHA256 hex). O "manifest" assinado e'
// "id:<data.id>;request-id:<x-request-id>;ts:<ts>;" — data.id em minusculas.
// Doc: https://www.mercadopago.com.br/developers/pt/docs/checkout-api/additional-content/your-integrations/notifications/webhooks#editor_9
function parseSignatureHeader(header: string): { ts: string; v1: string } | null {
  const parts = Object.fromEntries(
    header
      .split(",")
      .map((p) => p.trim().split("=", 2))
      .filter((pair): pair is [string, string] => pair.length === 2)
  );

  if (!parts.ts || !parts.v1) return null;
  return { ts: parts.ts, v1: parts.v1 };
}

export function verifySignature(params: {
  xSignature: string | null;
  xRequestId: string | null;
  dataId: string | null;
}): boolean {
  const secret = process.env.MP_WEBHOOK_SECRET;
  if (!secret || !params.xSignature || !params.xRequestId || !params.dataId) return false;

  const parsed = parseSignatureHeader(params.xSignature);
  if (!parsed) return false;

  const manifest = `id:${params.dataId.toLowerCase()};request-id:${params.xRequestId};ts:${parsed.ts};`;
  const expected = createHmac("sha256", secret).update(manifest).digest("hex");

  const a = Buffer.from(expected);
  const b = Buffer.from(parsed.v1);
  if (a.length !== b.length) return false;
  return timingSafeEqual(a, b);
}

// Fallback temporario pra testar o endpoint localmente (curl / simulador do
// MP) antes de ter o segredo real do dashboard configurado. Remover ou
// deprioritizar assim que a verificacao de assinatura acima estiver
// validada contra trafego real do Mercado Pago (ver README).
export function verifyQuerySecret(providedSecret: string | null): boolean {
  const expected = process.env.MP_WEBHOOK_SECRET;
  if (!expected || !providedSecret) return false;

  const a = Buffer.from(providedSecret);
  const b = Buffer.from(expected);
  if (a.length !== b.length) return false;
  return timingSafeEqual(a, b);
}
