export const appwriteConfig = {
  endpointURL: process.env.NEXT_PUBLIC_APPWRITE_ENDPOINT!,
  projectID: process.env.NEXT_PUBLIC_APPWRITE_PROJECT!,
  dbID: process.env.NEXT_PUBLIC_APPWRITE_DATABASE!,
  usersID: process.env.NEXT_PUBLIC_APPWRITE_USERS_TABLE!,
  filesID: process.env.NEXT_PUBLIC_APPWRITE_FILES_TABLE!,
  bucketID: process.env.NEXT_PUBLIC_APPWRITE_BUCKET!,
  secretKey: process.env.NEXT_APPWRITE_SECRET!,
};
