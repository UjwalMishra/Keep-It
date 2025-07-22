import { useState, forwardRef, useImperativeHandle } from "react";
import type { ForwardRefRenderFunction } from "react";

export interface TagInputRef {
  getTags: () => string[];
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
  }));

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if ((e.key === "Enter" || e.key === ",") && input.trim() !== "") {
      e.preventDefault();
      const newTag = input.trim().toLowerCase();
      if (!tags.includes(newTag)) {
        setTags([...tags, newTag]);
      }
      setInput("");
    }

    if (e.key === "Backspace" && input === "") {
      setTags(tags.slice(0, -1));
    }
  };

  const removeTag = (index: number) => {
    setTags(tags.filter((_, i) => i !== index));
  };

  return (
    <div className="tag-input">
      {tags.map((tag, i) => (
        <span key={i} className="tag">
          {tag}
          <button onClick={() => removeTag(i)}>×</button>
        </span>
      ))}
      <input
        type="text"
        value={input}
        placeholder="eg. #tech, #webdev"
        onChange={(e) => setInput(e.target.value)}
        onKeyDown={handleKeyDown}
        className="px-4 py-2 border rounded-md my-1 w-full"
      />
    </div>
  );
};

export default forwardRef(TagInput);
