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
import { BACKEND_URL } from "../config";
import copy from "copy-to-clipboard";
import { toast } from "react-hot-toast";

export const Dashboard = () => {
  const [type, setType] = useState("All");
  const [modalOpen, setModalOpen] = useState(false);

  const navigate = useNavigate();
  const token = localStorage.getItem("token");

  useEffect(() => {
    if (!token) {
      navigate("/signin");
    }
  }, []);

  let contents: any[] = [];
  if (token) {
    contents = useContent();
  }

  console.log(type);

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
          Authorization: `Bearer ${token} `,
        },
      }
    );
    copy(`http://localhost:5173/api/v1/link/share/${shareLink.data.link}`);
    toast("Copied!!!");
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 text-gray-900 relative font-sans">
      {/* Sidebar */}
      <div className=" border-r border-gray-200 bg-white shadow-md fixed h-full">
        <Sidebar setType={setType} />
      </div>

      {/* Main content */}
      <div className="ml-60 p-6">
        {/* Modal */}
        <CreateContentModal
          open={modalOpen}
          onClose={() => setModalOpen(false)}
        />

        {/* Navbar */}
        <div className="sticky top-0  bg-white/80 backdrop-blur-lg rounded-xl px-6 py-4 shadow-md flex justify-between items-center mb-8 border border-gray-200">
          <h1 className="text-3xl font-extrabold tracking-tight text-gray-800">
            📌 Keep-It
          </h1>
          <div className="flex items-center gap-3">
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
              text="Logout"
              size="md"
              onClick={() => {
                localStorage.clear();
                navigate("/signin");
              }}
            />
          </div>
        </div>

        {/* Cards grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 animate-fade-in ">
          {filteredContent.map(({ title, link, type }, index) => (
            <div
              key={index}
              className="transition-transform duration-300 transform hover:scale-[1.02] "
            >
              <Card title={title} link={link} type={type} />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
