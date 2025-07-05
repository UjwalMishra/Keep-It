import axios from "axios";
import { BACKEND_URL } from "../config";

import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import { Card } from "../components/ui/Card";
import Sidebar from "../components/Sidebar";
export default function SharedPage() {
  const [contents, setContents] = useState([]);

  const [type, setType] = useState("All");

  const { sharelink } = useParams();

  console.log(sharelink);

  async function getSharedItems() {
    const res = await axios.get(`${BACKEND_URL}/link/share/${sharelink}`);
    setContents(res.data.content);
  }

  useEffect(() => {
    getSharedItems();
  }, []);

  const filteredContent =
    type === "All"
      ? contents
      : contents.filter((content) => content.type === type);
  return (
    <div>
      {" "}
      <div className=" border-r border-gray-200 bg-white shadow-md fixed h-full">
        <Sidebar setType={setType} type={type} />
      </div>
      {filteredContent.length === 0 && (
        <div className="text-[32px] text-center font-semibold mt-8 capitalize">
          No Content found!
        </div>
      )}
      <div className="flex flex-wrap ml-72 gap-8 mt-8">
        {filteredContent.map(({ title, link, type }) => (
          <Card title={title} link={link} type={type} />
        ))}
      </div>
    </div>
  );
}
