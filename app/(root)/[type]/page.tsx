import Sort from "@/components/Sort";
import { getFiles } from "@/lib/actions/files.actions";
import React from "react";
import { Models } from "node-appwrite";
import Card from "@/components/Card";
const page = async ({ params }: SearchParamProps) => {
  const type = (await params)?.type as string | "";
  const files = await getFiles();
  return (
    <div className=" bg-gray-100 p-[40px] rounded-[40px] md:mr-5 h-[95%] ">
      <h1 className="capitalize text-4xl mb-2 text-light-100 font-bold">
        {type}
      </h1>
      <div className="flex justify-between">
        <div>
          <p>
            Total : <span className="font-semibold ">0 MB</span>
          </p>
        </div>
        <div className="flex ">
          <p className="text-gray-500"> Sort By :&nbsp; </p>
          <Sort></Sort>
        </div>
      </div>
      {files.total > 0 ? (
        <section className="mt-10 grid sm:grid-cols-2  md:grid-cols-4 gap-10">
          {files.documents.map((file: Models.Document) => {
            return <Card key={file.$id} file={file}></Card>;
          })}
        </section>
      ) : (
        <div className="flex justify-center items-center text-gray-400 h-[80%]">
          No Files Uploaded
        </div>
      )}
    </div>
  );
};

export default page;
