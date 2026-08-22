export function isVideoUrl(url: string): boolean {
  return /\.(mp4|webm)$/i.test(url);
}
