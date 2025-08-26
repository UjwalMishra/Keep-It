import axios from "axios";
import { useEffect, useState } from "react";
import { BACKEND_URL } from "../config";

export function useContent() {
  const [loading, setLoading] = useState(true);
  const [contents, setContents] = useState([]);

  async function getContent() {
    setLoading(true);
    const token = localStorage.getItem("token");
    try {
      const res = await axios.get(`${BACKEND_URL}/content/get-all-content`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setContents(res.data.data);
    } catch (error) {
      console.error("Failed to fetch content:", error);
      setContents([]);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    getContent();
  }, []);

  return { contents, loading, refresh: getContent };
}
