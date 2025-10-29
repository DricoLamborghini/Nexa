import mongoose from "mongoose";
// tried to do like reload but decided to give up
const SaCSchema = new mongoose.Schema({
  created: { type: Date, required: true },
  createdby: { type: String, required: true },
  owneraccountId: { type: String, required: true },
  code: { type: String, required: true, unique: true },
  code_lower: { type: String, required: true, unique: true },
  code_higher: { type: String, required: true, unique: true }
}, { collection: "saccodes" });

export const SaCCodes = mongoose.model("SaCCodes", SaCSchema);
