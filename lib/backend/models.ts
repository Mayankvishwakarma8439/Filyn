import mongoose, { Schema, type InferSchemaType, type Model } from "mongoose";

const userSchema = new Schema(
  {
    filynId: { type: String, required: true, unique: true, index: true },
    fullname: { type: String, required: true },
    email: { type: String, required: true, unique: true, lowercase: true, index: true },
    avatar: { type: String, required: true },
    accountId: { type: String, required: true, unique: true, index: true },
  },
  { timestamps: true }
);

const otpChallengeSchema = new Schema(
  {
    accountId: { type: String, required: true, unique: true, index: true },
    email: { type: String, required: true, lowercase: true, index: true },
    otpHash: { type: String, required: true },
    expiresAt: { type: Date, required: true, index: true },
  },
  { timestamps: true }
);

const sessionSchema = new Schema(
  {
    sessionId: { type: String, required: true, unique: true, index: true },
    userId: { type: String, required: true, index: true },
    secretHash: { type: String, required: true, unique: true, index: true },
    expiresAt: { type: Date, required: true, index: true },
  },
  { timestamps: true }
);

const fileSchema = new Schema(
  {
    filynId: { type: String, required: true, unique: true, index: true },
    type: { type: String, required: true, index: true },
    name: { type: String, required: true },
    url: { type: String, required: true },
    extension: { type: String, required: true },
    size: { type: Number, required: true },
    owner: { type: String, required: true, index: true },
    accountId: { type: String, required: true, index: true },
    bucketFileId: { type: String, required: true, unique: true },
  },
  { timestamps: true }
);

export type UserDocument = InferSchemaType<typeof userSchema> & {
  createdAt: Date;
  updatedAt: Date;
};
export type FileDocument = InferSchemaType<typeof fileSchema> & {
  createdAt: Date;
  updatedAt: Date;
};
export type OtpChallengeDocument = InferSchemaType<typeof otpChallengeSchema> & {
  createdAt: Date;
  updatedAt: Date;
};
export type SessionDocument = InferSchemaType<typeof sessionSchema> & {
  createdAt: Date;
  updatedAt: Date;
};

export const UserModel: Model<UserDocument> =
  mongoose.models.User || mongoose.model<UserDocument>("User", userSchema);

export const OtpChallengeModel: Model<OtpChallengeDocument> =
  mongoose.models.OtpChallenge ||
  mongoose.model<OtpChallengeDocument>("OtpChallenge", otpChallengeSchema);

export const SessionModel: Model<SessionDocument> =
  mongoose.models.Session ||
  mongoose.model<SessionDocument>("Session", sessionSchema);

export const FileModel: Model<FileDocument> =
  mongoose.models.File || mongoose.model<FileDocument>("File", fileSchema);
