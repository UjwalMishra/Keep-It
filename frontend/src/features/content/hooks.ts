import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast";
import {
  createContent,
  deleteContent,
  fetchContents,
  searchContents,
  updateContent,
} from "./api";
import { queryKeys } from "../../lib/queryClient";
import type { ContentPayload } from "../../types/content";
import { getApiErrorMessage } from "../../lib/apiErrors";

export function useContents() {
  return useQuery({
    queryKey: queryKeys.contents,
    queryFn: fetchContents,
  });
}

export function useSearchContents(query: string) {
  const trimmed = query.trim();

  return useQuery({
    queryKey: queryKeys.search(trimmed),
    queryFn: () => searchContents(trimmed),
    enabled: trimmed.length > 0,
  });
}

export function useCreateContent() {
  const qc = useQueryClient();

  return useMutation({
    mutationFn: (payload: ContentPayload) => createContent(payload),
    onSuccess: () => {
      toast.success("Content added successfully!");
      qc.invalidateQueries({ queryKey: queryKeys.contents });
    },
    onError: (err) =>
      toast.error(getApiErrorMessage(err, "Failed to add content")),
  });
}

export function useUpdateContent() {
  const qc = useQueryClient();

  return useMutation({
    mutationFn: ({ id, payload }: { id: string; payload: ContentPayload }) =>
      updateContent(id, payload),
    onSuccess: () => {
      toast.success("Content updated successfully!");
      qc.invalidateQueries({ queryKey: queryKeys.contents });
    },
    onError: (err) =>
      toast.error(getApiErrorMessage(err, "Failed to update content")),
  });
}

export function useDeleteContent() {
  const qc = useQueryClient();

  return useMutation({
    mutationFn: (contentId: string) => deleteContent(contentId),
    onSuccess: () => {
      toast.success("Content deleted.", { icon: "🗑️", duration: 3000 });
      qc.invalidateQueries({ queryKey: queryKeys.contents });
    },
    onError: (err) =>
      toast.error(getApiErrorMessage(err, "Failed to delete content")),
  });
}
