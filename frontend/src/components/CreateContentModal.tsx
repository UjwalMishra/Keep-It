import { useRef, useState } from "react";
import { CloseIcon } from "../icons/CloseIcon";
import Input from "./Input";
import { Button } from "./ui/Button";
import axios from "axios";
import { BACKEND_URL } from "../config";

//@ts-ignore
export enum ContentType {
  YouTube = "youtube",
  X = "x",
  Instagram = "instagram",
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
  const titleRef = useRef<any>("");
  const linkRef = useRef<any>("");

  async function addContentFxn() {
    const title = titleRef.current.value;
    const link = linkRef.current.value;

    const token = localStorage.getItem("token");
    await axios.post(
      `${BACKEND_URL}/content/post-content`,
      { title, link, type },
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
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm transition-opacity duration-300">
          <div className="w-[400px] bg-white rounded-2xl shadow-2xl p-6 animate-fade-in">
            {/* Header */}
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-bold text-gray-800">Add Content</h2>
              <button
                className=" transition-transform hover:scale-110 text-red-500 font-extrabold bg-gray-200 rounded-lg p-1 cursor-pointer"
                onClick={onClose}
              >
                <CloseIcon />
              </button>
            </div>

            {/* Form */}
            <div className="space-y-4">
              <Input placeholder="Title" ref={titleRef} />
              <Input placeholder="Link" ref={linkRef} />

              <div className="flex items-center justify-center gap-4 pt-2">
                <label
                  htmlFor="type-select"
                  className="font-medium text-gray-700"
                >
                  Type:
                </label>
                <select
                  id="type-select"
                  value={type}
                  onChange={(e) => {
                    setType(e.target.value);
                  }}
                  className="px-3 py-2 border border-gray-300 rounded-md text-sm text-gray-700 bg-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value={ContentType.YouTube}>YouTube</option>
                  <option value={ContentType.X}>X</option>
                  <option value={ContentType.Instagram}>Instagram</option>
                </select>
              </div>

              {/* Submit button */}
              <div className="pt-4 flex justify-center">
                <Button
                  variant="primary"
                  text="Submit"
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
