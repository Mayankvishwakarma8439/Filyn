export type BackendUser = {
  $id: string;
  $createdAt: string;
  $updatedAt: string;
  fullname: string;
  email: string;
  avatar: string;
  accountId: string;
};

export type BackendFile = {
  $id: string;
  $createdAt: string;
  $updatedAt: string;
  type: FileType;
  name: string;
  url: string;
  extension: string;
  size: number;
  owner: string | BackendUser;
  accountId: string;
  bucketFileId: string;
  aiSummary?: string | null;
  aiSearchText?: string | null;
  aiKeywords?: string[];
  aiProcessedAt?: string | null;
  aiIndexStatus?: "pending" | "ready" | "failed" | string;
  aiIndexError?: string | null;
  aiIndexAttempts?: number;
  aiLastIndexedAt?: string | null;
};

export type DocumentList<T> = {
  total: number;
  documents: T[];
};

export type SessionRecord = {
  id: string;
  userId: string;
  secretHash: string;
  expiresAt: string;
  createdAt: string;
};
