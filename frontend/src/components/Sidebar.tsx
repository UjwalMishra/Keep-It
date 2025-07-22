import AllIcon from "../icons/AllIcon";
import InstaIcon from "../icons/InstaIcon";
import MainIcon from "../icons/MainIcon";
import NotesIcon from "../icons/NotesIcon";
import WebIcon from "../icons/WebIcon";
import XIcons from "../icons/XIcons";
import YtIcon from "../icons/YtIcon";
import { Button } from "./ui/Button";

export default function Sidebar({
  type,
  setType,
  isOpen,
  onClose,
}: {
  type: string;
  setType: (type: string) => void;
  isOpen: boolean;
  onClose: () => void;
}) {
  const handleItemClick = (newType: string) => {
    setType(newType);
    // Close sidebar on mobile after selection
    if (window.innerWidth < 1024) {
      onClose();
    }
  };

  return (
    <>
      {/* Mobile backdrop */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-40 lg:hidden"
          onClick={onClose}
        />
      )}

      {/* Sidebar */}
      <div
        className={`
        h-screen w-64 sm:w-72 lg:w-56 xl:w-64 
        border-r border-slate-200 bg-gradient-to-b from-slate-50 to-white 
        fixed left-0 top-0 shadow-lg z-50 transition-all duration-300 ease-in-out
        ${isOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"}
      `}
      >
        {/* Header */}
        <div className="p-4 sm:p-6 border-b border-slate-200 bg-white/80 backdrop-blur-sm">
          <div className="flex items-center justify-between">
            <h2 className="text-2xl sm:text-3xl font-bold text-slate-800 tracking-tight flex items-center gap-1">
              <div className="text-2xl sm:text-3xl font-bold">
                <MainIcon />
              </div>
              <div className="select-none">Keep-It</div>
            </h2>
            {/* Close button for mobile */}
            <button
              onClick={onClose}
              className="lg:hidden p-2 rounded-lg hover:bg-gray-100 transition-colors"
            >
              <svg
                className="w-6 h-6"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </button>
          </div>
          <div className="w-26 h-1.5 bg-gradient-to-r from-blue-500 to-purple-500 mt-2 rounded-full"></div>
        </div>

        {/* Navigation Items */}
        <div className="flex flex-col p-3 sm:p-4 space-y-2 overflow-y-auto flex-1">
          {/* All */}
          <div
            className={`group relative overflow-hidden rounded-lg transition-all duration-300 hover:shadow-md cursor-pointer ${
              type === "All"
                ? "bg-gradient-to-r from-blue-100 to-purple-100 shadow-inner"
                : ""
            }`}
            onClick={() => handleItemClick("All")}
          >
            <div className="absolute inset-0 bg-gradient-to-r from-blue-500/10 to-purple-500/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
            <div
              className={`absolute left-0 top-0 w-1 h-full bg-gradient-to-b from-blue-500 to-purple-500 transform transition-transform duration-300 ${
                type === "All"
                  ? "translate-x-0"
                  : "-translate-x-full group-hover:translate-x-0"
              }`}
            />
            <div className="flex items-center ml-3 sm:ml-4">
              <AllIcon />
              <Button
                size="md"
                variant="normal"
                text="All"
                onClick={() => {}}
              />
            </div>
          </div>
          {/* YouTube */}
          <div
            className={`group relative overflow-hidden rounded-lg transition-all duration-300 hover:shadow-md cursor-pointer ${
              type === "youtube"
                ? "bg-gradient-to-r from-red-100 to-orange-100 shadow-inner"
                : ""
            }`}
            onClick={() => handleItemClick("youtube")}
          >
            <div className="absolute inset-0 bg-gradient-to-r from-red-500/10 to-orange-500/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
            <div
              className={`absolute left-0 top-0 w-1 h-full bg-gradient-to-b from-red-500 to-orange-500 transform transition-transform duration-300 ${
                type === "youtube"
                  ? "translate-x-0"
                  : "-translate-x-full group-hover:translate-x-0"
              }`}
            />
            <div className="flex items-center ml-3 sm:ml-4">
              <YtIcon />
              <Button
                size="md"
                variant="normal"
                text="YouTube"
                onClick={() => {}}
              />
            </div>
          </div>
          {/* X */}
          <div
            className={`group relative overflow-hidden rounded-lg transition-all duration-300 hover:shadow-md cursor-pointer ${
              type === "x"
                ? "bg-gradient-to-r from-indigo-100 to-pink-100 shadow-inner"
                : ""
            }`}
            onClick={() => handleItemClick("x")}
          >
            <div className="absolute inset-0 bg-gradient-to-r from-indigo-500/10 to-pink-500/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
            <div
              className={`absolute left-0 top-0 w-1 h-full bg-gradient-to-b from-indigo-500 to-pink-500 transform transition-transform duration-300 ${
                type === "x"
                  ? "translate-x-0"
                  : "-translate-x-full group-hover:translate-x-0"
              }`}
            />
            <div className="flex items-center ml-3 sm:ml-4">
              <XIcons />
              <Button size="md" variant="normal" text="X" onClick={() => {}} />
            </div>
          </div>
          {/* Instagram */}
          <div
            className={`group relative overflow-hidden rounded-lg transition-all duration-300 hover:shadow-md cursor-pointer ${
              type === "instagram"
                ? "bg-gradient-to-r from-red-100 to-orange-100 shadow-inner"
                : ""
            }`}
            onClick={() => handleItemClick("instagram")}
          >
            <div className="absolute inset-0 bg-gradient-to-r from-red-500/10 to-orange-500/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
            <div
              className={`absolute left-0 top-0 w-1 h-full bg-gradient-to-b from-red-500 to-orange-500 transform transition-transform duration-300 ${
                type === "instagram"
                  ? "translate-x-0"
                  : "-translate-x-full group-hover:translate-x-0"
              }`}
            />
            <div className="flex items-center ml-3 sm:ml-4">
              <InstaIcon />
              <Button
                size="md"
                variant="normal"
                text="Instagram"
                onClick={() => {}}
              />
            </div>
          </div>
          {/* Notes */}
          <div
            className={`group relative overflow-hidden rounded-lg transition-all duration-300 hover:shadow-md cursor-pointer ${
              type === "notes"
                ? "bg-gradient-to-r from-indigo-100 to-pink-100 shadow-inner"
                : ""
            }`}
            onClick={() => handleItemClick("notes")}
          >
            <div className="absolute inset-0 bg-gradient-to-r from-indigo-500/10 to-pink-500/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
            <div
              className={`absolute left-0 top-0 w-1 h-full bg-gradient-to-b from-indigo-500 to-pink-500 transform transition-transform duration-300 ${
                type === "notes"
                  ? "translate-x-0"
                  : "-translate-x-full group-hover:translate-x-0"
              }`}
            />
            <div className="flex items-center ml-3 sm:ml-4">
              <NotesIcon />
              <Button
                size="md"
                variant="normal"
                text="Notes"
                onClick={() => {}}
              />
            </div>
          </div>
          {/* web article  */}
          <div
            className={`group relative overflow-hidden rounded-lg transition-all duration-300 hover:shadow-md cursor-pointer ${
              type === "web articles"
                ? "bg-gradient-to-r from-red-100 to-orange-100 shadow-inner"
                : ""
            }`}
            onClick={() => handleItemClick("web articles")}
          >
            <div className="absolute inset-0 bg-gradient-to-r from-red-500/10 to-orange-500/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
            <div
              className={`absolute left-0 top-0 w-1 h-full bg-gradient-to-b from-red-500 to-orange-500 transform transition-transform duration-300 ${
                type === "web articles"
                  ? "translate-x-0"
                  : "-translate-x-full group-hover:translate-x-0"
              }`}
            />
            <div className="flex items-center ml-3 sm:ml-4">
              <WebIcon />
              <Button
                size="md"
                variant="normal"
                text="Web Articles"
                onClick={() => {}}
              />
            </div>
          </div>
        </div>

        {/* Footer decoration */}
        <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 opacity-60" />
      </div>
    </>
  );
}
