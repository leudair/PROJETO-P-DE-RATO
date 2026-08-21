import "server-only";
import * as z from "zod";
import { createClient } from "@/lib/supabase/server";
import { requireAdmin } from "./auth";
import { getTeamSettings } from "./settings";
import type { Database, PaymentStatus, PaymentType } from "@/lib/supabase/database.types";

type PaymentRow = Database["public"]["Tables"]["payments"]["Row"];
export type PaymentWithPlayer = PaymentRow & { players: { name: string } | null };

export const CreateCaixinhaSchema = z.object({
  playerId: z.string().uuid(),
  amount: z.coerce.number().positive("Informe um valor válido."),
});

export const GenerateMonthSchema = z.object({
  referenceMonth: z.string().regex(/^\d{4}-\d{2}-01$/),
});

export async function listPayments(filters?: { status?: PaymentStatus; type?: PaymentType }) {
  await requireAdmin();
  const supabase = await createClient();

  let query = supabase
    .from("payments")
    .select("*, players(name)")
    .order("created_at", { ascending: false });

  if (filters?.status) query = query.eq("status", filters.status);
  if (filters?.type) query = query.eq("type", filters.type);

  const { data, error } = await query;
  if (error) throw error;
  return data as PaymentWithPlayer[];
}

export async function getPaymentById(id: string) {
  await requireAdmin();
  const supabase = await createClient();

  const { data, error } = await supabase.from("payments").select("*, players(name)").eq("id", id).single();
  if (error) throw error;
  return data as PaymentWithPlayer;
}

export async function generateMonthlyCharges(referenceMonth: string) {
  await requireAdmin();
  const supabase = await createClient();
  const settings = await getTeamSettings();

  // Goleiro e' isento da mensalidade — nunca gerar cobranca pra ele. Filtra
  // no JS (nao com .neq() no Postgres) porque `position <> 'goleiro'` no SQL
  // exclui erroneamente jogadores com position NULL (comparacao com NULL
  // nunca e' verdadeira) — a maioria dos jogadores sem posicao definida.
  const { data: allActivePlayers, error: playersError } = await supabase
    .from("players")
    .select("id, position")
    .eq("active", true);
  if (playersError) throw playersError;
  const activePlayers = allActivePlayers.filter((p) => p.position !== "goleiro");

  const { data: existing, error: existingError } = await supabase
    .from("payments")
    .select("player_id")
    .eq("type", "mensalidade")
    .eq("reference_month", referenceMonth);
  if (existingError) throw existingError;

  const existingPlayerIds = new Set(existing.map((p) => p.player_id));
  const toCreate = activePlayers
    .filter((p) => !existingPlayerIds.has(p.id))
    .map((p) => ({
      player_id: p.id,
      type: "mensalidade" as const,
      amount: settings.default_mensalidade_amount,
      reference_month: referenceMonth,
      status: "pending" as const,
    }));

  if (toCreate.length === 0) return { created: 0 };

  const { error: insertError } = await supabase.from("payments").insert(toCreate);
  if (insertError) throw insertError;

  return { created: toCreate.length };
}

export async function createCaixinhaCharge(input: z.infer<typeof CreateCaixinhaSchema>) {
  await requireAdmin();
  const supabase = await createClient();

  const { error } = await supabase.from("payments").insert({
    player_id: input.playerId,
    type: "caixinha",
    amount: input.amount,
    reference_month: null,
    status: "pending",
  });

  if (error) throw error;
}

export async function attachPixToPayment(
  paymentId: string,
  pix: { mercadoPagoPaymentId: string; qrCode: string | null; qrCodeBase64: string | null }
) {
  await requireAdmin();
  const supabase = await createClient();

  const { error } = await supabase
    .from("payments")
    .update({
      mercado_pago_payment_id: pix.mercadoPagoPaymentId,
      pix_qr_code: pix.qrCode,
      pix_copy_paste: pix.qrCode,
    })
    .eq("id", paymentId);

  if (error) throw error;
}

export async function overridePaymentStatus(paymentId: string, status: PaymentStatus) {
  await requireAdmin();
  const supabase = await createClient();

  const { error } = await supabase
    .from("payments")
    .update({
      status,
      paid_at: status === "paid" ? new Date().toISOString() : null,
    })
    .eq("id", paymentId);

  if (error) throw error;
}
