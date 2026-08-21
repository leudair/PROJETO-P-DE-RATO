import "server-only";

// Chave service_role ignora RLS por completo. Nunca importar este modulo
// fora de rotas de servidor (webhook do Mercado Pago, painel admin, pagina
// publica) que precisam agir por tras de qualquer usuario autenticado.
export function supabaseServiceRoleKey(): string {
  const value = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!value) {
    throw new Error("Variavel de ambiente ausente: SUPABASE_SERVICE_ROLE_KEY");
  }
  return value;
}
