import "server-only";
import { createAdminClient } from "./admin";

const BUCKET = "caixa-time-media";
const MAX_SIZE_BYTES = 5 * 1024 * 1024;
const ALLOWED_TYPES = ["image/png", "image/jpeg", "image/webp", "image/gif"];

export class InvalidImageError extends Error {}

// Sobe uma imagem pro bucket publico "caixa-time-media" do Supabase Storage
// (precisa ser criado manualmente no dashboard — ver README; nome
// especifico porque o projeto e compartilhado com outro produto) e retorna
// a URL publica.
// Usa o client de service_role: bypassa qualquer policy de storage, entao
// SO deve ser chamado a partir de codigo ja protegido por requireAdmin().
export async function uploadPublicImage(file: File, folder: string): Promise<string> {
  if (!ALLOWED_TYPES.includes(file.type)) {
    throw new InvalidImageError("Formato inválido. Use PNG, JPEG, WEBP ou GIF.");
  }
  if (file.size > MAX_SIZE_BYTES) {
    throw new InvalidImageError("Imagem muito grande (máximo 5MB).");
  }

  const admin = createAdminClient();
  const extension = file.name.split(".").pop() ?? "png";
  const path = `${folder}/${crypto.randomUUID()}.${extension}`;

  const { error } = await admin.storage.from(BUCKET).upload(path, file, {
    contentType: file.type,
    upsert: false,
  });

  if (error) throw error;

  const { data } = admin.storage.from(BUCKET).getPublicUrl(path);
  return data.publicUrl;
}
