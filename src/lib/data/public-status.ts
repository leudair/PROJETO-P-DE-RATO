import "server-only";
import { createAdminClient } from "@/lib/supabase/admin";
import { currentReferenceMonth } from "@/lib/utils/month";

// Leitura exclusiva para a pagina publica de status. So server-only, so
// client admin (service_role) — nunca importar em um "use client". Seleciona
// EXPLICITAMENTE apenas colunas seguras: nunca phone, mercado_pago_payment_id,
// pix_qr_code ou pix_copy_paste chegam perto dessa funcao.
export async function getPublicStatus() {
  const admin = createAdminClient();
  const referenceMonth = currentReferenceMonth();

  const [{ data: settings }, { data: players, error: playersError }, { data: payments, error: paymentsError }] =
    await Promise.all([
      admin.from("team_settings").select("team_name, default_mensalidade_amount").eq("id", 1).single(),
      admin.from("players").select("id, name").eq("active", true).order("name", { ascending: true }),
      admin
        .from("payments")
        .select("player_id, type, amount, status")
        .eq("reference_month", referenceMonth),
    ]);

  if (playersError) throw playersError;
  if (paymentsError) throw paymentsError;

  const mensalidadeByPlayer = new Map(
    payments.filter((p) => p.type === "mensalidade").map((p) => [p.player_id, p])
  );

  const playerStatus = players.map((player) => {
    const payment = mensalidadeByPlayer.get(player.id);
    return {
      id: player.id,
      name: player.name,
      status: payment?.status === "paid" ? ("paid" as const) : ("pending" as const),
    };
  });

  const caixinhaContributions = payments
    .filter((p) => p.type === "caixinha" && p.status === "paid")
    .map((p) => ({
      playerName: players.find((pl) => pl.id === p.player_id)?.name ?? "Jogador",
      amount: p.amount,
    }));

  const totalMensalidade = payments
    .filter((p) => p.type === "mensalidade" && p.status === "paid")
    .reduce((sum, p) => sum + p.amount, 0);

  const totalCaixinha = caixinhaContributions.reduce((sum, c) => sum + c.amount, 0);

  return {
    teamName: settings?.team_name ?? "Meu Time",
    defaultMensalidadeAmount: settings?.default_mensalidade_amount ?? 0,
    referenceMonth,
    players: playerStatus,
    caixinhaContributions,
    totals: {
      mensalidade: totalMensalidade,
      caixinha: totalCaixinha,
      total: totalMensalidade + totalCaixinha,
    },
  };
}
