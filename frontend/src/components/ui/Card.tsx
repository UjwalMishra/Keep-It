import React, { useEffect, useState } from "react"; // <-- Import React and useEffect
import { Tweet } from "react-tweet"; // <-- This is correct for Twitter
import DeleteIcon from "../../icons/DeleteIcon";
import ArrowIcon from "../../icons/ArrowIcon";
import XIcons from "../../icons/XIcons";
import YtIcon from "../../icons/YtIcon";
import axios from "axios";
import { BACKEND_URL } from "../../config";
import toast from "react-hot-toast";
import NotesIcon from "../../icons/NotesIcon";
import WebIcon from "../../icons/WebIcon";
import InstaIcon from "../../icons/InstaIcon";
import Loader from "../Loader";

// Helper function to get the ID from a Tweet URL
const getTweetId = (url: string): string => {
  try {
    const urlObject = new URL(url);

    const pathParts = urlObject.pathname.split("/");
    return pathParts[pathParts.length - 1];
  } catch (e) {
    console.error("Invalid Tweet URL:", url);
    return "";
  }
};

interface CardProps {
  title: string;
  link: string;
  type: "x" | "youtube" | "instagram" | "notes" | "web articles";
  id: string;
  desc: string;
  tags: { title: string }[];
  refresh: () => void;
  previewImage: string;
  shared: boolean;
}

