import { Button } from "../components/ui/Button";
import { AddIcon } from "../icons/AddIcon";
import { ShareIcon } from "../icons/ShareIcon";
import { Card } from "../components/ui/Card";
import { CreateContentModal } from "../components/CreateContentModal";
import { useEffect, useState } from "react";
import Sidebar from "../components/Sidebar";
import { useContent } from "../hooks/useContent";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { BACKEND_URL, FRONTEND_URL } from "../config";
import copy from "copy-to-clipboard";
import { toast } from "react-hot-toast";
import { getDecodedToken } from "../utils/decode";
import UserIcon from "../icons/UserIcon";
import SearchContent from "../components/SearchContent";
import SearchIcon from "../icons/SearchIcon";
import LogoutIcon from "../icons/LogoutIcon";

export const Dashboard = () => {
  const [type, setType] = useState("All");
  const [modalOpen, setModalOpen] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [searchResults, setSearchResults] = useState<any[]>([]);
  const [searchParam, setSearchParam] = useState("");
  const navigate = useNavigate();
  const token = localStorage.getItem("token");

  useEffect(() => {
    if (!token) {
      navigate("/signin");
    }
  }, []);

  const user = getDecodedToken();
  let contents: any[] = [];
  let refresh = () => {};

  if (token) {
    const contentHook = useContent();
    contents = contentHook.contents;
    refresh = contentHook.refresh;
  }

  const filteredContent =
    type === "All"
      ? contents
      : contents.filter((content) => content.type === type);

  async function shareFxn() {
    const token = localStorage.getItem("token");
    const shareLink = await axios.post(
      `${BACKEND_URL}/link/share`,
      { share: true },
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
    copy(`${FRONTEND_URL}share/${shareLink.data.link}`);
    copy(`${FRONTEND_URL}share/${shareLink.data.link}`);

    toast.success("Link Copied!");
  }

  //search logic
  useEffect(() => {
    if (type !== "All") {
      setSearchResults([]);
    }
  }, [type]);

  let displayContent =
    searchResults.length > 0 ? searchResults : filteredContent;

  //@ts-ignore
  if (searchResults.length === 0 && searchParam !== "") {
    displayContent = [];
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-200 text-gray-900 relative font-sans">
      {/* Sidebar */}
      <Sidebar
        setType={setType}
        type={type}
        isOpen={sidebarOpen}
        onClose={() => setSidebarOpen(false)}
      />

      {/* Main content */}
      <div className="lg:ml-56 xl:ml-64 transition-all duration-300">
        {/* Modal */}
        <CreateContentModal
          open={modalOpen}
          onClose={() => setModalOpen(false)}
          refresh={refresh}
        />

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
              <UserIcon />
              {user ? user.username.split("@")[0] : "Not Logged In"}
            </h1>

            <Button
              variant="primary"
              text="Add"
              size="sm"
              onClick={() => setModalOpen(true)}
              startIcon={<AddIcon size="sm" />}
            />
          </div>
        </div>

        {/* Desktop Navbar */}
        <div className="hidden lg:block sticky top-0 bg-white/80 backdrop-blur-lg rounded-xl mx-4 xl:mx-6 mt-4 xl:mt-6 px-4 xl:px-6 py-4 shadow-md border border-gray-200 z-30">
          <div className="flex justify-between items-center">
            <h1 className="text-xl xl:text-2xl font-semibold tracking-tight text-gray-800 uppercase flex gap-3 xl:gap-4 items-center">
              <UserIcon />
              <div>
                {user ? `${user.username.split("@")[0]}` : `Not Logged In`}
              </div>
            </h1>

            {/* Buttons */}
            <div className="flex items-center gap-2 xl:gap-3">
              {/* Search */}
              <div className="flex justify-center items-center gap-2 relative">
                <SearchContent
                  refresh={refresh}
                  setSearchResults={setSearchResults}
                  setSearchParam={setSearchParam}
                />
                <div className="absolute right-0 pr-2">
                  <SearchIcon />
                </div>
              </div>
              <Button
                variant="primary"
                text="Add"
                size="md"
                onClick={() => setModalOpen(true)}
                startIcon={<AddIcon size="lg" />}
              />
              <Button
                variant="secondary"
                text="Share"
                size="md"
                onClick={shareFxn}
                startIcon={<ShareIcon size="lg" />}
              />
              <Button
                variant="secondary"
                text="Log out"
                size="md"
                onClick={() => {
                  localStorage.clear();
                  toast.success("Log out");
                  navigate("/signin");
                }}
                startIcon={<LogoutIcon />}
              />
            </div>
          </div>
        </div>

        {/* Mobile Action Bar */}
        <div className="lg:hidden sticky top-16 bg-white/90 backdrop-blur-lg mx-4 mt-4 px-4 py-3 rounded-xl shadow-sm border border-gray-200 z-20">
          <div className="flex items-center justify-between gap-3">
            {/* Search */}
            <div className="flex-1 flex justify-center items-center gap-2 relative max-w-xs">
              <SearchContent
                refresh={refresh}
                setSearchResults={setSearchResults}
                setSearchParam={setSearchParam}
              />
              <div className="absolute right-0 pr-2">
                <SearchIcon />
              </div>
            </div>

            {/* Action buttons */}
            <div className="flex items-center gap-2">
              <Button
                variant="secondary"
                text="Share"
                size="sm"
                onClick={shareFxn}
                startIcon={<ShareIcon size="sm" />}
              />
              <Button
                variant="secondary"
                text="Logout"
                size="sm"
                onClick={() => {
                  localStorage.clear();
                  navigate("/signin");
                }}
                startIcon={<LogoutIcon />}
              />
            </div>
          </div>
        </div>

        {/* Content Cards */}
        <div className="p-4 xl:p-6 mt-4 xl:mt-8">
          {displayContent?.length === 0 ? (
            <div className="text-2xl sm:text-3xl xl:text-4xl text-center font-semibold text-gray-600 mt-12">
              No Content found!
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3  gap-4 sm:gap-6 animate-fade-in">
              {displayContent?.map(
                ({ _id, title, link, type, tags, desc, previewImage }) => (
                  <div
                    key={_id}
                    className="transition-transform duration-300 transform hover:scale-[1.02]"
                  >
                    <Card
                      title={title}
                      link={link}
                      type={type}
                      id={_id}
                      tags={tags}
                      desc={desc}
                      refresh={refresh}
                      shared={false}
                      previewImage={previewImage}
                    />
                  </div>
                )
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
