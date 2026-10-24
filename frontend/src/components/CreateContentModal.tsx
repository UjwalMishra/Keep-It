import { useEffect, useMemo, useRef, useState } from "react";
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
import { FieldLabel } from "./FieldLabel";
import { useUiStore } from "../stores/uiStore";
import {
  useCreateContent,
  useUpdateContent,
} from "../features/content/hooks";
import type { ContentType } from "../types/content";
import { safeHttpUrl } from "../lib/urlSafety";

const CONTENT_TYPES: {
  value: ContentType;
  label: string;
  icon: React.ReactNode;
}[] = [
  { value: "youtube", label: "YouTube", icon: <YtIcon /> },
  { value: "x", label: "X (Twitter)", icon: <XIcons /> },
  { value: "instagram", label: "Instagram", icon: <InstaIcon /> },
  { value: "notes", label: "Notes", icon: <NotesIcon /> },
  { value: "web articles", label: "Web Articles", icon: <WebIcon /> },
];

type FieldName = "title" | "desc" | "link";

type TouchedState = Record<FieldName, boolean>;

const emptyTouched: TouchedState = {
  title: false,
  desc: false,
  link: false,
};

function getRequiredMap(type: ContentType) {
  return {
    title: type !== "web articles",
    desc: type === "notes" || type === "web articles",
    link: type !== "notes",
  };
}

function validateField(
  field: FieldName,
  value: string,
  type: ContentType
): string {
  const required = getRequiredMap(type)[field];
  const trimmed = value.trim();

  if (required && !trimmed) {
    if (field === "title") return "Title is required";
    if (field === "desc") return "Description is required";
    return "Link is required";
  }

  if (field === "link" && trimmed && !safeHttpUrl(trimmed)) {
    return "Enter a valid http(s) URL";
  }

  return "";
}

