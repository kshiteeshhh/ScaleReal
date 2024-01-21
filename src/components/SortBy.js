import React from "react";
import CloseIcon from "@mui/icons-material/Close";

const SortBy = ({ movies, setMovies, onClose }) => {
  const sortFn = (type) => {
    console.log("clicked");
    let sortedData;
    if (type === "episode") {
      sortedData = movies.sort((a, b) => {
        return a.episode_id - b.episode_id;
      });
    } else {
      sortedData = movies.sort((a, b) => {
        let year1 = Number(a.release_date.split("-")[0]);
        let year2 = Number(b.release_date.split("-")[0]);
        return year1 - year2;
      });
    }
    setMovies(sortedData);
    onClose();
  };
  return (
    <div className="absolute top-14 left-4 w-[15rem] h-[15rem] bg-[#fafafa] border-2 z-10 rounded-md flex flex-col">
      <div className="flex justify-between border-b py-2 px-1">
        <p className="font-georgia text-[1rem]">Sort By</p>
        <CloseIcon className="cursor-pointer" onClick={onClose} />
      </div>
      <div className="flex flex-col text-[0.9rem]">
        <button
          className="border-b text-start p-2"
          onClick={() => sortFn("episode")}
        >
          Episode
        </button>
        <button
          className="border-b text-start p-2"
          onClick={() => sortFn("year")}
        >
          Year
        </button>
      </div>
    </div>
  );
};

export default SortBy;
