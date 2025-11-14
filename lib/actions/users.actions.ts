"use server";

import { ID, Query } from "node-appwrite";
import { createAdminClient, createSessionClient } from "../appwrite";
import { appwriteConfig } from "../appwrite/config";
import { cookies } from "next/headers";
import { strict } from "assert";

export const getUserByEmail = async (email: string) => {
  const { databases } = await createAdminClient();
  const result = await databases.listDocuments(
    appwriteConfig.dbID,
    appwriteConfig.usersID,
    [Query.equal("email", [email])]
  );
  return result.total > 0 ? result.documents[0] : null;
};
export const sendEmailOtp = async (email: string) => {
  const { account } = await createAdminClient();
  try {
    const session = await account.createEmailToken(ID.unique(), email);
    return session.userId;
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
  const accountId = await sendEmailOtp(email);
  if (!accountId) throw new Error("Failed to send email OTP");

  if (!existingUser) {
    const { databases } = await createAdminClient();
    await databases.createDocument(
      appwriteConfig.dbID,
      appwriteConfig.usersID,
      ID.unique(),
      {
        fullname,
        email,
        avatar:
          "https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_1280.png",
        accountId,
      }
    );
  }
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
    const { account } = await createAdminClient();
    const session = await account.createSession(accountId, OTP);
    (await cookies()).set("appwrite-session", session.secret, {
      path: "/",
      httpOnly: true,
      sameSite: "strict",
      secure: true,
      maxAge: 60 * 60 * 24 * 30,
    });
    return JSON.parse(JSON.stringify({ sessionId: session.$id }));
  } catch (error) {
    return null;
  }
};
export const getCurrentUser = async () => {
  try {
    const { account, databases } = await createSessionClient();
    const result = await account.get();
    const user = await databases.listDocuments(
      appwriteConfig.dbID,
      appwriteConfig.usersID,
      [Query.equal("accountId", result.$id)]
    );
    if (user.total <= 0) return null;
    return JSON.parse(JSON.stringify(user.documents[0]));
  } catch (error) {
    console.log(error);
    return null;
  }
};
export const clearUserSession = async () => {
  try {
    const { account } = await createSessionClient();
    await account.deleteSession("current");
    const cookieStore = await cookies();
    cookieStore.delete("appwrite-session");
  } catch (error) {
    console.log(error);
  }
};
