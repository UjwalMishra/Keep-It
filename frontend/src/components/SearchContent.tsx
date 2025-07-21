import axios from "axios";

const SearchContent = ({ setSearchResults, val, refresh }) => {
  async function filterHandler(e) {
    const filter = e.target.value;
    console.log(filter);

    if (!filter) {
      setSearchResults([]);
      refresh();
      return;
    }

    try {
      const token = localStorage.getItem("token");

      const contentData = await axios.get(
        `http://localhost:3000/api/v1/content/get-content?query=${filter}`,
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
        ref={val}
        className=" w-[250px] px-3 py-1 border rounded-xl"
        placeholder="Search..."
        onChange={filterHandler}
      />
    </div>
  );
};

export default SearchContent;
