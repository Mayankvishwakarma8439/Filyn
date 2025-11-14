"use client";
import { convertFileToUrl, getFileType } from "@/lib/utils";
import React, { useCallback, useState } from "react";
import { useDropzone } from "react-dropzone";
import Thumbnail from "./Thumbnail";
import { MAX_FILE_SIZE } from "@/constants";
import { toast } from "sonner";
import { usePathname } from "next/navigation";
import { uploadFile } from "@/lib/actions/files.actions";
function MyDropzone({
  ownerId,
  accountId,
}: {
  ownerId: string;
  accountId: string;
}) {
  const [files, setFiles] = useState<File[]>([]);
  const path = usePathname();
  const onDrop = useCallback(
    async (acceptedFiles: File[]) => {
      // Do something with the files
      setFiles(acceptedFiles);
      const uploadPromises = acceptedFiles.map(async (file) => {
        if (file.size > MAX_FILE_SIZE) {
          setFiles((prevFiles) =>
            prevFiles.filter((f) => f.name !== file.name)
          );
          toast(
            <p className="bg-red p-2 text-white">
              <span className="font-semibold">{file.name}</span> is too large.
              Max file size is 50MB.
            </p>
          );
          return;
        }
        return uploadFile({ file, ownerId, accountId, path }).then(
          (uploadedFile) => {
            if (uploadedFile) {
              setFiles((prevFiles) =>
                prevFiles.filter((f) => f.name !== file.name)
              );
            }
          }
        );
      });
      await Promise.all(uploadPromises);
    },
    [accountId, ownerId, path]
  );
  const { getRootProps, getInputProps, isDragActive } = useDropzone({ onDrop });

  const handleRemoveFile = (
    //INCORRECT IMPLEMENTATION : FILES GET UPLOADED EVEN AFTER CLICKING REMOVE
    e: React.MouseEvent<HTMLImageElement>,
    fileName: string
  ) => {
    e.stopPropagation();
    setFiles((prevFiles) =>
      prevFiles.filter((file) => {
        return file.name !== fileName;
      })
    );
  };
  return (
    <div {...getRootProps()}>
      <input {...getInputProps()} />
      <div className=" h-[50px] w-[150px] bg-rose-500 rounded-full text-white flex justify-center items-center gap-2 hover:bg-rose-600 cursor-pointer">
        <img src="./assets/icons/upload.svg" alt="" />
        Upload
      </div>
      {files.length > 0 && (
        <ul>
          {/* Floating toasts container */}
          <div className="fixed top-10 right-10 flex flex-col gap-2 z-50">
            {files.map((file, index) => {
              const { type, extension } = getFileType(file.name);
              return (
                <div
                  key={`${file.name}-${index}`}
                  className="rounded-xl p-4 bg-white border-gray-500 shadow-md"
                >
                  {" "}
                  <h4 className="m-2 text-light-100">Uploading...</h4>
                  <div className="flex h-[50px] items-center gap-3 border border-white/20 rounded-md p-3 shadow-lg w-72">
                    <Thumbnail
                      type={type}
                      extension={extension}
                      url={convertFileToUrl(file)}
                    />
                    <div className="flex-1 truncate">
                      <p className="text-light-100 font-medium truncate">
                        {file.name}
                      </p>
                      <img src="./assets/icons/file-loader.gif" alt="Loader" />
                    </div>
                    <img
                      src="./assets/icons/remove.svg"
                      alt="remove"
                      className="w-6 h-6 cursor-pointer hover:scale-110 transition"
                      onClick={(e) => handleRemoveFile(e, file.name)}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </ul>
      )}
    </div>
  );
}
export default MyDropzone;
