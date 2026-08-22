import { createBrowserClient } from "@supabase/ssr";
import { supabaseAnonKey, supabaseUrl } from "./env";
import type { Database } from "./database.types";

// db.schema: "caixa_time" — o projeto Supabase e compartilhado com outro
// produto do usuario, entao as tabelas do caixa-time vivem num schema
// proprio (nao "public"). Precisa que "caixa_time" esteja em Project
// Settings > API > Exposed schemas no dashboard.
export function createClient() {
  return createBrowserClient<Database, "caixa_time">(supabaseUrl, supabaseAnonKey, {
    db: { schema: "caixa_time" },
  });
}
