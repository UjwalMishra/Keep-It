import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
    username: {
      type: String,
      required: true,
      trim: true,
      unique: true,
      lowercase: true,
      maxlength: 64,
    },
    password: {
      type: String,
      required: true,
      select: true,
    },
  },
  { timestamps: true }
);

export const User = mongoose.model("User", userSchema);
