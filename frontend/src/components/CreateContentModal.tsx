import React, { useEffect, useState, useRef } from "react";
import axios from "axios";
import toast from "react-hot-toast";

import { CloseIcon } from "../icons/CloseIcon";
import YtIcon from "../icons/YtIcon";
import XIcons from "../icons/XIcons";
import InstaIcon from "../icons/InstaIcon";
import NotesIcon from "../icons/NotesIcon";
import WebIcon from "../icons/WebIcon";

import Input from "./Input";
import DescriptionInput from "./DescriptionInput";
import TagInput, { TagInputRef } from "./TagInput";
import { Button } from "./ui/Button";
import Loader from "./Loader";
import { BACKEND_URL } from "../config";

//@ts-ignore
export enum ContentType {
  YouTube = "youtube",
  X = "x",
  Instagram = "instagram",
  Notes = "notes",
  WebArticles = "web articles",
}

interface createContentProps {
  open: boolean;
  onClose: () => void;
  refresh: () => void;
  initialData?: any | null;
}

export const CreateContentModal = ({
  open,
  onClose,
  refresh,
  initialData,
}: createContentProps) => {
  const [isLoading, setIsLoading] = useState(false);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [type, setType] = useState<ContentType>(ContentType.YouTube);
  const [title, setTitle] = useState("");
  const [desc, setDesc] = useState("");
  const [link, setLink] = useState("");
  const tagRef = useRef<TagInputRef>(null);

  const isEditMode = !!initialData;

  useEffect(() => {
    if (open) {
      if (isEditMode && initialData) {
        setTitle(initialData.title || "");
        setDesc(initialData.desc || "");
        setLink(initialData.link || "");
        setType(initialData.type || ContentType.YouTube);
        const tagTitles =
          initialData.tags?.map((tag: { title: string }) => tag.title) || [];
        tagRef.current?.setTags(tagTitles);
      } else {
        setTitle("");
        setDesc("");
        setLink("");
        setType(ContentType.YouTube);
        tagRef.current?.setTags([]);
      }
    }
  }, [initialData, open, isEditMode]);

  const contentTypes = [
    { value: ContentType.YouTube, label: "YouTube", icon: <YtIcon /> },
    { value: ContentType.X, label: "X (Twitter)", icon: <XIcons /> },
    { value: ContentType.Instagram, label: "Instagram", icon: <InstaIcon /> },
    { value: ContentType.Notes, label: "Notes", icon: <NotesIcon /> },
    {
      value: ContentType.WebArticles,
      label: "Web Articles",
      icon: <WebIcon />,
    },
  ];

  const selectedType = contentTypes.find((ct) => ct.value === type);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    const token = localStorage.getItem("token");
    const tags = tagRef.current?.getTags() || [];
    const contentData = { title, link, type, tags, desc };

    try {
      if (isEditMode) {
        console.log(contentData);

        // edit content
        await axios.post(
          `${BACKEND_URL}/content/update-content/${initialData._id}`,
          { contentData },
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );
        toast.success("Content updated successfully!");
      } else {
        //create content
        await axios.post(
          `${BACKEND_URL}/content/post-content`,
          { contentData },
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );
        toast.success("Content added successfully!");
      }
      refresh();
      onClose();
    } catch (err) {
      console.error(err);
      toast.error("An error occurred. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  if (!open) {
    return null;
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-md">
      <div className="w-[520px] max-w-[90vw] bg-white rounded-3xl shadow-2xl p-6 sm:p-8 animate-fade-in border border-gray-100">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold text-gray-900">
            {isEditMode ? "Edit Content" : "Add New Content"}
          </h2>
          <button
            className="transition-all duration-200 hover:scale-110 text-gray-400 hover:text-red-500 bg-gray-100 hover:bg-red-50 rounded-xl p-2 cursor-pointer"
            onClick={onClose}
          >
            <CloseIcon />
          </button>
        </div>

        <div className="space-y-6">
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-3">
              Content Type
            </label>
            <div className="relative">
              <button
                type="button"
                onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                className="w-full px-4 py-3 text-left border-2 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all duration-200 cursor-pointer hover:shadow-sm"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <span className="text-lg">{selectedType?.icon}</span>
                    <span className="font-medium">{selectedType?.label}</span>
                  </div>
                  <svg
                    className={`w-5 h-5 transition-transform duration-200 ${
                      isDropdownOpen ? "rotate-180" : ""
                    }`}
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path
                      fillRule="evenodd"
                      d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"
                      clipRule="evenodd"
                    />
                  </svg>
                </div>
              </button>
              {isDropdownOpen && (
                <div className="absolute top-full left-0 right-0 mt-2 bg-white border-2 border-gray-200 rounded-xl shadow-lg z-10 overflow-hidden">
                  {contentTypes.map((contentType) => (
                    <button
                      key={contentType.value}
                      type="button"
                      onClick={() => {
                        setType(contentType.value);
                        setIsDropdownOpen(false);
                      }}
                      className={`w-full cursor-pointer px-4 py-3 text-left hover:bg-gray-50 transition-colors duration-150 flex items-center gap-3 ${
                        type === contentType.value
                          ? "bg-blue-50 border-l-4 border-l-blue-500"
                          : ""
                      }`}
                    >
                      <span className="text-lg">{contentType.icon}</span>
                      <span className="font-medium text-gray-700">
                        {contentType.label}
                      </span>
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>
          <form onSubmit={handleSubmit}>
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Title
              </label>
              <Input
                placeholder="Enter content title..."
                required={type !== ContentType.WebArticles}
                value={title}
                onChange={(e) => setTitle(e.target.value)}
              />
            </div>
            {(type === ContentType.Notes ||
              type === ContentType.WebArticles) && (
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Description
                </label>
                <DescriptionInput
                  required
                  placeholder="Enter content description..."
                  value={desc}
                  onChange={(e) => setDesc(e.target.value)}
                />
              </div>
            )}
            {type !== ContentType.Notes && (
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Link
                </label>
                <Input
                  required
                  placeholder="Paste your content link here..."
                  value={link}
                  onChange={(e) => setLink(e.target.value)}
                />
              </div>
            )}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Tags
              </label>
              <TagInput ref={tagRef} />
            </div>
            <div className="pt-6 flex justify-center">
              {isLoading ? (
                <Loader color="black" />
              ) : (
                <Button
                  type="submit"
                  variant="primary"
                  text={isEditMode ? "Save Changes" : "Add Content"}
                  size="lg"
                />
              )}
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};
