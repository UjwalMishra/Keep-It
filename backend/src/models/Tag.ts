import mongoose from "mongoose";

const tagSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      lowercase: true,
      maxlength: 40,
    },
  },
  { timestamps: true }
);

export const Tag = mongoose.model("Tag", tagSchema);
