import { InstagramEmbed, XEmbed } from "react-social-media-embed";
import DeleteIcon from "../../icons/DeleteIcon";
import ArrowIcon from "../../icons/ArrowIcon";
import XIcons from "../../icons/XIcons";
import YtIcon from "../../icons/YtIcon";
import axios from "axios";
import { BACKEND_URL } from "../../config";
import toast from "react-hot-toast";

interface CardProps {
  title: string;
  link: string;
  type: "x" | "youtube" | "instagram";
  id: string;
  refresh: () => void;
}

export const Card = ({ title, link, type, id, refresh }: CardProps) => {
  function getYouTubeEmbedLink(link: string): string {
    try {
      const url = new URL(link);

      // Shortened URL like youtu.be/VIDEO_ID
      if (url.hostname === "youtu.be") {
        const videoId = url.pathname.slice(1); // remove leading '/'
        return `https://www.youtube.com/embed/${videoId}`;
      }

      // Full YouTube link like youtube.com/watch?v=VIDEO_ID
      if (url.hostname.includes("youtube.com")) {
        const videoId = url.searchParams.get("v");
        return videoId ? `https://www.youtube.com/embed/${videoId}` : "";
      }

      return "";
    } catch {
      return "";
    }
  }

  let ytLink = "";
  if (type === "youtube") {
    ytLink = getYouTubeEmbedLink(link);
  }

  async function deletefxn() {
    const token = localStorage.getItem("token");

    await axios.delete(`${BACKEND_URL}/content/delete-content`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
      data: {
        contentId: id,
      },
    });
    refresh();
    toast("Deleted!");
  }

  return (
    <div className="bg-white rounded-xl shadow-sm hover:shadow-lg transition-all duration-300 w-[380px]  border-gray- overflow-hidden group ">
      {/* Header */}
      <div className="px-6 py-4 bg-gradient-to-r from-gray-50 to-gray-100 border-b border-gray-200 ">
        <div className="flex justify-between items-center ">
          <div className="flex items-center space-x-3 ">
            <div className="rounded-lg text-xl shadow-sm">
              {type === "x" && <XIcons />}
              {type === "youtube" && <YtIcon />}
            </div>
            <div>
              <h3 className="text-gray-800 font-semibold text-lg leading-tight">
                {title}
              </h3>
              <p className="text-gray-500 text-sm mt-1 capitalize">
                {type === "x" ? "X (Twitter)" : "YouTube"}
              </p>
            </div>
          </div>
          <div className="flex items-center space-x-2 opacity-70 group-hover:opacity-100 transition-opacity">
            <a
              href={link}
              target="_blank"
              rel="noopener noreferrer"
              className="p-2 hover:bg-white rounded-lg transition-colors"
            >
              <ArrowIcon />
            </a>
            <button
              className="p-2 hover:bg-white rounded-lg transition-colors cursor-pointer"
              onClick={deletefxn}
            >
              <DeleteIcon />
            </button>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="p-6 ">
        <div className="w-full h-[250px] rounded-lg overflow-auto ">
          {type === "x" && (
            <div className="w-full h-full flex items-center justify-center ">
              <div className="w-full h-full max-w-[320px] mx-auto scrollbar-thin scrollbar-thumb-gray-50 scrollbar-track-gray-50 hover:scrollbar-thumb-gray-100">
                <XEmbed url={link} />
              </div>
            </div>
          )}

          {type === "youtube" && (
            <iframe
              width="100%"
              height="100%"
              src={`${ytLink}`}
              title="YouTube video player"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
              referrerPolicy="strict-origin-when-cross-origin"
              allowFullScreen
              className="rounded-lg"
            />
          )}
          {type === "instagram" && (
            <div className="w-full h-full flex items-center justify-center ">
              <div className="w-full h-full max-w-[320px] mx-auto scrollbar-thin scrollbar-thumb-gray-50 scrollbar-track-gray-50 hover:scrollbar-thumb-gray-100">
                <InstagramEmbed url={link} />
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
