import { getTeamSettings } from "@/lib/data/settings";
import { SettingsForm } from "./settings-form";

export default async function SettingsPage() {
  const settings = await getTeamSettings();

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-semibold text-foreground">Configurações</h1>
      <SettingsForm
        defaultValues={{
          teamName: settings.team_name,
          defaultMensalidadeAmount: settings.default_mensalidade_amount,
          bannerImageUrl: settings.banner_image_url,
        }}
      />
    </div>
  );
}
