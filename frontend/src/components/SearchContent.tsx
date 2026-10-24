import { useUiStore } from "../stores/uiStore";

export default function SearchContent() {
  const searchQuery = useUiStore((s) => s.searchQuery);
  const setSearchQuery = useUiStore((s) => s.setSearchQuery);

  return (
    <input
      className="w-full sm:w-[200px] md:w-[300px] lg:w-[300px] px-3 py-1 border rounded-xl"
      placeholder="Search..."
      value={searchQuery}
      onChange={(e) => setSearchQuery(e.target.value)}
      maxLength={100}
    />
  );
}
