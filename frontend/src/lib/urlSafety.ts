/** Only allow http(s) links for href/src to reduce javascript: XSS risk. */
export function safeHttpUrl(raw?: string | null): string | null {
  if (!raw) return null;
  try {
    const url = new URL(raw);
    if (url.protocol !== "http:" && url.protocol !== "https:") return null;
    return url.toString();
  } catch {
    return null;
  }
}

export function getYouTubeEmbedUrl(raw: string): string | null {
  const safe = safeHttpUrl(raw);
  if (!safe) return null;

  try {
    const url = new URL(safe);
    const host = url.hostname.replace(/^www\./, "");

    if (host === "youtu.be") {
      const id = url.pathname.split("/").filter(Boolean)[0];
      return id ? `https://www.youtube.com/embed/${id}` : null;
    }

    if (host === "youtube.com" || host === "m.youtube.com" || host === "music.youtube.com") {
      const list = url.searchParams.get("list");
      if (list) {
        return `https://www.youtube.com/embed/videoseries?list=${encodeURIComponent(list)}`;
      }
      const videoId = url.searchParams.get("v");
      return videoId
        ? `https://www.youtube.com/embed/${encodeURIComponent(videoId)}`
        : null;
    }

    return null;
  } catch {
    return null;
  }
}

export function getTweetId(raw: string): string | null {
  const safe = safeHttpUrl(raw);
  if (!safe) return null;

  try {
    const url = new URL(safe);
    const host = url.hostname.replace(/^www\./, "");
    if (host !== "x.com" && host !== "twitter.com" && host !== "mobile.twitter.com") {
      return null;
    }
    const parts = url.pathname.split("/").filter(Boolean);
    const statusIdx = parts.findIndex((p) => p === "status");
    if (statusIdx >= 0 && parts[statusIdx + 1]) {
      return parts[statusIdx + 1].replace(/[^0-9]/g, "") || null;
    }
    return null;
  } catch {
    return null;
  }
}
