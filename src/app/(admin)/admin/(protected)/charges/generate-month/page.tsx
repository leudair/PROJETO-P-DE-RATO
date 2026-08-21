import { GenerateMonthForm } from "./generate-form";

export default function GenerateMonthPage() {
  return (
    <div className="max-w-lg space-y-6">
      <h1 className="text-2xl font-semibold text-foreground">Gerar cobranças do mês</h1>
      <GenerateMonthForm />
    </div>
  );
}
