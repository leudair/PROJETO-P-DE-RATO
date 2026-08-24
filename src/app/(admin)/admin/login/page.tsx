import { getPublicBranding } from "@/lib/data/public-branding";
import { LoginForm } from "./login-form";

export const dynamic = "force-dynamic";

export default async function LoginPage() {
  const { teamName, crestImageUrl } = await getPublicBranding();

  return <LoginForm teamName={teamName} crestImageUrl={crestImageUrl} />;
}
