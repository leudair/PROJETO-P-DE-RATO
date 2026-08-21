function requireEnv(name: string): string {
  const value = process.env[name];
  if (!value) {
    throw new Error(`Variavel de ambiente ausente: ${name}`);
  }
  return value;
}

// Prefixo NEXT_PUBLIC_ = seguro para o bundle do cliente (chave anon respeita RLS).
export const supabaseUrl = requireEnv("NEXT_PUBLIC_SUPABASE_URL");
export const supabaseAnonKey = requireEnv("NEXT_PUBLIC_SUPABASE_ANON_KEY");
