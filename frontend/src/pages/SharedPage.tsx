import axios from "axios";
import { BACKEND_URL } from "../config";
import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import { Card } from "../components/ui/Card";
import Sidebar from "../components/Sidebar";
import Loader from "../components/Loader";

export default function SharedPage() {
  const [contents, setContents] = useState([]);
  const [type, setType] = useState("All");
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [loading, setLoading] = useState(true);

  const { sharelink } = useParams();

  console.log(sharelink);

  async function getSharedItems() {
    try {
      setLoading(true);
      const res = await axios.get(`${BACKEND_URL}/link/share/${sharelink}`);
      setContents(res.data.content);
    } catch (error) {
      console.error("Error fetching shared content:", error);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    getSharedItems();
  }, []);

  const filteredContent =
    type === "All"
      ? contents
      : //@ts-ignore
        contents.filter((content) => content.type === type);

  const refresh = () => {};

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 text-gray-900 relative font-sans">
      {/* Sidebar */}
      <Sidebar
        setType={setType}
        type={type}
        isOpen={sidebarOpen}
        onClose={() => setSidebarOpen(false)}
      />

      {/* Main content */}
      <div className="lg:ml-56 xl:ml-64 transition-all duration-300">
        {/* Mobile Header with Hamburger */}
        <div className="lg:hidden sticky top-0 bg-white/90 backdrop-blur-lg px-4 py-3 shadow-sm border-b border-gray-200 z-30">
          <div className="flex items-center justify-between">
            <button
              onClick={() => setSidebarOpen(true)}
              className="p-2 rounded-lg hover:bg-gray-100 transition-colors"
            >
              <svg
                className="w-6 h-6"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M4 6h16M4 12h16M4 18h16"
                />
              </svg>
            </button>
            <h1 className="text-lg font-semibold text-gray-800 flex items-center gap-2">
              <svg
                className="w-5 h-5"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.367 2.684 3 3 0 00-5.367-2.684z"
                />
              </svg>
              Shared Content
            </h1>
            <div className="w-10"></div> {/* Spacer for centering */}
          </div>
        </div>

        {/* Desktop Header */}
        <div className="hidden lg:block sticky top-0 bg-white/80 backdrop-blur-lg rounded-xl mx-4 xl:mx-6 mt-4 xl:mt-6 px-4 xl:px-6 py-4 shadow-md border border-gray-200 z-30">
          <div className="flex justify-between items-center">
            <h1 className="text-xl xl:text-2xl font-semibold tracking-tight text-gray-800 uppercase flex gap-3 xl:gap-4 items-center">
              <svg
                className="w-6 h-6 xl:w-7 xl:h-7"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.367 2.684 3 3 0 00-5.367-2.684z"
                />
              </svg>
              <div>Shared Content</div>
            </h1>

            <div className="text-sm text-gray-600 bg-gray-100 px-3 py-1 rounded-full">
              {filteredContent.length} item
              {filteredContent.length !== 1 ? "s" : ""}
            </div>
          </div>
        </div>

        {/* Content Section */}
        <div className="p-4 xl:p-6 mt-4 xl:mt-8">
          {loading ? (
            <div className="flex items-center justify-center min-h-[400px]">
              <div className="text-center">
                <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900 mb-4"></div>
                <p className="text-lg text-gray-600">
                  <Loader color={"black"} />
                </p>
              </div>
            </div>
          ) : filteredContent.length === 0 ? (
            <div className="text-center py-16">
              <svg
                className="mx-auto h-16 w-16 text-gray-400 mb-4"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={1}
                  d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4"
                />
              </svg>
              <h3 className="text-2xl sm:text-3xl xl:text-4xl font-semibold text-gray-600 mb-2">
                No Content Found!
              </h3>
              <p className="text-gray-500 text-base sm:text-lg">
                {type === "All"
                  ? "This shared link doesn't contain any content yet."
                  : `No ${type} content found in this shared collection.`}
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3  gap-4 sm:gap-6 animate-fade-in">
              {filteredContent.map(
                ({ _id, title, link, type, desc, tags, previewImage }) => (
                  <div
                    key={_id}
                    className="transition-transform duration-300 transform hover:scale-[1.02]"
                  >
                    <Card
                      title={title}
                      link={link}
                      type={type}
                      id={_id}
                      desc={desc}
                      tags={tags}
                      refresh={refresh}
                      shared={true}
                      previewImage={previewImage}
                    />
                  </div>
                )
              )}
            </div>
          )}
        </div>

        {/* Mobile item counter */}
        <div className="lg:hidden fixed bottom-4 right-4 bg-white/90 backdrop-blur-lg px-3 py-2 rounded-full shadow-md border border-gray-200">
          <span className="text-sm text-gray-600">
            {filteredContent.length} item
            {filteredContent.length !== 1 ? "s" : ""}
          </span>
        </div>
      </div>
    </div>
  );
}
