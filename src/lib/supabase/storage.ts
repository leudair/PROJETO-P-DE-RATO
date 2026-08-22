import "server-only";
import { createAdminClient } from "./admin";

const BUCKET = "caixa-time-media";
const MAX_IMAGE_SIZE_BYTES = 5 * 1024 * 1024;
const MAX_VIDEO_SIZE_BYTES = 20 * 1024 * 1024;
const IMAGE_TYPES = ["image/png", "image/jpeg", "image/webp", "image/gif"];
const VIDEO_TYPES = ["video/mp4", "video/webm"];

export class InvalidImageError extends Error {}

async function upload(file: File, folder: string): Promise<string> {
  const admin = createAdminClient();
  const extension = file.name.split(".").pop() ?? "bin";
  const path = `${folder}/${crypto.randomUUID()}.${extension}`;

  const { error } = await admin.storage.from(BUCKET).upload(path, file, {
    contentType: file.type,
    upsert: false,
  });

  if (error) throw error;

  const { data } = admin.storage.from(BUCKET).getPublicUrl(path);
  return data.publicUrl;
}

// Sobe uma imagem (foto de jogador, escudo do time, logo de patrocinador)
// pro bucket publico "caixa-time-media" do Supabase Storage (precisa ser
// criado manualmente no dashboard — ver README) e retorna a URL publica.
// Usa o client de service_role: bypassa qualquer policy de storage, entao
// SO deve ser chamado a partir de codigo ja protegido por requireAdmin().
export async function uploadPublicImage(file: File, folder: string): Promise<string> {
  if (!IMAGE_TYPES.includes(file.type)) {
    throw new InvalidImageError("Formato inválido. Use PNG, JPEG, WEBP ou GIF.");
  }
  if (file.size > MAX_IMAGE_SIZE_BYTES) {
    throw new InvalidImageError("Imagem muito grande (máximo 5MB).");
  }
  return upload(file, folder);
}

// Igual a uploadPublicImage, mas tambem aceita video curto (MP4/WEBM) — usado
// no banner do topo, que pode ser uma animacao (ex: gerada no Flow) em vez
// de imagem estatica.
export async function uploadPublicMedia(file: File, folder: string): Promise<string> {
  const isImage = IMAGE_TYPES.includes(file.type);
  const isVideo = VIDEO_TYPES.includes(file.type);

  if (!isImage && !isVideo) {
    throw new InvalidImageError("Formato inválido. Use PNG, JPEG, WEBP, GIF, MP4 ou WEBM.");
  }
  const maxSize = isVideo ? MAX_VIDEO_SIZE_BYTES : MAX_IMAGE_SIZE_BYTES;
  if (file.size > maxSize) {
    throw new InvalidImageError(`Arquivo muito grande (máximo ${isVideo ? "20MB" : "5MB"}).`);
  }
  return upload(file, folder);
}
