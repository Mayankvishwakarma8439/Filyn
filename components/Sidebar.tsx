"use client";
import {
  Home,
  FileText,
  Image,
  Video,
  MoreHorizontal,
  LogOut,
} from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";

const navItems = [
  { label: "Dashboard", icon: Home, url: "/" },
  { label: "Documents", icon: FileText, url: "/documents" },
  { label: "Images", icon: Image, url: "/images" },
  { label: "Media", icon: Video, url: "/media" },
  { label: "Others", icon: MoreHorizontal, url: "/others" },
];

export default function Sidebar({
  fullname,
  email,
}: {
  fullname: string;
  email: string;
}) {
  const pathname = usePathname();
  return (
    <aside className="hidden md:flex flex-col justify-between w-[100px] lg:w-[20%] h-screen bg-white  rounded-r-2xl p-5">
      <div>
        <div className="flex items-center gap-2 mb-10">
          <img src="./assets/icons/logo-brand.svg" className="w-10" alt="" />
          <Link href={"/"}>
            <h1 className="text-2xl ml-2 font-bold text-rose-500 hidden lg:inline">
              Filyn
            </h1>
          </Link>
        </div>
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
            >
              <item.icon size={20} />
              <span className="hidden lg:inline">{item.label}</span>
            </Link>
          ))}
        </nav>
      </div>

      <div className="mt-6">
        <div className="bg-rose-50 rounded-xl p-4 mb-5">
          <img
            src="./assets/images/files-2.png"
            alt="files"
            className="w-full transition-all hover:rotate-2 hover:scale-110"
          />
        </div>

        <div className="flex items-center gap-3 bg-gray-50 rounded-xl p-3">
          <img
            src="./assets/images/avatar.png"
            alt="User avatar"
            className="w-10 h-10 rounded-full"
          />
          <div className="overflow-hidden">
            <p className="text-sm font-semibold text-gray-800">{fullname}</p>
            <p className="text-xs text-gray-500">{email}</p>
          </div>
        </div>
      </div>
    </aside>
  );
}
