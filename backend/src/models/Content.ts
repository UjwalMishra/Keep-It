import mongoose from "mongoose";

const contentSchema = new mongoose.Schema({
  link: {
    type: String,
    trim: true,
  },
  type: {
    type: String,
    enum: ["youtube", "x", "instagram", "notes", "web articles"],
    required: true,
  },
  desc: {
    type: String,

    trim: true,
  },
  title: {
    type: String,

    trim: true,
  },
  tags: [
    {
      type: mongoose.Types.ObjectId,
      ref: "Tag",
    },
  ],
  previewImage: {
    type: String,
  },
  userId: {
    type: mongoose.Types.ObjectId,
    ref: "User",
    required: true,
  },
});

export const Content = mongoose.model("Content", contentSchema);
