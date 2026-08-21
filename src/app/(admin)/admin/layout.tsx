import { requireAdmin } from "@/lib/data/auth";
import { NavAdmin } from "@/components/nav-admin";

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const profile = await requireAdmin();

  return (
    <div className="min-h-screen bg-background">
      <NavAdmin profile={profile} />
      <main className="mx-auto max-w-5xl px-4 py-8">{children}</main>
    </div>
  );
}
