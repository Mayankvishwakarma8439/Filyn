import { convertFileSize, formatDateTime, getUsageSummary } from "@/lib/utils";
import type { BackendFile, DocumentList } from "@/lib/backend/types";
import Link from "next/link";
import Thumbnail from "./Thumbnail";

const Dashboard = ({ files }: { files: DocumentList<BackendFile> }) => {
  const allFiles = files.documents ?? [];

  const totalSpace = allFiles.reduce(
    (acc, file) => {
      const size = Number(file.size) || 0;
      const updatedAt = file.$updatedAt || file.$createdAt || "";
      const type = file.type as FileType;

      if (type in acc) {
        acc[type].size += size;
        acc[type].count += 1;
        if (!acc[type].latestDate || updatedAt > acc[type].latestDate) {
          acc[type].latestDate = updatedAt;
        }
      }

      return acc;
    },
    {
      document: { size: 0, count: 0, latestDate: "" },
      image: { size: 0, count: 0, latestDate: "" },
      video: { size: 0, count: 0, latestDate: "" },
      audio: { size: 0, count: 0, latestDate: "" },
      other: { size: 0, count: 0, latestDate: "" },
    }
  );

  const usageCards = getUsageSummary(totalSpace);
  const totalUsedSpace = allFiles.reduce(
    (total, file) => total + (Number(file.size) || 0),
    0
  );
  const storageLimit = 2 * 1024 * 1024 * 1024;
  const usedPercent = Math.min((totalUsedSpace / storageLimit) * 100, 100);
  const leftPercent = Math.max(100 - usedPercent, 0);

  const usageScale =
    totalUsedSpace > storageLimit ? storageLimit / totalUsedSpace : 1;
  const documentPercent =
    ((totalSpace.document.size * usageScale) / storageLimit) * 100;
  const imagePercent = ((totalSpace.image.size * usageScale) / storageLimit) * 100;
  const mediaPercent =
    (((totalSpace.video.size + totalSpace.audio.size) * usageScale) / storageLimit) *
    100;
  const otherPercent = ((totalSpace.other.size * usageScale) / storageLimit) * 100;

  const documentEnd = documentPercent;
  const imageEnd = documentEnd + imagePercent;
  const mediaEnd = imageEnd + mediaPercent;
  const otherEnd = mediaEnd + otherPercent;

  const recentFiles = [...allFiles]
    .sort((a, b) =>
      new Date(b.$updatedAt || b.$createdAt).getTime() -
      new Date(a.$updatedAt || a.$createdAt).getTime()
    )
    .slice(0, 6);

  const typeCountMap = {
    Documents: totalSpace.document.count,
    Images: totalSpace.image.count,
    Media: totalSpace.video.count + totalSpace.audio.count,
    Others: totalSpace.other.count,
  };

  return (
    <div className="bg-gray-100 p-[28px] md:p-[40px] rounded-[40px] md:mr-5 h-[95%] overflow-y-auto">
      <h1 className="text-4xl font-bold text-light-100">Dashboard</h1>
      <p className="text-gray-500 mt-1">
        Track your uploads and jump into recent files quickly.
      </p>

      <section className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {usageCards.map((item) => (
          <Link
            key={item.title}
            href={item.url}
            className="rounded-2xl bg-white p-4 shadow-[0_0_20px_rgba(0,0,0,0.06)] hover:shadow-[0_0_35px_rgba(0,0,0,0.11)] transition-all"
          >
            <div className="flex items-center justify-between">
              <div className="size-11 rounded-xl bg-rose-100 flex items-center justify-center">
                <img src={item.icon} alt={item.title} className="size-5" />
              </div>
              <span className="text-xs font-medium text-gray-500">
                {typeCountMap[item.title as keyof typeof typeCountMap]} files
              </span>
            </div>
            <p className="mt-4 text-lg font-semibold text-light-100">{item.title}</p>
            <p className="text-sm text-gray-500">{convertFileSize(item.size)}</p>
            <p className="mt-3 text-xs text-gray-400">
              Latest: {item.latestDate ? formatDateTime(item.latestDate) : "No uploads"}
            </p>
          </Link>
        ))}
      </section>

      <section className="mt-6 rounded-2xl bg-white p-5 shadow-[0_0_20px_rgba(0,0,0,0.06)]">
        <h2 className="text-lg font-semibold text-light-100">Storage Overview</h2>
        <div className="mt-5 grid gap-8 lg:grid-cols-[260px_1fr] lg:items-center">
          <div className="flex flex-col items-center">
            <div className="relative size-44">
              <div
                className="size-full rounded-full"
                style={{
                  background: `conic-gradient(
                    #F43F5E 0% ${documentEnd}%,
                    #56B8FF ${documentEnd}% ${imageEnd}%,
                    #F9AB72 ${imageEnd}% ${mediaEnd}%,
                    #3DD9B3 ${mediaEnd}% ${otherEnd}%,
                    #E5E7EB ${otherEnd}% 100%
                  )`,
                }}
              />
              <div className="absolute inset-[20%] rounded-full bg-white flex flex-col items-center justify-center">
                <p className="text-[28px] font-bold text-light-100">
                  {leftPercent.toFixed(1)}%
                </p>
                <p className="text-xs text-gray-500">left</p>
              </div>
            </div>
            <p className="mt-4 text-sm text-center text-gray-600">
              {convertFileSize(totalUsedSpace)} used of {convertFileSize(storageLimit)}
            </p>
            <p className="text-xs text-gray-500 mt-1">{usedPercent.toFixed(2)}% used</p>
          </div>

          <div className="grid gap-3 sm:grid-cols-2">
            <div className="rounded-xl border border-gray-100 bg-gray-50 p-4">
              <p className="text-xs text-gray-500">Documents</p>
              <p className="mt-1 text-sm font-semibold text-light-100">
                {convertFileSize(totalSpace.document.size)}
              </p>
              <p className="mt-1 text-xs text-gray-500">{totalSpace.document.count} files</p>
            </div>
            <div className="rounded-xl border border-gray-100 bg-gray-50 p-4">
              <p className="text-xs text-gray-500">Images</p>
              <p className="mt-1 text-sm font-semibold text-light-100">
                {convertFileSize(totalSpace.image.size)}
              </p>
              <p className="mt-1 text-xs text-gray-500">{totalSpace.image.count} files</p>
            </div>
            <div className="rounded-xl border border-gray-100 bg-gray-50 p-4">
              <p className="text-xs text-gray-500">Media</p>
              <p className="mt-1 text-sm font-semibold text-light-100">
                {convertFileSize(totalSpace.video.size + totalSpace.audio.size)}
              </p>
              <p className="mt-1 text-xs text-gray-500">
                {totalSpace.video.count + totalSpace.audio.count} files
              </p>
            </div>
            <div className="rounded-xl border border-gray-100 bg-gray-50 p-4">
              <p className="text-xs text-gray-500">Others</p>
              <p className="mt-1 text-sm font-semibold text-light-100">
                {convertFileSize(totalSpace.other.size)}
              </p>
              <p className="mt-1 text-xs text-gray-500">{totalSpace.other.count} files</p>
            </div>
          </div>
        </div>
      </section>

      <section className="mt-6 rounded-2xl bg-white p-5 shadow-[0_0_20px_rgba(0,0,0,0.06)]">
        <div className="flex items-center justify-between gap-3">
          <h2 className="text-lg font-semibold text-light-100">Recent Files</h2>
          <span className="text-sm text-gray-500">{allFiles.length} total files</span>
        </div>
        {recentFiles.length > 0 ? (
          <div className="mt-5 grid gap-3">
            {recentFiles.map((file) => (
              <Link
                key={file.$id}
                href={file.url}
                target="_blank"
                className="flex items-center justify-between rounded-xl border border-gray-100 bg-gray-50 p-3 hover:bg-rose-50 transition-colors"
              >
                <div className="flex items-center gap-3">
                  <Thumbnail
                    type={file.type}
                    extension={file.extension}
                    url={file.url}
                  />
                  <div>
                    <p className="text-sm font-semibold text-light-100">
                      {String(file.name).slice(0, 42)}
                    </p>
                    <p className="text-xs text-gray-500">
                      {formatDateTime(file.$updatedAt || file.$createdAt)}
                    </p>
                  </div>
                </div>
                <p className="text-xs font-medium text-gray-500">
                  {convertFileSize(Number(file.size) || 0)}
                </p>
              </Link>
            ))}
          </div>
        ) : (
          <div className="mt-6 rounded-xl border border-dashed border-gray-200 py-12 text-center text-gray-400">
            No files uploaded yet
          </div>
        )}
      </section>
    </div>
  );
};

export default Dashboard;
