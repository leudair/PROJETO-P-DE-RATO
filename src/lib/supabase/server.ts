import "server-only";
import { cookies } from "next/headers";
import { createServerClient } from "@supabase/ssr";
import { supabaseAnonKey, supabaseUrl } from "./env";
import type { Database } from "./database.types";

// Um client por request — nunca reaproveitar entre requisicoes.
// db.schema: "caixa_time" — ver nota em client.ts.
export async function createClient() {
  const cookieStore = await cookies();

  return createServerClient<Database, "caixa_time">(supabaseUrl, supabaseAnonKey, {
    db: { schema: "caixa_time" },
    cookies: {
      getAll() {
        return cookieStore.getAll();
      },
      setAll(cookiesToSet) {
        try {
          for (const { name, value, options } of cookiesToSet) {
            cookieStore.set(name, value, options);
          }
        } catch {
          // Chamado a partir de um Server Component: o proxy.ts ja cuida
          // de renovar a sessao em cookies, entao aqui pode ser ignorado.
        }
      },
    },
  });
}
