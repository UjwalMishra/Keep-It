import { Button } from "../components/ui/Button";
import { AddIcon } from "../icons/AddIcon";
import { ShareIcon } from "../icons/ShareIcon";
import { Card } from "../components/ui/Card";
import { CreateContentModal } from "../components/CreateContentModal";
import { useEffect, useRef, useState } from "react";
import Sidebar from "../components/Sidebar";
import { useContent } from "../hooks/useContent";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { BACKEND_URL } from "../config";
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
  const [searchResults, setSearchResults] = useState<any[]>([]);
  const searchRef = useRef("");
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
    copy(`http://localhost:5173/share/${shareLink.data.link}`);
    toast("Copied!!!");
  }

  //search logic
  useEffect(() => {
    if (type !== "All") {
      setSearchResults([]);
    }
  }, [type]);

  let displayContent =
    searchResults.length > 0 ? searchResults : filteredContent;
  // console.log("display - ", displayContent);

  if (searchResults.length == 0 && searchRef.current.value != "") {
    displayContent = [];
  }
  console.log(searchResults);

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 text-gray-900 relative font-sans">
      {/* Sidebar */}
      <div className="border-r border-gray-200 bg-white shadow-md fixed h-full">
        <Sidebar setType={setType} type={type} />
      </div>

      {/* Main content */}
      <div className="ml-60 p-6">
        {/* Modal */}
        <CreateContentModal
          open={modalOpen}
          onClose={() => setModalOpen(false)}
          refresh={refresh}
        />

        {/* Navbar */}
        <div className="sticky top-0 bg-white/80 backdrop-blur-lg rounded-xl px-6 py-4 shadow-md flex justify-between items-center mb-8 border border-gray-200">
          <h1 className="text-2xl font-semibold tracking-tight text-gray-800 uppercase flex gap-4 items-center">
            <UserIcon />
            <div>
              {user ? `${user.username.split("@")[0]}` : `Not Logged In`}
            </div>
          </h1>

          {/* Buttons */}
          <div className="flex items-center gap-3">
            {/* Search */}
            <div className="flex justify-center items-center gap-2 relative">
              {" "}
              <SearchContent
                refresh={refresh}
                setSearchResults={setSearchResults}
                val={searchRef}
              />
              <div className=" absolute right-0 pr-2">
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
                navigate("/signin");
              }}
              startIcon={<LogoutIcon />}
            />
          </div>
        </div>

        {/* Content Cards */}
        {displayContent.length === 0 ? (
          <div className="text-[32px] text-center font-semibold">
            No Content found!
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 animate-fade-in">
            {displayContent.map(({ _id, title, link, type, tags, desc }) => (
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
                />
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
