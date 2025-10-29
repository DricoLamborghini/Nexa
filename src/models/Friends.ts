import mongoose from "mongoose";

const FriendsSchema = new mongoose.Schema({
  created: { type: Date, required: true },
  accountId: { type: String, required: true, unique: true },
  friends: { type: Array, default: [] }
}, { collection: "friends" });

export const Friends = mongoose.model("Friends", FriendsSchema);
