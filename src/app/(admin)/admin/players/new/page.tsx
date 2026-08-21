import { PlayerForm } from "../player-form";

export default function NewPlayerPage() {
  return (
    <div className="max-w-md space-y-6">
      <h1 className="text-2xl font-semibold text-foreground">Novo jogador</h1>
      <PlayerForm mode="create" />
    </div>
  );
}
