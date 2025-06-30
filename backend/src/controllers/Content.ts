import { Request, Response } from "express";
import { contentZodSchema } from "../zod-schema/Content";
import { Content } from "../models/Content";

interface ContentRequest extends Request {
  userId?: string;
}

export const postContentController = async (
  req: ContentRequest,
  res: Response
): Promise<any> => {
  try {
    const contentData = req.body;
    console.log("post conetent hit");
    const { success } = contentZodSchema.safeParse(contentData);
    if (!success) {
      return res.status(411).json({
        msg: "You have sent the wrong input",
        success: false,
      });
    }

    const content = await Content.create({
      link: contentData.link,
      type: contentData.type,
      title: contentData.title,
      userId: req.userId,
      tags: [],
    });

    return res.status(200).json({
      success: true,
      content: content,
    });
  } catch (err) {
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
    const content = await Content.find({ userId: req.userId });
    if (!content) {
      return res.status(403).json({
        msg: "No content found, Pls add some",
      });
    }

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
