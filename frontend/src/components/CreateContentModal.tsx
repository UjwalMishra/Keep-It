import { useRef, useState } from "react";
import { CloseIcon } from "../icons/CloseIcon";
import Input from "./Input";
import { Button } from "./ui/Button";
import axios from "axios";
import { BACKEND_URL } from "../config";

enum ContentType {
  YouTube = "youtube",
  X = "x",
}

export const CreateContentModal = ({ open, onClose }) => {
  const [type, setType] = useState(ContentType.YouTube);

  const titleRef = useRef<any>("");
  const linkRef = useRef<any>("");

  async function addContentFxn() {
    const title = titleRef.current.value;
    const link = linkRef.current.value;

    const token = localStorage.getItem("token");
    await axios.post(
      `${BACKEND_URL}/content/post-content`,
      {
        title,
        link,
        type,
      },
      {
        headers: {
          Authorization: `Bearer ${token} `,
        },
      }
    );
    onClose();
  }
  return (
    <div>
      {open && (
        <div className="w-screen h-screen bg-black/50 backdrop-blur-sm fixed top-0 left-0 flex justify-center items-center z-10">
          <div className="h-[450px] w-[400px] bg-white rounded-xl shadow-xl border border-slate-300 flex flex-col">
            <div className="flex justify-between py-2 px-3">
              <div>Add Content</div>
              <div
                className="text-xl hover:cursor-pointer hover:scale-110 transition-all duration-200"
                onClick={onClose}
              >
                <CloseIcon />
              </div>
            </div>
            <div>
              <Input placeholder="Title" ref={titleRef} />
              <Input placeholder="Link" ref={linkRef} />
              <div className="flex justify-around px-8">
                <div className="font-bold text-[20px]">Type : </div>
                <Button
                  text="Youtube"
                  size="lg"
                  variant={
                    type === ContentType.YouTube ? "primary" : "secondary"
                  }
                  onClick={() => setType(ContentType.YouTube)}
                />
                <Button
                  text="X"
                  size="lg"
                  variant={type === ContentType.X ? "primary" : "secondary"}
                  onClick={() => setType(ContentType.X)}
                />
              </div>

              <div className="flex justify-center">
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
    </div>
  );
};
