const LABEL: Record<string, string> = {
  paid: "Pago",
  pending: "Pendente",
  cancelled: "Cancelado",
  exempt: "Isento",
  late: "Em atraso",
};

const STYLE: Record<string, string> = {
  paid: "bg-success/10 text-success",
  pending: "bg-pending/10 text-pending",
  cancelled: "bg-muted/10 text-muted",
  exempt: "bg-muted/10 text-muted",
  late: "bg-red-600/10 text-red-600",
};

export function StatusBadge({ status, daysLate }: { status: string; daysLate?: number }) {
  const style = STYLE[status] ?? STYLE.pending;
  const label =
    status === "late" && daysLate
      ? `${daysLate} dia${daysLate > 1 ? "s" : ""} em atraso`
      : (LABEL[status] ?? status);

  return (
    <span className={`inline-flex items-center rounded-full px-3 py-1 text-sm font-medium ${style}`}>
      {label}
    </span>
  );
}
