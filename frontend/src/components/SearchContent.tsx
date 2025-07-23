import axios from "axios";
import { BACKEND_URL } from "../config";

const SearchContent = ({
  setSearchResults,
  setSearchParam,
  refresh,
}: {
  setSearchResults: any;
  setSearchParam: any;
  refresh: () => void;
}) => {
  async function filterHandler(e: React.ChangeEvent<HTMLInputElement>) {
    const filter = e.target.value;
    setSearchParam(filter);

    if (!filter) {
      setSearchResults([]);
      refresh();
      return;
    }

    try {
      const token = localStorage.getItem("token");

      const contentData = await axios.get(
        `${BACKEND_URL}/content/get-content?query=${filter}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setSearchResults(contentData.data.content);
    } catch (err) {
      console.error("Error fetching content:", err);
      setSearchResults([]);
    }
  }

  return (
    <div>
      <input
        className="w-full sm:w-[150px] md:w-[250px] lg:w-[300px] px-3 py-1 border rounded-xl "
        placeholder="Search..."
        onChange={filterHandler}
      />
    </div>
  );
};

export default SearchContent;
