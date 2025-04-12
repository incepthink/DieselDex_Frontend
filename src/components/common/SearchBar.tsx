"use client";

import React from "react";
import { IoSearch } from "react-icons/io5";

type Props = {
  onClick: () => void;
};

const SearchBar: React.FC<Props> = ({ onClick }) => {
  return (
    <div
      className="flex items-center bg-white/20 backdrop-blur-2xl rounded-full p-1.5 px-2 gap-2 w-full cursor-pointer text-white text-sm lg:text-base hover:bg-white/30 transition"
      onClick={onClick}
    >
      <IoSearch size={18} />
      <p className="truncate">Search Pools</p>
    </div>
  );
};

export default SearchBar;
