"use server";
import { createAdminClient } from "../appwrite";
import { InputFile } from "node-appwrite/file";
import { appwriteConfig } from "../appwrite/config";
import { ID, Models, Query } from "node-appwrite";
import { constructFileUrl, getFileType } from "../utils";
import { revalidatePath } from "next/cache";
import { getCurrentUser } from "./users.actions";
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
  const { storage, databases } = await createAdminClient();
  try {
    console.log(getFileType(file.name));
    const inputFile = InputFile.fromBuffer(file, file.name);
    const bucketFile = await storage.createFile(
      appwriteConfig.bucketID,
      ID.unique(),
      inputFile
    );
    const fileDocument = {
      type: getFileType(file.name).type,
      name: bucketFile.name,
      url: constructFileUrl(bucketFile.$id),
      extension: getFileType(bucketFile.name).extension,
      size: bucketFile.sizeOriginal,
      owner: ownerId,
      accountId,
      bucketFileId: bucketFile.$id,
    };
    const newFile = await databases
      .createDocument(
        appwriteConfig.dbID,
        appwriteConfig.filesID,
        ID.unique(),
        fileDocument
      )
      .catch(async (error: unknown) => {
        await storage.deleteFile(appwriteConfig.bucketID, bucketFile.$id);
        console.log(error);
        throw new Error("Failed to create file document");
      });
    revalidatePath(path);
    return JSON.parse(JSON.stringify(newFile));
  } catch (error) {
    console.log(error);
    throw new Error("File upload Error");
  }
};
const createQueries = (currentUser: Models.Document) => {
  const queries = [Query.equal("owner", currentUser.$id)];
  return queries;
};

export const getFiles = async () => {
  const { databases } = await createAdminClient();
  try {
    const currentUser = await getCurrentUser();
    if (!currentUser) throw new Error("User not found");
    const queries = createQueries(currentUser);
    const files = await databases.listDocuments(
      appwriteConfig.dbID,
      appwriteConfig.filesID,
      queries
    );
    return JSON.parse(JSON.stringify(files));
  } catch (error) {
    console.log(error);
    throw new Error("Error occurred while fetching files");
  }
};
