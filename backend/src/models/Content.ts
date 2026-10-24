import mongoose from "mongoose";

const contentSchema = new mongoose.Schema(
  {
    link: {
      type: String,
      trim: true,
    },
    type: {
      type: String,
      enum: ["youtube", "x", "instagram", "notes", "web articles"],
      required: true,
      index: true,
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
        type: mongoose.Schema.Types.ObjectId,
        ref: "Tag",
      },
    ],
    previewImage: {
      type: String,
      trim: true,
    },
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },
  },
  { timestamps: true }
);

contentSchema.index({ userId: 1, createdAt: -1 });

export const Content = mongoose.model("Content", contentSchema);
