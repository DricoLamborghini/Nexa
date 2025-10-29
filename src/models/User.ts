import mongoose from "mongoose";

export interface IUser extends mongoose.Document {
  created: Date;
  banned: boolean;
  discordId?: string | null;
  accountId: string;
  username: string;
  username_lower: string;
  email: string;
  password: string;
  matchmakingId: string;
  isServer: boolean;
  currentSACCode?: string | null;
}

const UserSchema = new mongoose.Schema<IUser>({
  created: { type: Date, required: true },
  banned: { type: Boolean, default: false },
  discordId: { type: String, default: null, unique: true, sparse: true },
  accountId: { type: String, required: true, unique: true },
  username: { type: String, required: true, unique: true },
  username_lower: { type: String, required: true, unique: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  matchmakingId: { type: String, required: true, unique: true},
  isServer: { type: Boolean, default: false},
  currentSACCode: { type: String, default: null }
}, {
  collection: "users"
});

export const User = mongoose.model<IUser>("User", UserSchema);
