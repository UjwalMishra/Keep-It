import { Request, Response } from "express";
import { contentZodSchema } from "../zod-schema/Content";
import { Content } from "../models/Content";
import { Tag } from "../models/Tag";
import puppeteer from "puppeteer";

interface ContentRequest extends Request {
  userId?: string;
}

export const postContentController = async (
  req: ContentRequest,
  res: Response
): Promise<any> => {
  try {
    const contentData = req.body;

    const validation = contentZodSchema.safeParse(contentData);
    if (!validation.success) {
      return res.status(411).json({
        msg: "You have sent the wrong input",
        success: false,
      });
    }

    const tagTitles = contentData.tags || [];
    const tagIds = [];

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

    // Web metadata logic
    let finalTitle = contentData.title;
    let finalDesc = contentData.desc;
    let previewImage = "";

    if (contentData.type === "web articles" && contentData.link) {
      try {
        const browser = await puppeteer.launch();
        const page = await browser.newPage();
        await page.goto(contentData.link, { waitUntil: "networkidle2" });

        const metadata = await page.evaluate(() => {
          const title = document.querySelector("title")?.innerText;
          const description = document
            .querySelector('meta[name="description"]')
            ?.getAttribute("content");
          const image = document
            .querySelector('meta[property="og:image"]')
            ?.getAttribute("content");
          return { title, description, image };
        });

        await browser.close();

        finalTitle = metadata?.title || contentData.title;
        finalDesc = metadata?.description || contentData.desc;
        previewImage = metadata?.image || "";
      } catch (err) {
        console.warn("⚠️ Puppeteer failed:", err);
      }
    }

    const content = await Content.create({
      link: contentData.link,
      desc: finalDesc,
      type: contentData.type,
      title: finalTitle,
      previewImage: previewImage,
      userId: req.userId,
      tags: tagIds,
    });

    console.log(content);

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

//get content controller
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
    // console.log(JSON.stringify(content));

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
    const userId = req.userId;

    if (!query) {
      return res
        .status(400)
        .json({ success: false, msg: "Please enter a search term." });
    }

    const searchText = String(query).toLowerCase();

    // 1. Get contents where title matches AND userId matches
    const titleMatched = await Content.find({
      userId: req.userId,
      title: { $regex: searchText, $options: "i" },
    }).populate("tags");

    // 2. Get all contents for that user and filter those where tag titles match
    const allContents = await Content.find({ userId: req.userId }).populate(
      "tags"
    );

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
