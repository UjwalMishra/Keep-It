import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { ContentFilter, ContentItem } from "../types/content";

type UiState = {
  filter: ContentFilter;
  sidebarOpen: boolean;
  modalOpen: boolean;
  editingContent: ContentItem | null;
  notesContent: ContentItem | null;
  searchQuery: string;

  setFilter: (filter: ContentFilter) => void;
  setSidebarOpen: (open: boolean) => void;
  toggleSidebar: () => void;
  openCreateModal: () => void;
  openEditModal: (content: ContentItem) => void;
  closeModal: () => void;
  openNotes: (content: ContentItem) => void;
  closeNotes: () => void;
  setSearchQuery: (query: string) => void;
  resetUi: () => void;
};

const initial = {
  filter: "All" as ContentFilter,
  sidebarOpen: true,
  modalOpen: false,
  editingContent: null as ContentItem | null,
  notesContent: null as ContentItem | null,
  searchQuery: "",
};

export const useUiStore = create<UiState>()(
  persist(
    (set) => ({
      ...initial,

      setFilter: (filter) => set({ filter, searchQuery: "" }),
      setSidebarOpen: (sidebarOpen) => set({ sidebarOpen }),
      toggleSidebar: () => set((s) => ({ sidebarOpen: !s.sidebarOpen })),
      openCreateModal: () => set({ modalOpen: true, editingContent: null }),
      openEditModal: (content) =>
        set({ modalOpen: true, editingContent: content }),
      closeModal: () => set({ modalOpen: false, editingContent: null }),
      openNotes: (content) => set({ notesContent: content }),
      closeNotes: () => set({ notesContent: null }),
      setSearchQuery: (searchQuery) => set({ searchQuery }),
      resetUi: () =>
        set({
          filter: "All",
          modalOpen: false,
          editingContent: null,
          notesContent: null,
          searchQuery: "",
          // keep sidebarOpen preference
        }),
    }),
    {
      name: "keepit-ui",
      partialize: (state) => ({ sidebarOpen: state.sidebarOpen }),
    }
  )
);