export function CreateContentModal() {
  const open = useUiStore((s) => s.modalOpen);
  const onClose = useUiStore((s) => s.closeModal);
  const initialData = useUiStore((s) => s.editingContent);

  const createMutation = useCreateContent();
  const updateMutation = useUpdateContent();

  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [type, setType] = useState<ContentType>("youtube");
  const [title, setTitle] = useState("");
  const [desc, setDesc] = useState("");
  const [link, setLink] = useState("");
  const [touched, setTouched] = useState<TouchedState>(emptyTouched);
  const [submitAttempted, setSubmitAttempted] = useState(false);
  const tagRef = useRef<TagInputRef>(null);

  const isEditMode = !!initialData;
  const isLoading = createMutation.isPending || updateMutation.isPending;
  const requiredMap = useMemo(() => getRequiredMap(type), [type]);

  useEffect(() => {
    if (!open) return;

    if (isEditMode && initialData) {
      setTitle(initialData.title || "");
      setDesc(initialData.desc || "");
      setLink(initialData.link || "");
      setType(initialData.type || "youtube");
      const tagTitles = initialData.tags?.map((tag) => tag.title) || [];
      queueMicrotask(() => tagRef.current?.setTags(tagTitles));
    } else {
      setTitle("");
      setDesc("");
      setLink("");
      setType("youtube");
      queueMicrotask(() => tagRef.current?.setTags([]));
    }
    setIsDropdownOpen(false);
    setTouched(emptyTouched);
    setSubmitAttempted(false);
  }, [initialData, open, isEditMode]);

  const selectedType = CONTENT_TYPES.find((ct) => ct.value === type);

  const titleError =
    touched.title || submitAttempted
      ? validateField("title", title, type)
      : "";
  const descError =
    (touched.desc || submitAttempted) && requiredMap.desc
      ? validateField("desc", desc, type)
      : "";
  const linkError =
    (touched.link || submitAttempted) && requiredMap.link
      ? validateField("link", link, type)
      : "";

  const markTouched = (field: FieldName) => {
    setTouched((prev) => ({ ...prev, [field]: true }));
  };

  const handleTypeChange = (next: ContentType) => {
    setType(next);
    setIsDropdownOpen(false);
    // Reset field touch for fields that may become optional/hidden
    setTouched(emptyTouched);
    setSubmitAttempted(false);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitAttempted(true);
    setTouched({ title: true, desc: true, link: true });

    const nextTitleError = validateField("title", title, type);
    const nextDescError = requiredMap.desc
      ? validateField("desc", desc, type)
      : "";
    const nextLinkError = requiredMap.link
      ? validateField("link", link, type)
      : "";

    if (nextTitleError || nextDescError || nextLinkError) {
      return;
    }

    const tags = tagRef.current?.getTags() || [];
    const contentData = {
      title: title.trim() || undefined,
      link: type === "notes" ? undefined : link.trim(),
      type,
      tags,
      desc: desc.trim() || undefined,
    };

    try {
      if (isEditMode && initialData) {
        await updateMutation.mutateAsync({
          id: initialData._id,
          payload: contentData,
        });
      } else {
        await createMutation.mutateAsync(contentData);
      }
      onClose();
    } catch {
      // toast handled in mutation hooks
    }
  };

  if (!open) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-md p-4"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div className="w-full max-w-[520px] bg-white rounded-3xl shadow-2xl border border-gray-100 flex flex-col max-h-[90vh] animate-fade-in">
        <div className="flex-shrink-0 flex justify-between items-center p-6 sm:p-8 border-b border-gray-200">
          <h2 className="text-2xl font-bold text-gray-900">
            {isEditMode ? "Edit Content" : "Add New Content"}
          </h2>
          <button
            type="button"
            className="transition-all duration-200 hover:scale-110 text-gray-400 hover:text-red-500 bg-gray-100 hover:bg-red-50 rounded-xl p-2 cursor-pointer"
            onClick={onClose}
          >
            <CloseIcon />
          </button>
        </div>

        <form
          onSubmit={handleSubmit}
          noValidate
          className="flex flex-col flex-grow overflow-hidden"
        >
          <div className="flex-grow overflow-y-auto p-6 sm:p-8">
            <div className="space-y-5">
              <div>
                <FieldLabel required>Content Type</FieldLabel>
                <div className="relative">
                  <button
                    type="button"
                    onClick={() => setIsDropdownOpen((v) => !v)}
                    className="w-full px-4 py-3 text-left border-2 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all duration-200 cursor-pointer hover:shadow-sm border-gray-200"
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
                      {CONTENT_TYPES.map((contentType) => (
                        <button
                          key={contentType.value}
                          type="button"
                          onClick={() => handleTypeChange(contentType.value)}
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

              <div>
                <FieldLabel
                  htmlFor="content-title"
                  required={requiredMap.title}
                  optionalHint={
                    !requiredMap.title ? "optional, auto-filled" : undefined
                  }
                >
                  Title
                </FieldLabel>
                <Input
                  id="content-title"
                  name="title"
                  placeholder={
                    requiredMap.title
                      ? "Enter content title..."
                      : "Optional — auto-filled from the page"
                  }
                  required={requiredMap.title}
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  onBlur={() => markTouched("title")}
                  error={titleError}
                />
              </div>

              {requiredMap.desc && (
                <div>
                  <FieldLabel htmlFor="content-desc" required>
                    Description
                  </FieldLabel>
                  <DescriptionInput
                    id="content-desc"
                    name="desc"
                    required
                    placeholder="Enter content description..."
                    value={desc}
                    onChange={(e) => setDesc(e.target.value)}
                    onBlur={() => markTouched("desc")}
                    error={descError}
                  />
                </div>
              )}

              {requiredMap.link && (
                <div>
                  <FieldLabel htmlFor="content-link" required>
                    Link
                  </FieldLabel>
                  <Input
                    id="content-link"
                    name="link"
                    required
                    placeholder="Paste your content link here..."
                    value={link}
                    onChange={(e) => setLink(e.target.value)}
                    onBlur={() => markTouched("link")}
                    error={linkError}
                  />
                </div>
              )}

              <div>
                <FieldLabel optionalHint="optional">Tags</FieldLabel>
                <TagInput ref={tagRef} />
              </div>
            </div>
          </div>

          <div className="flex-shrink-0 flex justify-center p-6 sm:p-8 border-t border-gray-200">
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
  );
}
