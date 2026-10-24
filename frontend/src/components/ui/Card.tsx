import { useEffect, useState } from "react";
import { Tweet } from "react-tweet";
import DeleteIcon from "../../icons/DeleteIcon";
import ArrowIcon from "../../icons/ArrowIcon";
import XIcons from "../../icons/XIcons";
import YtIcon from "../../icons/YtIcon";
import NotesIcon from "../../icons/NotesIcon";
import WebIcon from "../../icons/WebIcon";
import InstaIcon from "../../icons/InstaIcon";
import EditIcon from "../../icons/EditIcon";
import Loader from "../Loader";
import type { ContentItem } from "../../types/content";
import { useDeleteContent } from "../../features/content/hooks";
import {
  getTweetId,
  getYouTubeEmbedUrl,
  safeHttpUrl,
} from "../../lib/urlSafety";

type CardProps = {
  item: ContentItem;
  shared?: boolean;
  onEdit?: () => void;
  onOpenNotes: () => void;
};

export function Card({ item, shared = false, onEdit, onOpenNotes }: CardProps) {
  const { title = "", link = "", type, desc = "", tags = [], previewImage } = item;
  const deleteMutation = useDeleteContent();
  const [readmore, setReadmore] = useState(false);

  const safeLink = safeHttpUrl(link);
  const safePreview = safeHttpUrl(previewImage);
  const ytLink = type === "youtube" && safeLink ? getYouTubeEmbedUrl(safeLink) : null;
  const tweetId = type === "x" && safeLink ? getTweetId(safeLink) : null;

  useEffect(() => {
    if (type === "instagram" && (window as any).instgrm) {
      (window as any).instgrm.Embeds.process();
    }
  }, [safeLink, type]);

  const displayedTitle = readmore ? title : title.substring(0, 20);

  return (
    <div className="bg-white rounded-xl shadow-sm hover:shadow-lg transition-all duration-300 w-full border border-gray-200 overflow-hidden group flex flex-col">
      <div className="w-full px-4 sm:px-6 py-4 bg-gradient-to-r from-gray-50 to-gray-100 border-b border-gray-200">
        <div className="flex justify-between items-start gap-3">
          <div className="flex flex-col space-y-2 flex-1 min-w-0">
            <div className="flex items-start space-x-3">
              <div className="text-xl flex-shrink-0 mt-1">
                {type === "x" && <XIcons />}
                {type === "youtube" && <YtIcon />}
                {type === "web articles" && <WebIcon />}
                {type === "notes" && <NotesIcon />}
                {type === "instagram" && <InstaIcon />}
              </div>

              <div className="flex-1 min-w-0">
                <h3
                  className={`text-gray-800 font-semibold text-base sm:text-lg leading-tight ${
                    !readmore ? "truncate" : "break-words"
                  }`}
                >
                  {displayedTitle}
                  {title.length > 20 && (
                    <button
                      type="button"
                      onClick={() => setReadmore((v) => !v)}
                      className={`text-blue-600 cursor-pointer ml-0 hover:underline ${
                        !readmore ? "text-xl" : "text-sm"
                      }`}
                    >
                      {readmore ? " show less" : "...."}
                    </button>
                  )}
                </h3>

                <div className="flex flex-wrap items-center gap-x-3 gap-y-2 mt-1.5">
                  <div className="text-gray-500 text-sm capitalize">{type}</div>
                  {tags.length > 0 && (
                    <div className="flex flex-wrap gap-1.5">
                      {tags.map((tag, i) => (
                        <span
                          key={tag._id || `${tag.title}-${i}`}
                          className="text-xs px-2 py-1 bg-gray-200 text-gray-700 rounded-full"
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

          <div className="flex items-center space-x-1 opacity-70 group-hover:opacity-100 transition-opacity flex-shrink-0">
            {!shared && onEdit && (
              <button
                type="button"
                className="p-2 hover:bg-gray-100 text-xl rounded-lg transition-colors font-medium text-gray-700 cursor-pointer"
                onClick={onEdit}
                aria-label="Edit"
              >
                <EditIcon />
              </button>
            )}
            {safeLink && (
              <a
                href={safeLink}
                target="_blank"
                rel="noopener noreferrer"
                className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                aria-label="Open link"
              >
                <ArrowIcon />
              </a>
            )}
            {!shared && (
              <button
                type="button"
                className="p-2 hover:bg-red-100 text-red-600 rounded-lg transition-colors cursor-pointer"
                onClick={() => deleteMutation.mutate(item._id)}
                disabled={deleteMutation.isPending}
                aria-label="Delete"
              >
                {deleteMutation.isPending ? (
                  <Loader color="black" />
                ) : (
                  <DeleteIcon />
                )}
              </button>
            )}
          </div>
        </div>
      </div>

      <div className="p-4 sm:p-6 flex-grow">
        <div className="w-full h-[200px] flex flex-col justify-center rounded-lg overflow-hidden">
          {type === "x" && tweetId && (
            <div className="w-full h-full flex items-center justify-center">
              <div className="w-full h-full max-w-[320px] mx-auto scrollbar-thin scrollbar-thumb-gray-50 scrollbar-track-gray-50 hover:scrollbar-thumb-gray-100 overflow-auto">
                <Tweet id={tweetId} />
              </div>
            </div>
          )}

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

          {type === "instagram" && safeLink && (
            <div className="w-full h-full flex items-center justify-center">
              <div className="w-full h-full max-w-[320px] mx-auto scrollbar-thin overflow-auto">
                <blockquote
                  className="instagram-media"
                  data-instgrm-permalink={safeLink}
                  data-instgrm-version="14"
                />
              </div>
            </div>
          )}

          {type === "notes" && (
            <button
              type="button"
              className="flex flex-col h-full cursor-pointer text-left w-full"
              onClick={onOpenNotes}
            >
              <div className="flex items-center mb-3">
                <span className="px-2">
                  <NotesIcon />
                </span>
                <p className="text-sm sm:text-md font-medium text-gray-700">
                  Description
                </p>
              </div>
              <div className="bg-yellow-50 p-3 sm:p-4 rounded-lg text-sm text-gray-800 whitespace-pre-wrap font-sans leading-relaxed flex-1 overflow-auto">
                {desc || "No content provided."}
              </div>
            </button>
          )}

          {type === "web articles" && (
            <div className="w-full">
              {safePreview && safeLink ? (
                <a href={safeLink} target="_blank" rel="noopener noreferrer" className="block">
                  <img
                    src={safePreview}
                    alt={title || "Article preview"}
                    className="w-full h-[180px] object-cover rounded-lg"
                    loading="lazy"
                    referrerPolicy="no-referrer"
                  />
                </a>
              ) : (
                <div className="p-4 bg-gray-50 border border-gray-200 rounded-lg">
                  {safeLink ? (
                    <a href={safeLink} target="_blank" rel="noopener noreferrer" className="block">
                      <p className="text-gray-700 mb-3 text-center text-sm">
                        Preview image not available for this article.
                      </p>
                      <p className="text-sm text-gray-800">
                        <strong>Description:</strong> {desc || "No description provided."}
                      </p>
                    </a>
                  ) : (
                    <p className="text-sm text-gray-800">
                      {desc || "No description provided."}
                    </p>
                  )}
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
