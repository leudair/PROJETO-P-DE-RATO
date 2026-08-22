interface Sponsor {
  id: string;
  name: string;
  website_url: string | null;
  logo_url: string | null;
}

export function SponsorsFooter({ sponsors }: { sponsors: Sponsor[] }) {
  if (sponsors.length === 0) return null;

  return (
    <footer className="mt-10 border-t border-border pt-6">
      <p className="mb-3 text-center text-xs uppercase tracking-wide text-muted">Apoio</p>
      <div className="flex flex-wrap items-center justify-center gap-3">
        {sponsors.map((sponsor) => (
          <SponsorItem key={sponsor.id} sponsor={sponsor} />
        ))}
      </div>
    </footer>
  );
}

function SponsorItem({ sponsor }: { sponsor: Sponsor }) {
  const content = sponsor.logo_url ? (
    // eslint-disable-next-line @next/next/no-img-element -- imagem enviada pelo admin, sem largura/altura conhecida de antemao
    <img src={sponsor.logo_url} alt={sponsor.name} className="h-12 w-auto rounded-md object-contain" />
  ) : (
    <span className="rounded-full border border-border bg-surface px-4 py-2 text-sm text-foreground">
      {sponsor.name}
    </span>
  );

  if (!sponsor.website_url) return content;

  return (
    <a href={sponsor.website_url} target="_blank" rel="noreferrer" title={sponsor.name}>
      {content}
    </a>
  );
}
