import AllIcon from "../icons/AllIcon";
import InstaIcon from "../icons/InstaIcon";
import MainIcon from "../icons/MainIcon";
import NotesIcon from "../icons/NotesIcon";
import WebIcon from "../icons/WebIcon";
import XIcons from "../icons/XIcons";
import YtIcon from "../icons/YtIcon";
import { SidebarItem } from "./ui/SidebarItem";
import { SidebarToggle } from "./SidebarToggle";
import { useUiStore } from "../stores/uiStore";
import type { ContentFilter } from "../types/content";

const FILTERS: {
  value: ContentFilter;
  label: string;
  icon: React.ReactNode;
  activeClass: string;
  barClass: string;
  hoverClass: string;
}[] = [
  {
    value: "All",
    label: "All",
    icon: <AllIcon />,
    activeClass: "bg-gradient-to-r from-blue-100 to-purple-100 shadow-inner",
    barClass: "bg-gradient-to-b from-blue-500 to-purple-500",
    hoverClass: "bg-gradient-to-r from-blue-500/10 to-purple-500/10",
  },
  {
    value: "youtube",
    label: "YouTube",
    icon: <YtIcon />,
    activeClass: "bg-gradient-to-r from-red-100 to-orange-100 shadow-inner",
    barClass: "bg-gradient-to-b from-red-500 to-orange-500",
    hoverClass: "bg-gradient-to-r from-red-500/10 to-orange-500/10",
  },
  {
    value: "x",
    label: "X",
    icon: <XIcons />,
    activeClass: "bg-gradient-to-r from-indigo-100 to-pink-100 shadow-inner",
    barClass: "bg-gradient-to-b from-indigo-500 to-pink-500",
    hoverClass: "bg-gradient-to-r from-indigo-500/10 to-pink-500/10",
  },
  {
    value: "instagram",
    label: "Instagram",
    icon: <InstaIcon />,
    activeClass: "bg-gradient-to-r from-red-100 to-orange-100 shadow-inner",
    barClass: "bg-gradient-to-b from-red-500 to-orange-500",
    hoverClass: "bg-gradient-to-r from-red-500/10 to-orange-500/10",
  },
  {
    value: "notes",
    label: "Notes",
    icon: <NotesIcon />,
    activeClass: "bg-gradient-to-r from-indigo-100 to-pink-100 shadow-inner",
    barClass: "bg-gradient-to-b from-indigo-500 to-pink-500",
    hoverClass: "bg-gradient-to-r from-indigo-500/10 to-pink-500/10",
  },
  {
    value: "web articles",
    label: "Web Articles",
    icon: <WebIcon />,
    activeClass: "bg-gradient-to-r from-red-100 to-orange-100 shadow-inner",
    barClass: "bg-gradient-to-b from-red-500 to-orange-500",
    hoverClass: "bg-gradient-to-r from-red-500/10 to-orange-500/10",
  },
];

export default function Sidebar() {
  const filter = useUiStore((s) => s.filter);
  const setFilter = useUiStore((s) => s.setFilter);
  const sidebarOpen = useUiStore((s) => s.sidebarOpen);
  const setSidebarOpen = useUiStore((s) => s.setSidebarOpen);
  const toggleSidebar = useUiStore((s) => s.toggleSidebar);

  const handleItemClick = (value: ContentFilter) => {
    setFilter(value);
    if (window.innerWidth < 1024) {
      setSidebarOpen(false);
    }
  };

  return (
    <>
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-40 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {!sidebarOpen && (
        <div className="fixed left-3 top-3 z-50">
          <SidebarToggle open={false} onToggle={toggleSidebar} className="bg-white shadow-md border border-slate-200" />
        </div>
      )}

      <aside
        className={`
        h-screen w-64 sm:w-72 lg:w-56 xl:w-64 
        border-r border-slate-200 bg-gradient-to-b from-slate-50 to-white 
        fixed left-0 top-0 shadow-lg z-50 transition-transform duration-300 ease-in-out
        flex flex-col
        ${sidebarOpen ? "translate-x-0" : "-translate-x-full"}
      `}
      >
        <div className="p-4 sm:p-6 border-b border-slate-200 bg-white/80 backdrop-blur-sm">
          <div className="flex items-center justify-between gap-2">
            <h2 className="text-2xl sm:text-3xl font-bold text-slate-800 tracking-tight flex items-center gap-1 min-w-0">
              <MainIcon />
              <span className="select-none truncate">Keep-It</span>
            </h2>
            <SidebarToggle open={true} onToggle={toggleSidebar} />
          </div>
          <div className="w-26 h-1.5 bg-gradient-to-r from-blue-500 to-purple-500 mt-2 rounded-full" />
        </div>

        <nav className="flex flex-col p-3 sm:p-4 space-y-2 overflow-y-auto flex-1">
          {FILTERS.map((item) => (
            <SidebarItem
              key={item.value}
              label={item.label}
              icon={item.icon}
              active={filter === item.value}
              activeClass={item.activeClass}
              barClass={item.barClass}
              hoverClass={item.hoverClass}
              onClick={() => handleItemClick(item.value)}
            />
          ))}
        </nav>

        <div className="h-1 bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 opacity-60" />
      </aside>
    </>
  );
}
