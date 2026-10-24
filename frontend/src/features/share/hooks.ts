import { useMutation, useQuery } from "@tanstack/react-query";
import copy from "copy-to-clipboard";
import toast from "react-hot-toast";
import { createShareLink, fetchSharedContents } from "./api";
import { FRONTEND_URL } from "../../config";
import { queryKeys } from "../../lib/queryClient";

export function useCreateShareLink() {
  return useMutation({
    mutationFn: createShareLink,
    onSuccess: (hash) => {
      const base = FRONTEND_URL?.endsWith("/")
        ? FRONTEND_URL
        : `${FRONTEND_URL || ""}/`;
      copy(`${base}share/${hash}`);
      toast.success("Link copied!");
    },
    onError: () => toast.error("Failed to create share link"),
  });
}

export function useSharedContents(hash?: string) {
  return useQuery({
    queryKey: queryKeys.shared(hash || ""),
    queryFn: () => fetchSharedContents(hash!),
    enabled: Boolean(hash),
  });
}
