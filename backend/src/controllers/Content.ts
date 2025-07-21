import { Request, Response } from "express";
import { contentZodSchema } from "../zod-schema/Content";
import { Content } from "../models/Content";
import { Tag } from "../models/Tag";

interface ContentRequest extends Request {
  userId?: string;
}

export const postContentController = async (
  req: ContentRequest,
  res: Response
): Promise<any> => {
  try {
    const contentData = req.body;

    const { success } = contentZodSchema.safeParse(contentData);
    if (!success) {
      return res.status(411).json({
        msg: "You have sent the wrong input",
        success: false,
      });
    }

    const tagTitles = contentData.tags || [];
    const tagIds = [];

    // Normalize tag titles
    const normalizedTags = [
      ...new Set(tagTitles.map((tag: string) => tag.toLowerCase().trim())),
    ];

    for (const title of normalizedTags) {
      let tag = await Tag.findOne({ title });

      if (!tag) {
        tag = await Tag.create({ title });
      }

      tagIds.push(tag._id);
    }

    const content = await Content.create({
      link: contentData.link,
      type: contentData.type,
      title: contentData.title,
      userId: req.userId,
      tags: tagIds,
    });

    return res.status(200).json({
      success: true,
      content,
    });
  } catch (err) {
    console.error("Error posting content:", err);
    return res.status(500).json({
      success: false,
      msg: "Server error",
    });
  }
};

export const getContentController = async (
  req: ContentRequest,
  res: Response
): Promise<any> => {
  try {
    const content = await Content.find({ userId: req.userId }).populate("tags");
    if (!content) {
      return res.status(403).json({
        msg: "No content found, Pls add some",
      });
    }
    console.log(JSON.stringify(content));

    return res.status(200).json({
      success: true,
      data: content,
    });
  } catch (err) {
    return res.status(500).json({
      success: false,
      msg: "Server error",
    });
  }
};

export const deleteContentController = async (
  req: ContentRequest,
  res: Response
): Promise<any> => {
  try {
    const { contentId } = req.body;
    const userId = req.userId;
    const isContent = await Content.findById({ _id: contentId });
    if (!isContent) {
      return res.status(403).json({
        success: false,
        msg: "Content of the provided content id not found",
      });
    }
    await Content.deleteMany({
      _id: contentId,
      userId: userId,
    });

    return res.status(200).json({
      success: true,
      msg: "Content deleted successfully",
    });
  } catch (err) {
    console.log(err);

    return res.status(500).json({
      success: false,
      msg: "Server error",
    });
  }
};

export const getFilteredContentController = async (
  req: ContentRequest,
  res: Response
): Promise<any> => {
  try {
    const { query } = req.query;

    if (!query) {
      return res
        .status(400)
        .json({ success: false, msg: "Please enter a search term." });
    }

    const searchText = String(query).toLowerCase();

    // 1. Get contents where title matches the search text
    const titleMatched = await Content.find({
      title: { $regex: searchText, $options: "i" },
    }).populate("tags");

    // 2. Get all contents and filter those where any tag title matches
    const allContents = await Content.find().populate("tags");

    const tagMatched = allContents.filter((content) =>
      //@ts-ignore
      (content.tags as { title: string }[]).some((tag) =>
        tag.title.toLowerCase().includes(searchText)
      )
    );

    // 3. Merge both title-matched and tag-matched results
    const merged = [...titleMatched, ...tagMatched];

    // 4. Remove duplicates (same content can match title + tag)
    const uniqueContent = [];
    const seen = new Set();

    for (const item of merged) {
      const id = item._id.toString();
      if (!seen.has(id)) {
        seen.add(id);
        uniqueContent.push(item);
      }
    }

    // 5. Send response
    return res.status(200).json({
      success: true,
      content: uniqueContent,
    });
  } catch (err) {
    console.log(err);

    return res.status(500).json({
      success: false,
      msg: "Server error",
    });
  }
};
