import "server-only";
import { createAdminClient } from "@/lib/supabase/admin";
import { currentReferenceMonth } from "@/lib/utils/month";

function isInCurrentCalendarMonth(iso: string): boolean {
  const now = new Date();
  const d = new Date(iso);
  return d.getUTCFullYear() === now.getUTCFullYear() && d.getUTCMonth() === now.getUTCMonth();
}

// Leitura exclusiva para a pagina publica de status. So server-only, so
// client admin (service_role) — nunca importar em um "use client". Seleciona
// EXPLICITAMENTE apenas colunas seguras: nunca phone, mercado_pago_payment_id,
// pix_qr_code ou pix_copy_paste chegam perto dessa funcao.
export async function getPublicStatus() {
  const admin = createAdminClient();
  const referenceMonth = currentReferenceMonth();

  const [
    { data: settings },
    { data: players, error: playersError },
    { data: payments, error: paymentsError },
    { data: pickupGame, error: pickupGameError },
    { data: jerseyWash, error: jerseyWashError },
    { data: withdrawals, error: withdrawalsError },
    { data: sponsors, error: sponsorsError },
  ] = await Promise.all([
    admin
      .from("team_settings")
      .select("team_name, default_mensalidade_amount, banner_image_url, crest_image_url")
      .eq("id", 1)
      .single(),
    admin
      .from("players")
      .select("id, name, position, photo_url")
      .eq("active", true)
      .order("name", { ascending: true }),
    // sem filtro de reference_month aqui: mensalidade usa reference_month,
    // mas caixinha e' sempre null (nao tem ciclo mensal) — filtrar por
    // reference_month excluiria toda caixinha da consulta.
    admin.from("payments").select("player_id, type, amount, status, reference_month, created_at"),
    admin.from("pickup_game_contributions").select("amount, status, created_at"),
    admin.from("jersey_wash_contributions").select("amount, status, created_at"),
    admin.from("withdrawals").select("id, description, amount, created_at").order("created_at", { ascending: false }),
    admin
      .from("sponsors")
      .select("id, name, website_url, logo_url")
      .eq("active", true)
      .order("display_order", { ascending: true }),
  ]);

  if (playersError) throw playersError;
  if (paymentsError) throw paymentsError;
  if (pickupGameError) throw pickupGameError;
  if (jerseyWashError) throw jerseyWashError;
  if (withdrawalsError) throw withdrawalsError;
  if (sponsorsError) throw sponsorsError;

  const mensalidadeByPlayer = new Map(
    payments
      .filter((p) => p.type === "mensalidade" && p.reference_month === referenceMonth)
      .map((p) => [p.player_id, p])
  );

  const playerStatus = players.map((player) => {
    const payment = mensalidadeByPlayer.get(player.id);
    const isGoalkeeper = player.position === "goleiro";
    return {
      id: player.id,
      name: player.name,
      position: player.position,
      photoUrl: player.photo_url,
      status: isGoalkeeper
        ? ("exempt" as const)
        : payment?.status === "paid"
          ? ("paid" as const)
          : ("pending" as const),
    };
  });

  const caixinhaContributions = payments
    .filter((p) => p.type === "caixinha" && p.status === "paid" && isInCurrentCalendarMonth(p.created_at))
    .map((p) => ({
      playerName: players.find((pl) => pl.id === p.player_id)?.name ?? "Jogador",
      amount: p.amount,
    }));

  const sum = (rows: { amount: number; status: string }[]) =>
    rows.filter((r) => r.status === "paid").reduce((total, r) => total + r.amount, 0);

  const totalMensalidade = payments
    .filter((p) => p.type === "mensalidade" && p.status === "paid")
    .reduce((total, p) => total + p.amount, 0);
  const totalCaixinha = sum(payments.filter((p) => p.type === "caixinha"));
  const totalPickupGame = sum(pickupGame);
  const totalJerseyWash = sum(jerseyWash);
  const totalWithdrawals = withdrawals.reduce((total, w) => total + w.amount, 0);
  const grossTotal = totalMensalidade + totalCaixinha + totalPickupGame + totalJerseyWash;

  return {
    teamName: settings?.team_name ?? "Meu Time",
    bannerImageUrl: settings?.banner_image_url ?? null,
    crestImageUrl: settings?.crest_image_url ?? null,
    defaultMensalidadeAmount: settings?.default_mensalidade_amount ?? 0,
    referenceMonth,
    players: playerStatus,
    sponsors,
    caixinhaContributions,
    withdrawals,
    totals: {
      mensalidade: totalMensalidade,
      caixinha: totalCaixinha,
      pickupGame: totalPickupGame,
      jerseyWash: totalJerseyWash,
      withdrawals: totalWithdrawals,
      grossTotal,
      balance: grossTotal - totalWithdrawals,
    },
  };
}
