import Link from "next/link";
import { listPlayers } from "@/lib/data/players";
import { ToggleActiveButton } from "./toggle-active-button";
import { POSITION_LABEL } from "@/lib/utils/positions";

export default async function PlayersPage() {
  const players = await listPlayers();

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold text-foreground">Jogadores</h1>
          <p className="text-sm text-muted">{players.length} jogador(es) cadastrado(s).</p>
        </div>
        <Link
          href="/admin/players/new"
          className="rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground"
        >
          Novo jogador
        </Link>
      </div>

      <div className="overflow-hidden rounded-xl border border-border bg-surface">
        <table className="w-full text-sm">
          <thead className="border-b border-border bg-surface-2 text-left text-xs text-muted">
            <tr>
              <th className="px-4 py-2 font-medium">Foto</th>
              <th className="px-4 py-2 font-medium">Nome</th>
              <th className="px-4 py-2 font-medium">Posição</th>
              <th className="px-4 py-2 font-medium">Idade</th>
              <th className="px-4 py-2 font-medium">Telefone</th>
              <th className="px-4 py-2 font-medium">Status</th>
              <th className="px-4 py-2 font-medium"></th>
            </tr>
          </thead>
          <tbody>
            {players.map((player) => (
              <tr key={player.id} className="border-b border-border last:border-0">
                <td className="px-4 py-3">
                  {player.photo_url ? (
                    // eslint-disable-next-line @next/next/no-img-element -- imagem enviada pelo admin, sem largura/altura conhecida de antemao
                    <img src={player.photo_url} alt={player.name} className="h-8 w-8 rounded-full object-cover" />
                  ) : (
                    <span className="text-muted">—</span>
                  )}
                </td>
                <td className="px-4 py-3">
                  <Link href={`/admin/players/${player.id}`} className="text-foreground hover:underline">
                    {player.name}
                  </Link>
                </td>
                <td className="px-4 py-3 text-muted">
                  {player.position ? POSITION_LABEL[player.position] : "—"}
                </td>
                <td className="px-4 py-3 text-muted">{player.age ?? "—"}</td>
                <td className="px-4 py-3 text-muted">{player.phone ?? "—"}</td>
                <td className="px-4 py-3">
                  <span className={player.active ? "text-success" : "text-muted"}>
                    {player.active ? "Ativo" : "Inativo"}
                  </span>
                </td>
                <td className="px-4 py-3 text-right">
                  <ToggleActiveButton playerId={player.id} active={player.active} />
                </td>
              </tr>
            ))}
            {players.length === 0 && (
              <tr>
                <td colSpan={7} className="px-4 py-6 text-center text-muted">
                  Nenhum jogador cadastrado ainda.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
