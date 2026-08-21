import { listPlayers } from "@/lib/data/players";
import { CaixinhaForm } from "./caixinha-form";

export default async function NewCaixinhaPage() {
  const players = (await listPlayers()).filter((p) => p.active);

  return (
    <div className="max-w-lg space-y-6">
      <h1 className="text-2xl font-semibold text-foreground">Nova caixinha</h1>
      <CaixinhaForm players={players} />
    </div>
  );
}
