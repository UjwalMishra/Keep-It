import { Response } from "express";
import mongoose from "mongoose";
import { Content } from "../models/Content";
import { contentZodSchema } from "../zod-schema/Content";
import { AuthRequest } from "../types/express";
import { resolveTagIds } from "../utils/tags";
import { fetchPageMetadata } from "../utils/metadata";
import { trimText } from "../constants/contentLimits";

type EnrichedFields = {
  title: string;
  desc: string;
  previewImage: string;
};

async function enrichWebArticle(input: {
  type: string;
  link?: string;
  title?: string;
  desc?: string;
}): Promise<EnrichedFields> {
  let title = trimText(input.title);
  let desc = trimText(input.desc);
  let previewImage = "";

  if (input.type === "web articles" && input.link) {
    const metadata = await fetchPageMetadata(input.link);
    if (metadata) {
      title = title || metadata.title;
      desc = desc || metadata.description;
      previewImage = metadata.image;
    }

    if (!title) {
      try {
        title = new URL(input.link).hostname.replace(/^www\./, "");
      } catch {
        title = "Web article";
      }
    }
  }

  return { title, desc, previewImage };
}

function sendMongooseValidationError(res: Response, err: unknown): boolean {
  if (
    err &&
    typeof err === "object" &&
    "name" in err &&
    (err as { name: string }).name === "ValidationError"
  ) {
    const validationErr = err as mongoose.Error.ValidationError;
    const errors: Record<string, string[]> = {};
    for (const [key, value] of Object.entries(validationErr.errors)) {
      errors[key] = [value.message];
    }
    res.status(400).json({
      success: false,
      msg: "Invalid content data",
      errors,
    });
    return true;
  }
  return false;
}

export const postContentController = async (
  req: AuthRequest,
  res: Response
): Promise<void> => {
  try {
    const { contentData } = req.body;
    const validation = contentZodSchema.safeParse(contentData);

    if (!validation.success) {
      res.status(400).json({
        success: false,
        msg: "Invalid input",
        errors: validation.error.flatten().fieldErrors,
      });
      return;
    }

    const data = validation.data;
    const tagIds = await resolveTagIds(data.tags);
    const enriched = await enrichWebArticle(data);

    const title = trimText(data.title) || enriched.title;
    const desc = trimText(data.desc) || enriched.desc;

    if (data.type !== "web articles" && !title) {
      res.status(400).json({
        success: false,
        msg: "Title is required",
      });
      return;
    }

    const content = await Content.create({
      link: data.link || undefined,
      desc: desc || undefined,
      type: data.type,
      title: title || undefined,
      previewImage: enriched.previewImage || undefined,
      userId: req.userId,
      tags: tagIds,
    });

    res.status(201).json({
      success: true,
      content,
    });
  } catch (err) {
    console.error("Error posting content:", err);
    if (sendMongooseValidationError(res, err)) return;
    res.status(500).json({
      success: false,
      msg: "Server error",
    });
  }
};

export const getContentController = async (
  req: AuthRequest,
  res: Response
): Promise<void> => {
  try {
    const content = await Content.find({ userId: req.userId })
      .populate("tags")
      .sort({ createdAt: -1 })
      .lean();

    res.status(200).json({
      success: true,
      data: content,
    });
  } catch (err) {
    console.error("Error fetching content:", err);
    res.status(500).json({
      success: false,
      msg: "Server error",
    });
  }
};

export const deleteContentController = async (
  req: AuthRequest,
  res: Response
): Promise<void> => {
  try {
    const { contentId } = req.body;

    if (!contentId || !mongoose.isValidObjectId(contentId)) {
      res.status(400).json({
        success: false,
        msg: "Valid contentId is required",
      });
      return;
    }

    const deleted = await Content.findOneAndDelete({
      _id: contentId,
      userId: req.userId,
    });

    if (!deleted) {
      res.status(404).json({
        success: false,
        msg: "Content not found",
      });
      return;
    }

    res.status(200).json({
      success: true,
      msg: "Content deleted successfully",
    });
  } catch (err) {
    console.error("Error deleting content:", err);
    res.status(500).json({
      success: false,
      msg: "Server error",
    });
  }
};

export const getFilteredContentController = async (
  req: AuthRequest,
  res: Response
): Promise<void> => {
  try {
    const query = String(req.query.query || "").trim();

    if (!query) {
      res.status(400).json({
        success: false,
        msg: "Please enter a search term.",
      });
      return;
    }

    if (query.length > 100) {
      res.status(400).json({
        success: false,
        msg: "Search term is too long.",
      });
      return;
    }

    const escaped = query.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
    const regex = new RegExp(escaped, "i");

    const content = await Content.aggregate([
      { $match: { userId: new mongoose.Types.ObjectId(req.userId) } },
      {
        $lookup: {
          from: "tags",
          localField: "tags",
          foreignField: "_id",
          as: "tags",
        },
      },
      {
        $match: {
          $or: [{ title: regex }, { desc: regex }, { "tags.title": regex }],
        },
      },
      { $sort: { createdAt: -1 } },
      { $limit: 100 },
    ]);

    res.status(200).json({
      success: true,
      content,
    });
  } catch (err) {
    console.error("Error searching content:", err);
    res.status(500).json({
      success: false,
      msg: "Server error",
    });
  }
};

export const updateContentController = async (
  req: AuthRequest,
  res: Response
): Promise<void> => {
  try {
    const contentId = req.params.id;

    if (!contentId || !mongoose.isValidObjectId(contentId)) {
      res.status(400).json({
        success: false,
        msg: "Valid content id is required",
      });
      return;
    }

    const existing = await Content.findOne({
      _id: contentId,
      userId: req.userId,
    });

    if (!existing) {
      res.status(404).json({
        success: false,
        msg: "Content not found",
      });
      return;
    }

    const validation = contentZodSchema.safeParse(req.body.contentData);
    if (!validation.success) {
      res.status(400).json({
        success: false,
        msg: "Invalid input",
        errors: validation.error.flatten().fieldErrors,
      });
      return;
    }

    const data = validation.data;
    const tagIds = await resolveTagIds(data.tags);

    const linkChanged =
      data.type === "web articles" && data.link && data.link !== existing.link;

    let title = trimText(data.title) || existing.title || "";
    let desc = trimText(data.desc) || existing.desc || "";
    let previewImage = existing.previewImage || "";

    if (linkChanged || (data.type === "web articles" && !previewImage)) {
      const enriched = await enrichWebArticle(data);
      title = trimText(data.title) || enriched.title || title;
      desc = trimText(data.desc) || enriched.desc || desc;
      previewImage = enriched.previewImage || previewImage;
    }

    const content = await Content.findOneAndUpdate(
      { _id: contentId, userId: req.userId },
      {
        link: data.link || undefined,
        desc: desc || undefined,
        type: data.type,
        title: title || undefined,
        previewImage: previewImage || undefined,
        tags: tagIds,
      },
      { new: true, runValidators: true }
    ).populate("tags");

    res.status(200).json({
      success: true,
      content,
    });
  } catch (err) {
    console.error("Error updating content:", err);
    if (sendMongooseValidationError(res, err)) return;
    res.status(500).json({
      success: false,
      msg: "Server error",
    });
  }
};
