import { api, publicApi } from "../../lib/api";
import type { ContentItem } from "../../types/content";

export async function createShareLink(): Promise<string> {
  const res = await api.post(`/link/share`, { share: true });
  return res.data.link as string;
}

export async function fetchSharedContents(hash: string): Promise<ContentItem[]> {
  const res = await publicApi.get(`/link/share/${encodeURIComponent(hash)}`);
  return (res.data.content || []) as ContentItem[];
}
