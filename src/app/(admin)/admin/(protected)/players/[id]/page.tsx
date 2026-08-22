import { getPlayer } from "@/lib/data/players";
import { PlayerForm } from "../player-form";

export default async function EditPlayerPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const player = await getPlayer(id);

  return (
    <div className="max-w-md space-y-6">
      <h1 className="text-2xl font-semibold text-foreground">Editar jogador</h1>
      <PlayerForm
        mode="edit"
        defaultValues={{
          playerId: player.id,
          name: player.name,
          phone: player.phone,
          position: player.position,
          age: player.age,
          photoUrl: player.photo_url,
        }}
      />
    </div>
  );
}
