import "server-only";

import {
  DeleteObjectCommand,
  GetObjectCommand,
  PutObjectCommand,
  S3Client,
} from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";

const region = process.env.AWS_REGION || process.env.AWS_DEFAULT_REGION;
const bucket = process.env.AWS_S3_BUCKET;

export const getS3Client = () => {
  if (!region || !bucket) {
    throw new Error("AWS_REGION and AWS_S3_BUCKET are required for S3 uploads.");
  }

  return new S3Client({ region });
};

export const uploadToS3 = async ({
  key,
  body,
  contentType,
}: {
  key: string;
  body: Buffer;
  contentType?: string;
}) => {
  const client = getS3Client();
  await client.send(
    new PutObjectCommand({
      Bucket: bucket,
      Key: key,
      Body: body,
      ContentType: contentType || "application/octet-stream",
    })
  );
};

export const deleteFromS3 = async (key: string) => {
  const client = getS3Client();
  await client.send(
    new DeleteObjectCommand({
      Bucket: bucket,
      Key: key,
    })
  );
};

export const getS3ObjectUrl = (key: string) => {
  const publicBaseUrl = process.env.NEXT_PUBLIC_S3_PUBLIC_BASE_URL;
  if (publicBaseUrl) return `${publicBaseUrl.replace(/\/$/, "")}/${key}`;
  return `https://${bucket}.s3.${region}.amazonaws.com/${key}`;
};

export const getSignedFileUrl = async (
  key: string,
  options?: {
    downloadName?: string;
    expiresIn?: number;
  }
) => {
  const client = getS3Client();
  const command = new GetObjectCommand({
    Bucket: bucket,
    Key: key,
    ...(options?.downloadName
      ? {
          ResponseContentDisposition: `attachment; filename="${options.downloadName.replace(/"/g, "")}"`,
        }
      : {}),
  });

  return getSignedUrl(client, command, {
    expiresIn: options?.expiresIn || 60 * 60,
  });
};
