import {
  constructFileUrl,
  convertFileSize,
  formatDateTime,
  getFileType,
} from "@/lib/utils";
import { MoreVertical } from "lucide-react";
import Link from "next/link";
import { Models } from "node-appwrite";
import React from "react";
import Thumbnail from "./Thumbnail";
import DropDown from "./DropDown";

const Card = ({ file }: { file: Models.Document }) => {
  const fileUrl = constructFileUrl(file.bucketFileId);
  const fileSize = convertFileSize(file.size);
  const fileName = file.name.slice(0, 20) + "...";
  const fileDate = formatDateTime(file.$updatedAt);
  const fileType = getFileType(file.name);
  return (
    <Link
      href={file.url}
      target="_blank"
      className="
    rounded-xl bg-white w-full md:w-[15vw] h-[20vh] p-1 cursor-pointer shadow-[0_0_25px_rgba(0,0,0,0.08)] hover:shadow-[0_0_45px_rgba(0,0,0,0.15)] hover:scale-[1.03] transition-all duration-300"
    >
      <div className="flex p-3 justify-between">
        <div className="h-[60px] w-[60px]  overflow-auto object-cover rounded-full">
          <img src={fileUrl} className="h-full w-full" />
        </div>
        <div className="flex flex-col items-end gap-2">
          <DropDown file={file}></DropDown>
          <p className="text-[15px]">{fileSize}</p>
        </div>
      </div>
      <div className="text-light-100 text-[14px] px-5">
        <p className=" font-semibold">{fileName}</p>
        <p>{fileDate}</p>
        <small>
          <p className="mt-2 text-gray-400">By : {file.owner.fullname}</p>
        </small>
      </div>
    </Link>
  );
};

export default Card;
