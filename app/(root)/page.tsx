export const dynamic = "force-dynamic";
import Dashboard from "@/components/Dashboard";
import { getFiles } from "@/lib/actions/files.actions";
import React from "react";

const page = async () => {
  const files = await getFiles();
  return <Dashboard files={files} />;
};

export default page;
