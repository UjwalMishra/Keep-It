import mongoose from "mongoose";

const contentSchema = new mongoose.Schema({
  link: {
    type: String,
    trim: true,
    required: true,
  },
  type: {
    type: String,
    enum: ["youtube", "x", "instagram", "video"],
    required: true,
  },
  title: {
    type: String,
    required: true,
    trim: true,
  },
  tags: [
    {
      type: mongoose.Types.ObjectId,
      ref: "Tag",
    },
  ],
  userId: {
    type: mongoose.Types.ObjectId,
    ref: "User",
    required: true,
  },
});

export const Content = mongoose.model("Content", contentSchema);
