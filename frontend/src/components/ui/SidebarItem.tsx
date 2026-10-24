import type { ReactNode } from "react";

type SidebarItemProps = {
  label: string;
  icon: ReactNode;
  active: boolean;
  activeClass: string;
  barClass: string;
  hoverClass: string;
  onClick: () => void;
};

export function SidebarItem({
  label,
  icon,
  active,
  activeClass,
  barClass,
  hoverClass,
  onClick,
}: SidebarItemProps) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`group relative w-full overflow-hidden rounded-lg transition-all duration-300 hover:shadow-md cursor-pointer text-left ${
        active ? activeClass : ""
      }`}
    >
      <div
        className={`absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300 ${hoverClass}`}
      />
      <div
        className={`absolute left-0 top-0 w-1 h-full transform transition-transform duration-300 ${barClass} ${
          active ? "translate-x-0" : "-translate-x-full group-hover:translate-x-0"
        }`}
      />
      <div className="relative flex items-center gap-3 ml-3 sm:ml-4 py-2.5 pr-3">
        <span className="flex-shrink-0">{icon}</span>
        <span className="font-medium text-slate-700">{label}</span>
      </div>
    </button>
  );
}
