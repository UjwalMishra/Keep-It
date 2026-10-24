import { api } from "../../lib/api";
import type { ContentItem, ContentPayload } from "../../types/content";

export async function fetchContents(): Promise<ContentItem[]> {
  const res = await api.get(`/content/get-all-content`);
  return (res.data.data || []) as ContentItem[];
}

export async function searchContents(query: string): Promise<ContentItem[]> {
  const res = await api.get(`/content/get-content`, {
    params: { query },
  });
  return (res.data.content || []) as ContentItem[];
}

export async function createContent(contentData: ContentPayload) {
  const res = await api.post(`/content/post-content`, { contentData });
  return res.data.content as ContentItem;
}

export async function updateContent(id: string, contentData: ContentPayload) {
  const res = await api.post(`/content/update-content/${id}`, { contentData });
  return res.data.content as ContentItem;
}

export async function deleteContent(contentId: string) {
  const res = await api.delete(`/content/delete-content`, {
    data: { contentId },
  });
  return res.data;
}
