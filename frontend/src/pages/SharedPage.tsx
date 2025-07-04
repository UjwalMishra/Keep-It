import axios from "axios";
import { BACKEND_URL } from "../config";

import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import { Card } from "../components/ui/Card";
export default function SharedPage() {
  const [contents, setContents] = useState([]);

  const { sharelink } = useParams();

  console.log(sharelink);

  async function getSharedItems() {
    const res = await axios.get(`${BACKEND_URL}/link/share/ }`);
    setContents(res.data.content);
  }

  useEffect(() => {
    getSharedItems();
  }, []);

  return (
    <div className="flex flex-wrap">
      {contents.map(({ title, link, type }) => (
        <Card title={title} link={link} type={type} />
      ))}
    </div>
  );
}
