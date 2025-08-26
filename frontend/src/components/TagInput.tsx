import React, { useState, forwardRef, useImperativeHandle } from "react";
import type { ForwardRefRenderFunction } from "react";
import { CloseIcon } from "../icons/CloseIcon";

export interface TagInputRef {
  getTags: () => string[];
  setTags: (tags: string[]) => void;
}

interface TagInputProps {}

const TagInput: ForwardRefRenderFunction<TagInputRef, TagInputProps> = (
  _props,
  ref
) => {
  const [tags, setTags] = useState<string[]>([]);
  const [input, setInput] = useState("");

  useImperativeHandle(ref, () => ({
    getTags: () => tags,
    setTags: (newTags: string[]) => {
      if (Array.isArray(newTags)) {
        // Sanitize tags set externally to ensure no '#' is stored in state
        const sanitizedTags = newTags.map((tag) =>
          tag.toLowerCase().replace(/^#/, "")
        );
        setTags(sanitizedTags);
      } else {
        setTags([]);
      }
    },
  }));

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if ((e.key === "Enter" || e.key === ",") && input.trim() !== "") {
      e.preventDefault();
      // Sanitize user input to remove any manually typed '#'
      const newTag = input.trim().toLowerCase().replace(/^#/, "");

      if (newTag && !tags.includes(newTag)) {
        setTags([...tags, newTag]);
      }
      setInput("");
    }

    if (e.key === "Backspace" && input === "") {
      setTags(tags.slice(0, -1));
    }
  };

  const removeTag = (indexToRemove: number) => {
    setTags(tags.filter((_, i) => i !== indexToRemove));
  };

  return (
    <div className="w-full p-3 border-2 border-gray-200 rounded-xl flex flex-wrap items-center gap-2 focus-within:ring-2 focus-within:ring-blue-500 focus-within:border-blue-500 transition-all duration-200">
      {tags.map((tag, i) => (
        <div
          key={i}
          className="flex items-center gap-1.5 bg-blue-100 text-blue-800 text-sm font-medium px-3 py-1.5 rounded-lg"
        >
          {/* Display rendered tags with a '#' */}
          <span>#{tag}</span>
          <button
            type="button"
            onClick={() => removeTag(i)}
            className="text-blue-600 hover:text-blue-800 hover:bg-blue-200 rounded-full p-0.5"
          >
            <CloseIcon />
          </button>
        </div>
      ))}

      <div className="flex-grow flex items-center min-w-[80px]">
        <span className="text-gray-500 text-sm pl-1">#</span>
        <input
          type="text"
          value={input}
          placeholder="Add a tag"
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={handleKeyDown}
          className="w-full bg-transparent text-sm p-1 pl-0 focus:outline-none"
        />
      </div>
    </div>
  );
};

export default forwardRef(TagInput);
