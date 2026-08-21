// reference_month sempre representa o primeiro dia do mes (data pura, sem hora).
export function currentReferenceMonth(): string {
  const now = new Date();
  return `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, "0")}-01`;
}

const MONTH_NAMES = [
  "Janeiro",
  "Fevereiro",
  "Março",
  "Abril",
  "Maio",
  "Junho",
  "Julho",
  "Agosto",
  "Setembro",
  "Outubro",
  "Novembro",
  "Dezembro",
];

export function formatReferenceMonth(referenceMonth: string): string {
  const [year, month] = referenceMonth.split("-").map(Number);
  return `${MONTH_NAMES[month - 1]}/${year}`;
}
