import Link from "next/link";
import { logout } from "@/app/logout-action";
import { ThemeToggle } from "@/components/theme-toggle";
import type { Database } from "@/lib/supabase/database.types";

type Profile = Database["public"]["Tables"]["profiles"]["Row"];

export function NavAdmin({ profile }: { profile: Profile }) {
  return (
    <header className="border-b border-border bg-surface">
      <div className="mx-auto flex max-w-5xl items-center justify-between px-4 py-3">
        <nav className="flex items-center gap-4 text-sm">
          <Link href="/admin" className="font-semibold text-foreground">
            Caixa do Time
          </Link>
          <Link href="/admin/players" className="text-muted hover:text-foreground">
            Jogadores
          </Link>
          <Link href="/admin/charges" className="text-muted hover:text-foreground">
            Cobranças
          </Link>
          <Link href="/admin/settings" className="text-muted hover:text-foreground">
            Configurações
          </Link>
        </nav>
        <div className="flex items-center gap-3 text-sm text-muted">
          <span>{profile.full_name ?? "Admin"}</span>
          <form action={logout}>
            <button type="submit" className="text-muted hover:text-foreground">
              Sair
            </button>
          </form>
          <ThemeToggle />
        </div>
      </div>
    </header>
  );
}
