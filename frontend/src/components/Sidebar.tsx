import AllIcon from "../icons/AllIcon";
import MainIcon from "../icons/MainIcon";
import XIcons from "../icons/XIcons";
import YtIcon from "../icons/YtIcon";
import { Button } from "./ui/Button";

export default function Sidebar({
  type,
  setType,
}: {
  type: string;
  setType: (type: string) => void;
}) {
  return (
    <div className="h-screen w-56 border-r border-slate-200 bg-gradient-to-b from-slate-50 to-white fixed left-0 top-0 shadow-lg z-50 transition-all duration-300 ease-in-out">
      {/* Header */}
      <div className="p-6 border-b border-slate-200 bg-white/80 backdrop-blur-sm">
        <h2 className="text-3xl font-bold text-slate-800 tracking-tight flex items-center gap-1">
          <div className=" text-3xl font-bold">
            <MainIcon />
          </div>
          <div>Keep-It</div>
        </h2>
        <div className="w-26 h-1.5 bg-gradient-to-r from-blue-500 to-purple-500 mt-2 rounded-full"></div>
      </div>

      {/* Navigation Items */}
      <div className="flex flex-col p-4 space-y-2">
        {/* All */}
        <div
          className={`group relative overflow-hidden rounded-lg transition-all duration-300 hover:shadow-md cursor-pointer ${
            type === "All"
              ? "bg-gradient-to-r from-blue-100 to-purple-100 shadow-inner"
              : ""
          }`}
          onClick={() => setType("All")}
        >
          <div className="absolute inset-0 bg-gradient-to-r from-blue-500/10 to-purple-500/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
          <div
            className={`absolute left-0 top-0 w-1 h-full bg-gradient-to-b from-blue-500 to-purple-500 transform transition-transform duration-300 ${
              type === "All"
                ? "translate-x-0"
                : "-translate-x-full group-hover:translate-x-0"
            }`}
          />
          <div className="flex items-center ml-4">
            <AllIcon />
            <Button size="md" variant="normal" text="All" onClick={() => {}} />
          </div>
        </div>

        {/* YouTube */}
        <div
          className={`group relative overflow-hidden rounded-lg transition-all duration-300 hover:shadow-md cursor-pointer ${
            type === "youtube"
              ? "bg-gradient-to-r from-red-100 to-orange-100 shadow-inner"
              : ""
          }`}
          onClick={() => setType("youtube")}
        >
          <div className="absolute inset-0 bg-gradient-to-r from-red-500/10 to-orange-500/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
          <div
            className={`absolute left-0 top-0 w-1 h-full bg-gradient-to-b from-red-500 to-orange-500 transform transition-transform duration-300 ${
              type === "youtube"
                ? "translate-x-0"
                : "-translate-x-full group-hover:translate-x-0"
            }`}
          />
          <div className="flex items-center ml-4">
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
          onClick={() => setType("x")}
        >
          <div className="absolute inset-0 bg-gradient-to-r from-indigo-500/10 to-pink-500/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
          <div
            className={`absolute left-0 top-0 w-1 h-full bg-gradient-to-b from-indigo-500 to-pink-500 transform transition-transform duration-300 ${
              type === "x"
                ? "translate-x-0"
                : "-translate-x-full group-hover:translate-x-0"
            }`}
          />
          <div className="flex items-center ml-4">
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
          onClick={() => setType("instagram")}
        >
          <div className="absolute inset-0 bg-gradient-to-r from-red-500/10 to-orange-500/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
          <div
            className={`absolute left-0 top-0 w-1 h-full bg-gradient-to-b from-red-500 to-orange-500 transform transition-transform duration-300 ${
              type === "instagram"
                ? "translate-x-0"
                : "-translate-x-full group-hover:translate-x-0"
            }`}
          />
          <div className="flex items-center ml-4">
            <YtIcon />
            <Button
              size="md"
              variant="normal"
              text="Instagram"
              onClick={() => {}}
            />
          </div>
        </div>
      </div>

      {/* Footer decoration */}
      <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 opacity-60" />
    </div>
  );
}
