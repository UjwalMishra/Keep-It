import { useUiStore } from "../../stores/uiStore";

/** Shifts main content when the sidebar is open. */
export function MainShell({ children }: { children: React.ReactNode }) {
  const sidebarOpen = useUiStore((s) => s.sidebarOpen);

  return (
    <div
      className={`transition-all duration-300 ease-in-out ${
        sidebarOpen ? "lg:ml-56 xl:ml-64" : "ml-0"
      }`}
    >
      {children}
    </div>
  );
}
