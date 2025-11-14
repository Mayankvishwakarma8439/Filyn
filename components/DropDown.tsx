"use client";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuPortal,
  DropdownMenuSeparator,
  DropdownMenuShortcut,
  DropdownMenuSub,
  DropdownMenuSubContent,
  DropdownMenuSubTrigger,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { constructDownloadUrl } from "@/lib/utils";
import { MoreVertical } from "lucide-react";
import Link from "next/link";
import { Models } from "node-appwrite";
import { useState } from "react";

export default function DropdownMenuDemo({ file }: { file: Models.Document }) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [action, setAction] = useState("");
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [fileName, setFileName] = useState(file.name);
  const closeAllModals = () => {
    setIsDropdownOpen(false);
    setFileName(file.name);
    setAction("");
    setIsModalOpen(false);
  };
  //TODO : IMPLEMENT HANDLE ACTION FUNCTION FOR HANDLING SHARE , DELETE AND RENAME FUNCTIONALITIES:
  const handleAction = async () => {};

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
              {action === "Share" && <>Click to share File</>}
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
          </DialogHeader>
          {["Rename", "Share", "Delete"].includes(action) && (
            <DialogFooter>
              <button
                className=" bg-rose-500 flex justify-center items-center gap-3 text-white rounded-full mt-2 p-2 w-full"
                onClick={() => {
                  handleAction;
                }}
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
          <MoreVertical className="text-gray-400 mb-4"></MoreVertical>
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
                  onClick={() => {
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
                    <Link
                      href={constructDownloadUrl(file.bucketFileId)}
                      download={file.name}
                      className="flex items-center gap-2"
                    >
                      <img
                        src={item.image}
                        alt={item.name}
                        width={30}
                        height={30}
                      ></img>
                      {item.name}
                    </Link>
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
