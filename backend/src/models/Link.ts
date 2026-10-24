import mongoose from "mongoose";

const linkSchema = new mongoose.Schema(
  {
    hash: {
      type: String,
      unique: true,
      required: true,
      index: true,
    },
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      unique: true,
      index: true,
    },
  },
  { timestamps: true }
);

export const Link = mongoose.model("Link", linkSchema);
