import { getFileIcon } from "@/lib/utils";
import React from "react";

const Thumbnail = ({
  type,
  extension,
  url,
  className,
  imageClassName,
}: {
  type: string;
  extension: string;
  url?: string;
  className?: string;
  imageClassName?: string;
}) => {
  const isImage = type === "image" && extension !== "svg";
  return (
    <figure className={className}>
      <img
        src={isImage ? url : getFileIcon(extension, type)}
        alt="Thumbnail"
        width={100}
        height={100}
        className={`size-8 object-cover rounded-full ${imageClassName || ""}`}
      />
      <div></div>
    </figure>
  );
};

export default Thumbnail;
