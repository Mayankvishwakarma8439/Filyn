"use server";

import { sendOtpEmail } from "../backend/email";
import {
  clearSession,
  createUserSession,
  generateOtp,
  getSessionUser,
  hashSecret,
} from "../backend/auth";
import {
  consumeOtpChallenge,
  createId,
  findUserByAccountId,
  findUserByEmail,
  insertUser,
  nowIso,
  upsertOtpChallenge,
} from "../backend/db";

export const getUserByEmail = async (email: string) => {
  return findUserByEmail(email);
};

export const sendEmailOtp = async (email: string) => {
  try {
    const user = await findUserByEmail(email);
    if (!user) return null;

    const otp = generateOtp();
    await upsertOtpChallenge(
      user.accountId,
      email,
      hashSecret(otp),
      new Date(Date.now() + 1000 * 60 * 10).toISOString()
    );
    await sendOtpEmail(email, otp);
    return user.accountId;
  } catch (error) {
    console.log(error, "Failed to send email otp");
    throw error;
  }
};
export const createAccount = async ({
  email,
  fullname,
}: {
  email: string;
  fullname: string;
}) => {
  const existingUser = await getUserByEmail(email);
  if (existingUser) throw new Error("User already exist");

  const createdAt = nowIso();
  const accountId = createId();
  await insertUser({
    $id: createId(),
    $createdAt: createdAt,
    $updatedAt: createdAt,
    fullname,
    email,
    avatar:
      "https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_1280.png",
    accountId,
  });

  await sendEmailOtp(email);
  return JSON.parse(JSON.stringify({ accountId }));
};

export const verifyOTP = async ({
  accountId,
  OTP,
}: {
  accountId: string;
  OTP: string;
}) => {
  try {
    const challenge = await consumeOtpChallenge(accountId, hashSecret(OTP));
    if (!challenge) return null;

    const user = await findUserByAccountId(accountId);
    if (!user) return null;

    const session = await createUserSession(user.$id);
    return JSON.parse(JSON.stringify({ sessionId: session.id }));
  } catch (error) {
    return null;
  }
};
export const getCurrentUser = async () => {
  try {
    const user = await getSessionUser();
    if (!user) return null;
    return JSON.parse(JSON.stringify(user));
  } catch (error) {
    console.log(error);
    return null;
  }
};
export const clearUserSession = async () => {
  try {
    await clearSession();
  } catch (error) {
    console.log(error);
  }
};
