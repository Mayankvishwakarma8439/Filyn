"use client";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import type { BackendFile } from "@/lib/backend/types";
import { deleteFile, getFileAccessUrl, renameFile } from "@/lib/actions/files.actions";
import { convertFileSize, formatDateTime } from "@/lib/utils";
import { MoreVertical } from "lucide-react";
import { usePathname, useRouter } from "next/navigation";
import { useState } from "react";
import { toast } from "sonner";

export default function DropdownMenuDemo({ file }: { file: BackendFile }) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [action, setAction] = useState("");
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [fileName, setFileName] = useState(file.name);
  const pathname = usePathname();
  const router = useRouter();
  const closeAllModals = () => {
    setIsDropdownOpen(false);
    setFileName(file.name);
    setAction("");
    setIsModalOpen(false);
  };

  const handleAction = async () => {
    try {
      setIsLoading(true);

      if (action === "Rename") {
        await renameFile({
          fileId: file.$id,
          name: fileName,
          path: pathname,
        });
        router.refresh();
        toast.success("File renamed");
      }

      if (action === "Delete") {
        await deleteFile({
          fileId: file.$id,
          path: pathname,
        });
        router.refresh();
        toast.success("File deleted");
      }

      if (action === "Share") {
        const shareUrl = await getFileAccessUrl({
          bucketFileId: file.bucketFileId,
          name: file.name,
        });

        if (navigator.share) {
          await navigator.share({
            title: file.name,
            text: `Open ${file.name}`,
            url: shareUrl,
          });
        } else {
          await navigator.clipboard.writeText(shareUrl);
          toast.success("Share link copied");
        }
      }

      closeAllModals();
    } catch (error) {
      console.log(error);
      toast.error(`Couldn't ${action.toLowerCase()} file`);
    } finally {
      setIsLoading(false);
    }
  };

  const handleDownload = async (event: React.MouseEvent) => {
    event.preventDefault();
    event.stopPropagation();

    try {
      const downloadUrl = await getFileAccessUrl({
        bucketFileId: file.bucketFileId,
        name: file.name,
        download: true,
      });
      window.open(downloadUrl, "_blank", "noopener,noreferrer");
    } catch (error) {
      console.log(error);
      toast.error("Couldn't download file");
    }
  };

  const dropdownItems = [
    { name: "Share", image: "./assets/icons/share.svg" },
    { name: "Rename", image: "./assets/icons/edit.svg" },
    { name: "Details", image: "./assets/icons/info.svg" },
    { name: "Download", image: "./assets/icons/download.svg" },
    { name: "Delete", image: "./assets/icons/delete.svg" },
  ];
  const renderDialogContent = () => {
    if (!action) return null;
    return (
      <Dialog
        open={isModalOpen}
        onOpenChange={(isOpen) => {
          if (!isOpen) closeAllModals();
          setIsModalOpen(isOpen);
        }}
      >
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>{action}</DialogTitle>
            <DialogDescription>
              {action === "Rename" && (
                <>Enter the new file name to rename it.</>
              )}
              {action === "Delete" && (
                <>Do you really want to delete the file?</>
              )}
              {action === "Share" && (
                <>Generate a secure link for this file and share it.</>
              )}
              {action === "Details" && (
                <>Inspect this file's metadata and storage details.</>
              )}
            </DialogDescription>
            {action === "Rename" && (
              <input
                value={fileName}
                onChange={(e) => setFileName(e.target.value)}
                className="w-full px-3 py-2 rounded-md border border-gray-300 bg-white text-gray-800 
             focus:outline-none focus:ring-2 focus:ring-rose-200 focus:border-rose-200
             placeholder-gray-400 shadow-sm"
                placeholder="Enter file name"
              />
            )}
            {action === "Share" && (
              <div className="rounded-xl border border-gray-200 bg-gray-50 p-3 text-sm text-gray-600">
                A time-limited secure link will be generated when you continue.
              </div>
            )}
            {action === "Details" && (
              <div className="grid gap-3 rounded-xl border border-gray-200 bg-gray-50 p-4 text-sm text-gray-700">
                <div className="flex items-center justify-between gap-4">
                  <span className="text-gray-500">Name</span>
                  <span className="max-w-[220px] truncate font-medium text-light-100">
                    {file.name}
                  </span>
                </div>
                <div className="flex items-center justify-between gap-4">
                  <span className="text-gray-500">Type</span>
                  <span className="font-medium capitalize text-light-100">
                    {file.type}
                  </span>
                </div>
                <div className="flex items-center justify-between gap-4">
                  <span className="text-gray-500">Size</span>
                  <span className="font-medium text-light-100">
                    {convertFileSize(file.size)}
                  </span>
                </div>
                <div className="flex items-center justify-between gap-4">
                  <span className="text-gray-500">Created</span>
                  <span className="font-medium text-light-100">
                    {formatDateTime(file.$createdAt)}
                  </span>
                </div>
                <div className="flex items-center justify-between gap-4">
                  <span className="text-gray-500">Updated</span>
                  <span className="font-medium text-light-100">
                    {formatDateTime(file.$updatedAt)}
                  </span>
                </div>
                <div className="flex items-center justify-between gap-4">
                  <span className="text-gray-500">Owner</span>
                  <span className="font-medium text-light-100">
                    {typeof file.owner === "string" ? "You" : file.owner.fullname}
                  </span>
                </div>
                <div className="flex items-center justify-between gap-4">
                  <span className="text-gray-500">Extension</span>
                  <span className="font-medium uppercase text-light-100">
                    {file.extension || "—"}
                  </span>
                </div>
              </div>
            )}
          </DialogHeader>
          {["Rename", "Share", "Delete"].includes(action) && (
            <DialogFooter>
              <button
                className=" bg-rose-500 flex justify-center items-center gap-3 text-white rounded-full mt-2 p-2 w-full"
                onClick={handleAction}
                disabled={isLoading}
              >
                <p>{action}</p>
                {isLoading && (
                  <div>
                    <img
                      src="./assets/icons/loader.svg"
                      width={20}
                      height={20}
                      className="animate-spin"
                    ></img>
                  </div>
                )}
              </button>
            </DialogFooter>
          )}
        </DialogContent>
      </Dialog>
    );
  };
  return (
    <>
      <DropdownMenu open={isDropdownOpen} onOpenChange={setIsDropdownOpen}>
        <DropdownMenuTrigger asChild>
          <button
            type="button"
            className="text-gray-400 mb-4"
            onClick={(event) => {
              event.preventDefault();
              event.stopPropagation();
            }}
          >
            <MoreVertical />
          </button>
        </DropdownMenuTrigger>
        <DropdownMenuContent className="w-56" align="start">
          <DropdownMenuLabel className="truncate">
            {file.name}
          </DropdownMenuLabel>
          <DropdownMenuSeparator></DropdownMenuSeparator>
          <DropdownMenuGroup>
            {dropdownItems.map((item, index) => {
              return (
                <DropdownMenuItem
                  key={index}
                  className=" data-[highlighted]:bg-gray-100 
     p-2 cursor-pointer flex items-center gap-3 justify-start rounded-[4px] w-full"
                  onClick={(event) => {
                    event.preventDefault();
                    event.stopPropagation();
                    setAction(item.name);
                    setIsDropdownOpen(false);
                    if (
                      ["Share", "Rename", "Details", "Delete"].includes(
                        item.name
                      )
                    )
                      setIsModalOpen(true);
                  }}
                >
                  {item.name === "Download" ? (
                    <button
                      type="button"
                      onClick={handleDownload}
                      className="flex items-center gap-2"
                    >
                      <img
                        src={item.image}
                        alt={item.name}
                        width={30}
                        height={30}
                      ></img>
                      {item.name}
                    </button>
                  ) : (
                    <div className="flex items-center gap-2">
                      <img
                        src={item.image}
                        alt={item.name}
                        width={30}
                        height={30}
                      ></img>
                      {item.name}
                    </div>
                  )}
                </DropdownMenuItem>
              );
            })}
          </DropdownMenuGroup>
        </DropdownMenuContent>
      </DropdownMenu>
      {renderDialogContent()}
    </>
  );
}
