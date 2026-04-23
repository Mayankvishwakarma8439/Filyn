import Headers from "@/components/Headers";
import MobileNavigation from "@/components/MobileNavigation";
import Sidebar from "@/components/Sidebar";
import { getFiles } from "@/lib/actions/files.actions";
import { getCurrentUser } from "@/lib/actions/users.actions";
import { redirect } from "next/navigation";
import { ReactNode } from "react";
import { Toaster } from "sonner";

const layout = async ({ children }: { children: ReactNode }) => {
  const currentUser = await getCurrentUser();
  if (!currentUser) redirect("/signin");

  let searchableFiles: {
    $id: string;
    name: string;
    url: string;
    type: string;
    extension: string;
  }[] = [];

  try {
    const files = await getFiles();
    searchableFiles = (files.documents || []).map((file: any) => ({
      $id: file.$id,
      name: file.name,
      url: file.url,
      type: file.type,
      extension: file.extension,
    }));
  } catch (error) {
    console.log("Failed to load searchable files", error);
  }

  return (
    <main className="flex h-screen">
      <Sidebar
        fullname={currentUser.fullname}
        email={currentUser.email}
      ></Sidebar>
      <section className="flex h-full flex-1 flex-col">
        <div className="block md:hidden">
          <MobileNavigation
            fullname={currentUser.fullname}
            email={currentUser.email}
            userId={currentUser.$id}
            accountId={currentUser.accountId}
          ></MobileNavigation>{" "}
        </div>
        <div className="hidden md:block">
          <Headers
            userId={currentUser.$id}
            accountId={currentUser.accountId}
            searchableFiles={searchableFiles}
          ></Headers>
        </div>

        <div className="h-full">{children}</div>
        <Toaster></Toaster>
      </section>
    </main>
  );
};

export default layout;
