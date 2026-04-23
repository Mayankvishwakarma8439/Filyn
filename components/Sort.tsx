"use client";

import { sortTypes } from "@/constants";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Check, ChevronDown, SlidersHorizontal } from "lucide-react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import React from "react";

const Sort = ({ sort }: { sort: string }) => {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const activeSort =
    sortTypes.find((item) => item.value === sort) ?? sortTypes[0];

  const handleSortChange = (value: string) => {
    const params = new URLSearchParams(searchParams.toString());
    params.set("sort", value);
    router.push(`${pathname}?${params.toString()}`);
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <button className="inline-flex items-center gap-2 rounded-full bg-rose-500 px-4 py-2 text-sm font-medium text-white shadow-[0_8px_22px_rgba(244,63,94,0.35)] hover:bg-rose-600 transition-colors">
          <SlidersHorizontal size={14} />
          <span>{activeSort.label}</span>
          <ChevronDown size={14} />
        </button>
      </DropdownMenuTrigger>
      <DropdownMenuContent
        align="end"
        className="w-[250px] rounded-2xl border-rose-100 p-2 shadow-[0_15px_35px_rgba(0,0,0,0.12)]"
      >
        {sortTypes.map((option) => (
          <DropdownMenuItem
            key={option.value}
            onClick={() => handleSortChange(option.value)}
            className={`rounded-xl px-3 py-2 text-sm cursor-pointer ${
              option.value === sort
                ? "bg-rose-50 text-rose-600"
                : "text-light-100 hover:bg-gray-50"
            }`}
          >
            <span className="flex-1">{option.label}</span>
            {option.value === sort && <Check size={15} />}
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default Sort;
