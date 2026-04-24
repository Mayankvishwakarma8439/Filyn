"use server";
import { constructFileUrl, getFileType } from "../utils";
import { revalidatePath } from "next/cache";
import { getCurrentUser } from "./users.actions";
import {
  deleteFromS3,
  getSignedFileUrl,
  uploadToS3,
} from "../backend/storage";
import {
  createId,
  deleteFileById,
  findFileById,
  insertFile,
  listFilesForOwner,
  nowIso,
  renameFileById,
} from "../backend/db";
import type { BackendUser } from "../backend/types";

export interface uploadFileProps {
  file: File;
  ownerId: string;
  accountId: string;
  path: string;
}
export const uploadFile = async ({
  file,
  ownerId,
  accountId,
  path,
}: uploadFileProps) => {
  try {
    const fileId = createId();
    const safeName = file.name.replace(/[^a-zA-Z0-9._-]/g, "_");
    const bucketFileId = `${accountId}/${fileId}-${safeName}`;
    const buffer = Buffer.from(await file.arrayBuffer());
    await uploadToS3({
      key: bucketFileId,
      body: buffer,
      contentType: file.type,
    });

    const createdAt = nowIso();
    const fileType = getFileType(file.name);
    const fileDocument = {
      $id: fileId,
      $createdAt: createdAt,
      $updatedAt: createdAt,
      type: fileType.type as FileType,
      name: file.name,
      url: constructFileUrl(bucketFileId),
      extension: fileType.extension,
      size: file.size,
      owner: ownerId,
      accountId,
      bucketFileId,
    };
    const newFile = await insertFile(fileDocument);
    revalidatePath(path);
    return JSON.parse(JSON.stringify(newFile));
  } catch (error) {
    console.log(error);
    throw new Error("File upload Error");
  }
};

export const getFiles = async () => {
  try {
    const currentUser = (await getCurrentUser()) as BackendUser | null;
    if (!currentUser) throw new Error("User not found");
    const documents = await listFilesForOwner(currentUser.$id);
    const files = {
      total: documents.length,
      documents,
    };
    return JSON.parse(JSON.stringify(files));
  } catch (error) {
    console.log(error);
    throw new Error("Error occurred while fetching files");
  }
};

const revalidateFileViews = (path: string, fileType?: FileType) => {
  revalidatePath(path);
  revalidatePath("/");

  if (fileType === "document") revalidatePath("/documents");
  if (fileType === "image") revalidatePath("/images");
  if (fileType === "video" || fileType === "audio") revalidatePath("/media");
  if (fileType === "other") revalidatePath("/others");
};

export const renameFile = async ({
  fileId,
  name,
  path,
}: {
  fileId: string;
  name: string;
  path: string;
}) => {
  try {
    const trimmedName = name.trim();
    if (!trimmedName) throw new Error("File name is required");

    const existingFile = await findFileById(fileId);
    if (!existingFile) throw new Error("File not found");

    const updatedFile = await renameFileById({
      fileId,
      name: trimmedName,
    });

    revalidateFileViews(path, existingFile.type);
    return JSON.parse(JSON.stringify(updatedFile));
  } catch (error) {
    console.log(error);
    throw new Error("Error occurred while renaming file");
  }
};

export const deleteFile = async ({
  fileId,
  path,
}: {
  fileId: string;
  path: string;
}) => {
  try {
    const existingFile = await findFileById(fileId);
    if (!existingFile) throw new Error("File not found");

    await deleteFromS3(existingFile.bucketFileId);
    await deleteFileById(fileId);

    revalidateFileViews(path, existingFile.type);
    return JSON.parse(JSON.stringify({ success: true }));
  } catch (error) {
    console.log(error);
    throw new Error("Error occurred while deleting file");
  }
};

export const getFileAccessUrl = async ({
  bucketFileId,
  name,
  download,
}: {
  bucketFileId: string;
  name: string;
  download?: boolean;
}) => {
  try {
    return await getSignedFileUrl(bucketFileId, {
      downloadName: download ? name : undefined,
    });
  } catch (error) {
    console.log(error);
    throw new Error("Error occurred while generating file link");
  }
};
