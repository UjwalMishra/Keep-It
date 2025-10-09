import { CloseIcon } from "../icons/CloseIcon";
import NotesIcon from "../icons/NotesIcon";

interface NoteProps {
  content: any;
  closeNotes: () => void;
}

const NotesInDetail = ({ content, closeNotes }: NoteProps) => {
  const handleBackdropClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };
  function onClose() {
    closeNotes();
  }
  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-md p-4"
      onClick={handleBackdropClick}
    >
      <div className="w-full max-w-fit  bg-white rounded-3xl shadow-2xl border border-gray-100 flex flex-col max-h-[90vh]  animate-fade-in">
        {/* Modal Header */}
        <div className="flex-shrink-0 flex justify-between items-center p-4 sm:p-6 border-b border-gray-200">
          <div className="text-xl font-semibold flex items-center justify-center gap-2">
            <div className="mt-2">
              <NotesIcon />
            </div>
            <div>{content.title}</div>
          </div>
          <button
            className="transition-all duration-200 hover:scale-110 text-gray-400 hover:text-red-500 bg-gray-100 hover:bg-red-50 rounded-xl p-2 cursor-pointer"
            onClick={onClose}
          >
            <CloseIcon />
          </button>
        </div>

        <div
          className="overflow-y-auto px-6 py-3 text-[1.1rem] leading-10 text-gray-800 tracking-wide 
                 font-[450] max-w-3xl mx-auto text-left whitespace-pre-line space-y-6  "
        >
          {content.desc}
        </div>
      </div>
    </div>
  );
};

export default NotesInDetail;
