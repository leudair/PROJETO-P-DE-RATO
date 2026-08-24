// Caixinhas vazias "chamando" apoiadores/patrocinadores — sem link nem foto
// por enquanto (decisao de exibir de verdade fica pra depois). O componente
// SponsorsFooter (patrocinadores reais) continua funcionando normalmente,
// esse aqui e' so um convite visual separado.
export function SponsorsPlaceholder() {
  return (
    <div className="mt-10 border-t border-border pt-6">
      <p className="mb-3 text-center text-xs uppercase tracking-wide text-muted">
        Aceitamos apoio / patrocínio
      </p>
      <div className="grid grid-cols-3 gap-2 sm:gap-3">
        <div className="flex h-16 items-center justify-center rounded-xl border border-dashed border-border bg-surface sm:h-20" />
        <div className="flex h-16 items-center justify-center rounded-xl border border-dashed border-border bg-surface sm:h-20" />
        <div className="flex h-16 items-center justify-center rounded-xl border border-dashed border-border bg-surface sm:h-20" />
      </div>
    </div>
  );
}
