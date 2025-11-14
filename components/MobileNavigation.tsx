"use client";
import React, { useState } from "react";

import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import {
  FileText,
  Home,
  Image,
  Menu,
  MoreHorizontal,
  Video,
} from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import Uploader from "./Uploader";
import { clearUserSession } from "@/lib/actions/users.actions";

const MobileNavigation = ({
  fullname,
  email,
  userId,
  accountId,
}: {
  fullname: string;
  email: string;
  userId: string;
  accountId: string;
}) => {
  const [open, setOpen] = useState(false);
  const navItems = [
    { label: "Dashboard", icon: Home, url: "/" },
    { label: "Documents", icon: FileText, url: "/documents" },
    { label: "Images", icon: Image, url: "/images" },
    { label: "Media", icon: Video, url: "/media" },
    { label: "Others", icon: MoreHorizontal, url: "/others" },
  ];
  const handleLogout = async () => {
    try {
      await clearUserSession();
    } catch (error) {
      alert("Error Occurred while logging out");
    }
  };
  const pathname = usePathname();
  return (
    <div className="p-3">
      {" "}
      <Sheet open={open} onOpenChange={setOpen}>
        <div className="flex justify-between px-3">
          {" "}
          <div className="flex items-center gap-3 ">
            <img src="./assets/icons/logo-brand.svg" className="w-10" alt="" />
            <Link href={"/"}>
              <h1 className="text-2xl font-bold text-rose-500 ">Filyn</h1>
            </Link>
          </div>
          <div className="flex justify-center items-center cursor-pointer">
            {" "}
            <SheetTrigger asChild>
              <Menu className="text-light-100"></Menu>
            </SheetTrigger>
          </div>
        </div>

        {/* Sheet Content */}
        <SheetContent className="bg-white space-y-5 ">
          <SheetHeader>
            <SheetTitle>
              <div className="flex items-center gap-4">
                <img src="./assets/images/avatar.png" width={60} alt="" />
                <div className="overflow-hidden">
                  <p className="font-semibold text-light-100">{fullname}</p>
                  <p className="text-sm text-gray-600">{email}</p>
                </div>
              </div>
            </SheetTitle>
            <SheetDescription></SheetDescription>
          </SheetHeader>
          <nav className="flex flex-col gap-3">
            {navItems.map((item, index) => (
              <Link
                key={index}
                href={item.url}
                className={`flex items-center gap-3 py-3 px-4 rounded-xl text-gray-700 font-medium hover:bg-rose-100 transition-all ${
                  pathname === item.url
                    ? "bg-rose-500 text-white shadow-md hover:!bg-rose-500"
                    : ""
                }`}
                onClick={() => setOpen(false)}
              >
                <item.icon size={20} />
                <span>{item.label}</span>
              </Link>
            ))}
            <Uploader ownerId={userId} accountId={accountId}></Uploader>
          </nav>
          <SheetFooter>
            <button
              className="w-full rounded-full flex justify-center gap-3 items-center bg-rose-100 text-red font-semibold p-4"
              onClick={handleLogout}
            >
              <img src="./assets/icons/logout.svg" alt="" />
              Logout
            </button>
          </SheetFooter>
        </SheetContent>
      </Sheet>
    </div>
  );
};

export default MobileNavigation;
