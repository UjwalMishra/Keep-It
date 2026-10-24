import ChevronDoubleLeftIcon from "../icons/ChevronDoubleLeftIcon";
import ChevronDoubleRightIcon from "../icons/ChevronDoubleRightIcon";

type SidebarToggleProps = {
  open: boolean;
  onToggle: () => void;
  className?: string;
};

/** Collapse / expand control for the sidebar. */
export function SidebarToggle({
  open,
  onToggle,
  className = "",
}: SidebarToggleProps) {
  return (
    <button
      type="button"
      onClick={onToggle}
      aria-label={open ? "Close sidebar" : "Open sidebar"}
      title={open ? "Close sidebar" : "Open sidebar"}
      className={`inline-flex items-center justify-center rounded-xl p-2 text-slate-600 hover:text-slate-900 hover:bg-slate-100 active:scale-95 transition-all ${className}`}
    >
      {open ? (
        <ChevronDoubleLeftIcon className="w-5 h-5" />
      ) : (
        <ChevronDoubleRightIcon className="w-5 h-5" />
      )}
    </button>
  );
}
