import React, { useState, useEffect, useRef } from "react";
import { useSnackbar } from "notistack";
import axios from "axios";
import SortBy from "./SortBy";
import "../components/Landing.css";
import SearchIcon from "@mui/icons-material/Search";
import { Grid } from "@mui/material";
const Landing = () => {
  const divRefs = useRef({});
  const { enqueueSnackbar } = useSnackbar();
  const [displayView, setDisplayView] = useState(false);
  const [selected, setSelected] = useState(0);
  const [movies, setMovies] = useState([]);
  const [filteredMovies, setFilteredMovies] = useState([]);
  const [sortby, setSortBy] = useState(false);
  const [debounceTimer, setDebounceTimer] = useState(0);
  const [focusedMovie, setFocusedMovie] = useState(null);

  const performSearch = (text) => {
    const newData = movies.filter((ele) =>
      ele.title.toLowerCase().includes(text.toLowerCase())
    );
    setFilteredMovies(newData);
  };

  const handleView = (episode_id) => {
    if (selected !== episode_id) {
      setDisplayView(true);
      setSelected(episode_id);
      setFocusedMovie(episode_id);
    } else {
      setDisplayView(!displayView);
      setSelected(0);
      setFocusedMovie(null);
    }
  };
  const handleSortby = () => {
    setSortBy(!sortby);
  };
  const debounceSearch = (event, debounceTimeout) => {
    if (debounceTimeout !== 0) {
      clearTimeout(debounceTimeout);
    }
    let text = event.target.value;
    let newTimer = setTimeout(() => {
      performSearch(text);
    }, 500);
    setDebounceTimer(newTimer);
  };
  const RomanizeFn = (num) => {
    var lookup = {
        M: 1000,
        CM: 900,
        D: 500,
        CD: 400,
        C: 100,
        XC: 90,
        L: 50,
        XL: 40,
        X: 10,
        IX: 9,
        V: 5,
        IV: 4,
        I: 1,
      },
      roman = "",
      i;
    for (i in lookup) {
      while (num >= lookup[i]) {
        roman += i;
        num -= lookup[i];
      }
    }
    return roman;
  };
  const performApiCall = async () => {
    try {
      const resp = await axios.get("https://swapi.dev/api/films");
      const Data = resp.data.results;
      setMovies(Data);
      setFilteredMovies(Data);
    } catch (e) {
      let obj = e.response;
      enqueueSnackbar(obj.data.message, { variant: "error" });
    }
  };
  useEffect(() => {
    performApiCall();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  return (
    <div className="flex flex-col font-georgia relative">
      <div className="bg-[#d7d9d8] h-[4rem] p-4 flex justify-start z-20">
        <div className=" w-[7%] flex flex-col">
          <button
            className="bg-[#e8edec] h-[2rem] rounded-md text-[#5b5c5c] border"
            onClick={handleSortby}
          >
            Sort By...
          </button>
        </div>
        <div className="flex ml-7">
          <div className="bg-[white] h-[2rem]rounded-tl-md rounded-bl-md px-2">
            <SearchIcon />
          </div>
          <input
            type="text"
            className="bg-[white] focus:outline-none h-[2rem] w-[65rem] rounded-tr-md rounded-br-md"
            placeholder="Type to Search"
            onChange={(event) => {
              debounceSearch(event, debounceTimer);
            }}
          ></input>
        </div>
        {sortby && (
          <SortBy
            movies={filteredMovies}
            setMovies={setFilteredMovies}
            onClose={() => setSortBy(false)}
          />
        )}
      </div>
      <div className="h-[100vh]">
        <Grid container className="h-[100vh]">
          <Grid item xs={12} md={12} lg={6} className="p-3 border-r">
            {filteredMovies.map((ele) => {
              if (!divRefs.current[ele.episode_id]) {
                divRefs.current[ele.episode_id] = React.createRef();
              }
              const isFocused = focusedMovie === ele.episode_id;
              return (
                <div
                  className={`flex justify-between rounded-md items-center h-[3rem] border-b cursor-pointer ${
                    isFocused ? "focused-bg" : ""
                  }`}
                  onClick={() => handleView(ele.episode_id)}
                >
                  <div className="flex ml-1">
                    <p className="text-[#8a8988] text-[0.7rem] my-auto tracking-widest">
                      EPISODE {ele.episode_id}
                    </p>
                    <p className="text-[#5b5c5c] ml-4 text-[1rem] font-medium my-auto">
                      EPISODE {RomanizeFn(ele.episode_id)} - {ele.title}
                    </p>
                  </div>
                  <p className="text-[#8a8988] text-[0.9rem] my-auto items-center p-2">
                    {ele.release_date}
                  </p>
                </div>
              );
            })}
          </Grid>
          <Grid
            item
            xs={12}
            md={6}
            className={`p-3 font-georgia flex h-full ${
              displayView
                ? "items-start justify-start"
                : "items-center justify-center"
            }`}
          >
            {!displayView && (
              <div className=" text-[1.1rem] font-medium">
                No movie selected
              </div>
            )}
            {displayView && (
              <div className="">
                {filteredMovies.map((ele) => {
                  if (Number(ele.episode_id) === selected) {
                    return (
                      <div className="flex flex-col p-2">
                        <h1 className="text-[2.3rem] text-[#2a2b2b] mb-3">
                          Episode {RomanizeFn(ele.episode_id)} - {ele.title}
                        </h1>
                        <p className="text-[0.9rem] text-[#8a8988] font-serif mb-2 tracking-wider leading-5">
                          {ele.opening_crawl}
                        </p>
                        <p className="text-[#8a8988] font-serif">
                          Directed by : {ele.director}
                        </p>
                      </div>
                    );
                  } else {
                    return null;
                  }
                })}
              </div>
            )}
          </Grid>
        </Grid>
      </div>
    </div>
  );
};

export default Landing;
