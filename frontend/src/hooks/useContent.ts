import axios from "axios";
import { useEffect, useState } from "react";
import { BACKEND_URL } from "../config";

export function useContent() {
  const [contents, setContents] = useState([]);

  async function getContent() {
    const token = localStorage.getItem("token");

    const res = await axios.get(`${BACKEND_URL}/content/get-all-content`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    setContents(res.data.data);
  }

  useEffect(() => {
    getContent();
  }, []);

  return contents;
}
