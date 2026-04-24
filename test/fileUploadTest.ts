import { getS3ObjectUrl, uploadToS3 } from "@/lib/backend/storage";

export const testUpload = async (file: File) => {
  try {
    const key = `test/${crypto.randomUUID()}-${file.name.replace(
      /[^a-zA-Z0-9._-]/g,
      "_"
    )}`;
    const buffer = Buffer.from(await file.arrayBuffer());
    await uploadToS3({ key, body: buffer, contentType: file.type });
    console.log("File uploaded:", getS3ObjectUrl(key));
  } catch (err) {
    console.error("Upload failed:", err);
  }
};
