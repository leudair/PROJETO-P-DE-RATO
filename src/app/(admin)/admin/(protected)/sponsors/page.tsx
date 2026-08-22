import { listSponsors } from "@/lib/data/sponsors";
import { SponsorForm } from "./sponsor-form";
import { ToggleActiveButton } from "./toggle-active-button";

export default async function SponsorsPage() {
  const sponsors = await listSponsors();

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold text-foreground">Patrocinadores</h1>
        <p className="text-sm text-muted">Aparecem no rodapé da página pública.</p>
      </div>

      <SponsorForm />

      <div className="overflow-hidden rounded-xl border border-border bg-surface">
        <table className="w-full text-sm">
          <thead className="border-b border-border bg-surface-2 text-left text-xs text-muted">
            <tr>
              <th className="px-4 py-2 font-medium">Logo</th>
              <th className="px-4 py-2 font-medium">Nome</th>
              <th className="px-4 py-2 font-medium">Link</th>
              <th className="px-4 py-2 font-medium">Status</th>
              <th className="px-4 py-2 font-medium"></th>
            </tr>
          </thead>
          <tbody>
            {sponsors.map((sponsor) => (
              <tr key={sponsor.id} className="border-b border-border last:border-0">
                <td className="px-4 py-3">
                  {sponsor.logo_url ? (
                    // eslint-disable-next-line @next/next/no-img-element -- imagem enviada pelo admin, sem largura/altura conhecida de antemao
                    <img src={sponsor.logo_url} alt={sponsor.name} className="h-8 w-8 rounded object-contain" />
                  ) : (
                    <span className="text-muted">—</span>
                  )}
                </td>
                <td className="px-4 py-3 text-foreground">{sponsor.name}</td>
                <td className="px-4 py-3 text-muted">
                  {sponsor.website_url ? (
                    <a href={sponsor.website_url} target="_blank" rel="noreferrer" className="hover:underline">
                      {sponsor.website_url}
                    </a>
                  ) : (
                    "—"
                  )}
                </td>
                <td className="px-4 py-3">
                  <span className={sponsor.active ? "text-success" : "text-muted"}>
                    {sponsor.active ? "Visível" : "Oculto"}
                  </span>
                </td>
                <td className="px-4 py-3 text-right">
                  <ToggleActiveButton sponsorId={sponsor.id} active={sponsor.active} />
                </td>
              </tr>
            ))}
            {sponsors.length === 0 && (
              <tr>
                <td colSpan={5} className="px-4 py-6 text-center text-muted">
                  Nenhum patrocinador cadastrado ainda.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
