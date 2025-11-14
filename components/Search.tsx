import React from "react";

const Search = () => {
  return (
    <div
      className="rounded-full ml-5 h-[50px] p-4 gap-4  bg-white shadow-[0_2px_10px_rgba(0,0,0,0.05),0_0_20px_rgba(93,90,255,0.05)]
 flex items-center w-[40%] "
    >
      <div>
        <img src="./assets/icons/search.svg" alt="" />
      </div>
      <div>
        <input
          type="text"
          placeholder="Search..."
          className="focus:outline-none"
        />
      </div>
    </div>
  );
};

export default Search;
