import mongoose from "mongoose";

const ProfileSchema = new mongoose.Schema({
  created: { type: Date, required: true },
  accountId: { type: String, required: true, unique: true },
  profiles: { type: Object, default: {} } // store Athena-style profiles blob
}, { collection: "profiles" });

export const Profile = mongoose.model("Profile", ProfileSchema);
