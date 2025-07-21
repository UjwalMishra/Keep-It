import { useRef, useState } from "react";
import { CloseIcon } from "../icons/CloseIcon";
import Input from "./Input";
import { Button } from "./ui/Button";
import axios from "axios";
import { BACKEND_URL } from "../config";
import TagInput from "./TagInput";
import YtIcon from "../icons/YtIcon";
import XIcons from "../icons/XIcons";
import InstaIcon from "../icons/InstaIcon";

//@ts-ignore
export enum ContentType {
  YouTube = "youtube",
  X = "x",
  Instagram = "instagram",
  Notes = "notes",
}

interface createContentProps {
  open: boolean;
  onClose: () => void;
  refresh: () => void;
}

export const CreateContentModal = ({
  open,
  onClose,
  refresh,
}: createContentProps) => {
  const [type, setType] = useState(ContentType.YouTube);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const titleRef = useRef<any>("");
  const descRef = useRef<any>("");
  const linkRef = useRef<any>("");
  const tagRef = useRef<any>([""]);

  const contentTypes = [
    {
      value: ContentType.YouTube,
      label: "YouTube",
      icon: <YtIcon />,
      // color: "bg-red-50 text-red-700 border-red-200",
    },
    {
      value: ContentType.X,
      label: "X (Twitter)",
      icon: <XIcons />,
      // color: "bg-gray-50 text-gray-700 border-gray-200",
    },
    {
      value: ContentType.Instagram,
      label: "Instagram",
      icon: <InstaIcon />,
      // color: "bg-pink-50 text-pink-700 border-pink-200",
    },
    {
      value: ContentType.Notes,
      label: "Notes",
      icon: <InstaIcon />,
      // color: "bg-pink-50 text-pink-700 border-pink-200",
    },
  ];

  const selectedType = contentTypes.find((ct) => ct.value === type);

  async function addContentFxn() {
    const title = titleRef.current.value;
    const desc = descRef.current.value;
    const link = linkRef.current.value;
    const tags = tagRef.current.getTags();

    console.log(title, " ", desc, " ", link, " ", tags);

    const token = localStorage.getItem("token");
    await axios.post(
      `${BACKEND_URL}/content/post-content`,
      { title, link, type, tags, desc },
      {
        headers: {
          Authorization: `Bearer ${token} `,
        },
      }
    );
    refresh();
    onClose();
  }

  return (
    <>
      {open && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-md transition-all duration-300">
          <div className="w-[520px] max-w-[90vw] bg-white rounded-3xl shadow-2xl p-8 animate-fade-in border border-gray-100">
            {/* Header */}
            <div className="flex justify-between items-center mb-6">
              <div>
                <h2 className="text-2xl font-bold text-gray-900">
                  Add New Content
                </h2>
              </div>
              <button
                className="transition-all duration-200 hover:scale-110 text-gray-400 hover:text-red-500 bg-gray-100 hover:bg-red-50 rounded-xl p-2 cursor-pointer"
                onClick={onClose}
              >
                <CloseIcon />
              </button>
            </div>

            {/* Form */}
            <div className="space-y-6">
              {/* Content Type Selector */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-3">
                  Content Type
                </label>
                <div className="relative">
                  <button
                    type="button"
                    onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                    className={`w-full px-4 py-3 text-left border-2 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all duration-200 ${selectedType?.color} hover:shadow-md`}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <span className="text-lg">{selectedType?.icon}</span>
                        <span className="font-medium">
                          {selectedType?.label}
                        </span>
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
                            setType(contentType.value as ContentType);
                            setIsDropdownOpen(false);
                          }}
                          className={`w-full px-4 py-3 text-left hover:bg-gray-50 transition-colors duration-150 flex items-center gap-3 ${
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

              {/* Title Input */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Title
                </label>
                <Input placeholder="Enter content title..." ref={titleRef} />
              </div>

              {type === "notes" && (
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Description
                  </label>
                  <Input placeholder="Enter content title..." ref={descRef} />
                </div>
              )}

              {/* Link Input */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Link{" "}
                  {type === "notes" && (
                    <span className="text-gray-400 font-normal">
                      (optional)
                    </span>
                  )}
                </label>
                <Input
                  placeholder="Paste your content link here..."
                  ref={linkRef}
                />
              </div>

              {/* Tags Input */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Tags
                </label>
                <TagInput ref={tagRef} />
              </div>

              {/* Submit Button */}
              <div className="pt-6 flex justify-center">
                <Button
                  variant="primary"
                  text="Add Content"
                  size="lg"
                  onClick={addContentFxn}
                />
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};
