"use server";
import { createAdminClient } from "@/lib/appwrite";
import { InputFile } from "node-appwrite/file";
import { appwriteConfig } from "@/lib/appwrite/config";
import { ID } from "node-appwrite";

export const testUpload = async (file: File) => {
  try {
    const { storage } = await createAdminClient();
    const buffer = Buffer.from(await file.arrayBuffer());
    const inputFile = InputFile.fromBuffer(buffer, file.name);
    const res = await storage.createFile(
      appwriteConfig.bucketID,
      ID.unique(),
      inputFile
    );
    console.log("✅ File uploaded:", res);
  } catch (err) {
    console.error("❌ Upload failed:", err);
  }
};
