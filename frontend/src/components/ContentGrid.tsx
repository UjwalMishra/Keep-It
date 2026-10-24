import { Card } from "./ui/Card";
import Loader from "./Loader";
import type { ContentItem } from "../types/content";
import { useUiStore } from "../stores/uiStore";

type ContentGridProps = {
  items: ContentItem[];
  isLoading: boolean;
  shared?: boolean;
  emptyTitle?: string;
  emptySubtitle?: string;
};

export function ContentGrid({
  items,
  isLoading,
  shared = false,
  emptyTitle = "No Content found!",
  emptySubtitle,
}: ContentGridProps) {
  const openEditModal = useUiStore((s) => s.openEditModal);
  const openNotes = useUiStore((s) => s.openNotes);

  if (isLoading) {
    return (
      <div className="flex justify-center items-center mt-20">
        <Loader color="black" />
      </div>
    );
  }

  if (items.length === 0) {
    return (
      <div className="text-center py-12">
        <div className="text-2xl sm:text-3xl xl:text-4xl font-semibold text-gray-600">
          {emptyTitle}
        </div>
        {emptySubtitle && (
          <p className="text-gray-500 text-base sm:text-lg mt-2">{emptySubtitle}</p>
        )}
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3 gap-4 sm:gap-6 animate-fade-in">
      {items.map((item) => (
        <div
          key={item._id}
          className="transition-transform duration-300 transform hover:scale-[1.02]"
        >
          <Card
            item={item}
            shared={shared}
            onEdit={!shared ? () => openEditModal(item) : undefined}
            onOpenNotes={() => openNotes(item)}
          />
        </div>
      ))}
    </div>
  );
}
