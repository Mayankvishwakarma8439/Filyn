import Sort from "@/components/Sort";
import { getFiles } from "@/lib/actions/files.actions";
import type { BackendFile } from "@/lib/backend/types";
import { convertFileSize, getFileTypesParams } from "@/lib/utils";
import React from "react";
import Card from "@/components/Card";
const sortFiles = (files: BackendFile[], sort: string) => {
  const [field, order] = sort.split("-");
  const direction = order === "asc" ? 1 : -1;

  return files.sort((a, b) => {
    if (field === "name") {
      return a.name.localeCompare(b.name) * direction;
    }

    if (field === "size") {
      return ((Number(a.size) || 0) - (Number(b.size) || 0)) * direction;
    }

    if (field === "$createdAt") {
      return (
        (new Date(a.$createdAt).getTime() - new Date(b.$createdAt).getTime()) *
        direction
      );
    }

    return 0;
  });
};

const page = async ({ params, searchParams }: SearchParamProps) => {
  const type = (await params)?.type as string | "";
  const query = await searchParams;
  const rawSort = query?.sort;
  const sort = (
    Array.isArray(rawSort) ? rawSort[0] : rawSort
  ) as string | undefined;
  const sortValue = sort || "$createdAt-desc";

  const files = await getFiles();
  const fileTypes = getFileTypesParams(type);
  const filteredFiles = files.documents.filter((file: BackendFile) =>
    fileTypes.includes(file.type)
  );
  const sortedFiles = sortFiles([...filteredFiles], sortValue);
  const totalSize = filteredFiles.reduce(
    (total: number, file: BackendFile) => total + (Number(file.size) || 0),
    0
  );
  return (
    <div className=" bg-gray-100 p-[40px] rounded-[40px] md:mr-5 h-[95%] ">
      <h1 className="capitalize text-4xl mb-2 text-light-100 font-bold">
        {type}
      </h1>
      <div className="flex justify-between">
        <div>
          <p>
            Total :{" "}
            <span className="font-semibold ">{convertFileSize(totalSize)}</span>
          </p>
        </div>
        <div className="flex items-center gap-2">
          <p className="text-gray-500 leading-none">Sort By :</p>
          <Sort sort={sortValue}></Sort>
        </div>
      </div>
      {sortedFiles.length > 0 ? (
        <section className="mt-10 grid sm:grid-cols-2  md:grid-cols-4 gap-10">
          {sortedFiles.map((file: BackendFile) => {
            return <Card key={file.$id} file={file}></Card>;
          })}
        </section>
      ) : (
        <div className="flex justify-center items-center text-gray-400 h-[80%]">
          No {type} uploaded
        </div>
      )}
    </div>
  );
};

export default page;
