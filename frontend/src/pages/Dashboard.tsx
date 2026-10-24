import { Button } from "../components/ui/Button";
import { AddIcon } from "../icons/AddIcon";
import { ShareIcon } from "../icons/ShareIcon";
import { CreateContentModal } from "../components/CreateContentModal";
import Sidebar from "../components/Sidebar";
import UserIcon from "../icons/UserIcon";
import SearchContent from "../components/SearchContent";
import SearchIcon from "../icons/SearchIcon";
import LogoutIcon from "../icons/LogoutIcon";
import Loader from "../components/Loader";
import NotesInDetail from "../components/NotesInDetail";
import { ContentGrid } from "../components/ContentGrid";
import { useAuthStore } from "../stores/authStore";
import { useUiStore } from "../stores/uiStore";
import { useContents, useSearchContents } from "../features/content/hooks";
import { useCreateShareLink } from "../features/share/hooks";
import { useLogout } from "../features/auth/hooks";
import { useDebouncedValue } from "../hooks/useDebouncedValue";
import { MainShell } from "../components/layout/MainShell";

export default function Dashboard() {
  const username = useAuthStore((s) => s.username);
  const filter = useUiStore((s) => s.filter);
  const searchQuery = useUiStore((s) => s.searchQuery);
  const setSidebarOpen = useUiStore((s) => s.setSidebarOpen);
  const openCreateModal = useUiStore((s) => s.openCreateModal);

  const debouncedSearch = useDebouncedValue(searchQuery, 350);
  const { data: contents = [], isLoading } = useContents();
  const { data: searchResults, isFetching: isSearching } =
    useSearchContents(debouncedSearch);
  const shareMutation = useCreateShareLink();
  const logoutMutation = useLogout();

  const displayName = username?.split("@")[0] || "User";

  const filtered =
    filter === "All"
      ? contents
      : contents.filter((content) => content.type === filter);

  const displayContent =
    debouncedSearch.trim().length > 0 ? searchResults ?? [] : filtered;

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-200 text-gray-900 relative font-sans">
      <Sidebar />
      <CreateContentModal />
      <NotesInDetail />

      <MainShell>
        {/* Mobile header */}
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

            <h1 className="text-lg font-semibold text-gray-800 flex items-center gap-2">
              <UserIcon />
              {displayName}
            </h1>

            <Button
              variant="primary"
              text="Add"
              size="sm"
              onClick={openCreateModal}
              startIcon={<AddIcon size="sm" />}
            />
          </div>
        </div>

        {/* Desktop navbar */}
        <div className="hidden lg:block sticky top-0 bg-white/80 backdrop-blur-lg rounded-xl mx-4 xl:mx-6 mt-4 xl:mt-6 px-4 xl:px-6 py-4 shadow-md border border-gray-200 z-30">
          <div className="flex justify-between items-center gap-4">
            <h1 className="text-xl xl:text-2xl font-semibold tracking-tight text-gray-800 uppercase flex gap-3 xl:gap-4 items-center min-w-0">
              <UserIcon />
              <div className="truncate">{displayName}</div>
            </h1>

            <div className="flex items-center gap-2 xl:gap-3">
              <div className="flex justify-center items-center gap-2 relative">
                <SearchContent />
                <div className="absolute right-0 pr-2">
                  <SearchIcon />
                </div>
              </div>
              <Button
                variant="primary"
                text="Add"
                size="md"
                onClick={openCreateModal}
                startIcon={<AddIcon size="lg" />}
              />
              {shareMutation.isPending ? (
                <Loader color="black" />
              ) : (
                <Button
                  variant="secondary"
                  text="Share"
                  size="md"
                  onClick={() => shareMutation.mutate()}
                  startIcon={<ShareIcon size="lg" />}
                />
              )}
              <Button
                variant="secondary"
                text="Log out"
                size="md"
                onClick={() => logoutMutation.mutate()}
                startIcon={<LogoutIcon />}
              />
            </div>
          </div>
        </div>

        {/* Mobile action bar */}
        <div className="lg:hidden sticky top-16 bg-white/90 backdrop-blur-lg mx-4 mt-4 px-4 py-3 rounded-xl shadow-sm border border-gray-200 z-20">
          <div className="flex items-center justify-between gap-3">
            <div className="flex-1 flex items-center gap-2 relative max-w-xs">
              <SearchContent />
            </div>
            <div className="flex items-center gap-2">
              {shareMutation.isPending ? (
                <Loader color="black" />
              ) : (
                <Button
                  variant="secondary"
                  text="Share"
                  size="sm"
                  onClick={() => shareMutation.mutate()}
                  startIcon={<ShareIcon size="sm" />}
                />
              )}
              <Button
                variant="secondary"
                text="Logout"
                size="sm"
                onClick={() => logoutMutation.mutate()}
                startIcon={<LogoutIcon />}
              />
            </div>
          </div>
        </div>

        <div className="p-4 xl:p-6 mt-4 xl:mt-8">
          <ContentGrid
            items={displayContent}
            isLoading={isLoading || (debouncedSearch.trim().length > 0 && isSearching)}
          />
        </div>
      </MainShell>
    </div>
  );
}
