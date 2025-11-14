import Headers from "@/components/Headers";
import MobileNavigation from "@/components/MobileNavigation";
import Sidebar from "@/components/Sidebar";
import { getCurrentUser } from "@/lib/actions/users.actions";
import { redirect } from "next/navigation";
import { ReactNode } from "react";
import { Toaster } from "sonner";

const layout = async ({ children }: { children: ReactNode }) => {
  const currentUser = await getCurrentUser();
  if (!currentUser) redirect("/signin");
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
          ></Headers>
        </div>

        <div className="h-full">{children}</div>
        <Toaster></Toaster>
      </section>
    </main>
  );
};

export default layout;
