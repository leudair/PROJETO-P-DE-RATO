import Link from "next/link";
import { getActivePlayersForDraw } from "@/lib/data/team-draw";
import { TeamDrawForm } from "./team-draw-form";

export const dynamic = "force-dynamic";

export default async function TeamDrawPage() {
  const players = await getActivePlayersForDraw();

  return (
    <main className="mx-auto min-h-screen max-w-2xl px-3 py-6 sm:px-4 sm:py-10">
      <div className="mb-6 flex items-center justify-between gap-3">
        <div>
          <h1 className="text-xl font-bold text-primary sm:text-2xl">Sortear times</h1>
          <p className="text-xs text-muted sm:text-sm">Marque quem vai jogar hoje e sorteie os times.</p>
        </div>
        <Link href="/" className="shrink-0 text-sm text-muted hover:text-foreground">
          ← Voltar
        </Link>
      </div>

      <TeamDrawForm players={players} />
    </main>
  );
}
