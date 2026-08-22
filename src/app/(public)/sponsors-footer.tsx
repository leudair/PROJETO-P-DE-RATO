export function SponsorsFooter({ sponsors }: { sponsors: { id: string; name: string; website_url: string | null }[] }) {
  if (sponsors.length === 0) return null;

  return (
    <footer className="mt-10 border-t border-border pt-6">
      <p className="mb-3 text-center text-xs uppercase tracking-wide text-muted">Apoio</p>
      <div className="flex flex-wrap justify-center gap-2">
        {sponsors.map((sponsor) =>
          sponsor.website_url ? (
            <a
              key={sponsor.id}
              href={sponsor.website_url}
              target="_blank"
              rel="noreferrer"
              className="rounded-full border border-border bg-surface px-4 py-2 text-sm text-foreground hover:bg-surface-2"
            >
              {sponsor.name}
            </a>
          ) : (
            <span
              key={sponsor.id}
              className="rounded-full border border-border bg-surface px-4 py-2 text-sm text-foreground"
            >
              {sponsor.name}
            </span>
          )
        )}
      </div>
    </footer>
  );
}
