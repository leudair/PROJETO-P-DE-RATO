import "server-only";
import { createClient as createSupabaseClient } from "@supabase/supabase-js";
import { supabaseUrl } from "./env";
import { supabaseServiceRoleKey } from "./service-role-key";
import type { Database } from "./database.types";

// Client com service_role: ignora RLS. Uso restrito a rotas de servidor
// que precisam agir fora do contexto de um usuario logado — webhook do
// Mercado Pago, camada de dados do admin, e a leitura da pagina publica
// de status (que nunca deve depender de policy `anon`, ver
// src/lib/data/public-status.ts).
export function createAdminClient() {
  return createSupabaseClient<Database>(supabaseUrl, supabaseServiceRoleKey(), {
    auth: {
      autoRefreshToken: false,
      persistSession: false,
    },
  });
}
