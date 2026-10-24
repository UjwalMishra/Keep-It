import { useParams } from "react-router-dom";
import Sidebar from "../components/Sidebar";
import NotesInDetail from "../components/NotesInDetail";
import { ContentGrid } from "../components/ContentGrid";
import { useSharedContents } from "../features/share/hooks";
import { useUiStore } from "../stores/uiStore";
import { MainShell } from "../components/layout/MainShell";

export default function SharedPage() {
  const { sharelink } = useParams();
  const filter = useUiStore((s) => s.filter);
  const setSidebarOpen = useUiStore((s) => s.setSidebarOpen);

  const { data: contents = [], isLoading, isError } = useSharedContents(sharelink);

  const filteredContent =
    filter === "All"
      ? contents
      : contents.filter((content) => content.type === filter);

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 text-gray-900 relative font-sans">
      <Sidebar />
      <NotesInDetail />

      <MainShell>
        <div className="lg:hidden sticky top-0 bg-white/90 backdrop-blur-lg px-4 py-3 shadow-sm border-b border-gray-200 z-30">
          <div className="flex items-center justify-between">
            <button
              type="button"
              onClick={() => setSidebarOpen(true)}
              className="p-2 rounded-lg hover:bg-gray-100 transition-colors"
              aria-label="Open sidebar"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            </button>
            <h1 className="text-lg font-semibold text-gray-800">Shared Content</h1>
            <div className="w-10" />
          </div>
        </div>

        <div className="hidden lg:block sticky top-0 bg-white/80 backdrop-blur-lg rounded-xl mx-4 xl:mx-6 mt-4 xl:mt-6 px-4 xl:px-6 py-4 shadow-md border border-gray-200 z-30">
          <div className="flex justify-between items-center gap-4">
            <h1 className="text-xl xl:text-2xl font-semibold tracking-tight text-gray-800 uppercase">
              Shared Content
            </h1>
            <div className="text-sm text-gray-600 bg-gray-100 px-3 py-1 rounded-full">
              {filteredContent.length} item
              {filteredContent.length !== 1 ? "s" : ""}
            </div>
          </div>
        </div>

        <div className="p-4 xl:p-6 mt-4 xl:mt-8">
          {isError ? (
            <div className="text-center py-16 text-gray-600 text-xl font-semibold">
              Invalid or expired share link
            </div>
          ) : (
            <ContentGrid
              items={filteredContent}
              isLoading={isLoading}
              shared
              emptyTitle="No Content Found!"
              emptySubtitle={
                filter === "All"
                  ? "This shared link doesn't contain any content yet."
                  : `No ${filter} content found in this shared collection.`
              }
            />
          )}
        </div>

        <div className="lg:hidden fixed bottom-4 right-4 bg-white/90 backdrop-blur-lg px-3 py-2 rounded-full shadow-md border border-gray-200">
          <span className="text-sm text-gray-600">
            {filteredContent.length} item
            {filteredContent.length !== 1 ? "s" : ""}
          </span>
        </div>
      </MainShell>
    </div>
  );
}
