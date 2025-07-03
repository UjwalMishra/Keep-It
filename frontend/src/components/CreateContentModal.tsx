import { CloseIcon } from "../icons/CloseIcon";
import Input from "./Input";
import { Button } from "./ui/Button";

export const CreateContentModal = ({ open, onClose }) => {
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
              <Input placeholder="Title" onChange={() => {}} />
              <Input placeholder="Link" onChange={() => {}} />
              <div className="flex justify-center">
                <Button variant="primary" text="Submit" size="lg" />
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