export const Card = ({
  title,
  link,
  type,
  id,
  refresh,
  tags,
  desc,
  shared,
  previewImage,
}: CardProps) => {
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (type === "instagram") {
      if ((window as any).instgrm) {
        (window as any).instgrm.Embeds.process();
      }
    }
  }, [link, type]);

  // --- Helper functions for YT ---
  function getYouTubeEmbedLink(link: string): string {
    try {
      const url = new URL(link);
      if (url.hostname === "youtu.be") {
        return `https://www.youtube.com/embed/${url.pathname.slice(1)}`;
      }
      if (url.hostname.includes("youtube.com")) {
        const videoId = url.searchParams.get("v");
        return videoId ? `https://www.youtube.com/embed/${videoId}` : "";
      }
      return "";
    } catch {
      return "";
    }
  }

  const ytLink = type === "youtube" ? getYouTubeEmbedLink(link) : "";
  const tweetId = type === "x" ? getTweetId(link) : "";

  const [readmore, setReadmore] = React.useState(false);

  const displayedTitle = readmore ? title : title.substring(0, 20);

  const toggleTitle = () => {
    setReadmore(!readmore);
  };

  async function deletefxn() {
    setLoading(true);
    const token = localStorage.getItem("token");
    await axios.delete(`${BACKEND_URL}/content/delete-content`, {
      headers: { Authorization: `Bearer ${token}` },
      data: { contentId: id },
    });
    refresh();
    toast.success("Content deleted.", { icon: "🗑️", duration: 3000 });
    setLoading(false);
  }

  return (
    <div className="bg-white rounded-xl shadow-sm hover:shadow-lg transition-all duration-300 w-full border border-gray-200 overflow-hidden group flex flex-col">
      {/* Header */}
      <div className="w-full px-4 sm:px-6 py-4 bg-gradient-to-r from-gray-50 to-gray-100 border-b border-gray-200">
        <div className="flex justify-between items-start gap-3">
          <div className="flex flex-col space-y-2 flex-1 min-w-0">
            <div className="flex items-start space-x-3">
              <div className=" text-xl flex-shrink-0 mt-1">
                {type === "x" && <XIcons />}
                {type === "youtube" && <YtIcon />}
                {type === "web articles" && <WebIcon />}
                {type === "notes" && <NotesIcon />}
                {type === "instagram" && <InstaIcon />}
              </div>
              <div className="flex-1 min-w-0">
                <h3
                  className={`text-gray-800 font-semibold text-base sm:text-lg leading-tight ${
                    !readmore ? "whitespace-nowrap" : " break-words"
                  }`}
                >
                  {displayedTitle}
                  {title.length > 20 && (
                    <span
                      onClick={toggleTitle}
                      className={`text-blue-600 cursor-pointer ml-1 hover:underline ${
                        !readmore ? "text-xl" : "text-sm"
                      }`}
                    >
                      {readmore ? "Show less" : "...."}
                    </span>
                  )}
                </h3>
                <div className="flex items-center gap-2">
                  <p className="text-gray-500 text-sm capitalize mt-1">
                    {type}
                  </p>
                  {/* Tags */}
                  {tags && tags.length > 0 && (
                    <div className="flex flex-wrap gap-1.5 mt-2">
                      {tags.map((tag, i) => (
                        <span
                          key={i}
                          className="text-xs px-2 py-1 bg-gray-200 text-gray-700 rounded-full break-all"
                        >
                          #{tag.title}
                        </span>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Actions */}
          <div className="flex items-center space-x-1 opacity-70 group-hover:opacity-100 transition-opacity flex-shrink-0">
            {link && (
              <a
                href={link}
                target="_blank"
                rel="noopener noreferrer"
                className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <ArrowIcon />
              </a>
            )}
            {!shared && (
              <button
                className="p-2 hover:bg-red-100 text-red-600 rounded-lg transition-colors cursor-pointer"
                onClick={deletefxn}
              >
                {loading === false ? (
                  <DeleteIcon />
                ) : (
                  <Loader color={"black"} />
                )}
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="sm:p-6 flex-grow">
        <div className="w-full h-[200px] flex flex-col justify-center  rounded-lg overflow-hidden">
          {/* x (Twitter) */}
          {type === "x" && tweetId && (
            <div className="w-full h-full flex items-center justify-center">
              <div className="w-full h-full max-w-[320px] mx-auto scrollbar-thin scrollbar-thumb-gray-50 scrollbar-track-gray-50 hover:scrollbar-thumb-gray-100 overflow-auto">
                <Tweet id={tweetId} />
              </div>
            </div>
          )}

          {/* yt (YouTube) */}
          {type === "youtube" && ytLink && (
            <iframe
              width="100%"
              height="100%"
              src={ytLink}
              title="YouTube video player"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
              referrerPolicy="strict-origin-when-cross-origin"
              allowFullScreen
              className="rounded-lg"
            />
          )}

          {/* insta */}
          {type === "instagram" && (
            <div className="w-full h-full flex items-center justify-center">
              <div className="w-full h-full max-w-[320px] mx-auto scrollbar-thin scrollbar-thumb-gray-50 scrollbar-track-gray-50 hover:scrollbar-thumb-gray-100 overflow-auto">
                <blockquote
                  className="instagram-media"
                  data-instgrm-permalink={link}
                  data-instgrm-version="14"
                ></blockquote>
              </div>
            </div>
          )}

          {/* notes */}
          {type === "notes" && (
            <div className="flex flex-col h-full">
              <div className="flex items-center mb-3">
                <span className="px-2">
                  {" "}
                  <NotesIcon />{" "}
                </span>
                <p className="text-sm sm:text-md font-medium text-gray-700">
                  Description
                </p>
              </div>
              <div className="bg-yellow-50 p-3 sm:p-4 rounded-lg text-sm text-gray-800 whitespace-pre-wrap font-sans leading-relaxed flex-1 overflow-auto">
                {desc || "No content provided."}
              </div>
            </div>
          )}

          {/* Web Articles */}
          {type === "web articles" && (
            <div className="w-full">
              {previewImage ? (
                <a
                  href={link}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="block"
                >
                  <img
                    src={previewImage}
                    alt={title}
                    className="w-full h-[180px] object-cover rounded-lg"
                  />
                </a>
              ) : (
                <div className="p-8 bg-gray-50 border border-gray-200 rounded-lg">
                  <a
                    href={link}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="block"
                  >
                    <p className="text-gray-700 mb-3 text-center text-sm">
                      ⚠️ Preview image not available for this article.
                    </p>
                    <p className="text-sm text-gray-800">
                      <strong>Description:</strong>{" "}
                      {desc || "No description provided."}
                    </p>
                  </a>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
