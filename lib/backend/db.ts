import "server-only";

import { randomUUID } from "crypto";
import type { BackendFile, BackendUser, SessionRecord } from "./types";
import { connectToDatabase } from "./mongodb";
import { getSignedFileUrl } from "./storage";
import {
  FileModel,
  OtpChallengeModel,
  SessionModel,
  UserModel,
} from "./models";

export const nowIso = () => new Date().toISOString();

export const createId = () => randomUUID();

const toBackendUser = (user: {
  filynId: string;
  fullname: string;
  email: string;
  avatar: string;
  accountId: string;
  createdAt: Date;
  updatedAt: Date;
}): BackendUser => ({
  $id: user.filynId,
  $createdAt: user.createdAt.toISOString(),
  $updatedAt: user.updatedAt.toISOString(),
  fullname: user.fullname,
  email: user.email,
  avatar: user.avatar,
  accountId: user.accountId,
});

const toBackendFile = (
  file: {
    filynId: string;
    type: string;
    name: string;
    url: string;
    extension: string;
    size: number;
    owner: string;
    accountId: string;
    bucketFileId: string;
    createdAt: Date;
    updatedAt: Date;
  },
  owner: BackendUser | string
): BackendFile => ({
  $id: file.filynId,
  $createdAt: file.createdAt.toISOString(),
  $updatedAt: file.updatedAt.toISOString(),
  type: file.type as FileType,
  name: file.name,
  url: file.url,
  extension: file.extension,
  size: file.size,
  owner,
  accountId: file.accountId,
  bucketFileId: file.bucketFileId,
});

export const findUserByEmail = async (email: string) => {
  await connectToDatabase();
  const user = await UserModel.findOne({ email: email.toLowerCase() }).lean();
  return user ? toBackendUser(user) : null;
};

export const findUserByAccountId = async (accountId: string) => {
  await connectToDatabase();
  const user = await UserModel.findOne({ accountId }).lean();
  return user ? toBackendUser(user) : null;
};

export const findUserById = async (id: string) => {
  await connectToDatabase();
  const user = await UserModel.findOne({ filynId: id }).lean();
  return user ? toBackendUser(user) : null;
};

export const findFileById = async (id: string) => {
  await connectToDatabase();
  const file = await FileModel.findOne({ filynId: id }).lean();
  if (!file) return null;
  const owner = await findUserById(file.owner);
  return toBackendFile(file, owner || file.owner);
};

export const insertUser = async (user: BackendUser) => {
  await connectToDatabase();
  const createdUser = await UserModel.create({
    filynId: user.$id,
    fullname: user.fullname,
    email: user.email.toLowerCase(),
    avatar: user.avatar,
    accountId: user.accountId,
  });
  return toBackendUser(createdUser.toObject());
};

export const upsertOtpChallenge = async (
  accountId: string,
  email: string,
  otpHash: string,
  expiresAt: string
) => {
  await connectToDatabase();
  await OtpChallengeModel.findOneAndUpdate(
    { accountId },
    {
      accountId,
      email: email.toLowerCase(),
      otpHash,
      expiresAt: new Date(expiresAt),
    },
    { upsert: true, new: true, setDefaultsOnInsert: true }
  );
};

export const consumeOtpChallenge = async (
  accountId: string,
  otpHash: string
) => {
  await connectToDatabase();
  const challenge = await OtpChallengeModel.findOne({
    accountId,
    otpHash,
    expiresAt: { $gt: new Date() },
  }).lean();

  if (!challenge) {
    await OtpChallengeModel.deleteMany({
      expiresAt: { $lte: new Date() },
    });
    return null;
  }

  await OtpChallengeModel.deleteOne({ accountId });
  return challenge;
};

export const insertSession = async (session: SessionRecord) => {
  await connectToDatabase();
  const createdSession = await SessionModel.create({
    sessionId: session.id,
    userId: session.userId,
    secretHash: session.secretHash,
    expiresAt: new Date(session.expiresAt),
  });

  return {
    id: createdSession.sessionId,
    userId: createdSession.userId,
    secretHash: createdSession.secretHash,
    expiresAt: createdSession.expiresAt.toISOString(),
    createdAt: createdSession.createdAt.toISOString(),
  };
};

export const findSessionByHash = async (secretHash: string) => {
  await connectToDatabase();
  const session = await SessionModel.findOne({
    secretHash,
    expiresAt: { $gt: new Date() },
  }).lean();
  if (!session) return null;

  return {
    id: session.sessionId,
    userId: session.userId,
    secretHash: session.secretHash,
    expiresAt: session.expiresAt.toISOString(),
    createdAt: session.createdAt.toISOString(),
  };
};

export const deleteSessionByHash = async (secretHash: string) => {
  await connectToDatabase();
  await SessionModel.deleteOne({ secretHash });
};

export const insertFile = async (file: BackendFile) => {
  await connectToDatabase();
  await FileModel.create({
    filynId: file.$id,
    type: file.type,
    name: file.name,
    url: file.url,
    extension: file.extension,
    size: file.size,
    owner: typeof file.owner === "string" ? file.owner : file.owner.$id,
    accountId: file.accountId,
    bucketFileId: file.bucketFileId,
  });

  const owner = await findUserById(
    typeof file.owner === "string" ? file.owner : file.owner.$id
  );

  return {
    ...file,
    owner: owner || (typeof file.owner === "string" ? file.owner : file.owner.$id),
  };
};

export const renameFileById = async ({
  fileId,
  name,
}: {
  fileId: string;
  name: string;
}) => {
  await connectToDatabase();
  const updatedFile = await FileModel.findOneAndUpdate(
    { filynId: fileId },
    { name },
    { new: true }
  ).lean();

  if (!updatedFile) return null;
  const owner = await findUserById(updatedFile.owner);
  return toBackendFile(updatedFile, owner || updatedFile.owner);
};

export const deleteFileById = async (fileId: string) => {
  await connectToDatabase();
  const deletedFile = await FileModel.findOneAndDelete({ filynId: fileId }).lean();
  if (!deletedFile) return null;
  const owner = await findUserById(deletedFile.owner);
  return toBackendFile(deletedFile, owner || deletedFile.owner);
};

export const listFilesForOwner = async (ownerId: string) => {
  await connectToDatabase();
  const [files, owner] = await Promise.all([
    FileModel.find({ owner: ownerId }).sort({ updatedAt: -1 }).lean(),
    findUserById(ownerId),
  ]);

  return Promise.all(
    files.map(async (file) =>
      toBackendFile(
        {
          ...file,
          url: await getSignedFileUrl(file.bucketFileId),
        },
        owner || ownerId
      )
    )
  );
};
