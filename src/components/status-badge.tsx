const LABEL: Record<string, string> = {
  paid: "Pago",
  pending: "Pendente",
  cancelled: "Cancelado",
};

const STYLE: Record<string, string> = {
  paid: "bg-success/10 text-success",
  pending: "bg-pending/10 text-pending",
  cancelled: "bg-muted/10 text-muted",
};

export function StatusBadge({ status }: { status: string }) {
  const style = STYLE[status] ?? STYLE.pending;
  const label = LABEL[status] ?? status;

  return (
    <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${style}`}>
      {label}
    </span>
  );
}
