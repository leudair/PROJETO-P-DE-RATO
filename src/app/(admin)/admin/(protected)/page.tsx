import Link from "next/link";
import { requireAdmin } from "@/lib/data/auth";

export default async function AdminDashboardPage() {
  await requireAdmin();

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold text-foreground">Visão geral</h1>
        <p className="text-sm text-muted">Gerencie jogadores, cobranças e configurações do time.</p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <Link
          href="/admin/players"
          className="rounded-xl border border-border bg-surface p-6 hover:bg-surface-2"
        >
          <h2 className="font-medium text-foreground">Jogadores</h2>
          <p className="mt-1 text-sm text-muted">Cadastrar e gerenciar jogadores do time.</p>
        </Link>
        <Link
          href="/admin/charges"
          className="rounded-xl border border-border bg-surface p-6 hover:bg-surface-2"
        >
          <h2 className="font-medium text-foreground">Cobranças</h2>
          <p className="mt-1 text-sm text-muted">Gerar mensalidades, caixinhas e Pix.</p>
        </Link>
        <Link
          href="/admin/sponsors"
          className="rounded-xl border border-border bg-surface p-6 hover:bg-surface-2"
        >
          <h2 className="font-medium text-foreground">Patrocinadores</h2>
          <p className="mt-1 text-sm text-muted">Banner de patrocínio no rodapé da página pública.</p>
        </Link>
        <Link
          href="/admin/settings"
          className="rounded-xl border border-border bg-surface p-6 hover:bg-surface-2"
        >
          <h2 className="font-medium text-foreground">Configurações</h2>
          <p className="mt-1 text-sm text-muted">Valor padrão da mensalidade e nome do time.</p>
        </Link>
      </div>
    </div>
  );
}
