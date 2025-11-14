"use client";
import React from "react";
import Search from "./Search";
import Uploader from "./Uploader";
import { clearUserSession } from "@/lib/actions/users.actions";
const Headers = ({
  userId,
  accountId,
}: {
  userId: string;
  accountId: string;
}) => {
  const handleLogout = async () => {
    try {
      await clearUserSession();
    } catch (error) {
      alert("Error Occurred while logging out");
    }
  };
  return (
    <div className="h-[90px] flex justify-between w-full items-center pr-5 mb-3 mt-3">
      <Search></Search>
      <div className="flex justify-center items-center gap-8">
        <Uploader ownerId={userId} accountId={accountId}></Uploader>
        <div
          className="w-[50px] h-[50px] rounded-[50%] bg-rose-100 flex items-center justify-center cursor-pointer hover:bg-rose-200"
          onClick={handleLogout}
        >
          <img src="./assets/icons/logout.svg" alt="" />
        </div>
      </div>
    </div>
  );
};

export default Headers;
