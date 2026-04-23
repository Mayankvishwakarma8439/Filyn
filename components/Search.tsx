 "use client";

import { getFileIcon } from "@/lib/utils";
import Link from "next/link";
import React, { useMemo, useState } from "react";

const Search = ({
  files,
}: {
  files: {
    $id: string;
    name: string;
    url: string;
    type: string;
    extension: string;
  }[];
}) => {
  const [query, setQuery] = useState("");
  const [showResults, setShowResults] = useState(false);

  const matchedFiles = useMemo(() => {
    const searchText = query.trim().toLowerCase();
    if (!searchText) return [];

    return files
      .filter((file) => file.name.toLowerCase().includes(searchText))
      .slice(0, 7);
  }, [files, query]);

  return (
    <div className="relative ml-5 w-[44%]">
      <div className="rounded-full h-[50px] p-4 gap-4 bg-white shadow-[0_2px_10px_rgba(0,0,0,0.05),0_0_20px_rgba(244,63,94,0.08)] flex items-center">
        <img src="./assets/icons/search.svg" alt="Search" />
        <input
          type="text"
          placeholder="Search files..."
          value={query}
          onChange={(e) => {
            setQuery(e.target.value);
            setShowResults(true);
          }}
          onFocus={() => setShowResults(true)}
          onBlur={() => setTimeout(() => setShowResults(false), 140)}
          className="w-full bg-transparent text-sm text-light-100 placeholder:text-gray-400 focus:outline-none"
        />
      </div>

      {showResults && query.trim() && (
        <div className="absolute z-50 mt-3 w-full rounded-2xl border border-rose-100 bg-white p-2 shadow-[0_14px_36px_rgba(0,0,0,0.14)]">
          {matchedFiles.length > 0 ? (
            matchedFiles.map((file) => (
              <Link
                key={file.$id}
                href={file.url}
                target="_blank"
                className="flex items-center gap-3 rounded-xl px-3 py-2 hover:bg-rose-50 transition-colors"
              >
                <img
                  src={getFileIcon(file.extension, file.type)}
                  alt={file.type}
                  className="h-7 w-7"
                />
                <p className="text-sm text-light-100 truncate">{file.name}</p>
              </Link>
            ))
          ) : (
            <p className="px-3 py-2 text-sm text-gray-500">No files found</p>
          )}
        </div>
      )}
    </div>
  );
};

export default Search;
