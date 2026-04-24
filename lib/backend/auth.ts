import "server-only";

import { createHash, randomBytes } from "crypto";
import { cookies } from "next/headers";
import {
  createId,
  deleteSessionByHash,
  findSessionByHash,
  findUserById,
  insertSession,
  nowIso,
} from "./db";

export const SESSION_COOKIE = "filyn-session";

export const hashSecret = (value: string) =>
  createHash("sha256").update(value).digest("hex");

export const generateOtp = () =>
  String(Math.floor(100000 + Math.random() * 900000));

export const createUserSession = async (userId: string) => {
  const secret = randomBytes(32).toString("hex");
  const session = await insertSession({
    id: createId(),
    userId,
    secretHash: hashSecret(secret),
    expiresAt: new Date(Date.now() + 1000 * 60 * 60 * 24 * 30).toISOString(),
    createdAt: nowIso(),
  });

  (await cookies()).set(SESSION_COOKIE, secret, {
    path: "/",
    httpOnly: true,
    sameSite: "strict",
    secure: process.env.NODE_ENV === "production",
    maxAge: 60 * 60 * 24 * 30,
  });

  return session;
};

export const getSessionUser = async () => {
  const secret = (await cookies()).get(SESSION_COOKIE)?.value;
  if (!secret) return null;

  const session = await findSessionByHash(hashSecret(secret));
  if (!session) return null;

  return findUserById(session.userId);
};

export const clearSession = async () => {
  const cookieStore = await cookies();
  const secret = cookieStore.get(SESSION_COOKIE)?.value;
  if (secret) await deleteSessionByHash(hashSecret(secret));
  cookieStore.delete(SESSION_COOKIE);
};
